import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/footer";
import { SiteNav } from "@/components/site-nav";
import { ArrowRight, ButtonLink, Reveal, RevealGroup, RevealItem } from "@/components/ui";
import { getArticle, getTopicStyle } from "@/lib/blog";
import { articles, clinic } from "@/lib/site";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const style = getTopicStyle(article.topic);
  const related = articles.filter((item) => item.slug !== article.slug).slice(0, 2);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    headline: article.title,
    description: article.excerpt,
    url: `${clinic.url}/blog/${article.slug}`,
    publisher: {
      "@type": "MedicalClinic",
      name: clinic.name,
      url: clinic.url,
    },
    about: "Hyperhidrosis",
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Static, per-slug constant derived from build-time content — no
        // user input reaches this.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteNav />
      <main id="main" className="bg-bone">
        <div className={`bg-gradient-to-b ${style.wash} pb-16 pt-36 sm:pt-44`}>
          <div className="u-container">
            <Reveal>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate transition-colors duration-300 hover:text-clinical-700"
              >
                <svg aria-hidden viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                  <path
                    d="M9.5 3 4 8l5.5 5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Learn
              </Link>
            </Reveal>
            <Reveal>
              <span
                className={`mt-8 inline-block text-[0.7rem] font-semibold uppercase tracking-[0.18em] ${style.accent}`}
              >
                {article.topic}
              </span>
            </Reveal>
            <Reveal>
              <h1 className="mt-4 max-w-3xl text-display-md sm:text-display-lg">
                {article.title}
              </h1>
            </Reveal>
          </div>
        </div>

        <div className="u-container py-16 sm:py-20">
          <div className="grid gap-14 lg:grid-cols-[1fr_0.32fr]">
            <article>
              <RevealGroup className="u-measure space-y-6" childDelay={0.06}>
                {article.body.map((paragraph) => (
                  <RevealItem key={paragraph.slice(0, 40)}>
                    <p className="text-lg text-slate">{paragraph}</p>
                  </RevealItem>
                ))}
              </RevealGroup>

              <Reveal>
                <div className="u-measure mt-10 rounded-card border border-line bg-shell p-6 text-sm text-muted">
                  Adapted from the clinic&apos;s own published article, reworked
                  here for this site.{" "}
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-clinical-700 underline-offset-4 hover:underline"
                  >
                    Read the original on perthsweatclinic.com.au
                  </a>
                  .
                </div>
              </Reveal>

              <Reveal>
                <div className="mt-10">
                  <ButtonLink href="/#contact" size="lg">
                    Book a consultation
                    <ArrowRight />
                  </ButtonLink>
                </div>
              </Reveal>
            </article>

            <aside>
              <Reveal soft>
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Also on the blog
                </h2>
                <ul className="mt-5 space-y-5">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/blog/${item.slug}`}
                        className="group block"
                      >
                        <p className="font-display text-base text-ink transition-colors duration-300 group-hover:text-clinical-700">
                          {item.title}
                        </p>
                        <p className="mt-1.5 text-sm text-muted">
                          {item.topic}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/blog"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-clinical-700"
                >
                  All articles
                  <ArrowRight />
                </Link>
              </Reveal>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
