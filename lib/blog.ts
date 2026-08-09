import { articles } from "@/lib/site";

export type Article = (typeof articles)[number];

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

/**
 * No photography exists for any post (see the note on `articles` in
 * lib/site.ts) — each one gets a plain colour-band header keyed to its
 * topic instead of a fabricated stock image. Three topics, three bands.
 */
export const topicStyle: Record<string, { wash: string; accent: string }> = {
  "The science": {
    wash: "from-clinical-100 via-clinical-50 to-bone",
    accent: "text-clinical-700",
  },
  "Living with it": {
    wash: "from-ember-100 via-bone to-bone",
    accent: "text-ember-700",
  },
  Health: {
    wash: "from-mist via-shell to-bone",
    accent: "text-clinical-700",
  },
};

export function getTopicStyle(topic: string) {
  return topicStyle[topic] ?? topicStyle.Health;
}
