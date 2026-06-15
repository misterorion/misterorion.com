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
    date: z.coerce.date(),
    description: z.string(),
    featured: z.boolean().optional(),
    cover: image().optional(),
    coverAlt: z.string().optional(),
  }),
});

export const collections = { posts };
