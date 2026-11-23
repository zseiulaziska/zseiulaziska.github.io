# 21 — [Backlog opcjonalny] Natywny scrollspy (`scroll-target-group`) z fallbackiem IO

Status: open
Type: task
Priority: P5 (backlog, nie wprost w raporcie)
Blocked by: —
Źródło: `spec.md` §4.4 i „Dodatkowa okazja"

## Problem (zweryfikowane)

Dwa miejsca korzystają (lub powinny korzystać) z aktywnego stanu spisu treści:

1. `public/elo/index.html:552` — `scrollObserver = new IntersectionObserver(...)`
   (klasyczny JS scrollspy).
2. `src/pages/informacje.astro:295` — `<nav aria-label="Spis treści" class="sticky top-24 ...">`
   **bez jakiegokolwiek JS scrollspy** — brak stanu aktywnej sekcji.

Wytyczna nowoczesnej platformy (wg `spec.md`) zaleca spróbować natywnego
`scroll-target-group: auto` + `:target-current` (Chrome/Edge 140+), z
IntersectionObserver jako fallbackiem dla starszych przeglądarek.

## Zakres

1. Sprawdzić wsparcie `scroll-target-group` w obecnych przeglądarkach
   (baseline status) — jeśli nie jest jeszcze wystarczające, **nie wdrażać**
   samego natywnego rozwiązania bez fallbacku.
2. Dodać `scroll-target-group: auto` do kontenerów list linków
   (`informacje.astro:295`, odpowiednik w `elo/index.html`).
3. Dodać style `a:target-current { ... }` z widocznym wyróżnieniem
   (kontrast w trybie wysokim!).
4. Zachować/ dodać IntersectionObserver jako fallback wykrywany przez
   `@supports not (scroll-target-group: auto)` albo feature-detection w JS.
5. `aria-current="location"` na aktywnym linku dla czytników ekranu.

## Kryteria akceptacji

- [ ] Na `/informacje` aktywny punkt spisu treści podąża za przewijaniem
      w Chrome (natywnie) i w przeglądarce bez wsparcia (fallback).
- [ ] `aria-current` ustawiany w obu ścieżkach.
- [ ] W trybie wysokiego kontrastu aktywny link nadal odróżnia się od reszty.
- [ ] Brak regresji w `public/elo/` (tam już działa IO — najpierw upewnić się,
      że nowy mechanizm go nie psuje; w razie wątpliwości zostawić `elo` bez zmian).
- [ ] `npm run check`, `npm test`, `npm run build` przechodzą.

## Ryzyka

Natywna właściwość ma ograniczone wsparcie i inną semantykę `:target-current`
niż klasy JS. To najbardziej „eksperymentalny" ticket z całego zestawu —
można go bezpiecznie odłożyć poza ten audyt.

## Comments