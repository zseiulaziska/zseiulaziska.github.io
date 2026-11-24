/**
 * Czyste funkcje łączące wyniki Pagefind i filtry z widocznymi kartami katalogu.
 * Moduł nie importuje Astro, Pagefind ani DOM — korzystają z niego strona i testy.
 */

/** Pagefind 1.5 tworzy kotwicę sub-resultu na nagłówku tytułu karty. */
export const CARD_TITLE_ANCHOR_SUFFIX = '-tytul';

/** Z kotwicy nagłówka tytułu odtwarza stabilny identyfikator karty. */
export function cardIdFromTitleAnchor(anchor: string): string {
	return anchor.endsWith(CARD_TITLE_ANCHOR_SUFFIX)
		? anchor.slice(0, -CARD_TITLE_ANCHOR_SUFFIX.length)
		: anchor;
}

export type PagefindSubResult = {
	url?: unknown;
};

export type PagefindResultData = {
	sub_results?: readonly PagefindSubResult[] | null;
};

function normalizePath(path: string): string {
	return path.replace(/\/+$/, '') || '/';
}

/** Identyfikatory kart wskazane przez kotwice sub-results z Trasy katalogu. */
export function cardIdsFromPagefindResults(
	results: readonly PagefindResultData[],
	pagePath: string,
	anchorToCardId: (anchor: string) => string = (anchor) => anchor,
): string[] {
	const expectedPath = normalizePath(pagePath);
	const ids: string[] = [];

	for (const result of results ?? []) {
		for (const subResult of result?.sub_results ?? []) {
			const url = subResult?.url;
			if (typeof url !== 'string' || !url.includes('#')) continue;

			let parsed: URL;
			try {
				parsed = new URL(url, 'https://pagefind.local');
			} catch {
				continue;
			}
			if (normalizePath(parsed.pathname) !== expectedPath) continue;

			const hash = parsed.hash.slice(1);
			if (!hash) continue;

			let id: string;
			try {
				id = decodeURIComponent(hash);
			} catch {
				id = hash;
			}
			const cardId = anchorToCardId(id);
			if (cardId && !ids.includes(cardId)) ids.push(cardId);
		}
	}

	return ids;
}

/** Karta widoczna w katalogu — dane czytane z atrybutów DOM przez stronę. */
export type DownloadFilterCard = {
	id: string;
	category: string;
	format: string;
};

export type DownloadFilterState = {
	category: string;
	format: string;
};

/**
 * Identyfikatory kart do pokazania. `matchedIds === null` oznacza brak aktywnego
 * wyszukiwania; pusty zbiór oznacza wyszukiwanie bez pasujących kart.
 */
export function visibleCardIds(
	cards: readonly DownloadFilterCard[],
	filters: DownloadFilterState,
	matchedIds: ReadonlySet<string> | null,
): string[] {
	return cards
		.filter((card) => !filters.category || card.category === filters.category)
		.filter((card) => !filters.format || card.format === filters.format)
		.filter((card) => matchedIds === null || matchedIds.has(card.id))
		.map((card) => card.id);
}

/** Kształt zwracany przez `pagefind.filters()` (lub null, gdy indeksu nie ma). */
export type PagefindFilters = Record<string, Record<string, number>> | null | undefined;

export type PagefindFilterKey = 'kategoria' | 'format';

/**
 * Wartości filtru dostępne użytkownikowi: z indeksu Pagefind, ograniczone do
 * centralnej listy. Gdy indeksu nie ma, pozostają wartości widoczne na kartach.
 */
export function availableFilterValues(
	pagefindFilters: PagefindFilters,
	key: PagefindFilterKey,
	allowedValues: readonly string[],
	renderedValues: readonly string[],
): string[] {
	const counts = pagefindFilters?.[key];
	const rendered = new Set(renderedValues);

	return allowedValues.filter(
		(value) => rendered.has(value) || (typeof counts?.[value] === 'number' && counts[value] > 0),
	);
}
