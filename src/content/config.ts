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

const teacherSchema = z.object({
  management: z.array(z.object({
    name: z.string(),
    role: z.string(),
    subjects: z.array(z.string()),
  })),
  teachers: z.array(z.object({
    name: z.string(),
    subjects: z.array(z.string()),
  })),
});

export const collections = {
  blog: defineCollection({
    schema: blogSchema,
  }),
  teacher: defineCollection({
    schema: teacherSchema,
  }),
};
