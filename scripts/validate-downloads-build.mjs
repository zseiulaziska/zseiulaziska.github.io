// Adapter walidacji wyjścia buildu: czyta wygenerowany katalog i wpisy treści,
// a następnie przekazuje je do czystej funkcji validateDownloadsOutput.
// Wywoływany przez scripts/postbuild.cjs; kończy build błędem przy niespójności.

import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { validateDownloadsOutput } from './validate-downloads-output.mjs';

const CONTENT_FILE_PATTERN = /\.mdx?$/;

function walk(dir) {
	const files = [];
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) files.push(...walk(path));
		else files.push(path);
	}
	return files;
}

/** Wszystkie pliki wyjścia jako ścieżki publiczne, np. downloads/logo.pdf. */
function builtPublicPaths(siteDir) {
	return walk(siteDir).map((file) => relative(siteDir, file).split(sep).join('/'));
}

/** Identyfikator, tytuł i stan publikacji wpisów z src/content/downloads. */
function sourceEntries(contentDir) {
	return readdirSync(contentDir)
		.filter((name) => CONTENT_FILE_PATTERN.test(name))
		.map((name) => {
			const raw = readFileSync(join(contentDir, name), 'utf8');
			const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
			const rawTitle = frontmatter.match(/^title:\s*(.+)$/m)?.[1]?.trim() ?? '';
			return {
				id: name.replace(CONTENT_FILE_PATTERN, ''),
				title: rawTitle.replace(/^["']|["']$/g, ''),
				published: /^published:\s*true\s*$/m.test(frontmatter),
			};
		});
}

const siteDir = process.argv[2] ?? 'dist';
const catalogFile = join(siteDir, 'materialy-do-pobrania', 'index.html');
const contentDir = 'src/content/downloads';

let html;
try {
	html = readFileSync(catalogFile, 'utf8');
} catch {
	console.error(`BŁĄD: brak wygenerowanej strony katalogu: ${catalogFile}`);
	process.exit(1);
}

const problems = validateDownloadsOutput(html, {
	builtFiles: builtPublicPaths(siteDir),
	entries: sourceEntries(contentDir),
});

if (problems.length) {
	console.error(`Walidacja katalogu materiałów: PROBLEMY (${problems.length}):`);
	for (const problem of problems.slice(0, 40)) console.error(' - ' + problem);
	process.exit(1);
}

console.log(`OK: katalog materiałów w ${catalogFile} — karty, kategorie i odnośniki do plików poprawne.`);
