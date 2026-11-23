# 11 — Widoczny fokus w trybie wysokiego kontrastu (`outline: none`)

Status: open
Type: task
Priority: P2 (WCAG 2.4.7 Focus Visible)
Blocked by: —
Źródło: raport §2.5, `spec.md` §2.2

## Problem (zweryfikowane)

`src/styles/high-contrast.css:103-114`:

```css
html.high-contrast .mega-nav-link:focus-visible,
html.high-contrast .mega-item:focus-visible,
html.high-contrast .mega-highlight:focus-visible,
html.high-contrast .nav-link:focus-visible,
html.high-contrast .search-result-item:focus-visible,
html.high-contrast .search-result-option.is-active .search-result-item,
html.high-contrast .skip-link {
  background: #000 !important;
  color: #ffff00 !important;
  border: 2px solid #ffff00 !important;
  outline: none !important;   /* ← linia 113 */
}
```

Fokus jest obecnie sygnalizowany **zmianą bordera**. To działa w większości przypadków,
ale:

- border może być nadpisany przez bardziej szczegółową regułę innego komponentu
  (`!important` chroni, ale łańcuch selektorów bywa dłuższy);
- na elementach z istniejącym borderem 2px nie ma **odstępu** od treści,
  więc obrys „klei się" do tekstu;
- jawne `outline: none` jest antywzorcem i utrudnia audyt/UT (maskuje fokus,
  jeśli border z jakiegokolwiek powodu nie zadziała).

Uwaga: `high-contrast.css:116-123` dla `.skip-link:focus` ma już poprawny
`outline: 3px solid #ffff0 !important; outline-offset: 2px !important`.
Docelowy wzorzec jest więc w tym samym pliku.

## Zakres

W bloku 103-114 zamiast `outline: none !important`:

```css
outline: 2px solid #ffff00 !important;
outline-offset: 2px !important;
```

Zostawić dotychczasowy `border` (podwajanie obrysu jest akceptowalne i zwiększa
widoczność) albo go usunąć — zdecydować po teście wizualnym i zapisać w `## Comments`.
Weryfikacja w praktyce: przełączyć kontrast (`UtilityBar.astro:35` / `contrast-toggle-bar`)
i przejść `Tab` przez nagłówek, menu, wyszukiwarkę, stopkę.

## Kryteria akceptacji

- [ ] Brak `outline: none !important` w `src/styles/` (sprawdzić też `global.css:85`
      — tam `outline: none` przy `:focus-visible`.**
      Jeśli to dotyczy elementów z własnym `ring`, zostawić i odnotować).
- [ ] W trybie wysokiego kontrastu każdy element z listy selektorów ma wyraźny
      żółty obrys z odstępem 2px po naciśnięciu `Tab`.
- [ ] Brak podwójnego/rozjechanego obrysu na `skip-link` (reguła 116-123 ma pierwszeństwo).
- [ ] Brak regresji w trybie normalnym i ciemnym.
- [ ] `npm run check`, `npm run build` przechodzą.

## Powiązane

Ticket 12 dodaje automatyczne włączanie tego trybu dla systemowych ustawień kontrastu.

## Comments