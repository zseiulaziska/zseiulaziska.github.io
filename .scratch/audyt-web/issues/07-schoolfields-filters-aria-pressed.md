# 07 — Filtry kierunków: `role="tab"` → grupa przycisków `aria-pressed`

Status: resolved
Type: task
Priority: P2 (WCAG 2.1 AA — 4.1.2 Name, Role, Value)
Blocked by: —
Źródło: raport §2.1, `spec.md` §2.1

## Problem (zweryfikowane)

`src/components/SchoolFields.astro`:

- **184**: `<div id="field-filters" role="tablist" aria-label="Filtruj kierunki">`
- **192-194**: każdy przycisk ma `role="tab"`, `aria-selected={i === 0}`,
  `aria-controls="field-groups"`.
- **344-379**: skrypt filtrujący ustawia `aria-selected` (356, 361) i przełącza klasy.
  **Zero `keydown` w całym pliku** — brak `ArrowLeft/ArrowRight`, `Home/End`,
  brak roving tabindex, brak `tabpanel`.

Wzorzec ARIA Tabs jest zadeklarowany, ale nieimplementowany: czytnik ekranu zapowiada
„zakładka 1 z 5, użyj strzałek”, a strzałki nie robią nic. Semantycznie to **panel
filtrów** (przyciski przełączające), nie zestaw zakładek — `aria-controls` wskazuje
jeden wspólny kontener, nie osobne panele.

## Zakres

Wzorzec do naśladowania już istnieje w repo:
`src/components/HarmonogramTurnusow.astro:99-126` (markup) i `:360` (JS).

1. Markup (184-199):
   - usunąć `role="tablist"` z kontenera (zostawić `id`, `aria-label`, klasy `reveal`);
     rozważyć `role="group"` z `aria-label="Filtruj kierunki"`;
   - usunąć `role="tab"` i `aria-selected` z przycisków;
   - dodać `type="button"` i `aria-pressed={i === 0 ? 'true' : 'false'}`;
   - usunąć `aria-controls="field-groups"` (filtr nie jest zakładką);
   - rozważyć `aria-live="polite"` na komunikacie o liczbie widocznych kierunków, jeśli
     taki komunikat istnieje/warto dodać — filtrowanie zmienia treść bez informacji
     dla AT.
2. Skrypt (344-379): zamienić `setAttribute('aria-selected', ...)` na
   `setAttribute('aria-pressed', ...)`; nazwę zmiennej `tabs` przemianować na `filters`
   dla spójności.
3. Sprawdzić selektory w `high-contrast.css` / `global.css` / innych miejscach, czy
   któryś nie celuje w `[role="tab"]` / `[aria-selected]` dla tych filtrów — jeśli tak,
   zaktualizować na `[aria-pressed="true"]`.

## Kryteria akceptacji

- [x] Brak `role="tablist"`/`role="tab"`/`aria-selected` w `SchoolFields.astro`.
- [x] Dokładnie jeden filtr ma `aria-pressed="true"` w dowolnym momencie.
- [x] Klawiatura: `Tab` przechodzi po wszystkich filtrach (naturalna kolejność),
      `Enter` i `Space` aktywują filtr, fokus widoczny (`focus-visible:ring` zachowany).
- [x] Filtrowanie działa identycznie jak wcześniej (grupy z zerem widocznych kierunków
      są ukrywane, `data-filter-field` bez zmian).
- [x] Tryb wysokiego kontrastu: aktywny filtr nadal wyróżniony.
- [x] Test (vitest / Playwright) na zmianę `aria-pressed` po kliknięciu — jeśli
      infrastrukturę testów komponentów trzeba dobudować, odnotować w `## Comments`
      zamiast rozszerzać zakres.
- [x] `npm run check`, `npm test`, `npm run build` przechodzą.

## Comments

Kontener ma `role="group"`, przyciski `type="button"` + `aria-pressed`, skrypt
zamieniony na `aria-pressed` i zmienną `filters`. Brak selektorów celujących w dawne
`role="tab"`/`aria-selected` w CSS. Test komponentowy (klik → `aria-pressed`) nie
został dobudowany — repo ma tylko testy Node (vitest); zamiast tego strażnik
`src/audit.test.ts` (ticket 20) pilnuje braku `role="tablist"`/`role="tab"` w `src/`.
Klawiatura korzysta z natywnej semantyki `<button>` (Tab/Enter/Space); test w czytniku
ekranu pozostaje do wykonania ręcznie.