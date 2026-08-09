"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

import { ArrowRight, ButtonLink } from "@/components/ui";
import type { PointerState } from "@/components/webgl/dry-hand-field";
import { useNearViewport, useWebGLEligible } from "@/lib/hooks";
import { EASE_OUT_SOFT } from "@/lib/motion";
import { clinic } from "@/lib/site";
import { useSound } from "@/lib/use-sound";

const DryHandField = dynamic(() => import("@/components/webgl/dry-hand-field"), {
  ssr: false,
});

const heroStats = [
  { value: "85%", label: "need one miraDry treatment" },
  { value: "Permanent", label: "results, not maintenance" },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [canvasRef, nearViewport] = useNearViewport<HTMLDivElement>("200px");
  const webglEligible = useWebGLEligible();
  const { play } = useSound();

  const pointerState = useRef<PointerState>({ x: 0, y: 0, active: false });
  const dropletCuePlayed = useRef(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  /**
   * The droplets finish evaporating by the time the hero is ~75% scrolled
   * past, so the field is fully clear before the next section arrives
   * rather than lingering behind it.
   */
  const dryness = useTransform(scrollYProgress, [0, 0.75], [0, 1], {
    clamp: true,
  });

  // Copy drifts up and fades slightly slower than the droplets — a shallow
  // parallax that gives the hero depth without disturbing readability.
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  /**
   * A single droplet tick the moment the field resolves — the one place on
   * the site where a sound is tied to a scroll position, and only ever if
   * the visitor has switched sound on.
   */
  useEffect(() => {
    const unsubscribe = dryness.on("change", (value) => {
      if (value > 0.72 && !dropletCuePlayed.current) {
        dropletCuePlayed.current = true;
        play("droplet");
      }
      if (value < 0.2) dropletCuePlayed.current = false;
    });
    return unsubscribe;
  }, [dryness, play]);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    // Fine pointers only — a touch drag should not drag a drying halo around.
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerState.current = {
      x: ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      y: -(((event.clientY - bounds.top) / bounds.height) * 2 - 1),
      active: true,
    };
  }, []);

  const handlePointerLeave = useCallback(() => {
    pointerState.current.active = false;
  }, []);

  const showCanvas = webglEligible && nearViewport;

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative isolate flex min-h-[92svh] items-center overflow-hidden bg-bone pt-28 pb-20 sm:pt-32"
    >
      {/* Ambient wash. Doubles as the complete static fallback whenever the
          droplet field is not rendered. */}
      <div aria-hidden className="u-wash absolute inset-0 -z-20" />

      {/*
        The droplets are decoration; the promise they illustrate is stated in
        the headline beside them. The mask fades the field out across the left
        of the screen so it never competes with that headline for contrast —
        the beads gather in the open space to the right instead.
      */}
      <div ref={canvasRef} aria-hidden className="u-hero-mask absolute inset-0 -z-10">
        {showCanvas ? (
          <DryHandField progress={dryness} pointerState={pointerState} />
        ) : null}
      </div>

      <div className="u-container relative">
        <motion.div
          style={{ opacity: copyOpacity, y: copyY }}
          className="max-w-3xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_SOFT }}
            className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/70 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-clinical-700 backdrop-blur"
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ember-500" />
            Hyperhidrosis specialists · Perth
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT_SOFT, delay: 0.08 }}
            className="mt-7 text-display-lg sm:text-display-xl lg:text-display-2xl"
          >
            The last day you plan
            <br className="hidden sm:block" />{" "}
            <span className="text-clinical-700">your life around sweat.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT_SOFT, delay: 0.16 }}
            className="mt-7 max-w-xl text-lg text-slate sm:text-xl"
          >
            Excessive sweating of the hands, underarms and face, treated
            permanently by a Harvard-trained cardiothoracic surgeon. Most
            patients are home the same day.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT_SOFT, delay: 0.24 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <ButtonLink href="#contact" size="lg">
              Book a consultation
              <ArrowRight />
            </ButtonLink>
            <ButtonLink href="#conditions" tone="outline" size="lg">
              Which type affects you?
            </ButtonLink>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: EASE_OUT_SOFT, delay: 0.32 }}
            className="mt-6 text-sm text-muted"
          >
            Consultations in person, by phone or by video ·{" "}
            <a
              href={clinic.phoneHref}
              className="font-semibold text-clinical-700 underline-offset-4 hover:underline"
            >
              {clinic.phone}
            </a>
          </motion.p>
        </motion.div>
      </div>

      {/* Trust strip — pinned to the base of the hero so the credentials are
          visible without any scrolling at all. */}
      <div className="u-container absolute inset-x-0 bottom-0 hidden pb-8 lg:block">
        <motion.dl
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT_SOFT, delay: 0.45 }}
          className="inline-grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line"
        >
          {heroStats.map((stat) => (
            <div key={stat.label} className="bg-white/80 px-6 py-5 backdrop-blur">
              <dt className="font-display text-xl text-ink">{stat.value}</dt>
              <dd className="mt-1 text-sm text-muted">{stat.label}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
