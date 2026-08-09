"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";

import { Reveal, SectionLabel, SectionSeam } from "@/components/ui";
import { EASE_OUT_SOFT } from "@/lib/motion";
import { journey } from "@/lib/site";

const RING_RADIUS = 78;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/**
 * The patient journey, consult through to results.
 *
 * The practice clearly has this process; the previous site never showed it.
 * The ring stays pinned and fills as you scroll, so the visitor can always
 * see how far through the process they are reading.
 */
export function Journey() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const dashOffset = useTransform(
    scrollYProgress,
    [0, 1],
    [RING_CIRCUMFERENCE, 0],
  );

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const index = Math.min(
      journey.length - 1,
      Math.max(0, Math.floor(value * journey.length)),
    );
    setActiveStep(index);
  });

  const step = journey[activeStep];

  return (
    <section id="journey" className="relative isolate bg-shell">
      <SectionSeam from="bone" />
      <div className="u-container pt-24 sm:pt-32">
        <Reveal>
          <SectionLabel>Your journey</SectionLabel>
        </Reveal>
        <Reveal>
          <h2 className="mt-5 max-w-3xl text-display-md sm:text-display-lg">
            From first consultation to dry hands, step by step.
          </h2>
        </Reveal>
        <Reveal>
          <p className="u-measure mt-5 text-lg text-slate">
            You should know exactly what happens and when, before you commit to
            anything. This is the whole process.
          </p>
        </Reveal>
      </div>

      <div
        ref={sectionRef}
        className="u-container relative lg:grid lg:grid-cols-[0.9fr_1fr] lg:gap-16"
      >
        {/* Pinned progress ring */}
        <div className="sticky top-20 z-10 -mx-6 bg-shell/92 px-6 py-6 backdrop-blur lg:top-0 lg:mx-0 lg:flex lg:h-screen lg:items-center lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
          <div className="flex items-center gap-7 lg:flex-col lg:items-start lg:gap-10">
            <div className="relative shrink-0">
              <svg
                viewBox="0 0 180 180"
                className="h-28 w-28 -rotate-90 lg:h-52 lg:w-52"
                aria-hidden
              >
                <circle
                  cx="90"
                  cy="90"
                  r={RING_RADIUS}
                  fill="none"
                  stroke="#e4eaea"
                  strokeWidth="6"
                />
                <motion.circle
                  cx="90"
                  cy="90"
                  r={RING_RADIUS}
                  fill="none"
                  stroke="#157388"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  style={{ strokeDashoffset: dashOffset }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={step.step}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: EASE_OUT_SOFT }}
                    className="font-display text-3xl text-ink lg:text-5xl"
                  >
                    {step.step}
                  </motion.span>
                </AnimatePresence>
                <span className="mt-0.5 text-[0.6rem] uppercase tracking-[0.16em] text-muted lg:text-[0.65rem]">
                  of {String(journey.length).padStart(2, "0")}
                </span>
              </div>
            </div>

            <div className="min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: EASE_OUT_SOFT }}
                >
                  <p className="font-display text-xl text-ink lg:text-display-md">
                    {step.title}
                  </p>
                  <p className="mt-2 text-sm text-clinical-700 lg:mt-4 lg:text-base">
                    {step.meta}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Step ticks — a compact map of the whole process. */}
              <ul className="mt-5 hidden gap-2 lg:flex">
                {journey.map((item, index) => (
                  <li
                    key={item.step}
                    aria-hidden
                    className={`h-1 w-9 rounded-full transition-colors duration-500 ${
                      index <= activeStep ? "bg-clinical-600" : "bg-line-strong"
                    }`}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Steps scrolling past */}
        <ol className="pb-16 lg:pb-0">
          {journey.map((item, index) => (
            <li
              key={item.step}
              className="flex min-h-[54vh] flex-col justify-center py-8 lg:min-h-[80vh] lg:py-0"
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, ease: EASE_OUT_SOFT }}
                animate={{ opacity: activeStep === index ? 1 : 0.4 }}
                className="rounded-panel border border-line bg-bone p-8 shadow-lift sm:p-10"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-sm font-semibold text-clinical-600">
                    {item.step}
                  </span>
                  <h3 className="font-display text-2xl text-ink">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-5 text-lg text-slate">{item.body}</p>
                <p className="mt-6 border-t border-line pt-5 text-sm text-muted">
                  {item.meta}
                </p>
              </motion.div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
