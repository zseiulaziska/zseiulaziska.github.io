import { describe, expect, it } from 'vitest';
import { MATERIALY_DO_POBRANIA_PATH } from '../routes';
import { DOWNLOAD_CATEGORY_IDS, DOWNLOAD_FORMATS } from './downloads-catalog';
import {
	availableFilterValues,
	cardIdFromTitleAnchor,
	cardIdsFromPagefindResults,
	visibleCardIds,
	type DownloadFilterCard,
} from './downloads-search';

const categoryIds = DOWNLOAD_CATEGORY_IDS;
const CATALOG_PATH = `${MATERIALY_DO_POBRANIA_PATH}/`;

describe('mapowanie wyników Pagefind na karty katalogu', () => {
	it('zwraca identyfikatory kart z kotwic sub-results, pomijając wynik całej strony', () => {
		const results = [
			{
				sub_results: [
					{ url: CATALOG_PATH },
					{ url: `${CATALOG_PATH}#ulotka-rekrutacyjna`, title: 'Ulotka rekrutacyjna' },
					{ url: '/blog/#ulotka-rekrutacyjna', title: 'Wpis na blogu' },
					{ url: `${CATALOG_PATH}#logo-szkoly`, title: 'Logo szkoły' },
				],
			},
		];

		expect(cardIdsFromPagefindResults(results, CATALOG_PATH)).toEqual([
			'ulotka-rekrutacyjna',
			'logo-szkoly',
		]);
	});

	it('dekoduje zakodowane kotwice i nie powtarza tego samego identyfikatora', () => {
		const results = [
			{ sub_results: [{ url: `${CATALOG_PATH}#ulotka%20rekrutacyjna` }] },
			{ sub_results: [{ url: `${CATALOG_PATH}#ulotka%20rekrutacyjna` }] },
		];

		expect(cardIdsFromPagefindResults(results, CATALOG_PATH)).toEqual(['ulotka rekrutacyjna']);
	});

	it('nie rzuca błędu przy braku lub uszkodzonych danych Pagefind', () => {
		expect(cardIdsFromPagefindResults([], CATALOG_PATH)).toEqual([]);
		expect(cardIdsFromPagefindResults([{}, { sub_results: null }], CATALOG_PATH)).toEqual([]);
		expect(cardIdsFromPagefindResults([{ sub_results: [{}, { url: 42 }] }], CATALOG_PATH)).toEqual([]);
	});

	it('przekłada kotwicę nagłówka karty na identyfikator karty', () => {
		const results = [
			{ sub_results: [{ url: `${CATALOG_PATH}#material-przykladowy-tytul` }] },
		];

		expect(cardIdsFromPagefindResults(results, CATALOG_PATH, cardIdFromTitleAnchor)).toEqual([
			'material-przykladowy',
		]);
		expect(cardIdsFromPagefindResults(results, CATALOG_PATH)).toEqual([
			'material-przykladowy-tytul',
		]);
	});
});

const cards: readonly DownloadFilterCard[] = [
	{ id: 'pierwszy', category: 'identyfikacja-wizualna', format: 'PDF' },
	{ id: 'drugi', category: 'dokumenty-i-publikacje', format: 'DOCX' },
	{ id: 'trzeci', category: 'dokumenty-i-publikacje', format: 'PDF' },
];

describe('widoczne karty po wyszukiwaniu i filtrowaniu', () => {
	it('bez wyszukiwania i filtrów pokazuje wszystkie karty w ustalonym porządku', () => {
		expect(
			visibleCardIds(cards, { category: '', format: '' }, null),
		).toEqual(['pierwszy', 'drugi', 'trzeci']);
	});

	it('łączy filtr kategorii i formatu', () => {
		expect(
			visibleCardIds(cards, { category: 'dokumenty-i-publikacje', format: 'PDF' }, null),
		).toEqual(['trzeci']);
		expect(visibleCardIds(cards, { category: 'multimedia', format: '' }, null)).toEqual([]);
	});

	it('przy aktywnym wyszukiwaniu zostawia tylko karty z wyników Pagefind', () => {
		const matched = new Set(['pierwszy', 'trzeci']);

		expect(visibleCardIds(cards, { category: '', format: '' }, matched)).toEqual([
			'pierwszy',
			'trzeci',
		]);
		expect(
			visibleCardIds(cards, { category: 'dokumenty-i-publikacje', format: '' }, matched),
		).toEqual(['trzeci']);
		expect(visibleCardIds(cards, { category: '', format: '' }, new Set())).toEqual([]);
	});
});

describe('dostępne wartości filtrów', () => {
	it('łączy wartości z pagefind.filters() z centralną listą kategorii', () => {
		const filters = {
			kategoria: {
				multimedia: 1,
				'dokumenty-i-publikacje': 3,
				'nieznana-kategoria': 2,
			},
		};

		expect(availableFilterValues(filters, 'kategoria', categoryIds, [])).toEqual([
			'dokumenty-i-publikacje',
			'multimedia',
		]);
	});

	it('wybiera formaty w kolejności centralnej listy i ignoruje wartości o zerowej liczności', () => {
		const filters = { format: { PDF: 4, DOCX: 0, EXE: 2 } };

		expect(availableFilterValues(filters, 'format', DOWNLOAD_FORMATS, [])).toEqual(['PDF']);
	});

	it('gdy indeks Pagefind nie istnieje, korzysta z wartości widocznych na kartach', () => {
		expect(availableFilterValues(null, 'format', DOWNLOAD_FORMATS, ['PDF'])).toEqual(['PDF']);
		expect(availableFilterValues(undefined, 'kategoria', categoryIds, ['multimedia'])).toEqual([
			'multimedia',
		]);
	});

	it('zachowuje wartość widoczną na karcie, nawet jeśli indeks jest nieaktualny', () => {
		const filters = { kategoria: { multimedia: 1 } };

		expect(availableFilterValues(filters, 'kategoria', categoryIds, ['pdf-bez-indeksu', 'multimedia']))
			.toEqual(['multimedia']);
		expect(availableFilterValues(filters, 'kategoria', categoryIds, ['identyfikacja-wizualna']))
			.toEqual(['identyfikacja-wizualna', 'multimedia']);
	});
});
