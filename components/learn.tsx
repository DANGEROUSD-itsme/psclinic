"use client";

import { ArrowRight, ButtonLink, Reveal, RevealGroup, RevealItem, SectionHeading } from "@/components/ui";
import { articles, clinic } from "@/lib/site";

/**
 * The Learn hub.
 *
 * The practice already has genuinely useful articles; they were simply
 * disconnected from the service pages. Surfacing them here links the
 * authority content back into the treatment journey.
 *
 * Cards are summaries rather than links for now: the posts still live on the
 * existing WordPress blog. Once they are migrated to `/learn/<slug>` routes,
 * give each entry in `articles` an `href` and wrap the card in a <Link>.
 */
export function Learn() {
  return (
    <section id="learn" className="bg-bone py-24 sm:py-32">
      <div className="u-container">
        <SectionHeading
          label="Learn"
          title="Understanding what you are living with."
          lede="Plain-language reading on hyperhidrosis — the biology, the day-to-day, and the part most people never talk about."
        />

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2" childDelay={0.07}>
          {articles.map((article) => (
            <RevealItem key={article.title} className="h-full">
              <article className="flex h-full flex-col rounded-card border border-line bg-white/80 p-8 sm:p-9">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-clinical-600">
                  {article.topic}
                </span>
                <h3 className="mt-4 font-display text-xl text-ink">
                  {article.title}
                </h3>
                <p className="mt-4 text-slate">{article.excerpt}</p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal>
          <div className="mt-10">
            <ButtonLink href={`${clinic.url}/blog`} tone="outline" size="lg">
              Read the full blog
              <ArrowRight />
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
