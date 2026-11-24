import { describe, expect, it } from 'vitest';
import {
	DOWNLOAD_CATEGORIES,
	downloadCountWord,
	formatFromPath,
	groupDownloads,
	isValidFileSize,
	toDownloadItem,
	visibleDownloads,
	type DownloadEntry,
} from './downloads-catalog';

function entry(overrides: Record<string, unknown> = {}, id = 'material-przykladowy'): DownloadEntry {
	return {
		id,
		data: {
			title: 'Przykładowy materiał',
			description: 'Opis przykładowego materiału',
			category: 'dokumenty-i-publikacje',
			file: '/downloads/przykladowy-material.pdf',
			fileSize: '24 kB',
			pubDate: '2026-11-24',
			published: true,
			...overrides,
		},
	};
}

describe('katalog materiałów do pobrania', () => {
	it('ma centralną listę pięciu kategorii', () => {
		expect(DOWNLOAD_CATEGORIES.map((category) => category.id)).toEqual([
			'identyfikacja-wizualna',
			'materialy-promocyjne',
			'dokumenty-i-publikacje',
			'media-i-partnerzy',
			'multimedia',
		]);
	});

	it('wylicza format z rozszerzenia pliku, także przy adresie z zapytaniem', () => {
		expect(formatFromPath('/downloads/instrukcja.PDF')).toBe('PDF');
		expect(formatFromPath('https://example.edu.pl/pliki/ulotka.docx?download=1')).toBe('DOCX');
		expect(formatFromPath('/downloads/plik.exe')).toBeUndefined();
	});

	it('waliduje ręcznie wpisany rozmiar pliku', () => {
		expect(isValidFileSize('2.4 MB')).toBe(true);
		expect(isValidFileSize('1,39 MB')).toBe(true);
		expect(isValidFileSize('542 kB')).toBe(true);
		expect(isValidFileSize('2.4')).toBe(false);
		expect(isValidFileSize('duży plik')).toBe(false);
	});
});

describe('etykiety liczby materiałów', () => {
	it('odmienia liczbę materiałów poprawnie po polsku', () => {
		expect(downloadCountWord(1)).toBe('materiał');
		expect(downloadCountWord(2)).toBe('materiały');
		expect(downloadCountWord(3)).toBe('materiały');
		expect(downloadCountWord(4)).toBe('materiały');
		expect(downloadCountWord(5)).toBe('materiałów');
		expect(downloadCountWord(11)).toBe('materiałów');
		expect(downloadCountWord(12)).toBe('materiałów');
		expect(downloadCountWord(21)).toBe('materiał');
		expect(downloadCountWord(22)).toBe('materiały');
	});
});

describe('widoczne materiały', () => {
	it('pomija wpisy nieopublikowane', () => {
		expect(visibleDownloads([entry(), entry({ published: false }, 'ukryty')])).toHaveLength(1);
		expect(visibleDownloads([entry({ published: undefined })])).toEqual([]);
	});

	it('odrzuca wpisy z brakującym wymaganym polem', () => {
		for (const field of ['title', 'description', 'category', 'fileSize', 'pubDate', 'published', 'file']) {
			expect(toDownloadItem(entry({ [field]: undefined })), `pole ${field}`).toBeUndefined();
		}
	});

	it('odrzuca wpis z nieprawidłową ścieżką pliku', () => {
		for (const file of [
			'downloads/material.pdf',
			'/downloads/../material.pdf',
			'/images/material.pdf',
			'/downloads/material.exe',
		]) {
			expect(toDownloadItem(entry({ file })), `ścieżka ${file}`).toBeUndefined();
		}
	});

	it('odrzuca wpis z adresem zewnętrznym bez obsługiwanego formatu', () => {
		expect(toDownloadItem(entry({ file: undefined, externalUrl: 'ftp://example.pl/material.pdf' }))).toBeUndefined();
		expect(toDownloadItem(entry({ file: undefined, externalUrl: 'https://example.pl/material' }))).toBeUndefined();
	});

	it('odrzuca wpis z jednocześnie plikiem lokalnym i adresem zewnętrznym', () => {
		const both = entry({ externalUrl: 'https://example.pl/inne.pdf' });
		expect(toDownloadItem(both)).toBeUndefined();
	});

	it('zwraca kartę z wyliczonym formatem, rozmiarem, datą i działającym odnośnikiem', () => {
		const [item] = visibleDownloads([entry()]);

		expect(item).toMatchObject({
			id: 'material-przykladowy',
			title: 'Przykładowy materiał',
			category: 'dokumenty-i-publikacje',
			categoryLabel: 'Dokumenty i publikacje',
			format: 'PDF',
			fileSize: '24 kB',
			href: '/downloads/przykladowy-material.pdf',
			external: false,
			downloadName: 'przykladowy-material.pdf',
		});
		expect(item.pubDate).toBeInstanceOf(Date);
	});

	it('dla materiału zewnętrznego zachowuje adres i oznacza go jako zewnętrzny', () => {
		const [item] = visibleDownloads([
			entry({ file: undefined, externalUrl: 'https://example.pl/ulotka.pdf' }),
		]);

		expect(item.external).toBe(true);
		expect(item.href).toBe('https://example.pl/ulotka.pdf');
		expect(item.format).toBe('PDF');
	});
});

