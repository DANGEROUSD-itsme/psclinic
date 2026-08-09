"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * The sympathetic nerve chain, scrubbed by scroll.
 *
 * This replaces the embedded explainer video the practice was relying on.
 * It is deliberately abstract — a chain, its ganglia, and the rib arcs it
 * runs behind — because the point is to show *where* the procedure happens
 * and *what changes*, not to render anatomy in a way anyone would find
 * confronting.
 *
 * The nerve signal travels visibly up the chain toward the hands. Once the
 * scroll reaches the ablation step, the treated segment goes inert and the
 * signal can no longer get past it. That is the entire procedure, in one
 * image.
 */

/** Where along the chain the treated segment sits (over the 2nd–3rd ribs). */
const SEGMENT_START = 0.17;
const SEGMENT_END = 0.34;

const CHAIN_VERTEX = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const CHAIN_FRAGMENT = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uFocus;    // how strongly the treated segment is highlighted
  uniform float uAblate;   // 0 = intact, 1 = ablated
  uniform vec3  uBase;
  uniform vec3  uActive;
  uniform vec3  uInert;
  uniform float uSegStart;
  uniform float uSegEnd;

  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    float along = vUv.x;

    // The treated segment, with soft shoulders rather than a hard cut.
    float segment =
        smoothstep(uSegStart - 0.02, uSegStart + 0.01, along)
      - smoothstep(uSegEnd - 0.01, uSegEnd + 0.02, along);

    // The signal runs from the chest up toward the hands.
    float head = 1.0 - fract(uTime * 0.2);
    float pulse = exp(-pow((along - head) * 20.0, 2.0));

    // Once ablated, nothing gets past the treated segment.
    float blocked = (1.0 - smoothstep(uSegEnd - 0.02, uSegEnd, along)) * uAblate;
    pulse *= (1.0 - blocked);

    vec3 color = uBase;
    color = mix(color, uActive, segment * uFocus * 0.85);
    color = mix(color, uInert, segment * uAblate);
    color += uActive * pulse * 0.75 * (1.0 - uAblate * 0.35);

    // Simple directional shading so the tube reads as round.
    float diffuse = clamp(dot(normalize(vNormal), normalize(vec3(0.35, 0.7, 0.62))), 0.0, 1.0);
    color *= 0.62 + 0.5 * diffuse;

    gl_FragColor = vec4(color, 1.0);

    #include <colorspace_fragment>
  }
