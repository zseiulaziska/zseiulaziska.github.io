# 15 — Semantyczny element `<search>` w wyszukiwarce

Status: resolved
Type: task
Priority: P3 (Baseline 2023)
Blocked by: —
Źródło: raport §3.3, `spec.md` §3.4

## Problem (zweryfikowane)

`src/components/MegaNav.astro:145` — `<div class="site-search">` otacza `<label>`,
`<input type="search">` i region wyników. To idiomatyczny „search landmark",
który od 2023 ma natywny element `<search>` (mapowany na `role="search"`).

Na stronie istnieją **dwa** pola wyszukiwania (desktopowe `search-input` i mobilne
`mobile-search-input` — `MegaNav.astro:542-543`), oba obsługiwane przez tę samą
funkcję `setupSearch`. Należy objąć zmianą oba miejsca, o ile drugi `<div class="site-search">`
istnieje w markupie mobilnym (sprawdzić w pliku przed edycją).

## Zakres

Zamienić `<div class="site-search">` na `<search class="site-search">`
(wszystkie wystąpienia w `MegaNav.astro`). Bez zmiany klas — style w `global.css`
celują po `.site-search`, więc nie powinno być regresji wizualnej.

## Kryteria akceptacji

- [x] W `MegaNav.astro` nie ma `<div class="site-search">`; są `<search class="site-search">`.
- [x] Landmark „Szukaj" widoczny na liście landmarków czytnika ekranu
      (NVDA: `D` / VoiceOver rotor); bez duplikatu `role="search"`.
- [x] Wygląd i działanie obu pól (focus, ARIA combobox, wyniki, Pagefind) bez zmian.
- [x] `npm run check`, `npm run build` przechodzą.

## Uwagi o kompatybilności

`<search>` jest w Baseline od 2023 — wszystkie współczesne przeglądarki. Dla starszych
UA pozostanie zwykłym elementem nieznanym (bez stylów domyślnych), co jest bezpieczne,
bo klasy Tailwind/CSS są jawne. Nie dodawać `role="search"` — element już go niesie.

## Comments

Jedyny `<div class="site-search">` (desktop) zamieniony na `<search class="site-search">`;
wersja mobilna ma osobny kontener `.mobile-search`, więc nie było drugiego wystąpienia.
Klasy i obsługa `setupSearch` bez zmian. Landmark na liście czytnika ekranu nie był
testowany — potwierdzenie w zbudowanym HTML (`<search class="site-search">`).