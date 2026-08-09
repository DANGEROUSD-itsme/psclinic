"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * The condition switcher's visual signature.
 *
 * Each of the three hyperhidrosis sub-types gets its own procedural field —
 * same palette family, distinctly different structure and movement — and
 * switching between them plays a soft ripple that distorts the surface as
 * it passes. It replaces what would otherwise be a plain cross-fade, and
 * gives the three conditions a visual identity without three stock photos.
 */

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uMix;      // 0 = previous field, 1 = next field
  uniform float uAspect;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform float uSeedA;
  uniform float uSeedB;
  uniform vec3  uBase;

  varying vec2 vUv;

  // Ashima simplex noise (2D).
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                            dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float total = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      total += snoise(p) * amplitude;
      p *= 2.02;
      amplitude *= 0.5;
    }
    return total;
  }

  /**
   * One condition's field. The seed shifts scale, drift direction and
   * banding so each sub-type is recognisably its own surface.
   */
  vec3 field(vec2 uv, float seed, vec3 accent) {
    vec2 p = uv;
    p.x *= uAspect;

    // Large, calm shapes. Higher frequencies here start to read as
    // camouflage rather than as water.
    float scale = 1.0 + seed * 0.85;
    vec2 drift = vec2(cos(seed * 6.283) * 0.035, sin(seed * 6.283) * 0.045);

    float base  = fbm(p * scale + drift * uTime + seed * 21.0);
    float detail = fbm(p * scale * 2.3 - drift * uTime * 1.4 + seed * 7.0);

    float shape = base * 0.72 + detail * 0.28;

    // Two layers: a soft mass, and crisp contour lines threaded through it.
    // The contours are what make this read as light refracting through
    // moving water rather than as a cloud of noise.
    float mass = smoothstep(-0.22, 0.48, shape);
    float contour = abs(sin(shape * 6.5 + seed * 2.4));
    float lines = smoothstep(0.52, 0.97, contour);

    float amount = clamp(mass * 0.44 + lines * 0.46, 0.0, 1.0);

    // Fade toward the edges so the field sits inside its card instead of
    // running flat into the corners.
    float vignette = smoothstep(1.3, 0.18, length(uv - 0.5) * 1.45);

    return mix(uBase, accent, amount * vignette);
  }

  void main() {
    // An expanding ring drives the transition: everything inside it has
    // already become the new field, and the ring itself bends the surface
    // slightly as it sweeps outward.
    vec2 centred = vUv - 0.5;
    float dist = length(centred * vec2(uAspect, 1.0));

    float edge = uMix * 1.45 - dist;
    float wipe = smoothstep(0.0, 0.16, edge);
    float ring = exp(-pow(edge * 11.0, 2.0));

    vec2 dir = normalize(centred + 1e-5);
    vec2 uvA = vUv + dir * ring * 0.028;
    vec2 uvB = vUv - dir * ring * 0.022;

    vec3 previous = field(uvA, uSeedA, uColorA);
    vec3 next     = field(uvB, uSeedB, uColorB);

    vec3 color = mix(previous, next, wipe);

    // A faint bright crest on the ring itself, so the transition reads as
    // a moving front rather than a dissolve.
    color += ring * 0.06;

    gl_FragColor = vec4(color, 1.0);

    #include <colorspace_fragment>
  }
`;

export type FieldParams = { seed: number; color: string };

function FieldPlane({ params }: { params: FieldParams }) {
  const { viewport } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // The shader always holds two fields: the one being left and the one
  // being arrived at. These refs track that pair across switches.
  const previous = useRef<FieldParams>(params);
  const current = useRef<FieldParams>(params);
  const mix = useRef(1);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMix: { value: 1 },
      uAspect: { value: 1 },
      uSeedA: { value: params.seed },
      uSeedB: { value: params.seed },
      uColorA: { value: new THREE.Color(params.color) },
      uColorB: { value: new THREE.Color(params.color) },
      uBase: { value: new THREE.Color("#f4f7f7") },
    }),
    // Deliberately built once: subsequent changes are driven imperatively
    // in useFrame so a switch animates instead of snapping.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;

    // A new selection arrived — retire the current field to the "previous"
    // slot and start the ripple over again.
    if (params.seed !== current.current.seed) {
      previous.current = current.current;
      current.current = params;
      mix.current = 0;

      material.uniforms.uSeedA.value = previous.current.seed;
      material.uniforms.uColorA.value.set(previous.current.color);
      material.uniforms.uSeedB.value = current.current.seed;
      material.uniforms.uColorB.value.set(current.current.color);
    }

    mix.current = Math.min(1, mix.current + delta * 1.15);

    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uMix.value = mix.current;
    material.uniforms.uAspect.value = viewport.width / viewport.height;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
      />
    </mesh>
  );
}

export default function ConditionField({ params }: { params: FieldParams }) {
  return (
    <Canvas
      gl={{ antialias: false, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ pointerEvents: "none" }}
    >
      <FieldPlane params={params} />
    </Canvas>
  );
}
