import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/footer";
import { SiteNav } from "@/components/site-nav";
import { ArrowRight, ButtonLink, Reveal, RevealGroup, RevealItem, SectionHeading } from "@/components/ui";
import { getTopicStyle } from "@/lib/blog";
import { articles, clinic } from "@/lib/site";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Plain-language reading on hyperhidrosis: the biology, the day-to-day, and the part most people never talk about.",
};

export default function BlogIndexPage() {
  return (
    <>
      <SiteNav />
      <main id="main" className="bg-bone pb-24 pt-36 sm:pt-40">
        <div className="u-container">
          <SectionHeading
            label="Learn"
            title="Understanding what you are living with."
            lede="Plain-language reading on hyperhidrosis: the biology, the day-to-day, and the part most people never talk about."
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
                      <h2 className="mt-4 font-display text-xl text-ink">
                        {article.title}
                      </h2>
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
              <ButtonLink href="#contact" size="lg">
                Book a consultation
                <ArrowRight />
              </ButtonLink>
              <p className="mt-4 text-sm text-muted">
                Have a question these don&apos;t cover? Call{" "}
                <a
                  href={clinic.phoneHref}
                  className="font-semibold text-clinical-700 underline-offset-4 hover:underline"
                >
                  {clinic.phone}
                </a>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
