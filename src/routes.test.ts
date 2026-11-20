import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { buildCrumbs, externalLinks, findRoute, routes, sections } from './routes';

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
    expect(routes.map((route) => route.path).sort()).toEqual(expected);
  });

  it('ma unikalne ścieżki kanoniczne', () => {
    const paths = routes.map((route) => route.path);

    expect(new Set(paths).size).toBe(paths.length);
  });

  it('rozwiązuje każdy alias do istniejącej Trasy', () => {
    for (const route of routes) {
      for (const alias of route.aliases ?? []) {
        expect(findRoute(alias), `Alias ${alias} nie prowadzi do Trasy`).toBe(route);
      }
    }

    expect(findRoute('/kierunki-ksztalcenia')?.path).toBe('/kierunki');
  });

  it('ma sekcje z adresami okruszków zakończonymi ukośnikiem', () => {
    for (const section of sections) {
      expect(section.href, `Sekcja ${section.title} ma zły adres okruszka`).toMatch(/\/$/);
    }
  });

  it('ma unikalne linki zewnętrzne', () => {
    const hrefs = externalLinks.map((link) => link.href);

    expect(new Set(hrefs).size).toBe(hrefs.length);
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
