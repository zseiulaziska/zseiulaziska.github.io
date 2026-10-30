import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { basename, join } from 'node:path';

/** Wyciąga zawartość <urlset> (same wpisy <url>) z pliku mapy witryny. */
function urlsetBody(xml) {
	const start = xml.indexOf('<urlset');
	if (start === -1) return '';
	const openEnd = xml.indexOf('>', start) + 1;
	const end = xml.lastIndexOf('</urlset>');
	return end > openEnd ? xml.slice(openEnd, end) : '';
}

/**
 * Dodaje do builda standardowy plik `/sitemap.xml`.
 *
 * `@astrojs/sitemap` generuje zawsze `sitemap-index.xml` + `sitemap-N.xml`,
 * a Google Search Console najwygodniej obsługuje pojedynczy adres `/sitemap.xml`.
 * Integracja scala wszystkie części w jeden plik (a przy jednej części po prostu
 * ją kopiuje), więc wystarczy zgłosić w GSC `https://<domena>/sitemap.xml`.
 */
export default function sitemapRoot() {
	return {
		name: 'sitemap-root',
		hooks: {
			'astro:build:done': async ({ dir, logger }) => {
				const outputDir = fileURLToPath(dir);

				let index;
				try {
					index = await readFile(join(outputDir, 'sitemap-index.xml'), 'utf8');
				} catch {
					logger.warn('Brak sitemap-index.xml — pomijam generowanie sitemap.xml.');
					return;
				}

				const shards = [...index.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(([, loc]) =>
					basename(new URL(loc).pathname)
				);

				if (shards.length === 0) {
					logger.warn('sitemap-index.xml nie zawiera żadnych map — pomijam generowanie sitemap.xml.');
					return;
				}

				const contents = await Promise.all(
					shards.map((shard) => readFile(join(outputDir, shard), 'utf8'))
				);

				let sitemap = contents[0];
				if (contents.length > 1) {
					const first = contents[0];
					const header = first.slice(0, first.indexOf('>', first.indexOf('<urlset')) + 1);
					sitemap = `${header}${contents.map(urlsetBody).join('')}</urlset>`;
				}

				await writeFile(join(outputDir, 'sitemap.xml'), sitemap, 'utf8');
				logger.info('`sitemap.xml` utworzony (adres do zgłoszenia w Google Search Console).');
			},
		},
	};
}
