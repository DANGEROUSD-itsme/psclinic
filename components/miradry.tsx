"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { ArrowRight, ButtonLink, Reveal, RevealGroup, RevealItem, SectionLabel, SectionSeam } from "@/components/ui";
import { miradrySteps } from "@/lib/site";

/**
 * How miraDry works.
 *
 * Deliberately not a WebGL moment — the guardrail is that heavy 3D stays on
 * the hero and the ETS explainer. What this needs instead is a diagram that
 * makes one thing obvious: the energy lands at gland depth while the skin
 * surface is cooled and protected.
 */
function DepthDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.35"],
  });

  const energyOpacity = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
  const energyY = useTransform(scrollYProgress, [0.1, 0.55], [-18, 0]);
  const glandFade = useTransform(scrollYProgress, [0.55, 0.9], [1, 0.18]);

  return (
    <div ref={ref} className="relative">
      <svg
        viewBox="0 0 400 300"
        className="w-full"
        role="img"
        aria-label="Cross-section of underarm skin showing microwave energy focused at sweat gland depth while the skin surface is cooled."
      >
        {/* Skin layers */}
        <rect x="0" y="0" width="400" height="300" rx="18" fill="#fbfbf9" />
        <rect x="0" y="0" width="400" height="52" fill="#e9f0f1" />
        <rect x="0" y="52" width="400" height="70" fill="#f2f7f7" />

        {/* Cooling at the surface */}
        <g>
          {[40, 100, 160, 220, 280, 340].map((x) => (
            <motion.path
              key={x}
              d={`M${x} 14 q 10 8 0 16 q -10 8 0 16`}
              stroke="#71ccd8"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.75"
            />
          ))}
        </g>
        <text
          x="20"
          y="44"
          fill="#157388"
          fontSize="11"
          fontWeight="600"
          letterSpacing="0.08em"
        >
          SKIN COOLED AND PROTECTED
        </text>

        {/* Energy focused at gland depth */}
        <motion.g style={{ opacity: energyOpacity, y: energyY }}>
          {[70, 140, 210, 280, 350].map((x) => (
            <g key={x}>
              <line
                x1={x}
                y1="60"
                x2={x}
                y2="150"
                stroke="#d1764b"
                strokeWidth="2"
                strokeDasharray="5 5"
                opacity="0.55"
              />
              <ellipse cx={x} cy="156" rx="26" ry="12" fill="#f0b58e" opacity="0.35" />
            </g>
          ))}
        </motion.g>

        {/* Gland layer */}
        <motion.g style={{ opacity: glandFade }}>
          {[52, 118, 186, 254, 322, 372].map((x, i) => (
            <g key={x}>
              <circle cx={x} cy="158" r="9" fill="#38adbd" opacity="0.85" />
              <path
                d={`M${x} 149 q ${i % 2 ? 8 : -8} -14 0 -26`}
                stroke="#38adbd"
                strokeWidth="2.5"
                fill="none"
                opacity="0.55"
              />
            </g>
          ))}
        </motion.g>

        <line
          x1="0"
          y1="196"
          x2="400"
          y2="196"
          stroke="#e4eaea"
          strokeWidth="2"
        />
        <text x="20" y="222" fill="#7a8b91" fontSize="11" letterSpacing="0.08em">
          SWEAT, ODOUR AND HAIR GLANDS — PERMANENTLY DESTROYED
        </text>
        <text x="20" y="262" fill="#7a8b91" fontSize="11" letterSpacing="0.08em">
          DEEPER TISSUE UNAFFECTED
        </text>
      </svg>
    </div>
  );
}

export function MiraDry() {
  return (
    <section id="miradry" className="relative isolate bg-bone py-24 sm:py-32">
      <SectionSeam from="shell" />
      <div className="u-container">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <Reveal>
              <SectionLabel>miraDry</SectionLabel>
            </Reveal>
            <Reveal>
              <h2 className="mt-5 text-display-md sm:text-display-lg">
                No sweat, no odour, no hair. Without surgery.
              </h2>
            </Reveal>
            <Reveal>
              <p className="mt-6 text-lg text-slate">
                miraDry treats underarm hyperhidrosis with microwave energy
                delivered just beneath the skin, at exactly the depth the sweat
                and odour glands sit. Those glands are destroyed, and they do
                not grow back.
              </p>
            </Reveal>
            <Reveal>
              <p className="mt-5 text-slate">
                It takes 60 to 90 minutes, in the clinic&apos;s Mount Hospital
                suite, under local anaesthetic. Perth Sweat Clinic is a fully
                accredited miraDry practice.
              </p>
            </Reveal>

            <RevealGroup className="mt-10 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
              {[
                { value: "85%", label: "need one treatment only" },
                { value: "60–90", label: "minutes, in-office" },
                { value: "TGA + FDA", label: "approved technology" },
              ].map((stat) => (
                <RevealItem key={stat.label} className="bg-bone px-5 py-5">
                  <p className="font-display text-xl text-clinical-700">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted">{stat.label}</p>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href="#contact" size="lg">
                  Book a miraDry consultation
                  <ArrowRight />
                </ButtonLink>
                <p className="text-sm text-muted">
                  <span className="font-display text-lg text-ink">$2,900</span>{" "}
                  complete treatment
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal soft>
            <div className="overflow-hidden rounded-panel border border-line bg-bone p-6 shadow-lift sm:p-8">
              <DepthDiagram />
            </div>
          </Reveal>
        </div>

        {/* Steps */}
        <RevealGroup
          className="mt-20 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
          childDelay={0.07}
        >
          {miradrySteps.map((step, index) => (
            <RevealItem key={step.title} className="bg-bone p-7">
              <span className="font-display text-sm font-semibold text-clinical-600">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-base text-ink">
                {step.title}
              </h3>
              <p className="mt-2.5 text-sm text-slate">{step.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal>
          <p className="mt-8 text-sm text-muted">
            Around 15% of patients need a second treatment, charged at $2,400.
            Expect some swelling, redness or altered sensation afterwards, which
            settles; ice packs are applied on the day.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
