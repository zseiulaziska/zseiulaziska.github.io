// Walidacja wygenerowanego HTML katalogu materiałów do pobrania.
// Czysty moduł: przyjmuje HTML oraz dane z buildu i zwraca listę problemów.
// Uruchamiany po buildzie przez scripts/postbuild.cjs.

// Szukamy tagów otwierających, a nie par <article>…</article>: strona ma
// zewnętrzny <article> obejmujący całą zawartość, który pochłonąłby pierwszą
// kartę przy dopasowaniu od pierwszego do najbliższego tagu zamykającego.
const OPEN_ARTICLE_PATTERN = /<article\b([^>]*)>/g;
const CLOSING_ARTICLE = '</article>';
const SECTION_PATTERN = /<section\b([^>]*)>([\s\S]*?)<\/section>/g;
const CARD_ATTRIBUTES = [
	'data-pagefind-title',
	'data-pagefind-filter',
	'data-kategoria',
	'data-format',
];

function attributes(tag) {
	const attrs = {};
	for (const [, name, value] of tag.matchAll(/([A-Za-z_:][\w:.-]*)\s*=\s*"([^"]*)"/g)) {
		attrs[name] = value;
	}
	return attrs;
}

function publicPath(path) {
	return path.replace(/^\.?\//, '');
}

function hasFilter(filters, name) {
	return filters.some((filter) => filter.startsWith(`${name}:`) && filter.length > name.length + 1);
}

function cardIdentity(card) {
	return card.id || card.title || 'bez identyfikatora';
}

function cardsFrom(html) {
	const cards = [];
	for (const match of html.matchAll(OPEN_ARTICLE_PATTERN)) {
		const attrs = attributes(match[1]);
		if (!CARD_ATTRIBUTES.some((name) => name in attrs)) continue;

		const start = match.index + match[0].length;
		const end = html.indexOf(CLOSING_ARTICLE, start);
		const cardHtml = end === -1 ? html.slice(match.index) : html.slice(match.index, end + CLOSING_ARTICLE.length);
		const body = end === -1 ? '' : html.slice(start, end);

		cards.push({
			id: attrs.id ?? '',
			title: attrs['data-pagefind-title'] ?? '',
			filters: [...cardHtml.matchAll(/data-pagefind-filter\s*=\s*"([^"]*)"/g)].map((filter) => filter[1]),
			hrefs: [...body.matchAll(/href\s*=\s*"([^"]*)"/g)].map((link) => link[1]),
		});
	}
	return cards;
}

function sectionsFrom(html) {
	const sections = [];
	for (const match of html.matchAll(SECTION_PATTERN)) {
		const category = attributes(match[1])['data-kategoria'];
		if (!category) continue;
		const count = match[2].match(/<[^>]*\bdata-katalog-licznik(?=[\s/>=])[^>]*>([^<]*)</)?.[1];
		sections.push({ category, count: count?.trim(), cardCount: cardsFrom(match[2]).length });
	}
	return sections;
}

/** Zwraca listę problemów; pusta lista oznacza poprawny katalog. */
export function validateDownloadsOutput(html, options = {}) {
	const problems = [];
	const cards = cardsFrom(html);
	const entries = options.entries ?? [];
	const builtFiles = new Set((options.builtFiles ?? []).map(publicPath));

	for (const card of cards) {
		const name = cardIdentity(card);
		if (!card.id.trim()) problems.push('karta bez identyfikatora');
		if (!card.title.trim()) problems.push(`karta "${name}" bez data-pagefind-title`);
		if (!hasFilter(card.filters, 'format')) problems.push(`karta "${name}" bez filtru formatu`);
		if (!hasFilter(card.filters, 'kategoria')) problems.push(`karta "${name}" bez filtru kategorii`);
		for (const href of card.hrefs) {
			const path = href.split(/[?#]/, 1)[0] ?? '';
			if (!path.startsWith('/downloads/')) continue;
			if (!builtFiles.has(publicPath(path))) problems.push(`brak pliku w buildzie: ${path}`);
		}
	}

	for (const entry of entries) {
		if (entry.published === true) continue;
		const match = cards.find(
			(card) =>
				(entry.id && card.id === entry.id) || (entry.title && card.title === entry.title),
		);
		if (match) problems.push(`karta "${cardIdentity(match)}" pochodzi z nieopublikowanego wpisu`);
	}

	for (const section of sectionsFrom(html)) {
		if (section.cardCount === 0) problems.push(`pusta kategoria "${section.category}"`);
		if (section.count && Number(section.count) !== section.cardCount) {
			problems.push(
				`licznik kategorii "${section.category}" wynosi ${section.count}, a kart jest ${section.cardCount}`,
			);
		}
	}

	return problems;
}
