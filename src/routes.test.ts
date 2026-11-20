import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { PLAN_LEKCJI_URL, PLAN_LO_URL } from './consts';
import { buildCrumbs, findTrasa, quickAccessLinks, trasy } from './routes';

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

describe('quickAccessLinks', () => {
  it('zwraca cztery szybkie linki w dotychczasowej kolejności z nazwami z katalogu', () => {
    expect(quickAccessLinks().map(({ id, label, source, external }) => ({ id, label, source, external }))).toEqual([
      { id: 'edziennik', label: 'E-Dziennik', source: 'external', external: true },
      { id: 'plan-lekcji', label: 'Plan lekcji', source: 'external', external: true },
      { id: 'plan-lo', label: 'Plan LO', source: 'external', external: true },
      { id: 'dzwonki', label: 'Dzwonki', source: 'trasa', external: false },
    ]);
  });

  it('pobiera adresy z katalogu i rozróżnia Trasę planu lekcji od linku zewnętrznego', () => {
    const links = quickAccessLinks();
    const byId = (id: string) => {
      const link = links.find((candidate) => candidate.id === id);
      if (!link) throw new Error(`Brak szybkiego linku ${id}`);
      return link;
    };

    expect(byId('edziennik').href).toBe('https://uonetplus.vulcan.net.pl/powiatmikolowski');
    expect(byId('plan-lekcji').href).toBe(PLAN_LEKCJI_URL);
    expect(byId('plan-lo').href).toBe(PLAN_LO_URL);
    expect(byId('dzwonki').href).toBe('/dzwonki');
    expect(byId('plan-lekcji').href).not.toBe(findTrasa('/plan-lekcji')?.path);
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
