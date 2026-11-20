import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { buildCrumbs, findTrasa, footerGroups, trasy } from './routes';

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

describe('katalog Tras jako źródło stopki', () => {
  it('rozwiązuje każdy adres z grup stopki do Trasy', () => {
    for (const [group, paths] of Object.entries(footerGroups)) {
      for (const path of paths) {
        expect(findTrasa(path), `Grupa ${group}: brak Trasy dla ${path}`).toBeDefined();
      }
    }
  });

  it('przechowuje dłuższe nazwy stopki jako jawne warianty, nie zastępując etykiet kanonicznych', () => {
    expect(findTrasa('/opw')?.label).toBe('Oddział Przygotowania Wojskowego');
    expect(findTrasa('/opw')?.footerLabel).toBe('Oddziały Przygotowania Wojskowego - OPW');
    expect(findTrasa('/rekrutacja')?.label).toBe('Rekrutacja');
    expect(findTrasa('/rekrutacja')?.footerLabel).toBe('Rekrutacja 2026/2027');
    expect(findTrasa('/dokumenty')?.label).toBe('Dokumenty szkolne');
    expect(findTrasa('/dokumenty')?.footerLabel).toBe('Statuty i Regulaminy');
  });

  it('zachowuje dotychczasową kolejność linków w grupach stopki', () => {
    expect(footerGroups.oferta).toEqual([
      '/opw',
      '/opm',
      '/technik-informatyk',
      '/technik-logistyk',
      '/technik-elektryk',
      '/technik-urzadzen-i-systemow-energetyki-odnawialnej',
      '/technik-stylista',
      '/technik-organizacji-turystyki',
      '/wielozawodowa',
      '/lo-dla-doroslych',
    ]);
    expect(footerGroups.spolecznosc).toEqual([
      '/kalendarz',
      '/podreczniki',
      '/praktyki-zawodowe',
      '/pracownicy-mlodociani',
      '/egzaminy-zawodowe',
      '/rekrutacja',
    ]);
    expect(footerGroups.prawne).toEqual(['/dostepnosc', '/rodo', '/dokumenty']);
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
