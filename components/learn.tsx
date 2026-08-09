"use client";

import Link from "next/link";

import { ArrowRight, ButtonLink, Reveal, RevealGroup, RevealItem, SectionHeading, SectionSeam } from "@/components/ui";
import { getTopicStyle } from "@/lib/blog";
import { articles } from "@/lib/site";

/**
 * The Learn hub teaser, on the homepage.
 *
 * Full posts live at /blog/<slug> — this is a preview grid linking into
 * them, not the content itself.
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
          {articles.map((article) => {
            const style = getTopicStyle(article.topic);
            return (
              <RevealItem key={article.slug} className="h-full">
                <Link
                  href={`/blog/${article.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-white/80 transition duration-300 ease-out-soft hover:-translate-y-1 hover:border-clinical-200 hover:shadow-float"
                >
                  <div className={`h-2 w-full bg-gradient-to-r ${style.wash}`} />
                  <div className="flex flex-1 flex-col p-8 sm:p-9">
                    <span
                      className={`text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${style.accent}`}
                    >
                      {article.topic}
                    </span>
                    <h3 className="mt-4 font-display text-xl text-ink">
                      {article.title}
                    </h3>
                    <p className="mt-4 text-slate">{article.excerpt}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-clinical-700">
                      Read the article
                      <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal>
          <div className="mt-10">
            <ButtonLink href="/blog" tone="outline" size="lg">
              Read the full blog
              <ArrowRight />
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
