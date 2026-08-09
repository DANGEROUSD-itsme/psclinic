"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * "The Dry Hand" — the hero centrepiece.
 *
 * A field of water droplets rendered as GPU points on the off-white base.
 * As the visitor scrolls, each droplet reaches its own evaporation moment,
 * lifts, shrinks and disappears — so the field clears unevenly, the way a
 * real surface dries. Moving the cursor drags a local drying halo across
 * the field.
 *
 * It states the clinic's promise without a word of copy: the sweat goes,
 * and it does not come back.
 */

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform vec2  uPointer;
  uniform float uPointerStrength;
  uniform float uPixelRatio;
  uniform float uSize;

  attribute float aSeed;
  attribute float aScale;

  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Each droplet dries at its own moment in the scroll, staggered by seed,
    // so the field never clears as one flat wipe.
    float threshold = aSeed * 0.68;
    float dry = smoothstep(threshold, threshold + 0.3, uProgress);

    // A local drying halo that follows the cursor.
    float pointerDistance = distance(pos.xy, uPointer);
    float halo = 1.0 - smoothstep(0.0, 0.9, pointerDistance);
    dry = clamp(dry + halo * uPointerStrength, 0.0, 1.0);

    // Idle bob, so the field is quietly alive before any scrolling begins.
    pos.x += sin(uTime * 0.24 + aSeed * 11.0) * 0.035;
    pos.y += cos(uTime * 0.19 + aSeed * 8.0) * 0.035;

    // Evaporating droplets rise and drift apart slightly.
    pos.y += dry * (0.35 + aSeed * 0.75);
    pos.x += dry * (aSeed - 0.5) * 0.7;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = max(uSize * aScale * (1.0 - dry) * uPixelRatio, 0.0);

    vAlpha = 1.0 - dry;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uBody;
  uniform vec3 uRim;

  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    // On an off-white page a droplet only reads if it has a rim and a
    // highlight — a flat blob just looks like a dot.
    float body = smoothstep(0.5, 0.32, d);
    float rim  = smoothstep(0.5, 0.41, d) - smoothstep(0.41, 0.22, d);
    float spec = smoothstep(0.17, 0.0, distance(uv, vec2(-0.14, 0.14)));

    vec3 color = mix(uBody, uRim, rim * 0.8);
    color = mix(color, vec3(1.0), spec * 0.9);

    // Low alphas on purpose. These beads sit behind live copy, and the
    // headline has to stay the most legible thing on the screen.
    float alpha = (body * 0.26 + rim * 0.34 + spec * 0.38) * vAlpha;
    if (alpha < 0.002) discard;

    gl_FragColor = vec4(color, alpha);

    #include <colorspace_fragment>
  }
`;

/**
 * Normalised pointer position (-1..1 on both axes) tracked by the hero
 * itself. The canvas sits behind the hero copy with `pointer-events: none`
 * so the calls to action stay clickable, which means it cannot observe the
 * cursor directly — the parent hands it over instead.
 */
export type PointerState = { x: number; y: number; active: boolean };

function DropletField({
  progress,
  pointerState,
}: {
  progress: MotionValue<number>;
  pointerState: React.RefObject<PointerState>;
}) {
  const { viewport } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef(new THREE.Vector2(999, 999));
  const pointerStrength = useRef(0);

  const count = useMemo(() => {
    // Scale the field with the canvas so density stays constant, but keep a
    // hard ceiling — this runs on phones too.
    //
    // Kept deliberately sparse: this sits behind the headline, and a dense
    // field stops reading as "a few beads of sweat" and starts reading as
    // soap bubbles.
    const area = viewport.width * viewport.height;
    return Math.min(340, Math.max(90, Math.round(area * 2.1)));
  }, [viewport.width, viewport.height]);

  /**
   * Stable randomness. Seeds are generated once and reused across resizes,
   * so changing the window never re-scrambles the field — only the mapping
   * from normalised space into world units is recomputed.
   */
  const seeds = useMemo(() => {
    const values = new Float32Array(count * 4);
    for (let i = 0; i < count; i += 1) {
      values[i * 4 + 0] = Math.random() - 0.5; // normalised x
      values[i * 4 + 1] = Math.random() - 0.5; // normalised y
      values[i * 4 + 2] = Math.random(); // evaporation seed
      values[i * 4 + 3] = 0.45 + Math.random() * 0.85; // relative size
    }
    return values;
  }, [count]);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seedAttr = new Float32Array(count);
    const scaleAttr = new Float32Array(count);

    // Slight overscan so droplets drifting in from the edges never pop.
    const width = viewport.width * 1.15;
    const height = viewport.height * 1.15;

    for (let i = 0; i < count; i += 1) {
      positions[i * 3 + 0] = seeds[i * 4 + 0] * width;
      positions[i * 3 + 1] = seeds[i * 4 + 1] * height;
      positions[i * 3 + 2] = 0;
      seedAttr[i] = seeds[i * 4 + 2];
      scaleAttr[i] = seeds[i * 4 + 3];
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seedAttr, 1));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scaleAttr, 1));
    return geo;
  }, [count, seeds, viewport.width, viewport.height]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPointer: { value: new THREE.Vector2(999, 999) },
      uPointerStrength: { value: 0 },
      uPixelRatio: { value: 1 },
      uSize: { value: 21 },
      uBody: { value: new THREE.Color("#bce6ee") },
      uRim: { value: new THREE.Color("#4e94a4") },
    }),
    [],
  );

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;

    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uProgress.value = progress.get();
    material.uniforms.uPixelRatio.value = state.gl.getPixelRatio();

    // Pointer arrives normalised (-1..1); map it into world units.
    const current = pointerState.current;
    const targetX = (current.x * viewport.width) / 2;
    const targetY = (current.y * viewport.height) / 2;

    // The halo only exists while the cursor is actually over the hero —
    // otherwise one would sit parked at the origin on load and on touch
    // devices that never report a hover.
    const targetStrength = current.active ? 0.85 : 0;

    // Damp both position and strength so the halo trails the cursor softly
    // rather than snapping to it.
    const damp = Math.min(1, delta * 4);
    pointer.current.x += (targetX - pointer.current.x) * damp;
    pointer.current.y += (targetY - pointer.current.y) * damp;
    pointerStrength.current +=
      (targetStrength - pointerStrength.current) * Math.min(1, delta * 2.5);

    material.uniforms.uPointer.value.copy(pointer.current);
    material.uniforms.uPointerStrength.value = pointerStrength.current;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

export default function DryHandField({
  progress,
  pointerState,
}: {
  progress: MotionValue<number>;
  pointerState: React.RefObject<PointerState>;
}) {
  return (
    <Canvas
      // The page owns the background; the canvas only contributes droplets.
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{ pointerEvents: "none" }}
    >
      <DropletField progress={progress} pointerState={pointerState} />
    </Canvas>
  );
}
