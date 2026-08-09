"use client";

import { ArrowRight, ButtonLink, Reveal, RevealGroup, RevealItem, SectionHeading } from "@/components/ui";
import { pricing } from "@/lib/site";

export function Pricing() {
  return (
    <section id="pricing" className="bg-bone py-24 sm:py-32">
      <div className="u-container">
        <SectionHeading
          label="Pricing"
          title="What it costs, before you ask."
          lede="Fees are published here rather than buried inside individual treatment pages. There are no consultation packages, and no pressure to commit on the day."
        />

        <RevealGroup className="mt-14 grid gap-6 lg:grid-cols-3" childDelay={0.08}>
          {pricing.map((tier) => (
            <RevealItem key={tier.name} className="h-full">
              <div
                className={`flex h-full flex-col rounded-card border p-8 sm:p-9 ${
                  tier.featured
                    ? "border-clinical-300 bg-clinical-50 shadow-float"
                    : "border-line bg-white/80 shadow-lift"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-xl text-ink">{tier.name}</h3>
                  {tier.featured ? (
                    <span className="rounded-full bg-clinical-700 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white">
                      Most common
                    </span>
                  ) : null}
                </div>

                <p className="mt-6 font-display text-display-md text-clinical-800">
                  {tier.price}
                </p>
                <p className="mt-3 text-sm text-slate">{tier.note}</p>

                <ul className="mt-8 space-y-3 border-t border-line pt-7">
                  {tier.items.map((item) => (
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
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Funding */}
        <Reveal>
          <div className="mt-8 grid gap-6 rounded-card border border-line bg-shell p-8 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <h3 className="font-display text-xl text-ink">
                Medicare and private health
              </h3>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-clinical-700">
                    Medicare
                  </p>
                  <p className="mt-1.5 text-sm text-slate">
                    A rebate of $86.15 applies to the $300 consultation when you
                    hold a valid GP referral. Worth arranging beforehand.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-clinical-700">
                    Private health funds
                  </p>
                  <p className="mt-1.5 text-sm text-slate">
                    ETS surgery is fully covered. miraDry is a non-surgical
                    procedure and is charged at the fee shown above.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:text-right">
              <ButtonLink href="/#contact" size="lg">
                Book a consultation
                <ArrowRight />
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
