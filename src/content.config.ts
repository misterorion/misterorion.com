import { z, defineCollection } from "astro:content";

const postCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    date: z.coerce.date(),
    description: z.string(),
    heroImage: z.string().optional(),
    heroImageSource: z.string().optional(),
    heroImageSourceUrl: z.string().optional(),
    heroImageAlt: z.string().optional(),
  }),
});

const grimoireCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
  }),
});

export const collections = {
  posts: postCollection,
  grimoire: grimoireCollection,
};
