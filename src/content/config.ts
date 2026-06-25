import { defineCollection, z } from 'astro:content';

const blogSchema = z.object({
  title: z.string(),
  description: z.string().max(160),
  pubDate: z.coerce.date(),
  author: z.string(),
  image: z.string(),
  imageAlt: z.string(),
  tags: z.array(z.string()),
  draft: z.boolean().optional(),
});

export const collections = {
  blog: defineCollection({
    schema: blogSchema,
  }),
};
