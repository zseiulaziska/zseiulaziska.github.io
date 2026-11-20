import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { buildCrumbs, findTrasa, redirects, trasy } from './routes';

const pagesDir = fileURLToPath(new URL('./pages', import.meta.url));

function pagePaths(): string[] {
  return readdirSync(pagesDir, { recursive: true })
    .filter((entry): entry is string => typeof entry === 'string' && entry.endsWith('.astro'))
    .filter((entry) => !entry.includes('[...slug]'))
    .map((entry) => {
      const path = entry.replace(/\\/g, '/').replace(/\.astro$/, '');
      if (path === 'index') return '/';
      if (path.endsWith('/index')) return `/${path.slice(0, -'/index'.length)}`;
      return `/${path}`;
    })
    .sort();
}

describe('katalog Tras', () => {
  it('ma dokładnie jedną Trasę dla każdej strony statycznej', () => {
    const expected = pagePaths();

    expect(expected.length).toBeGreaterThan(0);
    expect(trasy.map((trasa) => trasa.path).sort()).toEqual(expected);
  });

  it('ma unikalne ścieżki kanoniczne', () => {
    const paths = trasy.map((trasa) => trasa.path);

    expect(new Set(paths).size).toBe(paths.length);
  });

  it('rozwiązuje każdy alias do istniejącej Trasy', () => {
    for (const trasa of trasy) {
      for (const alias of trasa.aliases ?? []) {
        expect(findTrasa(alias), `Alias ${alias} nie prowadzi do Trasy`).toBe(trasa);
      }
    }

    expect(findTrasa('/kierunki-ksztalcenia')?.path).toBe('/kierunki');
  });
});

describe('redirecty z katalogu Tras', () => {
  it('stary adres kierunków prowadzi do aktualnej oferty', () => {
    expect(redirects['/kierunki-ksztalcenia']).toBe('/kierunki');
  });

  it('pokrywa każdy alias Trasy i prowadzi do jej kanonicznego adresu', () => {
    const aliasy = trasy.flatMap((trasa) => trasa.aliases ?? []);

    expect(Object.keys(redirects).sort()).toEqual([...aliasy].sort());
    for (const trasa of trasy) {
      for (const alias of trasa.aliases ?? []) {
        expect(findTrasa(alias)?.path, `Alias ${alias} nie prowadzi do Trasy`).toBe(trasa.path);
        expect(redirects[alias]).toBe(trasa.path);
      }
    }
  });
});

describe('buildCrumbs', () => {
  it('dla strony głównej nie zwraca okruszków', () => {
    expect(buildCrumbs('/')).toEqual([]);
  });

  it.each(['/opm', '/opm/'])('dla zwykłej Trasy %s zwraca home → sekcję → stronę', (pathname) => {
    expect(buildCrumbs(pathname)).toEqual([
      { href: '/', label: 'Strona główna' },
      { href: '/kierunki/', label: 'Oferta' },
      { href: '/opm', label: 'Oddział Przygotowania Mundurowego' },
    ]);
  });

  it('dla wpisu bloga zwraca home → Aktualności → tytuł wpisu', () => {
    expect(buildCrumbs('/blog/powitanie', 'Powitanie')).toEqual([
      { href: '/', label: 'Strona główna' },
      { href: '/blog/', label: 'Aktualności' },
      { href: '/blog/powitanie', label: 'Powitanie' },
    ]);
  });

  it('dla nieznanej ścieżki zwraca bezpieczny okruszek strony głównej', () => {
    expect(buildCrumbs('/nie-ma-mnie')).toEqual([{ href: '/', label: 'Strona główna' }]);
  });
});
