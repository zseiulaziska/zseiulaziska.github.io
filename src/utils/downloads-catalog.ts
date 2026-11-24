/**
 * Czysty moduł katalogu materiałów do pobrania.
 *
 * Jedyne źródło listy kategorii oraz reguł walidacji wpisu: korzystają z niego
 * konfiguracja Keystatic, schemat kolekcji Astro, strona katalogu i testy.
 * Moduł nie importuje Astro ani Keystatic i nie ma skutków ubocznych.
 */

export const DOWNLOAD_CATEGORIES = [
	{ id: 'identyfikacja-wizualna', label: 'Identyfikacja wizualna' },
	{ id: 'materialy-promocyjne', label: 'Materiały promocyjne' },
	{ id: 'dokumenty-i-publikacje', label: 'Dokumenty i publikacje' },
	{ id: 'media-i-partnerzy', label: 'Media i partnerzy' },
	{ id: 'multimedia', label: 'Multimedia' },
] as const;

export type DownloadCategoryId = (typeof DOWNLOAD_CATEGORIES)[number]['id'];

export const DOWNLOAD_CATEGORY_IDS: readonly DownloadCategoryId[] = DOWNLOAD_CATEGORIES.map(
	(category) => category.id,
);

export function isDownloadCategoryId(value: unknown): value is DownloadCategoryId {
	return typeof value === 'string' && DOWNLOAD_CATEGORY_IDS.some((id) => id === value);
}

export function downloadCategoryLabel(id: DownloadCategoryId): string {
	return DOWNLOAD_CATEGORIES.find((category) => category.id === id)?.label ?? id;
}

/** Poprawna polska odmiana słowa „materiał” przy danej liczbie. */
export function downloadCountWord(count: number): string {
	const lastTwo = count % 100;
	const last = count % 10;
	if (last === 1 && lastTwo !== 11) return 'materiał';
	if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return 'materiały';
	return 'materiałów';
}

export const DOWNLOAD_FORMATS = [
	'PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX',
	'ZIP', 'JPG', 'JPEG', 'PNG', 'WEBP', 'SVG', 'TXT', 'CSV',
] as const;

export type DownloadFormat = (typeof DOWNLOAD_FORMATS)[number];

