"use client";

import { ArrowRight, ButtonLink, Reveal, RevealGroup, RevealItem, SectionHeading, SectionSeam } from "@/components/ui";
import { articles, clinic } from "@/lib/site";

function ExternalIcon() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
      <path
        d="M6.5 3.5H3.5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3M9.5 2.5h4v4M13.2 2.8 7 9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The Learn hub.
 *
 * Each card links to the real, existing post on perthsweatclinic.com.au —
 * the excerpt summarises it, the full article stays where it was published
 * rather than being reproduced here.
 */
export function Learn() {
  return (
    <section id="learn" className="relative isolate bg-bone py-24 sm:py-32">
      <SectionSeam from="shell" />
      <div className="u-container">
        <SectionHeading
          label="Learn"
          title="Understanding what you are living with."
          lede="Plain-language reading on hyperhidrosis — the biology, the day-to-day, and the part most people never talk about."
        />

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2" childDelay={0.07}>
          {articles.map((article) => (
            <RevealItem key={article.title} className="h-full">
              <a
                href={article.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-card border border-line bg-white/80 p-8 transition duration-300 ease-out-soft hover:-translate-y-1 hover:border-clinical-200 hover:shadow-float sm:p-9"
              >
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-clinical-600">
                  {article.topic}
                </span>
                <h3 className="mt-4 font-display text-xl text-ink">
                  {article.title}
                </h3>
                <p className="mt-4 text-slate">{article.excerpt}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-clinical-700">
                  Read on perthsweatclinic.com.au
                  <ExternalIcon />
                </span>
              </a>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal>
          <div className="mt-10">
            <ButtonLink
              href={`${clinic.url}/blog/`}
              target="_blank"
              rel="noopener noreferrer"
              tone="outline"
              size="lg"
            >
              Read the full blog
              <ArrowRight />
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
