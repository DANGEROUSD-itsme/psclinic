"use client";

import { Reveal, RevealGroup, RevealItem, SectionSeam } from "@/components/ui";
import { patientStories, trustStats } from "@/lib/site";

export function Trust() {
  return (
    <section id="results" className="relative isolate overflow-hidden bg-clinical-900 py-24 sm:py-32">
      {/* The one dark moment on the site — a deliberate pause between the
          treatment detail and the commercial sections. Both seams are wider
          than usual: a light-to-dark transition needs a longer blend than a
          same-tone one to avoid reading as a hard flash. */}
      <SectionSeam from="shell" height="h-40 sm:h-52" />
      <SectionSeam from="bone" edge="bottom" height="h-40 sm:h-52" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 60% at 20% 15%, rgba(56,173,189,0.4) 0%, transparent 65%), radial-gradient(55% 55% at 85% 80%, rgba(209,118,75,0.25) 0%, transparent 68%)",
        }}
      />

      <div className="u-container relative">
        <div className="max-w-2xl">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-clinical-200">
              <span aria-hidden className="h-px w-6 bg-clinical-400" />
              Results
            </span>
          </Reveal>
          <Reveal>
            <h2 className="mt-5 text-display-md text-white sm:text-display-lg">
              Permanent means permanent.
            </h2>
          </Reveal>
          <Reveal>
            <p className="mt-5 text-lg text-clinical-100">
              These are not treatments you return for every few months. The
              glands do not regenerate, and the nerve signal does not come
              back.
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustStats.map((stat) => (
            <RevealItem
              key={stat.label}
              className="rounded-card border border-white/12 bg-white/6 p-7 backdrop-blur"
            >
              <p className="font-display text-3xl text-white">{stat.value}</p>
              <p className="mt-3 text-sm text-clinical-100">{stat.label}</p>
              <p className="mt-3 border-t border-white/12 pt-3 text-xs text-clinical-200/80">
                {stat.detail}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Renders only once real, consented patient stories exist. */}
        {patientStories.length > 0 ? (
          <RevealGroup className="mt-8 grid gap-6 lg:grid-cols-3">
            {patientStories.map((story) => (
              <RevealItem
                key={story.quote.slice(0, 40)}
                className="rounded-card border border-white/12 bg-white/6 p-7 backdrop-blur"
              >
                <blockquote className="font-display text-lg leading-snug text-white">
                  {story.quote}
                </blockquote>
                <p className="mt-5 text-sm text-clinical-200">
                  {story.attribution} · {story.treatment}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        ) : null}
      </div>
    </section>
  );
}
