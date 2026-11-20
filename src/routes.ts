import { PLAN_LEKCJI_URL, PLAN_LO_URL } from './consts';

export type SectionId = 'o-szkole' | 'oferta' | 'uczniowie-i-rodzice' | 'projekty';

export type Crumb = { href: string; label: string };

export type SectionMenuEntry = { trasa: string } | { external: string };

export type Section = {
  id: SectionId;
  title: string;
  description: string;
  href: string;
  highlight?: string;
  groups: { title: string; entries: SectionMenuEntry[] }[];
};

export type Trasa = {
  path: string;
  label: string;
  navLabel?: string;
  footerLabel?: string;
  description?: string;
  section?: SectionId;
  breadcrumbParent?: Crumb;
  navGroup?: string;
  icon?: string;
  aliases?: string[];
  searchTitle: string;
};

export type ExternalLink = {
  id: string;
  label: string;
  href: string;
  description?: string;
  ariaLabel?: string;
  icon?: string;
  external?: boolean;
  hideMobile?: boolean;
};

// Szybki dostęp łączy linki zewnętrzne z jedną Trasą; źródło pozostaje jawne.
export type QuickAccessLink = ExternalLink & { source: 'external' | 'trasa' };

type TrasaInput = Omit<Trasa, 'searchTitle'> & { searchTitle?: string };

function defineTrasa({ searchTitle, ...trasa }: TrasaInput): Trasa {
  return { ...trasa, searchTitle: searchTitle ?? trasa.label };
}

// Adresy sekcji zachowują końcowy ukośnik używany dotąd w danych strukturalnych.
export const sections: Section[] = [
  {
    id: 'o-szkole',
    title: 'O szkole',
    description: 'Informacje, zespół i życie szkolnej społeczności.',
    href: '/informacje/',
    groups: [
      {
        title: 'Szkoła',
        entries: [
          { trasa: '/informacje' },
          { trasa: '/historia' },
          { trasa: '/kierunki' },
          { trasa: '/blog' },
          { trasa: '/dostepnosc' },
        ],
      },
      {
        title: 'Ludzie',
        entries: [{ trasa: '/dyrekcja' }, { trasa: '/grono-pedagogiczne' }],
      },
    ],
  },
  {
    id: 'oferta',
    title: 'Oferta',
    description: 'Kierunki, klasy i informacje dla kandydatów.',
    href: '/kierunki/',
    highlight: '/rekrutacja',
    groups: [
      {
        title: 'Kierunki',
        entries: [{ trasa: '/kierunki' }, { trasa: '/lo-dla-doroslych' }, { trasa: '/wielozawodowa' }],
      },
      {
        title: 'Profile',
        entries: [
          { trasa: '/opw' },
          { trasa: '/opm' },
          { trasa: '/technik-elektryk' },
          { trasa: '/technik-informatyk' },
          { trasa: '/technik-logistyk' },
          { trasa: '/technik-organizacji-turystyki' },
          { trasa: '/technik-urzadzen-i-systemow-energetyki-odnawialnej' },
          { trasa: '/technik-stylista' },
        ],
      },
    ],
  },
  {
    id: 'uczniowie-i-rodzice',
    title: 'Uczniowie i rodzice',
    description: 'Codzienne sprawy, terminy, plany i dokumenty.',
    href: '/dla-uczniow/',
    groups: [
      {
        title: 'Na co dzień',
        entries: [
          { trasa: '/dla-uczniow' },
          { trasa: '/dla-rodzicow' },
          { trasa: '/praktyki-zawodowe' },
          { trasa: '/pracownicy-mlodociani' },
          { external: 'plan-lekcji' },
          { trasa: '/kalendarz' },
        ],
      },
      {
        title: 'Dokumenty',
        entries: [
          { trasa: '/podreczniki' },
          { trasa: '/dokumenty' },
          { trasa: '/rodo' },
          { trasa: '/egzaminy-zawodowe' },
        ],
      },
      {
        title: 'Liceum dla Dorosłych',
        entries: [{ trasa: '/lo-dla-doroslych' }, { external: 'plan-lo' }],
      },
    ],
  },
  {
    id: 'projekty',
    title: 'Projekty',
    description: 'Programy, Erasmus+ i aktualności z życia szkoły.',
    href: '/projekty/',
    groups: [
      {
        title: 'Aktywności',
        entries: [
          { trasa: '/projekty' },
          { trasa: '/erasmus' },
          { trasa: '/erasmus-grecja' },
          { trasa: '/erasmus-sycylia' },
          { trasa: '/zawodowy-mikolowski' },
          { trasa: '/profesjonalny-mikolowski' },
          { trasa: '/narodowy-program-rozwoju-czytelnictwa' },
        ],
      },
    ],
  },
];

