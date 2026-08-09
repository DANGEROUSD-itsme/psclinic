"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";

import { ArrowRight, Reveal, RevealGroup, RevealItem, SectionHeading } from "@/components/ui";
import type { FieldParams } from "@/components/webgl/condition-field";
import { useHashLinkClick, useNearViewport, useWebGLEligible } from "@/lib/hooks";
import { EASE_OUT_SOFT } from "@/lib/motion";
import { conditionFacts, conditions, type ConditionId } from "@/lib/site";

const ConditionField = dynamic(
  () => import("@/components/webgl/condition-field"),
  { ssr: false },
);

/**
 * Each sub-type gets its own field parameters. The palette stays inside
 * the one clinical accent family — only the structure and depth change —
 * so three distinct identities never fragment the brand.
 */
const fieldParams: Record<ConditionId, FieldParams> = {
  hands: { seed: 0.16, color: "#1493a8" },
  underarms: { seed: 0.54, color: "#33b6c8" },
  face: { seed: 0.87, color: "#63cddb" },
};

/** CSS stand-in used wherever the shader does not run. */
const fallbackGradient: Record<ConditionId, string> = {
  hands:
    "radial-gradient(75% 70% at 30% 25%, #cfeaf0 0%, transparent 65%), radial-gradient(65% 60% at 75% 80%, #a9dce6 0%, transparent 70%), #eef5f6",
  underarms:
    "radial-gradient(70% 65% at 70% 25%, #d8f0f4 0%, transparent 68%), radial-gradient(60% 65% at 25% 75%, #b6e3ea 0%, transparent 70%), #f0f7f8",
  face: "radial-gradient(80% 60% at 50% 20%, #e2f4f7 0%, transparent 70%), radial-gradient(60% 60% at 30% 85%, #c6e9ef 0%, transparent 70%), #f2f8f9",
};

export function Conditions() {
  const [active, setActive] = useState<ConditionId>("hands");
  const [visualRef, nearViewport] = useNearViewport<HTMLDivElement>("250px");
  const webglEligible = useWebGLEligible();
  const handleHashClick = useHashLinkClick();

  const condition = conditions.find((item) => item.id === active) ?? conditions[0];
  const showCanvas = webglEligible && nearViewport;

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /**
   * Arrow-key navigation, as the tabs pattern expects. Combined with the
   * roving tabindex below, the group behaves like one control rather than
   * three separate stops in the tab order.
   */
  const handleTabKeyDown = useCallback(
    (event: React.KeyboardEvent, index: number) => {
      const lastIndex = conditions.length - 1;
      let next: number | null = null;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        next = index === lastIndex ? 0 : index + 1;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        next = index === 0 ? lastIndex : index - 1;
      } else if (event.key === "Home") {
        next = 0;
      } else if (event.key === "End") {
        next = lastIndex;
      }

      if (next === null) return;
      event.preventDefault();
      setActive(conditions[next].id);
      tabRefs.current[next]?.focus();
    },
    [],
  );

  return (
    <section id="conditions" className="relative bg-bone py-24 sm:py-32">
      <div className="u-container">
        <SectionHeading
          label="The condition"
          title="Three ways it shows up. One overactive nerve system underneath."
          lede="Hyperhidrosis is excessive, uncontrollable sweating driven by an overactive sympathetic nervous system. It usually begins in the early teens, and about half of patients have a parent with the same thing. It is a medical condition, not a habit."
        />

        {/* Tabs */}
        <Reveal className="mt-12">
          <div
            role="tablist"
            aria-label="Hyperhidrosis sub-types"
            className="inline-flex flex-wrap gap-1.5 rounded-full border border-line bg-white/70 p-1.5 backdrop-blur"
          >
            {conditions.map((item, index) => {
              const selected = item.id === active;
              return (
                <button
                  key={item.id}
                  role="tab"
                  id={`condition-tab-${item.id}`}
                  aria-selected={selected}
                  aria-controls={`condition-panel-${item.id}`}
                  tabIndex={selected ? 0 : -1}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  onClick={() => setActive(item.id)}
                  className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                    selected ? "text-white" : "text-slate hover:text-clinical-700"
                  }`}
                >
                  {selected ? (
                    <motion.span
                      layoutId="condition-pill"
                      transition={{ duration: 0.4, ease: EASE_OUT_SOFT }}
                      className="absolute inset-0 rounded-full bg-clinical-700"
                    />
                  ) : null}
                  <span className="relative">{item.label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-stretch lg:gap-14">
          {/* Copy panel */}
          <div
            role="tabpanel"
            id={`condition-panel-${condition.id}`}
            aria-labelledby={`condition-tab-${condition.id}`}
            className="flex flex-col justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={condition.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE_OUT_SOFT }}
              >
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-clinical-600">
                  {condition.clinical}
                </p>
                <h3 className="mt-4 text-display-md">{condition.headline}</h3>
                <p className="mt-5 text-lg text-slate">{condition.lede}</p>

                <ul className="mt-8 space-y-3.5">
                  {condition.lived.map((item) => (
                    <li key={item} className="flex gap-3.5 text-slate">
                      <svg
                        aria-hidden
                        viewBox="0 0 16 16"
                        fill="none"
                        className="mt-[7px] h-2.5 w-2.5 shrink-0"
                      >
                        <circle cx="8" cy="8" r="6" fill="#a9e1e9" />
                        <circle cx="8" cy="8" r="2.5" fill="#157388" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href={condition.treatmentHref}
                  onClick={(event) => handleHashClick(event, condition.treatmentHref)}
                  className="group mt-9 inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-white px-5 py-3 text-sm font-semibold text-ink transition duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-clinical-300 hover:shadow-lift"
                >
                  <span className="text-muted">Treated with</span>
                  {condition.treatment}
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Shader panel */}
          <Reveal soft>
            <div
              ref={visualRef}
              className="relative min-h-[24rem] overflow-hidden rounded-panel border border-line shadow-lift lg:min-h-[32rem]"
            >
              <div
                aria-hidden
                className="absolute inset-0 transition-[background] duration-700"
                style={{ background: fallbackGradient[condition.id] }}
              />
              {showCanvas ? (
                <div aria-hidden className="absolute inset-0">
                  <ConditionField params={fieldParams[condition.id]} />
                </div>
              ) : null}

              {/* Legibility scrim — only deep enough to carry the caption. */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/92 via-white/55 to-transparent"
              />

              <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={condition.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease: EASE_OUT_SOFT }}
                  >
                    <p className="font-display text-2xl text-ink">
                      {condition.clinical}
                    </p>
                    <p className="mt-2 max-w-sm text-sm text-slate">
                      {condition.label} · treated with {condition.treatment}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Prevalence facts */}
        <RevealGroup className="mt-16 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {conditionFacts.map((fact) => (
            <RevealItem key={fact.label} className="bg-bone px-6 py-7">
              <p className="font-display text-2xl text-clinical-700">
                {fact.stat}
              </p>
              <p className="mt-2 text-sm text-slate">{fact.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
