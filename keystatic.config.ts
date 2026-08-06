import { config, fields, collection } from '@keystatic/core';

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
					],
					defaultValue: '',
				}),
				tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: (props) => props.value || 'Tag' }),
				draft: fields.checkbox({ label: 'Draft' }),
				content: fields.mdx({
					label: 'Content',
					image: {
						directory: 'public/images/blog',
						publicPath: '/images/blog',
					},
				}),
			},
		}),
	},
});
