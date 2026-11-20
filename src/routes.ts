import { PLAN_LEKCJI_URL, PLAN_LO_URL } from './consts';

export type SectionId = 'o-szkole' | 'oferta' | 'uczniowie-i-rodzice' | 'projekty';

export type Crumb = { href: string; label: string };

export type Section = {
  id: SectionId;
  title: string;
  description: string;
  href: string;
  groups: string[];
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
  icon?: string;
  external?: boolean;
  hideMobile?: boolean;
};

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
    groups: ['Szkoła', 'Ludzie'],
  },
  {
    id: 'oferta',
    title: 'Oferta',
    description: 'Kierunki, klasy i informacje dla kandydatów.',
    href: '/kierunki/',
    groups: ['Kierunki', 'Profile'],
  },
  {
    id: 'uczniowie-i-rodzice',
    title: 'Uczniowie i rodzice',
    description: 'Codzienne sprawy, terminy, plany i dokumenty.',
    href: '/dla-uczniow/',
    groups: ['Na co dzień', 'Dokumenty', 'Liceum dla Dorosłych'],
  },
  {
    id: 'projekty',
    title: 'Projekty',
    description: 'Programy, Erasmus+ i aktualności z życia szkoły.',
    href: '/projekty/',
    groups: ['Aktywności'],
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
    icon: 'calendar',
    external: true,
    hideMobile: true,
  },
  {
    id: 'plan-lo',
    label: 'Plan LO',
    href: PLAN_LO_URL,
    icon: 'calendar',
    external: true,
    hideMobile: true,
  },
  {
    id: 'bip',
    label: 'BIP',
    href: 'https://zseiu.bip.gov.pl/',
    external: true,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/zseiu',
    external: true,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/zseiu_laziska/',
    external: true,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/zespół-szkół-energetycznych-i-usługowych-w-łaziskach-górnych',
    external: true,
  },
];

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

function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/';
}

export function findTrasa(pathname: string): Trasa | undefined {
  const path = normalizePath(pathname);
  return trasy.find((trasa) => trasa.path === path || trasa.aliases?.includes(path));
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