// Linki bez własnej strony w serwisie; nie są Trasami.
export const externalLinks: ExternalLink[] = [
  {
    id: 'edziennik',
    label: 'E-Dziennik',
    href: 'https://uonetplus.vulcan.net.pl/powiatmikolowski',
    icon: 'book',
    external: true,
    hideMobile: true,
  },
  {
    id: 'plan-lekcji',
    label: 'Plan lekcji',
    href: PLAN_LEKCJI_URL,
    description: 'Aktualny plan zajęć',
    icon: 'calendar',
    external: true,
    hideMobile: true,
  },
  {
    id: 'plan-lo',
    label: 'Plan LO',
    href: PLAN_LO_URL,
    description: 'Aktualny plan zajęć',
    icon: 'calendar',
    external: true,
    hideMobile: true,
  },
  {
    id: 'bip',
    label: 'BIP',
    href: 'https://zseiu.bip.gov.pl/',
    ariaLabel: 'BIP (otwiera się w nowej karcie)',
    external: true,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/zseiu',
    ariaLabel: 'Facebook ZSEiU (otwiera się w nowej karcie)',
    external: true,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/zseiu_laziska/',
    ariaLabel: 'Instagram ZSEiU (otwiera się w nowej karcie)',
    external: true,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/zespół-szkół-energetycznych-i-usługowych-w-łaziskach-górnych',
    ariaLabel: 'LinkedIn ZSEiU (otwiera się w nowej karcie)',
    external: true,
  },
];

export function externalLink(id: string): ExternalLink {
  const link = externalLinks.find((candidate) => candidate.id === id);
  if (!link) throw new Error(`Brak linku zewnętrznego „${id}” w katalogu Tras`);
  return link;
}

// Kolejność grup stopki jest znacząca: wyznacza kolejność linków w adapterze.
export const footerGroups = {
  oferta: [
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
  ],
  spolecznosc: [
    '/kalendarz',
    '/podreczniki',
    '/praktyki-zawodowe',
    '/pracownicy-mlodociani',
    '/egzaminy-zawodowe',
    '/rekrutacja',
  ],
  prawne: ['/dostepnosc', '/rodo', '/dokumenty'],
} as const satisfies Record<string, readonly string[]>;

