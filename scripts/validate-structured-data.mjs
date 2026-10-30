// Walidacja danych strukturalnych BreadcrumbList we wszystkich wygenerowanych stronach.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.argv[2] ?? 'dist';

async function walk(dir) {
	let out = [];
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const p = join(dir, entry.name);
		if (entry.isDirectory()) out.push(...(await walk(p)));
		else if (entry.name.endsWith('.html')) out.push(p);
	}
	return out;
}

const files = await walk(root);
let checked = 0;
const problems = [];

for (const file of files) {
	const html = await readFile(file, 'utf8');
	const blocks = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)];
	for (const [, raw] of blocks) {
		let data;
		try {
			data = JSON.parse(raw);
		} catch (err) {
			problems.push(`${file}: niepoprawny JSON-LD (${err.message})`);
			continue;
		}
		const items = Array.isArray(data) ? data : [data];
		for (const node of items) {
			if (node?.['@type'] !== 'BreadcrumbList') continue;
			checked++;
			if (!Array.isArray(node.itemListElement) || node.itemListElement.length === 0) {
				problems.push(`${file}: brak itemListElement`);
				continue;
			}
			node.itemListElement.forEach((el, i) => {
				if (!el.item) problems.push(`${file}: element #${i + 1} ("${el.name}") bez pola "item"`);
				else if (!/^https:\/\/zseiulaziska\.pl\//.test(el.item))
					problems.push(`${file}: element #${i + 1} ma item spoza domeny: ${el.item}`);
				if (el.position !== i + 1) problems.push(`${file}: element #${i + 1} ma position ${el.position}`);
				if (!el.name) problems.push(`${file}: element #${i + 1} bez "name"`);
			});
		}
	}
}

console.log(`Pliki HTML: ${files.length}, bloki BreadcrumbList: ${checked}`);
if (problems.length) {
	console.log(`PROBLEMY (${problems.length}):`);
	for (const p of problems.slice(0, 40)) console.log(' - ' + p);
	process.exit(1);
} else {
	console.log('OK: każdy itemListElement ma "item", "name" i poprawne "position".');
}
