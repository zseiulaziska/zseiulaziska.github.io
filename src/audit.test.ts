import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const self = fileURLToPath(import.meta.url);

function sourceFiles(dir: string, extensions: readonly string[]): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (full === self) return []; // strażnik nie skanuje własnych wzorców w stringach
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.astro', '.git'].includes(entry.name)) return [];
      return sourceFiles(full, extensions);
    }
    return extensions.some((ext) => entry.name.endsWith(ext)) ? [full] : [];
  });
}

const srcFiles = sourceFiles(join(root, 'src'), ['.astro', '.ts', '.js']);

type Finding = { file: string; line: number };
type Check = (source: string) => number[];

function locate(file: string, helper: Check): Finding[] {
  const source = readFileSync(file, 'utf8');
  const rel = relative(root, file).replaceAll('\\', '/');
  return helper(source).map((line) => ({ file: rel, line }));
}

function report(findings: Finding[]): string {
  return findings.map((f) => `${f.file}:${f.line}`).join(', ');
}

function linesWith(source: string, pattern: RegExp): number[] {
  return source.split(/\r?\n/).flatMap((line, index) => (pattern.test(line) ? [index + 1] : []));
}

function tags(source: string, name: string): Array<{ text: string; line: number }> {
  const regex = new RegExp(`<${name}\\b[\\s\\S]*?>`, 'g');
  const found: Array<{ text: string; line: number }> = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(source)) !== null) {
    found.push({ text: match[0], line: source.slice(0, match.index).split(/\r?\n/).length });
  }
  return found;
}

export function findInnerHtmlClears(source: string): number[] {
  return linesWith(source, /\.innerHTML\s*=\s*(['"`])\1\s*;?/);
}

export function findCopySorts(source: string): number[] {
  return linesWith(source, /\[\.\.\.\w+\]\.sort\(/);
}

export function findStaticCursorPointers(source: string): number[] {
  return tags(source, 'div')
    .filter((tag) => /cursor-pointer/.test(tag.text) && !/(onclick=|role=["']button["']|href=)/.test(tag.text))
    .map((tag) => tag.line);
}

export function findTargetBlankWithoutNoopener(source: string): number[] {
  return [...tags(source, 'a'), ...tags(source, 'area')]
    .filter((tag) => /\btarget=["']_blank["']/.test(tag.text) && !/rel=["'][^"']*\bnoopener\b/.test(tag.text))
    .map((tag) => tag.line);
}

export function findTabindexArticle(source: string): number[] {
  return tags(source, 'div')
    .filter((tag) => /tabindex=["']0["']/.test(tag.text) && /role=["']article["']/.test(tag.text))
    .map((tag) => tag.line);
}

export function findTabRolesWithoutKeydown(source: string): number[] {
  const allLines = source.split(/\r?\n/);
  return allLines.flatMap((line, index) => {
    if (!/role=["']tab(?:list)?["']/.test(line)) return [];
    // Obsługa klawiatury musi być blisko wzorca tabs — nie dowolnie w pliku.
    const nearby = allLines.slice(Math.max(0, index - 30), index + 31).join('\n');
    return /\bkeydown\b/.test(nearby) ? [] : [index + 1];
  });
}

export function findUnsafeExcerpts(source: string): number[] {
  return linesWith(source, /innerHTML[^\n]*item\.excerpt|item\.excerpt[^\n]*innerHTML/);
}

function expectNoFindings(files: readonly string[], helper: Check): void {
  const findings = files.flatMap((file) => locate(file, helper));
  expect(findings, report(findings)).toEqual([]);
}

describe('strażnik wzorców z audytu', () => {
  it('wykrywa celowe innerHTML = \'\' w syntetycznym źródle (test testu)', () => {
    expect(findInnerHtmlClears("listbox.innerHTML = '';\nconst x = 1;")).toEqual([1]);
    expect(findInnerHtmlClears('dayTabs.innerHTML = "";')).toEqual([1]);
  });

  it('nie oznacza poprawnych przypadków jako naruszeń', () => {
    expect(findInnerHtmlClears('listbox.innerHTML = data.map(render);')).toEqual([]);
    expect(findStaticCursorPointers('<a href="/x" class="cursor-pointer">X</a>')).toEqual([]);
    expect(findStaticCursorPointers('<summary class="cursor-pointer">X</summary>')).toEqual([]);
    expect(findCopySorts('const sorted = items.toSorted(fn);')).toEqual([]);
    expect(findTabRolesWithoutKeydown(`input.addEventListener("keydown", fn);\n${'\n'.repeat(40)}<div role="tablist"></div>`)).toEqual([42]);
  });

  it('brak target="_blank" bez rel="noopener"', () => {
    expectNoFindings(srcFiles, findTargetBlankWithoutNoopener);
  });

  it('brak pustych przypisań innerHTML', () => {
    expectNoFindings(srcFiles, findInnerHtmlClears);
  });

  it('brak [...arr].sort()', () => {
    expectNoFindings(srcFiles, findCopySorts);
  });

  it('brak cursor-pointer na statycznych divach', () => {
    expectNoFindings(srcFiles, findStaticCursorPointers);
  });

  it('brak tabindex="0" na elementach z role="article"', () => {
    expectNoFindings(srcFiles, findTabindexArticle);
  });

  it('brak nieobsłużonego wzorca ARIA Tabs', () => {
    expectNoFindings(srcFiles, findTabRolesWithoutKeydown);
  });

  it('item.excerpt nie trafia bezpośrednio do innerHTML', () => {
    expectNoFindings(srcFiles, findUnsafeExcerpts);
  });

  it('usunięte artefakty nie wracają do repozytorium', () => {
    const removed = [
      'src/components/Image.astro',
      'src/assets/fonts/atkinson-bold.woff',
      'src/assets/fonts/atkinson-regular.woff',
      'public/sw.js',
      'public/manifest.json',
    ];
    const stillThere = removed.filter((path) => existsSync(join(root, path)));
    expect(stillThere, stillThere.join(', ')).toEqual([]);
  });

  it('public/_headers zawiera egzekwowaną CSP', () => {
    const headers = join(root, 'public/_headers');
    expect(existsSync(headers)).toBe(true);
    expect(readFileSync(headers, 'utf8')).toContain('Content-Security-Policy:');
  });

  it('BaseHead.astro zawiera meta color-scheme', () => {
    const baseHead = join(root, 'src/components/BaseHead.astro');
    expect(readFileSync(baseHead, 'utf8')).toContain('<meta name="color-scheme"');
  });
});
