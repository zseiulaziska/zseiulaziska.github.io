import { defineCollection, z } from 'astro:content';

const blogSchema = z.object({
  title: z.string(),
  description: z.string().max(160),
  pubDate: z.coerce.date(),
  heroImage: z.string().optional(),
  imageAlt: z.string().optional(),
  category: z.string().optional(),
  featured: z.boolean().optional(),
  featuredLabel: z.string().optional(),
  tags: z.array(z.string()).optional(),
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

const podrecznikiSchema = z.object({
  typ_szkoly: z.string(),
  klasa: z.string(),
});

export const collections = {
  blog: defineCollection({
    schema: blogSchema,
  }),
  teacher: defineCollection({
    schema: teacherSchema,
  }),
  podreczniki: defineCollection({
    schema: podrecznikiSchema,
  }),
};
