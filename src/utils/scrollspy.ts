/**
 * Wspólna logika stanu spisu treści dla natywnego `:target-current`
 * oraz fallbacku opartego na IntersectionObserver.
 */

const TARGET_CURRENT_CLASS = 'target-current';
const CURRENT_LOCATION = 'location';

export interface TocLink {
  getAttribute(name: string): string | null;
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
  classList: { toggle(token: string, force?: boolean): boolean };
}

export interface SectionCandidate {
  id: string;
  isIntersecting: boolean;
  boundingClientRect: { top: number; bottom: number };
}

function fragmentHrefOf(link: TocLink): string | null {
  const href = link.getAttribute('href');
  return href && href.startsWith('#') && href.length > 1 ? href : null;
}

/** Ustawia widoczny stan i aria-current dokładnie na jednym linku (#id sekcji). */
export function syncTocCurrent(links: Iterable<TocLink>, activeTarget: string | null): void {
  for (const link of links) {
    const active = activeTarget !== null && fragmentHrefOf(link) === activeTarget;
    link.classList.toggle(TARGET_CURRENT_CLASS, active);
    if (active) link.setAttribute('aria-current', CURRENT_LOCATION);
    else link.removeAttribute('aria-current');
  }
}

/**
 * Zwraca id sekcji przecinającej linię czytania (środek viewportu).
 * Gdy żadna nie przecina, zwraca null — wywołujący zachowuje poprzedni stan,
 * żeby aktywny punkt nie mrugał w przerwach między sekcjami.
 */
export function pickActiveTarget(candidates: readonly SectionCandidate[]): string | null {
  let best: SectionCandidate | null = null;
  for (const candidate of candidates) {
    if (!candidate.isIntersecting) continue;
    if (best === null || candidate.boundingClientRect.top > best.boundingClientRect.top) {
      best = candidate;
    }
  }
  return best?.id ?? null;
}
