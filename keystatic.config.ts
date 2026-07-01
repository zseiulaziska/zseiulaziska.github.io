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
