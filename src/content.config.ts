import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import {
	DOWNLOAD_FILE_SIZE_PATTERN,
	formatFromPath,
	isDownloadCategoryId,
	isHttpUrl,
	isValidDownloadFilePath,
} from './utils/downloads-catalog';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date().optional(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.string().optional(),
			imageAlt: z.string().optional(),
			draft: z.boolean().optional(),
			author: z.string().optional(),
		}),
});

const podreczniki = defineCollection({
	loader: glob({ base: './src/content/podreczniki', pattern: ['*.md', '!Podręczniki*'] }),
	schema: z.object({
		typ_szkoly: z.string(),
		klasa: z.string(),
		skroconyTyp: z.string().optional(),
	}),
});

const downloads = defineCollection({
	loader: glob({ base: './src/content/downloads', pattern: '**/*.{md,mdx}' }),
	schema: () =>
		z
			.object({
				title: z.string().min(1),
				description: z.string().min(1),
				category: z.string().refine(isDownloadCategoryId, 'Nieznana kategoria materiału'),
				// `format` jest wyliczany z rozszerzenia, więc nie jest polem frontmatter.
				file: z.string().nullish(),
				externalUrl: z.string().nullish(),
				fileSize: z
					.string()
					.regex(DOWNLOAD_FILE_SIZE_PATTERN, 'Podaj rozmiar np. „2.4 MB” lub „1,39 MB”'),
				pubDate: z.coerce.date(),
				published: z.boolean(),
				updatedDate: z.coerce.date().nullish(),
				featured: z.boolean().nullish(),
				tags: z.array(z.string()).nullish(),
				sortOrder: z.number().nullish(),
				downloadName: z.string().nullish(),
			})
			.superRefine((data, ctx) => {
				const file = data.file?.trim() ?? '';
				const externalUrl = data.externalUrl?.trim() ?? '';

				if (file && externalUrl) {
					ctx.addIssue({ code: 'custom', message: 'Wpis wskazuje plik i adres zewnętrzny' });
				}
				if (!file && !externalUrl) {
					ctx.addIssue({ code: 'custom', message: 'Wpis musi wskazywać plik lub adres zewnętrzny' });
				}
				if (file && !isValidDownloadFilePath(file)) {
					ctx.addIssue({ code: 'custom', message: 'Ścieżka pliku musi prowadzić do /downloads/' });
				}
				if (file && isValidDownloadFilePath(file) && !formatFromPath(file)) {
					ctx.addIssue({ code: 'custom', message: 'Nieobsługiwany format pliku' });
				}
				if (externalUrl && !isHttpUrl(externalUrl)) {
					ctx.addIssue({ code: 'custom', message: 'Adres zewnętrzny musi używać http lub https' });
				}
				if (externalUrl && isHttpUrl(externalUrl) && !formatFromPath(externalUrl)) {
					ctx.addIssue({ code: 'custom', message: 'Nieobsługiwany format pliku zewnętrznego' });
				}
			}),
});

export const collections = { blog, podreczniki, downloads };
