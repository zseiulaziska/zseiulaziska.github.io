import { config, fields, collection } from '@keystatic/core';
import {
	DOWNLOAD_CATEGORIES,
	DOWNLOAD_FILE_SIZE_PATTERN,
} from './src/utils/downloads-catalog';

export default config({
	storage: {
		kind: 'local',
	},
	collections: {
		blog: collection({
			label: 'Blog',
			slugField: 'title',
			path: 'src/content/blog/*',
			format: { contentField: 'content' },
			schema: {
				title: fields.slug({ name: { label: 'Title' } }),
				description: fields.text({ label: 'Description', multiline: true }),
				pubDate: fields.date({ label: 'Publication Date' }),
				heroImage: fields.image({
					label: 'Hero Image',
					directory: 'public/images/blog',
					publicPath: '/images/blog',
				}),
				imageAlt: fields.text({ label: 'Image Alt Text' }),
				category: fields.select({
					label: 'Category',
					options: [
						{ label: 'None', value: '' },
						{ label: 'Rekrutacja', value: 'Rekrutacja' },
						{ label: 'Sukcesy', value: 'Sukcesy' },
						{ label: 'Wydarzenia', value: 'Wydarzenia' },
						{ label: 'Projekty', value: 'Projekty' },
						{ label: 'Sport', value: 'Sport' },
					],
					defaultValue: '',
				}),
				featured: fields.checkbox({ label: 'Featured / Important post' }),
				featuredLabel: fields.select({
					label: 'Featured badge label',
					options: [
						{ label: 'None', value: '' },
						{ label: 'WAŻNE', value: 'WAŻNE' },
						{ label: 'REKRUTACJA', value: 'REKRUTACJA' },
						{ label: 'PILNE', value: 'PILNE' },
						{ label: 'SUKCES', value: 'SUKCES' },
					],
					defaultValue: '',
				}),
				tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: (props) => props.value || 'Tag' }),
				draft: fields.checkbox({ label: 'Draft' }),
				content: fields.mdx({
					label: 'Content',
					options: {
						image: {
							directory: 'public/images/blog',
							publicPath: '/images/blog',
						},
					},
				}),
			},
		}),
		downloads: collection({
			label: 'Materiały do pobrania',
			slugField: 'title',
			path: 'src/content/downloads/*',
			format: { contentField: 'content' },
			schema: {
				title: fields.slug({ name: { label: 'Tytuł' } }),
				description: fields.text({ label: 'Opis', multiline: true }),
				category: fields.select({
					label: 'Kategoria',
					options: DOWNLOAD_CATEGORIES.map((category) => ({
						label: category.label,
						value: category.id,
					})),
					defaultValue: DOWNLOAD_CATEGORIES[0].id,
				}),
				file: fields.file({
					label: 'Plik do pobrania',
					directory: 'public/downloads',
					publicPath: '/downloads',
					description: 'Wgraj plik z katalogu publicznego; format wyliczamy z rozszerzenia.',
				}),
				externalUrl: fields.url({
					label: 'Zewnętrzny adres URL (zamiast pliku)',
					description: 'Pozostaw puste, jeśli materiał jest plikiem wgranym powyżej.',
				}),
				fileSize: fields.text({
					label: 'Rozmiar pliku',
					description: 'Wpisz ręcznie, np. „2.4 MB”, „1,39 MB” lub „542 kB”.',
					validation: {
						isRequired: true,
						pattern: {
							regex: DOWNLOAD_FILE_SIZE_PATTERN,
							message: 'Podaj liczbę, spację i jednostkę: B, kB, MB lub GB.',
						},
					},
				}),
				pubDate: fields.date({ label: 'Data publikacji' }),
				published: fields.checkbox({ label: 'Opublikowane', defaultValue: false }),
				featured: fields.checkbox({ label: 'Wyróżnione', defaultValue: false }),
				tags: fields.array(fields.text({ label: 'Tag' }), {
					label: 'Tagi',
					itemLabel: (props) => props.value || 'Tag',
				}),
				updatedDate: fields.date({ label: 'Data aktualizacji (opcjonalnie)' }),
				sortOrder: fields.number({ label: 'Kolejność (opcjonalnie)', step: 1 }),
				downloadName: fields.text({
					label: 'Sugerowana nazwa pobieranego pliku (opcjonalnie)',
				}),
				content: fields.mdx({ label: 'Treść (opcjonalnie)' }),
			},
		}),
	},
});
