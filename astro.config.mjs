// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import node from '@astrojs/node';
import { defineConfig, fontProviders } from 'astro/config';

const keystaticEnabled = !process.env.SKIP_KEYSTATIC;

// https://astro.build/config
export default defineConfig({
	site: 'https://zseiulaziska.github.io',
	adapter: keystaticEnabled ? node({ mode: 'standalone' }) : undefined,
	integrations: [
		mdx(),
		sitemap(),
		react(),
		markdoc(),
		...(keystaticEnabled ? [keystatic()] : []),
	],
	vite: {
		plugins: [tailwindcss()],
	},
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Inter',
			cssVariable: '--font-body',
			fallbacks: ['system-ui', 'sans-serif'],
			weights: [300, 400, 600, 700],
			subsets: ['latin', 'latin-ext'],
			display: 'swap',
		},
		{
			provider: fontProviders.google(),
			name: 'Montserrat',
			cssVariable: '--font-display',
			fallbacks: ['system-ui', 'sans-serif'],
			weights: [600, 700],
			subsets: ['latin', 'latin-ext'],
			display: 'swap',
		},
	],
});
