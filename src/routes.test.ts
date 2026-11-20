import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { PLAN_LEKCJI_URL, PLAN_LO_URL } from './consts';
import { buildCrumbs, findTrasa, footerGroups, quickAccessLinks, redirects, resolveSearchTitle, trasy } from './routes';

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

describe('resolveSearchTitle', () => {
  it('dla Trasy zwraca etykietę kanoniczną z katalogu zamiast tytułu strony z sufiksem', () => {
    expect(resolveSearchTitle(
      '/opm',
      'Oddział Przygotowania Mundurowego – Technik Logistyk | ZSEiU Łaziska Górne',
    )).toBe('Oddział Przygotowania Mundurowego');
  });

  it('dla strony głównej zwraca etykietę Trasy bez osobnego przypadku w adapterze', () => {
    expect(resolveSearchTitle('/', 'Zespół Szkół Energetycznych i Usługowych w Łaziskach Górnych'))
      .toBe('Strona główna');
  });

  it('dla aliasu zwraca tytuł wyszukiwania rozwiązanej Trasy', () => {
    expect(resolveSearchTitle('/kierunki-ksztalcenia', 'Kierunki kształcenia'))
      .toBe('Kierunki kształcenia');
  });

  it('dla wpisu bloga, który nie jest Trasą, zwraca tytuł wpisu', () => {
    expect(resolveSearchTitle('/blog/powitanie', 'Powitanie')).toBe('Powitanie');
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
