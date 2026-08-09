"use client";

import { ArrowRight, ButtonLink, Reveal, RevealGroup, RevealItem, SectionLabel, SectionSeam } from "@/components/ui";
import { etsRisks, locations } from "@/lib/site";

/**
 * About ETS.
 *
 * Earlier drafts of this section dramatised the surgical mechanism itself —
 * a scroll-driven 3D nerve chain with an "ablation" animation, plus a
 * minute-by-minute procedure-day schedule. Neither belongs on a marketing
 * page: a stylised animation of a surgical technique risks reading as more
 * clinically authoritative than a webpage can responsibly be, and an exact
 * timetable overclaims certainty about a hospital's day-of scheduling. What
 * changes and how something is done belongs in the consultation, with Dr
 * Sharma, not in a page animation. This section instead states plainly what
 * the procedure is, what it treats, where it happens, and — at proper
 * length — what the risks are, then routes everything else to a
 * consultation.
 */
export function EtsExplainer() {
  return (
    <section id="ets" className="relative isolate bg-shell py-24 sm:py-32">
      <SectionSeam from="bone" />
      <div className="u-container">
        <div className="grid gap-14 lg:grid-cols-[1fr_0.85fr] lg:items-start lg:gap-20">
          <div>
            <Reveal>
              <SectionLabel>Endoscopic Thoracic Sympathectomy</SectionLabel>
            </Reveal>
            <Reveal>
              <h2 className="mt-5 text-display-md sm:text-display-lg">
                A minimally invasive surgical option for sweaty hands and
                face.
              </h2>
            </Reveal>
            <Reveal>
              <p className="mt-6 text-lg text-slate">
                ETS is the clinic&apos;s surgical option for palmar and severe
                craniofacial hyperhidrosis, and for facial blushing. It is
                offered once conservative treatments have failed, and it is
                performed as a day procedure under general anaesthetic at an
                accredited private hospital.
              </p>
            </Reveal>
            <Reveal>
              <p className="mt-5 text-slate">
                The technique, what it involves, and what recovery looks like
                for you specifically are things Dr Sharma will walk you
                through in your consultation, not something a webpage
                should try to summarise for you in advance. What follows here
                is what you should know going in: what it treats, where it
                happens, and its genuine risks.
              </p>
            </Reveal>

            <Reveal>
              <div className="mt-9">
                <ButtonLink href="#contact" size="lg">
                  Discuss ETS with Dr Sharma
                  <ArrowRight />
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <Reveal soft>
            <div className="rounded-panel border border-line bg-bone p-8 shadow-lift sm:p-10">
              <h3 className="font-display text-lg text-ink">
                What ETS treats
              </h3>
              <ul className="mt-5 space-y-3">
                {[
                  "Palmar hyperhidrosis (sweaty hands)",
                  "Severe craniofacial hyperhidrosis",
                  "Facial blushing",
                  "Raynaud's disease",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-slate">
                    <svg
                      aria-hidden
                      viewBox="0 0 16 16"
                      fill="none"
                      className="mt-[5px] h-3.5 w-3.5 shrink-0 text-clinical-600"
                    >
                      <path
                        d="M3 8.5l3.2 3.2L13 5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 border-t border-line pt-8 font-display text-lg text-ink">
                Where it is performed
              </h3>
              <ul className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
                {locations.hospitals.map((hospital) => (
                  <li key={hospital.name} className="bg-bone px-4 py-3.5">
                    <p className="text-sm font-semibold text-ink">
                      {hospital.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {hospital.suburb}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Risks — disclosed plainly, not buried */}
      <div className="u-container pt-20 sm:pt-24">
        <Reveal>
          <div className="max-w-2xl">
            <SectionLabel>What you should know</SectionLabel>
            <h3 className="mt-5 text-display-md">
              Every surgical procedure has trade-offs. Here are these ones.
            </h3>
            <p className="mt-5 text-slate">
              Dr Sharma will go through all of these with you before you decide
              anything. Compensatory sweating in particular is worth weighing
              carefully; it is the most common one.
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
