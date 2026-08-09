"use client";

import dynamic from "next/dynamic";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";

import { Reveal, RevealGroup, RevealItem, SectionLabel } from "@/components/ui";
import { useNearViewport, useWebGLEligible } from "@/lib/hooks";
import { EASE_OUT_SOFT } from "@/lib/motion";
import { etsRisks, etsSteps, locations } from "@/lib/site";

const NerveChain = dynamic(() => import("@/components/webgl/nerve-chain"), {
  ssr: false,
});

/**
 * How ETS works.
 *
 * The visual is pinned while the steps scroll past it, so each step updates
 * the same anchored model rather than scrolling a fresh graphic into view.
 */
export function EtsExplainer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visualRef, nearViewport] = useNearViewport<HTMLDivElement>("300px");
  const webglEligible = useWebGLEligible();
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // The model reads the raw scroll progress; the copy reads a stepped
  // version of the same value, so they can never disagree.
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const index = Math.min(
      etsSteps.length - 1,
      Math.max(0, Math.floor(value * etsSteps.length)),
    );
    setActiveStep(index);
  });

  const fallbackRotation = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const showCanvas = webglEligible && nearViewport;

  return (
    <section id="ets" className="bg-shell">
      <div className="u-container pt-24 sm:pt-32">
        <Reveal>
          <SectionLabel>Endoscopic Thoracic Sympathectomy</SectionLabel>
        </Reveal>
        <Reveal>
          <h2 className="mt-5 max-w-3xl text-display-md sm:text-display-lg">
            Keyhole surgery that switches the signal off at its source.
          </h2>
        </Reveal>
        <Reveal>
          <p className="u-measure mt-5 text-lg text-slate">
            ETS is the clinic&apos;s flagship procedure for sweaty hands, and
            for severe craniofacial sweating and facial blushing. It is offered
            once conservative treatments have failed — and it is a day
            procedure.
          </p>
        </Reveal>
      </div>

      {/* Pinned scroll block */}
      <div ref={sectionRef} className="u-container relative lg:grid lg:grid-cols-2 lg:gap-16">
        {/* The anchored visual */}
        <div className="sticky top-20 z-10 -mx-6 bg-shell/90 px-6 pt-8 pb-4 backdrop-blur lg:top-0 lg:mx-0 lg:flex lg:h-screen lg:items-center lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
          <div
            ref={visualRef}
            className="relative h-[36vh] w-full overflow-hidden rounded-panel border border-line bg-bone shadow-lift lg:h-[68vh]"
          >
            {showCanvas ? (
              <div aria-hidden className="absolute inset-0">
                <NerveChain progress={scrollYProgress} />
              </div>
            ) : (
              /* Static fallback: the same idea, drawn flat. */
              <motion.svg
                aria-hidden
                viewBox="0 0 200 320"
                style={{ rotate: fallbackRotation }}
                className="absolute inset-0 h-full w-full p-10"
              >
                {[0, 1, 2, 3, 4, 5, 6].map((rib) => (
                  <g key={rib} stroke="#6f8f99" strokeOpacity="0.22" fill="none">
                    <path
                      d={`M100 ${44 + rib * 38} q -${34 + rib * 6} 8 -${44 + rib * 8} ${18 + rib * 3}`}
                    />
                    <path
                      d={`M100 ${44 + rib * 38} q ${34 + rib * 6} 8 ${44 + rib * 8} ${18 + rib * 3}`}
                    />
                  </g>
                ))}
                <path
                  d="M100 24 C 92 90, 92 170, 100 296"
                  stroke="#8fb3bc"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M97 70 C 94 92, 93 108, 94 122"
                  stroke="#1d8fa1"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                />
                {[52, 90, 128, 166, 204, 242, 280].map((cy, i) => (
                  <circle
                    key={cy}
                    cx={i < 3 ? 96 : 98}
                    cy={cy}
                    r="6"
                    fill={cy > 60 && cy < 130 ? "#1d8fa1" : "#a8c3ca"}
                  />
                ))}
              </motion.svg>
            )}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-bone via-bone/70 to-transparent p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Sympathetic nerve chain · 2nd–3rd ribs
              </p>
              <p className="shrink-0 font-display text-sm text-clinical-700">
                {String(activeStep + 1).padStart(2, "0")} / {String(etsSteps.length).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>

        {/* The steps that scroll past it */}
        <div className="pb-16 lg:pb-0">
          {etsSteps.map((step, index) => (
            <div
              key={step.title}
              className="flex min-h-[58vh] flex-col justify-center py-10 lg:min-h-[82vh] lg:py-0"
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, ease: EASE_OUT_SOFT }}
                animate={{
                  opacity: activeStep === index ? 1 : 0.5,
                }}
              >
                <span className="font-display text-sm font-semibold text-clinical-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-display-md">{step.title}</h3>
                <p className="mt-5 max-w-lg text-lg text-slate">{step.body}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Procedure day + hospitals */}
      <div className="u-container pt-8">
        <RevealGroup className="grid gap-6 lg:grid-cols-2">
          <RevealItem className="rounded-card border border-line bg-bone p-8 sm:p-9">
            <h3 className="font-display text-xl text-ink">Your procedure day</h3>
            <ul className="mt-6 space-y-4">
              {[
                { time: "6:30am", event: "Admitted to hospital" },
                { time: "8:00am", event: "Surgery — around 30 minutes per side" },
                { time: "9:00am", event: "Approximately one hour in recovery" },
                { time: "10:00am", event: "Chest X-ray to confirm full lung expansion" },
                { time: "1:00pm", event: "Discharged home with simple painkillers" },
                { time: "3 weeks", event: "Follow-up appointment with Dr Sharma" },
              ].map((item) => (
                <li key={item.time} className="flex gap-5 text-slate">
                  <span className="w-20 shrink-0 font-display text-sm font-semibold text-clinical-700">
                    {item.time}
                  </span>
                  <span className="text-sm">{item.event}</span>
                </li>
              ))}
            </ul>
          </RevealItem>

          <RevealItem className="rounded-card border border-line bg-bone p-8 sm:p-9">
            <h3 className="font-display text-xl text-ink">
              Where surgery is performed
            </h3>
            <p className="mt-3 text-sm text-slate">
              ETS is carried out at accredited private hospitals across Perth.
            </p>
            <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
              {locations.hospitals.map((hospital) => (
                <li key={hospital.name} className="bg-bone px-5 py-4">
                  <p className="text-sm font-semibold text-ink">
                    {hospital.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">{hospital.suburb}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-slate">
              ETS is also used to treat facial blushing and Raynaud&apos;s
              disease.
            </p>
          </RevealItem>
        </RevealGroup>
      </div>

      {/* Risks — disclosed plainly, not buried */}
      <div className="u-container py-20 sm:py-24">
        <Reveal>
          <div className="max-w-2xl">
            <SectionLabel>What you should know</SectionLabel>
            <h3 className="mt-5 text-display-md">
              Every surgical procedure has trade-offs. Here are these ones.
            </h3>
            <p className="mt-5 text-slate">
              Dr Sharma will go through all of these with you before you decide
              anything. Compensatory sweating in particular is worth weighing
              carefully — it is the most common one.
            </p>
          </div>
        </Reveal>

        <RevealGroup
          className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
          childDelay={0.05}
        >
          {etsRisks.map((risk) => (
            <RevealItem key={risk.title} className="bg-bone p-7">
              <h4 className="font-display text-base text-ink">{risk.title}</h4>
              <p className="mt-2.5 text-sm text-slate">{risk.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
