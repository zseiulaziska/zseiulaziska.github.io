// Ścieżki grafik szybkiego dostępu pozostają w adapterze — katalog Tras
// przechowuje tylko nazwy ikon i adresy linków.

const book = '<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>';
const calendar = '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>';
const calendarDays = '<path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>';
const bell = '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>';

// Klucze to identyfikatory linków z quickAccessLinks(), nie nazwy ikon
// z katalogu Tras — adaptery szybkiego dostępu wybierają ikonę po id.
export const quickAccessIconPaths = {
  edziennik: `${book}<path d="M8 7h8M8 11h6"/>`,
  'plan-lekcji': `${calendar}${calendarDays}`,
  'plan-lo': `${calendar}${calendarDays}`,
  dzwonki: bell,
} as const;
