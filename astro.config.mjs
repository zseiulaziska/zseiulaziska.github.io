// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import node from '@astrojs/node';
import { defineConfig, fontProviders } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import sitemapRoot from './src/integrations/sitemap-root.mjs';

const keystaticEnabled = !process.env.SKIP_KEYSTATIC;
const staticBuild = !!process.env.GITHUB_ACTIONS;
// Keystatic w trybie lokalnym potrzebuje dostępu do systemu plików, którego nie zapewnia
// środowisko workerd używane przez adapter Cloudflare podczas `astro dev`.
const isDev = process.env.NODE_ENV === 'development';
// Podgląd builda z Keystatic w trybie lokalnym musi działać na Node (workerd nie ma dostępu do plików).
const useNodeRuntime = isDev || process.env.PREVIEW_NODE === '1';
const previewNode = process.env.PREVIEW_NODE === '1';

// https://astro.build/config
export default defineConfig({
    site: 'https://zseiulaziska.github.io',
    redirects: {
        '/kierunki-ksztalcenia': '/kierunki',
    },
    adapter: staticBuild ? undefined : useNodeRuntime ? node({ mode: 'standalone' }) : cloudflare(),
    // Osobny katalog dla podglądu Node, aby nie kolidować z buildem/preview Cloudflare.
    ...(previewNode && { outDir: './dist-node' }),
    integrations: [
        mdx(),
        sitemap(),
        sitemapRoot(),
        react(),
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