/** Format jest wyliczany wyłącznie z rozszerzenia ścieżki lub adresu URL. */
export function formatFromPath(path: string): DownloadFormat | undefined {
	const withoutQuery = path.split(/[?#]/, 1)[0] ?? '';
	const filename = withoutQuery.split('/').at(-1) ?? '';
	const dot = filename.lastIndexOf('.');
	if (dot < 0) return undefined;

	const extension = filename.slice(dot + 1).toUpperCase();
	return DOWNLOAD_FORMATS.find((format) => format === extension);
}

/** Akceptuje np. „2.4 MB”, „1,39 MB”, „542 kB” — odrzuca brak jednostki i spacji. */
export const DOWNLOAD_FILE_SIZE_PATTERN = /^\d+(?:[.,]\d{1,2})? (?:B|kB|MB|GB)$/i;

export function isValidFileSize(value: unknown): boolean {
	return typeof value === 'string' && DOWNLOAD_FILE_SIZE_PATTERN.test(value);
}

/** Pliki lokalne katalogu muszą pochodzić z publicznego katalogu /downloads/. */
export function isValidDownloadFilePath(path: string): boolean {
	return (
		path.startsWith('/downloads/') &&
		path.length > '/downloads/'.length &&
		!path.includes('..') &&
		!path.includes('//') &&
		!path.includes('\\') &&
		!/[\s?#]/.test(path)
	);
}

export function isHttpUrl(value: string): boolean {
	try {
		const url = new URL(value);
		return (url.protocol === 'http:' || url.protocol === 'https:') && !/\s/.test(value);
	} catch {
		return false;
	}
}

export type DownloadFrontmatter = {
	title?: unknown;
	description?: unknown;
	category?: unknown;
	file?: unknown;
	externalUrl?: unknown;
	fileSize?: unknown;
	pubDate?: unknown;
	published?: unknown;
	updatedDate?: unknown;
	featured?: unknown;
	tags?: unknown;
	sortOrder?: unknown;
	downloadName?: unknown;
};

export type DownloadEntry = { id: string; data: DownloadFrontmatter };

export type DownloadItem = {
	id: string;
	title: string;
	description: string;
	category: DownloadCategoryId;
	categoryLabel: string;
	format: DownloadFormat;
	fileSize: string;
	pubDate: Date;
	updatedDate?: Date;
	featured: boolean;
	sortOrder?: number;
	tags: string[];
	href: string;
	external: boolean;
	downloadName: string;
};

export type DownloadGroup = {
	id: DownloadCategoryId;
	label: string;
	count: number;
	items: DownloadItem[];
};

function trimmedString(value: unknown): string | undefined {
	if (typeof value !== 'string') return undefined;
	const trimmed = value.trim();
	return trimmed || undefined;
}

function parsedDate(value: unknown): Date | undefined {
	if (value instanceof Date) {
		return Number.isNaN(value.getTime()) ? undefined : value;
	}
	if (typeof value !== 'string' && typeof value !== 'number') return undefined;

	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? undefined : date;
}

/** Zwraca listę błędów wpisu; pusta lista oznacza wpis poprawny. */
export function validateDownloadEntry(entry: DownloadEntry): string[] {
	const errors: string[] = [];
	const data = entry?.data;

	if (!data || typeof data !== 'object') return ['brak danych wpisu'];
	if (!trimmedString(entry.id)) errors.push('brak identyfikatora wpisu');
	if (!trimmedString(data.title)) errors.push('brak tytułu');
	if (!trimmedString(data.description)) errors.push('brak opisu');

	const category = trimmedString(data.category);
	if (!category || !isDownloadCategoryId(category)) errors.push('nieznana kategoria');
	if (!isValidFileSize(data.fileSize)) errors.push('nieprawidłowy rozmiar pliku');
	if (!parsedDate(data.pubDate)) errors.push('brak lub nieprawidłowa data publikacji');
	if (typeof data.published !== 'boolean') errors.push('brak pola opublikowane');

	if (data.updatedDate != null && !parsedDate(data.updatedDate)) {
		errors.push('nieprawidłowa data aktualizacji');
	}
	if (data.featured != null && typeof data.featured !== 'boolean') {
		errors.push('nieprawidłowe pole wyróżnione');
	}
	if (
		data.tags != null &&
		(!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== 'string'))
	) {
		errors.push('nieprawidłowa lista tagów');
	}
	if (
		data.sortOrder != null &&
		(typeof data.sortOrder !== 'number' || !Number.isFinite(data.sortOrder))
	) {
		errors.push('nieprawidłowa kolejność');
	}
	const downloadName = trimmedString(data.downloadName);
	if (data.downloadName != null && (!downloadName || /[\\/]/.test(downloadName))) {
		errors.push('nieprawidłowa sugerowana nazwa pliku');
	}

	const file = trimmedString(data.file);
	const externalUrl = trimmedString(data.externalUrl);
	if (file && externalUrl) {
		errors.push('wpis wskazuje jednocześnie plik lokalny i adres zewnętrzny');
	}
	if (!file && !externalUrl) {
		errors.push('brak pliku i adresu zewnętrznego');
	}
	if (file && !isValidDownloadFilePath(file)) {
		errors.push('nieprawidłowa ścieżka pliku');
	}
	if (file && isValidDownloadFilePath(file) && !formatFromPath(file)) {
		errors.push('nieobsługiwany format pliku');
	}
	if (externalUrl && !isHttpUrl(externalUrl)) {
		errors.push('nieprawidłowy adres zewnętrzny');
	}
	if (externalUrl && isHttpUrl(externalUrl) && !formatFromPath(externalUrl)) {
		errors.push('nieobsługiwany format pliku zewnętrznego');
	}

	return errors;
}

/** Normalizuje poprawny wpis; dla wpisu niepoprawnego zwraca undefined. */
export function toDownloadItem(entry: DownloadEntry): DownloadItem | undefined {
	if (validateDownloadEntry(entry).length > 0) return undefined;

	const data = entry.data;
	const file = trimmedString(data.file);
	const externalUrl = trimmedString(data.externalUrl);
	const href = externalUrl ?? file!;
	const category = trimmedString(data.category) as DownloadCategoryId;

	return {
		id: trimmedString(entry.id)!,
		title: trimmedString(data.title)!,
		description: trimmedString(data.description)!,
		category,
		categoryLabel: downloadCategoryLabel(category),
		format: formatFromPath(href)!,
		fileSize: trimmedString(data.fileSize)!,
		pubDate: parsedDate(data.pubDate)!,
		updatedDate: data.updatedDate != null ? parsedDate(data.updatedDate) : undefined,
		featured: data.featured === true,
		sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : undefined,
		tags: Array.isArray(data.tags) ? data.tags.filter((tag): tag is string => typeof tag === 'string') : [],
		href,
		external: externalUrl !== undefined,
		downloadName: trimmedString(data.downloadName) ?? (file ? file.split('/').at(-1)! : ''),
	};
}

/** Data widoczna na karcie: aktualizacja, jeśli jest, inaczej publikacja. */
function displayDate(item: DownloadItem): Date {
	return item.updatedDate ?? item.pubDate;
}

/** Deterministyczny porządek: wyróżnione, widoczna data, tytuł, kolejność, identyfikator. */
export function sortDownloads(items: readonly DownloadItem[]): DownloadItem[] {
	return items.toSorted((a, b) => {
		if (a.featured !== b.featured) return a.featured ? -1 : 1;

		const byDate = displayDate(b).getTime() - displayDate(a).getTime();
		if (byDate !== 0) return byDate;

		const byTitle = a.title.localeCompare(b.title, 'pl');
		if (byTitle !== 0) return byTitle;

		const byOrder = (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER);
		if (byOrder !== 0) return byOrder;

		return a.id.localeCompare(b.id, 'pl');
	});
}

/** Tylko opublikowane i poprawne wpisy, już posortowane. */
export function visibleDownloads(entries: readonly DownloadEntry[]): DownloadItem[] {
	const items = entries.flatMap((entry) => {
		if (entry?.data?.published !== true) return [];
		const item = toDownloadItem(entry);
		return item ? [item] : [];
	});

	return sortDownloads(items);
}

/** Grupuje według centralnej listy kategorii; pomija kategorie bez materiałów. */
export function groupDownloads(items: readonly DownloadItem[]): DownloadGroup[] {
	// Kolejność kart nie zależy od kolejności wpisów przekazanych do grupowania.
	const sorted = sortDownloads(items);
	return DOWNLOAD_CATEGORIES.flatMap((category) => {
		const groupItems = sorted.filter((item) => item.category === category.id);
		if (groupItems.length === 0) return [];

		return [
			{
				id: category.id,
				label: category.label,
				count: groupItems.length,
				items: groupItems,
			},
		];
	});
}
