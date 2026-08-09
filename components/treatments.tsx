"use client";

import Link from "next/link";

import { ArrowRight, Card, Reveal, RevealGroup, RevealItem, SectionHeading, SectionSeam } from "@/components/ui";
import { useHashLinkClick } from "@/lib/hooks";
import { treatments } from "@/lib/site";

function CheckMark() {
  return (
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
  );
}

export function Treatments() {
  const handleHashClick = useHashLinkClick();
  return (
    <section id="treatments" className="relative isolate bg-bone py-24 sm:py-32">
      <SectionSeam from="shell" />
      <div className="u-container">
        <SectionHeading
          label="Treatments"
          title="Three routes. Which one applies depends on where you sweat."
          lede="Surgery is not the first answer for everyone, and you will be told plainly whether it suits you. Everything starts with a consultation."
        />

        <RevealGroup className="mt-14 grid gap-6 lg:grid-cols-3" childDelay={0.09}>
          {treatments.map((treatment) => (
            <RevealItem key={treatment.id} className="h-full">
              <Card
                interactive
                className="flex h-full flex-col p-8 shadow-lift sm:p-9"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl text-ink">
                    {treatment.name}
                  </h3>
                  <span className="text-right font-display text-base text-clinical-700">
                    {treatment.price}
                  </span>
                </div>

                <p className="mt-1.5 text-sm text-muted">{treatment.fullName}</p>

                <p className="mt-6 text-slate">{treatment.summary}</p>

                <ul className="mt-7 space-y-3 border-t border-line pt-7">
                  {treatment.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm text-slate">
                      <CheckMark />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <p className="text-xs text-muted">{treatment.priceNote}</p>
                  <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted">
                    Treats
                  </p>
                  <p className="mt-1.5 text-sm text-slate">{treatment.treats}</p>

                  <Link
                    href={treatment.href}
                    onClick={(event) => handleHashClick(event, treatment.href)}
                    className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-clinical-700 transition-colors duration-300 hover:text-clinical-800"
                  >
                    {treatment.id === "consult"
                      ? "Book a consultation"
                      : `How ${treatment.name} works`}
                    <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal>
          <p className="mt-10 text-sm text-muted">
            Referrals: a valid GP referral entitles you to a Medicare rebate of
            $86.15 on the consultation fee. ETS surgery is fully covered by
            private health funds.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