`;

function Anatomy({ progress }: { progress: MotionValue<number> }) {
  const { viewport } = useThree();
  const group = useRef<THREE.Group>(null);
  const chainMaterial = useRef<THREE.ShaderMaterial>(null);
  const ribMaterial = useRef<THREE.LineBasicMaterial>(null);
  const ganglia = useRef<(THREE.Mesh | null)[]>([]);
  const smoothed = useRef(0);

  /** The chain itself — a gently curved spline running down the chest. */
  const chainGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.1, 1.85, 0.05),
      new THREE.Vector3(-0.05, 1.0, 0.12),
      new THREE.Vector3(-0.12, 0.2, 0.08),
      new THREE.Vector3(-0.05, -0.6, 0.0),
      new THREE.Vector3(0.08, -1.4, -0.08),
      new THREE.Vector3(0.16, -1.95, -0.12),
    ]);
    return new THREE.TubeGeometry(curve, 220, 0.035, 12, false);
  }, []);

  /** Ganglia sit at intervals along the chain. */
  const gangliaPoints = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.1, 1.85, 0.05),
      new THREE.Vector3(-0.05, 1.0, 0.12),
      new THREE.Vector3(-0.12, 0.2, 0.08),
      new THREE.Vector3(-0.05, -0.6, 0.0),
      new THREE.Vector3(0.08, -1.4, -0.08),
      new THREE.Vector3(0.16, -1.95, -0.12),
    ]);
    return Array.from({ length: 8 }, (_, i) => {
      const t = 0.06 + (i / 7) * 0.88;
      return { position: curve.getPointAt(t), t };
    });
  }, []);

  /**
   * Rib arcs sweeping forward from the spine. Faint, and only there to
   * place the chain in the chest — they never become the subject.
   */
  const ribGeometry = useMemo(() => {
    const vertices: number[] = [];
    const ribCount = 7;

    for (let r = 0; r < ribCount; r += 1) {
      const y = 1.62 - r * 0.5;
      const spread = 0.74 + r * 0.075;
      const droop = 0.26 + r * 0.06;

      for (const side of [-1, 1]) {
        const points: THREE.Vector3[] = [];
        const steps = 26;
        for (let i = 0; i <= steps; i += 1) {
          const a = (i / steps) * Math.PI * 0.62;
          points.push(
            new THREE.Vector3(
              side * Math.sin(a) * spread,
              y - Math.sin(a) * droop,
              // A deep forward sweep, so the cage reads as three-dimensional
              // the moment the model starts turning.
              -Math.cos(a) * 0.95 + 0.95,
            ),
          );
        }
        for (let i = 0; i < points.length - 1; i += 1) {
          vertices.push(
            points[i].x,
            points[i].y,
            points[i].z,
            points[i + 1].x,
            points[i + 1].y,
            points[i + 1].z,
          );
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3),
    );
    return geo;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFocus: { value: 0 },
      uAblate: { value: 0 },
      uBase: { value: new THREE.Color("#8fb3bc") },
      uActive: { value: new THREE.Color("#1d8fa1") },
      uInert: { value: new THREE.Color("#c9d6d9") },
      uSegStart: { value: SEGMENT_START },
      uSegEnd: { value: SEGMENT_END },
    }),
    [],
  );

  useFrame((state, delta) => {
    // Smooth the raw scroll value so a flicked scroll wheel does not make
    // the model judder.
    const target = progress.get();
    smoothed.current += (target - smoothed.current) * Math.min(1, delta * 6);
    const p = smoothed.current;

    if (group.current) {
      // Rotation is driven by scroll position, not by a timer — the visitor
      // is turning the model themselves.
      group.current.rotation.y = -0.62 + p * 1.15;
      group.current.rotation.x = 0.12 - p * 0.16;

      const fit = Math.min(1.28, viewport.width / 3.9);
      group.current.scale.setScalar(fit);
    }

    if (chainMaterial.current) {
      chainMaterial.current.uniforms.uTime.value = state.clock.elapsedTime;
      // The treated segment lights up as the copy explains where it is…
      chainMaterial.current.uniforms.uFocus.value = THREE.MathUtils.smoothstep(
        p,
        0.18,
        0.55,
      );
      // …and goes inert once the copy reaches the ablation step.
      chainMaterial.current.uniforms.uAblate.value = THREE.MathUtils.smoothstep(
        p,
        0.62,
        0.78,
      );
    }

    if (ribMaterial.current) {
      ribMaterial.current.opacity =
        0.22 + THREE.MathUtils.smoothstep(p, 0, 0.3) * 0.3;
    }

    // Ganglia inside the treated segment dim as the chain is ablated.
    const ablated = THREE.MathUtils.smoothstep(p, 0.62, 0.78);
    ganglia.current.forEach((mesh, index) => {
      if (!mesh) return;
      const t = gangliaPoints[index].t;
      const inSegment = t > SEGMENT_START && t < SEGMENT_END;
      const material = mesh.material as THREE.MeshStandardMaterial;
      material.color.set(inSegment ? "#1d8fa1" : "#a8c3ca");
      if (inSegment) {
        material.color.lerp(new THREE.Color("#cdd8d9"), ablated);
        mesh.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.06 * (1 - ablated));
      }
    });
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 3, 4]} intensity={0.7} />

      <lineSegments geometry={ribGeometry}>
        <lineBasicMaterial
          ref={ribMaterial}
          color="#6f8f99"
          transparent
          opacity={0.16}
        />
      </lineSegments>

      <mesh geometry={chainGeometry}>
        <shaderMaterial
          ref={chainMaterial}
          uniforms={uniforms}
          vertexShader={CHAIN_VERTEX}
          fragmentShader={CHAIN_FRAGMENT}
        />
      </mesh>

      {gangliaPoints.map((point, index) => (
        <mesh
          key={index}
          position={point.position}
          ref={(node) => {
            ganglia.current[index] = node;
          }}
        >
          <sphereGeometry args={[0.075, 20, 20]} />
          <meshStandardMaterial roughness={0.45} metalness={0.05} />
        </mesh>
      ))}
    </group>
  );
}

export default function NerveChain({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5.4], fov: 45 }}
      style={{ pointerEvents: "none" }}
    >
      <Anatomy progress={progress} />
    </Canvas>
  );
}