export const trasy: Trasa[] = [
  defineTrasa({ path: '/', label: 'Strona główna' }),

  defineTrasa({
    path: '/informacje',
    label: 'Informacje o szkole',
    description: 'Dane szkoły i podstawowe informacje',
    section: 'o-szkole',
    navGroup: 'Szkoła',
    icon: 'info',
  }),
  defineTrasa({
    path: '/historia',
    label: 'Historia',
    description: 'Dzieje ZSEiU w Łaziskach Górnych',
    section: 'o-szkole',
    navGroup: 'Szkoła',
    icon: 'clock',
  }),
  defineTrasa({
    path: '/kierunki',
    label: 'Kierunki kształcenia',
    description: 'Przegląd zawodów i profili',
    section: 'o-szkole',
    // W menu Trasa należy do „O szkole”, ale jej dotychczasowy breadcrumb prowadził do „Oferta”.
    breadcrumbParent: { href: '/kierunki/', label: 'Oferta' },
    navGroup: 'Szkoła',
    icon: 'graduation',
    aliases: ['/kierunki-ksztalcenia'],
  }),
  defineTrasa({
    path: '/blog',
    label: 'Blog',
    navLabel: 'Aktualności',
    searchTitle: 'Aktualności',
    description: 'Wydarzenia i informacje ze szkoły',
    section: 'projekty',
    navGroup: 'Szkoła',
    icon: 'news',
  }),
  defineTrasa({
    path: '/dostepnosc',
    label: 'Dostępność',
    footerLabel: 'Deklaracja dostępności',
    description: 'Deklaracja dostępności',
    section: 'o-szkole',
    navGroup: 'Szkoła',
    icon: 'access',
  }),
  defineTrasa({
    path: '/dyrekcja',
    label: 'Dyrekcja i kierownictwo',
    description: 'Osoby zarządzające szkołą',
    section: 'o-szkole',
    navGroup: 'Ludzie',
    icon: 'people',
  }),
  defineTrasa({
    path: '/grono-pedagogiczne',
    label: 'Grono pedagogiczne',
    description: 'Nauczyciele i specjaliści',
    section: 'o-szkole',
    navGroup: 'Ludzie',
    icon: 'graduation',
  }),
  defineTrasa({
    path: '/klienci-i-partnerzy',
    label: 'Klienci i partnerzy',
    section: 'o-szkole',
    icon: 'briefcase',
  }),
  defineTrasa({
    path: '/pracownie',
    label: 'Pracownie',
    section: 'o-szkole',
    icon: 'info',
  }),

  defineTrasa({
    path: '/rekrutacja',
    label: 'Rekrutacja',
    footerLabel: 'Rekrutacja 2026/2027',
    description: 'Terminy, zasady naboru i najważniejsze dokumenty',
    section: 'oferta',
    navGroup: 'Kierunki',
    icon: 'check',
  }),
  defineTrasa({
    path: '/lo-dla-doroslych',
    label: 'LO dla Dorosłych',
    description: 'Nauka w systemie zaocznym',
    section: 'oferta',
    navGroup: 'Kierunki',
    icon: 'book',
  }),
  defineTrasa({
    path: '/wielozawodowa',
    label: 'Klasa wielozawodowa',
    footerLabel: 'Klasa wielozawodowa (BS I)',
    description: 'Branżowa Szkoła I stopnia – nauka z wynagrodzeniem',
    section: 'oferta',
    navGroup: 'Kierunki',
    icon: 'clipboard',
  }),
  defineTrasa({
    path: '/opw',
    label: 'Oddział Przygotowania Wojskowego',
    footerLabel: 'Oddziały Przygotowania Wojskowego - OPW',
    description: 'Programy o profilu mundurowym',
    section: 'oferta',
    navGroup: 'Profile',
    icon: 'info',
  }),
  defineTrasa({
    path: '/opm',
    label: 'Oddział Przygotowania Mundurowego',
    footerLabel: 'Oddziały Przygotowania Mundurowego - OPM',
    description: 'Policja i Straż Graniczna',
    section: 'oferta',
    navGroup: 'Profile',
    icon: 'info',
  }),
  defineTrasa({
    path: '/technik-elektryk',
    label: 'Technik elektryk',
    description: 'Instalacje, OZE, automatyka domowa i sterowniki PLC',
    section: 'oferta',
    navGroup: 'Profile',
    icon: 'spark',
  }),
  defineTrasa({
    path: '/technik-informatyk',
    label: 'Technik informatyk',
    description: 'Programowanie, sieci i cyberbezpieczeństwo',
    section: 'oferta',
    navGroup: 'Profile',
    icon: 'terminal',
  }),
  defineTrasa({
    path: '/technik-logistyk',
    label: 'Technik logistyk',
    footerLabel: 'Technik logistyk (Mundurowy)',
    description: 'Transport, magazyny, spedycja i systemy ERP',
    section: 'oferta',
    navGroup: 'Profile',
    icon: 'globe',
  }),
  defineTrasa({
    path: '/technik-organizacji-turystyki',
    label: 'Technik organizacji turystyki',
    description: 'Pilotowanie, biura podróży, języki obce',
    section: 'oferta',
    navGroup: 'Profile',
    icon: 'globe',
  }),
  defineTrasa({
    path: '/technik-urzadzen-i-systemow-energetyki-odnawialnej',
    label: 'Technik urządzeń i systemów energetyki odnawialnej',
    navLabel: 'Technik urządzeń OZE',
    footerLabel: 'Technik urządzeń OZE',
    searchTitle: 'Technik urządzeń OZE',
    description: 'Fotowoltaika, pompy ciepła, magazyny energii',
    section: 'oferta',
    navGroup: 'Profile',
    icon: 'spark',
  }),
  defineTrasa({
    path: '/technik-stylista',
    label: 'Technik stylista',
    description: 'Projektowanie mody, stylizacja, wizaż i marketing',
    section: 'oferta',
    navGroup: 'Profile',
    icon: 'book',
  }),
  defineTrasa({
    path: '/klasy-mundurowe',
    label: 'Klasy mundurowe',
    section: 'oferta',
    icon: 'shield',
  }),
  defineTrasa({
    path: '/klasa-policyjna',
    label: 'Klasa policyjna',
    section: 'oferta',
    icon: 'badge',
  }),

  defineTrasa({
    path: '/dla-uczniow',
    label: 'Dla uczniów',
    description: 'Informacje i zasoby dla uczniów',
    section: 'uczniowie-i-rodzice',
    navGroup: 'Na co dzień',
    icon: 'graduation',
  }),
  defineTrasa({
    path: '/dla-rodzicow',
    label: 'Dla rodziców',
    description: 'Komunikaty dla opiekunów',
    section: 'uczniowie-i-rodzice',
    navGroup: 'Na co dzień',
    icon: 'people',
  }),
  defineTrasa({
    path: '/praktyki-zawodowe',
    label: 'Praktyki zawodowe',
    description: 'Informacje i dokumenty praktyk',
    section: 'uczniowie-i-rodzice',
    navGroup: 'Na co dzień',
    icon: 'briefcase',
  }),
  defineTrasa({
    path: '/pracownicy-mlodociani',
    label: 'Pracownicy młodociani',
    description: 'Turnusy dokształcania teoretycznego',
    section: 'uczniowie-i-rodzice',
    navGroup: 'Na co dzień',
    icon: 'briefcase',
  }),
  defineTrasa({
    path: '/plan-lekcji',
    label: 'Plan lekcji',
    section: 'uczniowie-i-rodzice',
    icon: 'calendar',
  }),
  defineTrasa({
    path: '/kalendarz',
    label: 'Kalendarz',
    footerLabel: 'Kalendarz szkolny',
    description: 'Rok szkolny i ważne terminy',
    section: 'uczniowie-i-rodzice',
    navGroup: 'Na co dzień',
    icon: 'calendar-days',
  }),
  defineTrasa({
    path: '/podreczniki',
    label: 'Podręczniki',
    description: 'Wykazy podręczników',
    section: 'uczniowie-i-rodzice',
    navGroup: 'Dokumenty',
    icon: 'book',
  }),
  defineTrasa({
    path: '/dokumenty',
    label: 'Dokumenty szkolne',
    footerLabel: 'Statuty i Regulaminy',
    description: 'Statuty, regulaminy, procedury i formularze',
    section: 'uczniowie-i-rodzice',
    navGroup: 'Dokumenty',
    icon: 'file',
  }),
  defineTrasa({
    path: '/rodo',
    label: 'RODO',
    footerLabel: 'RODO & Prywatność',
    description: 'Ochrona danych osobowych',
    section: 'uczniowie-i-rodzice',
    navGroup: 'Dokumenty',
    icon: 'shield',
  }),
  defineTrasa({
    path: '/egzaminy-zawodowe',
    label: 'Egzaminy zawodowe',
    description: 'Kwalifikacje i informacje egzaminacyjne',
    section: 'uczniowie-i-rodzice',
    navGroup: 'Dokumenty',
    icon: 'award',
  }),
  defineTrasa({
    path: '/plan-zajec-lo',
    label: 'Plan zajęć LO',
    section: 'uczniowie-i-rodzice',
    icon: 'calendar',
  }),
  defineTrasa({
    path: '/dzwonki',
    label: 'Dzwonki',
    section: 'uczniowie-i-rodzice',
    icon: 'clock',
  }),

  defineTrasa({
    path: '/projekty',
    label: 'Projekty',
    description: 'Inicjatywy edukacyjne i społeczne',
    section: 'projekty',
    navGroup: 'Aktywności',
    icon: 'spark',
  }),
  defineTrasa({
    path: '/erasmus',
    label: 'Erasmus+',
    description: 'Program Unii Europejskiej – praktyki zagraniczne',
    section: 'projekty',
    navGroup: 'Aktywności',
    icon: 'globe',
  }),
  defineTrasa({
    path: '/erasmus-grecja',
    label: 'Erasmus+ Grecja',
    description: '„Pod stokami Olimpu” – Nei Pori',
    section: 'projekty',
    navGroup: 'Aktywności',
    icon: 'globe',
  }),
  defineTrasa({
    path: '/erasmus-sycylia',
    label: 'Erasmus+ Sycylia',
    description: '„U podnóża Etny” – Katania',
    section: 'projekty',
    navGroup: 'Aktywności',
    icon: 'globe',
  }),
  defineTrasa({
    path: '/zawodowy-mikolowski',
    label: 'Zawodowy Mikołowski',
    description: 'Projekt unijny – edukacja zawodowa w transformacji',
    section: 'projekty',
    navGroup: 'Aktywności',
    icon: 'spark',
  }),
  defineTrasa({
    path: '/profesjonalny-mikolowski',
    label: 'Profesjonalny Mikołowski',
    description: 'Program Staży Uczniowskich 2024–2029',
    section: 'projekty',
    navGroup: 'Aktywności',
    icon: 'spark',
  }),
  defineTrasa({
    path: '/narodowy-program-rozwoju-czytelnictwa',
    label: 'Narodowy Program Rozwoju Czytelnictwa',
    description: 'Wsparcie dla biblioteki szkolnej',
    section: 'projekty',
    navGroup: 'Aktywności',
    icon: 'book',
  }),

  defineTrasa({ path: '/kontakt', label: 'Kontakt', icon: 'info' }),
];

