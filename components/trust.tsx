"use client";

import { Reveal, RevealGroup, RevealItem, SectionHeading, SectionSeam } from "@/components/ui";
import { patientStories, trustStats } from "@/lib/site";

/**
 * Results.
 *
 * This used to be the site's one dark section, a deliberate mood change
 * between the treatment detail and the commercial sections. In practice it
 * read as a hard, ugly cut in the page rather than a considered pause, so
 * it's back on the light base like everything around it. This section just
 * states the results plainly.
 */
export function Trust() {
  return (
    <section id="results" className="relative isolate overflow-hidden bg-bone py-24 sm:py-32">
      <SectionSeam from="shell" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 h-[34rem] w-[34rem] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(169,225,233,0.55) 0%, transparent 68%)",
        }}
      />

      <div className="u-container relative">
        <SectionHeading
          label="Results"
          title="Permanent means permanent."
          lede="These are not treatments you return for every few months. The glands do not regenerate, and the nerve signal does not come back."
        />

        <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {trustStats.map((stat) => (
            <RevealItem key={stat.label} className="bg-white px-7 py-7">
              <p className="font-display text-3xl text-clinical-700">
                {stat.value}
              </p>
              <p className="mt-3 text-sm text-slate">{stat.label}</p>
              <p className="mt-3 border-t border-line pt-3 text-xs text-muted">
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
                className="rounded-card border border-line bg-white p-7"
              >
                <blockquote className="font-display text-lg leading-snug text-ink">
                  {story.quote}
                </blockquote>
                <p className="mt-5 text-sm text-muted">
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
