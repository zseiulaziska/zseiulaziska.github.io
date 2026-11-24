import { describe, expect, it } from 'vitest';
import { validateDownloadsOutput } from './validate-downloads-output.mjs';

/** Fragment karty odwzorowujący wyjście DownloadCard.astro. */
function card({
	id = 'material-przykladowy',
	title = 'Przykładowy materiał do pobrania',
	category = 'dokumenty-i-publikacje',
	format = 'PDF',
	href = '/downloads/przykladowy-material.pdf',
} = {}) {
	return `<article id="${id}" data-pagefind-title="${title}" data-pagefind-filter="format:${format}" data-kategoria="${category}" data-format="${format}">
    <span class="sr-only" data-pagefind-filter="kategoria:${category}">Dokumenty i publikacje</span>
    <a href="${href}">Pobierz</a>
  </article>`;
}

describe('walidacja wyjścia buildu katalogu materiałów', () => {
	it('akceptuje kartę z wymaganymi atrybutami Pagefind', () => {
		expect(
			validateDownloadsOutput(`<section data-kategoria="dokumenty-i-publikacje">${card()}</section>`, {
				builtFiles: ['/downloads/przykladowy-material.pdf'],
			}),
		).toEqual([]);
	});

	it('wykrywa kartę bez wymaganego atrybutu Pagefind', () => {
		const problems = validateDownloadsOutput(
			`<article id="bez-tytulu" data-pagefind-filter="format:PDF"><a href="/downloads/material.pdf">Pobierz</a></article>`,
		);
		expect(problems.join('\n')).toContain('data-pagefind-title');
	});

	it('wykrywa kartę bez filtru formatu lub kategorii', () => {
		const html = `<article id="bez-filtrow" data-pagefind-title="Materiał"><a href="/downloads/material.pdf">Pobierz</a></article>`;
		const problems = validateDownloadsOutput(html).join('\n');
		expect(problems).toContain('filtru formatu');
		expect(problems).toContain('filtru kategorii');
	});

	it('wykrywa kartę odpowiadającą wpisowi nieopublikowanemu', () => {
		const problems = validateDownloadsOutput(
			`<section data-kategoria="dokumenty-i-publikacje">${card({ id: 'ukryty', title: 'Ukryty materiał' })}</section>`,
			{ entries: [{ id: 'ukryty', title: 'Ukryty materiał', published: false }] },
		);
		expect(problems.join('\n')).toContain('nieopublikowanego wpisu');
	});

	it('akceptuje kartę wpisu opublikowanego', () => {
		expect(
			validateDownloadsOutput(`<section data-kategoria="dokumenty-i-publikacje">${card()}</section>`, {
				builtFiles: ['/downloads/przykladowy-material.pdf'],
				entries: [{ id: 'material-przykladowy', title: 'Przykładowy materiał do pobrania', published: true }],
			}),
		).toEqual([]);
	});

	it('wykrywa pustą kategorię w wyjściu buildu', () => {
		const problems = validateDownloadsOutput(
			`<section data-kategoria="multimedia"><h2>Multimedia</h2></section>`,
		);
		expect(problems.join('\n')).toContain('pusta kategoria');
	});

	it('wykrywa rozbieżność między licznikiem kategorii a liczbą kart', () => {
		const html = `<section data-kategoria="multimedia"><h2><span data-katalog-licznik>3</span><span data-katalog-licznik-slowo> materiały</span></h2>${card({ id: 'a', category: 'multimedia' })}</section>`;
		const problems = validateDownloadsOutput(html, {
			builtFiles: ['/downloads/przykladowy-material.pdf'],
		});
		expect(problems.join('\n')).toContain('licznik kategorii');
	});

	it('wykrywa odnośnik do pliku, którego nie ma w wyjściu buildu', () => {
		const problems = validateDownloadsOutput(
			`<section data-kategoria="dokumenty-i-publikacje">${card({ href: '/downloads/brakuje.pdf' })}</section>`,
			{ builtFiles: ['/downloads/inne.pdf'] },
		);
		expect(problems.join('\n')).toContain('brak pliku w buildzie');
	});

	it('akceptuje odnośnik do pliku w buildzie i adres zewnętrzny', () => {
		const local = validateDownloadsOutput(
			`<section data-kategoria="dokumenty-i-publikacje">${card()}</section>`,
			{ builtFiles: ['/downloads/przykladowy-material.pdf'] },
		);
		const external = validateDownloadsOutput(
			`<section data-kategoria="dokumenty-i-publikacje">${card({ href: 'https://example.pl/material.pdf' })}</section>`,
			{ builtFiles: [] },
		);
		expect(local).toEqual([]);
		expect(external).toEqual([]);
	});

	it('sprawdza pierwszą kartę także wtedy, gdy stronę obejmuje zewnętrzny artykuł', () => {
		// Strona katalogu ma <article class="..."> otaczający całą zawartość.
		const html = `<article class="w-full max-w-5xl mx-auto">
    <h1>Materiały do pobrania</h1>
    <div id="katalog-karty">
      <section data-kategoria="dokumenty-i-publikacje">
        <h2><span data-katalog-licznik>1</span></h2>
        <ul><li>${card({ href: '/downloads/BRAK.pdf' })}</li></ul>
      </section>
    </div>
  </article>`;
		const problems = validateDownloadsOutput(html, {
			builtFiles: ['/downloads/przykladowy-material.pdf'],
		});
		expect(problems.join('\n')).toContain('brak pliku w buildzie: /downloads/BRAK.pdf');
	});
});