// Konfiguracja Astro konsumuje tę mapę; aliasy pozostają faktem Trasy, nie osobną listą.
export const redirects: Record<string, string> = Object.fromEntries(
  trasy.flatMap((trasa) => (trasa.aliases ?? []).map((alias) => [alias, trasa.path])),
);

function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/';
}

export function findTrasa(pathname: string): Trasa | undefined {
  const path = normalizePath(pathname);
  return trasy.find((trasa) => trasa.path === path || trasa.aliases?.includes(path));
}

const quickExternalIds = ['edziennik', 'plan-lekcji', 'plan-lo'] as const;
const quickTrasaPath = '/dzwonki';

export function quickAccessLinks(): QuickAccessLink[] {
  const links = quickExternalIds.map((id): QuickAccessLink => {
    const link = externalLink(id);
    return { ...link, external: link.external ?? true, source: 'external' };
  });

  const dzwonki = findTrasa(quickTrasaPath);
  if (!dzwonki) throw new Error(`Brak Trasy „${quickTrasaPath}” w katalogu Tras`);
  links.push({
    id: 'dzwonki',
    label: dzwonki.label,
    href: dzwonki.path,
    icon: dzwonki.icon,
    external: false,
    hideMobile: true,
    source: 'trasa',
  });

  return links;
}

