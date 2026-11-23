# 12 — Automatyczny tryb wysokiego kontrastu dla `forced-colors` / `prefers-contrast`

Status: open
Type: task
Priority: P2 (WCAG 1.4.11 Non-text Contrast, 1.4.6)
Blocked by: 11
Źródło: raport §2.5 (integracja z systemem)

## Problem (zweryfikowane)

`src/styles/high-contrast.css` opiera się wyłącznie na klasie `html.high-contrast`,
którą ustawia ręcznie przełącznik (`UtilityBar.astro:35-42`, zapis w `localStorage`
pod kluczem `contrast`, odczyt i anti-FOUC w `Layout.astro:35-82`).

W repozytorium **nie ma** żadnej reguły `@media (forced-colors: active)` ani
`@media (prefers-contrast: more)` (grep po `src/styles/` → 0 trafień). Użytkownik
Windows High Contrast Mode / systemowego „większego kontrastu" musi sam odnaleźć
przełącznik na stronie, żeby uzyskać czytelny interfejs.

## Zakres

1. Dodać do `high-contrast.css` (na końcu, żeby nie wymagać duplikowania selektorów)
   media query, które aktywuje te same reguły bez klasy. Najprostszy wzorzec
   (jeśli reguły są już pogrupowane pod `html.high-contrast`) — rozszerzyć selektory:

```css
@media (forced-colors: active), (prefers-contrast: more) {
  /* powtórzyć lub współdzielić reguły z html.high-contrast */
}
```

   Rozważyć użycie `:where()` / listy selektorów, żeby nie kopiować 150 linii CSS.
   Alternatywa: w `Layout.astro:35-82` wykryć `matchMedia('(forced-colors: active)')`
   i dodać klasę `high-contrast` do `<html>` — mniejszy duplikat CSS, ale klasa
   będzie wtedy też zapisywana/odczytywana z `localStorage`, więc trzeba pilnować
   rozróżnienia „preferencja systemu" vs „wybór użytkownika"
   (system ma wygrywać albo przynajmniej nie być nadpisywany).
2. Dodać reguły `forced-color-adjust` tylko tam, gdzie faktycznie potrzebne
   (np. grafiki dekoracyjne, `background-image` w `cyber-grid`).
   **Nie** ustawiać globalnie `forced-color-adjust: none` — zniszczyłoby to
   systemowe kolory.
3. Upewnić się, że fokus z ticketu 11 pozostaje widoczny w `forced-colors`
   (system i tak nadpisuje kolory na `Highlight`/`CanvasText`).
   Użyć `outline: 2px solid Highlight` wewnątrz media query, jeśli żółty
   jest ignorowany.

## Kryteria akceptacji

- [ ] Emulacja `forced-colors: active` w DevTools (Rendering → Emulate CSS media feature)
      daje czytelny interfejs bez ręcznego włączania przełącznika.
- [ ] Emulacja `prefers-contrast: more` daje ten sam efekt (albo udokumentowany,
      celowy odpowiednik).
- [ ] Przełącznik ręczny nadal działa i nie jest zablokowany przez media query
      w przeglądarce bez wsparcia (graceful degradation).
- [ ] `prefers-color-scheme: dark` + forced-colors nie powoduje konfliktu klas.
- [ ] `npm run check`, `npm run build` przechodzą.

## Ryzyka

Największe: duplikacja CSS i kolejność reguł — łatwo o przypadek, w którym
systemowy tryb kontrastu „wyłącza" ręczny i odwrotnie. Wymaga testu macierzy
4 kombinacji (system on/off × przełącznik on/off).

## Comments