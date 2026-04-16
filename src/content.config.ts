import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({
    pattern: ["**/*.{md,mdx}", "!_drafts/**"],
    base: "src/content/posts",
  }),
  schema: ({ image }) => z.object({
    title: z.string(),
    tags: z.array(z.string()),
    date: z.coerce.date(),
    description: z.string(),
    cover: image().optional(),
    coverAlt: z.string().optional(),
  }),
});

const gg = defineCollection({
  loader: glob({
    pattern: ["**/*.{md,mdx}", "!_drafts/**"],
    base: "src/content/gg",
  }),
  schema:  z.object({
    title: z.string(),
    description: z.string(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
  }),
});

const grimoire = defineCollection({
  loader: glob({
    pattern: ["**/*.{md,mdx}", "!_drafts/**"],
    base: "src/content/grimoire",
  }),
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
  }),
});

export const collections = { posts, gg, grimoire };