// Wpisy bloga i nieznane ścieżki nie są Trasami — wtedy czyścimy sufiks szkoły z tytułu strony.
export function resolveSearchTitle(pathname: string, fallbackTitle: string): string {
  const trasa = findTrasa(pathname);
  if (trasa) return trasa.searchTitle;

  const title = fallbackTitle.replace(/\s*[-|–]\s*ZSEiU.*$/i, '').trim();
  return title || fallbackTitle;
}

export function buildCrumbs(pathname: string, postTitle?: string): Crumb[] {
  const rawPath = pathname || '/';
  const path = normalizePath(rawPath);

  if (path === '/') return [];

  const crumbs: Crumb[] = [{ href: '/', label: 'Strona główna' }];

  // Wpisy bloga mają własną ścieżkę: Aktualności → tytuł wpisu, bez sekcji.
  if (path.startsWith('/blog/')) {
    const blog = findTrasa('/blog');
    crumbs.push({
      href: '/blog/',
      label: blog?.navLabel ?? blog?.label ?? 'Aktualności',
    });
    if (postTitle) {
      crumbs.push({ href: rawPath, label: postTitle });
    }
    return crumbs;
  }

  const trasa = findTrasa(path);

  if (trasa?.breadcrumbParent) {
    crumbs.push(trasa.breadcrumbParent);
  } else if (trasa?.section) {
    const section = sections.find((candidate) => candidate.id === trasa.section);
    if (section) {
      crumbs.push({ href: section.href, label: section.title });
    }
  }

  if (trasa) {
    crumbs.push({ href: trasa.path, label: trasa.label });
  }

  return crumbs;
}
