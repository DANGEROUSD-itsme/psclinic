"use client";

import { useEffect, useRef } from "react";

import { useNearViewport, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Realistic falling rain for the hero — canvas 2D, not CSS.
 *
 * Flat repeating CSS streaks read as a texture, not weather. Real rain
 * reads as individual drops: each one has its own speed, its own streak
 * length (motion blur scales with how fast it's falling), and drops
 * closer to camera fall faster and blur more than distant ones. This
 * simulates three depth layers of drops on one canvas, each drawn as a
 * short gradient stroke — bright, tapering to nothing at the tail — along
 * a single shared wind angle, so the streak direction and the travel
 * direction always agree. That agreement is most of what makes CSS rain
 * look fake and this look real.
 *
 * Canvas 2D rather than WebGL: rain is a 2D compositing problem (a lot of
 * thin strokes), not a shading problem, so a GPU shader buys nothing here.
 * That also means it can skip the site's `useWebGLEligible` gate — the
 * heavier checks that gate exist for real WebGL contexts, and this runs
 * comfortably on hardware that would fail them.
 */

type Layer = {
  count: number;
  speed: [number, number];
  length: [number, number];
  width: [number, number];
  alpha: [number, number];
  color: string;
  glint: boolean;
};

/**
 * Back to front: far, mid, near. Nearer drops are bigger, faster, brighter.
 * Alpha runs noticeably higher than a first pass at this — at realistic
 * subtlety the effect read as nothing at normal viewing distance and only
 * showed up under a 4x crop. This is tuned to be unmistakably rain at
 * actual page scale, not just present in a pixel inspector.
 */
const LAYERS: Layer[] = [
  { count: 100, speed: [260, 360], length: [10, 17], width: [0.7, 1.0], alpha: [0.14, 0.22], color: "50,84,97", glint: false },
  { count: 64, speed: [420, 580], length: [19, 30], width: [1.1, 1.5], alpha: [0.22, 0.34], color: "28,64,79", glint: false },
  { count: 30, speed: [640, 900], length: [30, 48], width: [1.7, 2.3], alpha: [0.3, 0.46], color: "14,48,62", glint: true },
];

/** Degrees off vertical — the same angle drives both streak tilt and travel direction. */
const WIND_DEG = 10;

type Drop = {
  x: number;
  y: number;
  speed: number;
  length: number;
  width: number;
  alpha: number;
};

function randRange([min, max]: [number, number]) {
  return min + Math.random() * (max - min);
}

/** Scatters x across a margin either side so drift never leaves a bare edge. */
function spawnDrop(layer: Layer, width: number, height: number): Drop {
  return {
    x: Math.random() * (width + 200) - 100,
    y: Math.random() * height,
    speed: randRange(layer.speed),
    length: randRange(layer.length),
    width: randRange(layer.width),
    alpha: randRange(layer.alpha),
  };
}

export function Rain() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visibilityRef, nearViewport] = useNearViewport<HTMLDivElement>("100px");
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!nearViewport) return;

    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const angle = (WIND_DEG * Math.PI) / 180;
    const dirX = Math.sin(angle);
    const dirY = Math.cos(angle);

    let width = 0;
    let height = 0;
    let dpr = 1;
    let drops: { layer: Layer; drop: Drop }[] = [];

    function populate() {
      drops = [];
      for (const layer of LAYERS) {
        for (let i = 0; i < layer.count; i += 1) {
          // Scattered across the full height, not bunched at the top — the
          // scene should look like rain already falling, not rain that
          // just started the moment the page loaded.
          drops.push({ layer, drop: spawnDrop(layer, width, height) });
        }
      }
    }

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      populate();
    }

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrap);

    function drawFrame() {
      ctx!.clearRect(0, 0, width, height);

      for (const { layer, drop } of drops) {
        const tailX = drop.x - dirX * drop.length;
        const tailY = drop.y - dirY * drop.length;

        const gradient = ctx!.createLinearGradient(tailX, tailY, drop.x, drop.y);
        gradient.addColorStop(0, `rgba(${layer.color},0)`);
        gradient.addColorStop(1, `rgba(${layer.color},${drop.alpha})`);

        ctx!.strokeStyle = gradient;
        ctx!.lineWidth = drop.width;
        ctx!.lineCap = "round";
        ctx!.beginPath();
        ctx!.moveTo(tailX, tailY);
        ctx!.lineTo(drop.x, drop.y);
        ctx!.stroke();

        // A tiny bright point at the leading edge on the nearest layer only
        // — the specular catch-light that sells a drop as wet rather than
        // a painted line.
        if (layer.glint) {
          ctx!.fillStyle = `rgba(255,255,255,${drop.alpha * 0.8})`;
          ctx!.beginPath();
          ctx!.arc(drop.x, drop.y, drop.width * 0.6, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
    }

    /** `deltaSeconds` keeps fall speed consistent across refresh rates. */
    function step(deltaSeconds: number) {
      for (const entry of drops) {
        const { drop, layer } = entry;
        drop.x += dirX * drop.speed * deltaSeconds;
        drop.y += dirY * drop.speed * deltaSeconds;

        // Recycle once a drop clears the bottom or drifts past the right
        // edge, staggering the restart slightly above the top so arrivals
        // don't all pop in on the same line.
        if (drop.y - drop.length > height || drop.x > width + 120) {
          Object.assign(drop, spawnDrop(layer, width, height));
          drop.y = -drop.length - Math.random() * height * 0.3;
        }
      }
      drawFrame();
    }

    if (prefersReducedMotion) {
      // A still frame reads as "rain" even motionless; a live loop would
      // not respect the visitor's stated preference.
      drawFrame();
      return () => resizeObserver.disconnect();
    }

    let raf = 0;
    let last = performance.now();
    function loop(now: number) {
      raf = requestAnimationFrame(loop);
      // Clamp so a stalled/backgrounded tab resuming doesn't fling every
      // drop across the screen in one oversized step.
      const deltaSeconds = Math.min(now - last, 50) / 1000;
      last = now;
      step(deltaSeconds);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
  }, [nearViewport, prefersReducedMotion]);

  return (
    <div
      ref={(node) => {
        wrapRef.current = node;
        visibilityRef.current = node;
      }}
      aria-hidden
      className="u-hero-mask pointer-events-none absolute inset-0 -z-10"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