describe('porządkowanie i grupowanie', () => {
	it('sortuje wyróżnione przed pozostałymi, potem wg daty i tytułu', () => {
		const items = visibleDownloads([
			entry({ title: 'Starszy' }, 'starszy'),
			entry({ title: 'Nowszy', pubDate: '2026-11-25' }, 'nowszy'),
			entry({ title: 'Wyróżniony', featured: true, pubDate: '2026-01-01' }, 'wyrozniony'),
		]);

		expect(items.map((item) => item.title)).toEqual(['Wyróżniony', 'Nowszy', 'Starszy']);
	});

	it('używa kolejności jako wyróżnika przy identycznych danych', () => {
		const items = visibleDownloads([
			entry({ sortOrder: 2 }, 'pozniej'),
			entry({ sortOrder: 1 }, 'wczesniej'),
		]);

		expect(items.map((item) => item.id)).toEqual(['wczesniej', 'pozniej']);
	});

	it('zawsze zwraca ten sam porządek, także przy identycznych wyróżnikach', () => {
		const first = visibleDownloads([entry({}, 'b'), entry({}, 'a')]);
		const second = visibleDownloads([entry({}, 'a'), entry({}, 'b')]);

		expect(first.map((item) => item.id)).toEqual(['a', 'b']);
		expect(second.map((item) => item.id)).toEqual(first.map((item) => item.id));
	});

	it('sortuje wg daty widocznej na karcie, czyli daty aktualizacji gdy jest dostępna', () => {
		const items = visibleDownloads([
			entry({ title: 'Zaktualizowany', pubDate: '2026-01-01', updatedDate: '2026-11-24' }, 'zaktualizowany'),
			entry({ title: 'Nowsza publikacja', pubDate: '2026-11-20' }, 'nowsza-publikacja'),
		]);

		expect(items.map((item) => item.title)).toEqual(['Zaktualizowany', 'Nowsza publikacja']);
	});

	it('grupuje tylko kategorie z materiałami, w kolejności centralnej listy', () => {
		const groups = groupDownloads(
			visibleDownloads([
				entry({ category: 'multimedia' }, 'multimedium'),
				entry({ category: 'dokumenty-i-publikacje' }, 'dokument'),
				entry({ category: 'dokumenty-i-publikacje' }, 'kolejny-dokument'),
			]),
		);

		expect(groups.map((group) => [group.id, group.count])).toEqual([
			['dokumenty-i-publikacje', 2],
			['multimedia', 1],
		]);
		expect(groups[0]?.items[0]).toMatchObject({ id: 'dokument' });
	});

	it('liczy tyle materiałów, ile kart znajduje się w grupie', () => {
		const groups = groupDownloads(
			visibleDownloads([
				entry({ category: 'multimedia' }, 'pierwszy'),
				entry({ category: 'multimedia' }, 'drugi'),
				entry({ category: 'multimedia', featured: true }, 'trzeci'),
			]),
		);

		expect(groups).toHaveLength(1);
		expect(groups[0]?.count).toBe(3);
		expect(groups[0]?.items).toHaveLength(groups[0]?.count ?? -1);
	});

	it('sortuje karty w grupie niezależnie od kolejności wpisów', () => {
		const items = [
			toDownloadItem(entry({ title: 'Nowszy', pubDate: '2026-11-25' }, 'nowszy'))!,
			toDownloadItem(entry({ title: 'Wyróżniony', featured: true, pubDate: '2026-01-01' }, 'wyrozniony'))!,
			toDownloadItem(entry({ title: 'Starszy', pubDate: '2026-01-01' }, 'starszy'))!,
			toDownloadItem(entry({ title: 'Alfabetyszny', pubDate: '2026-01-01' }, 'alfabetyszny'))!,
		];

		const [group] = groupDownloads(items);

		expect(group?.items.map((item) => item.title)).toEqual([
			'Wyróżniony',
			'Nowszy',
			'Alfabetyszny',
			'Starszy',
		]);
	});
});
