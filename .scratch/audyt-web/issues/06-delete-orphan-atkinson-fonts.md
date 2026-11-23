# 06 — Usunięcie osieroconych czcionek Atkinson

Status: open
Type: task
Priority: P4 (higiena repozytorium)
Blocked by: —
Źródło: raport §4.2

## Problem (zweryfikowane)

W `src/assets/fonts/` leżą dwa pliki pozostałe po szablonie bloga Astro:

- `atkinson-bold.woff`
- `atkinson-regular.woff`

Projekt ładuje **Inter** i **Montserrat** przez `fontProviders.google()`
(`astro.config.mjs:41-60`, `<Font cssVariable="--font-body|--font-display" preload />`
w `BaseHead.astro:54-55`). Atkinson nie jest nigdzie deklarowany w `@font-face`
ani w `--font-*`.

## Zakres

1. Potwierdzić grepem brak odniesień (`atkinson`, `Atkinson`) w `src/`, `public/`,
   `astro.config.mjs`, `keystatic.config.ts`.
2. Usunąć oba pliki `.woff`.
3. Jeśli katalog `src/assets/fonts/` zostanie pusty — usunąć katalog.

## Kryteria akceptacji

- [ ] Oba pliki usunięte, brak odniesień w kodzie.
- [ ] `npm run build` przechodzi; w `dist/` nie ma plików Atkinson.
- [ ] Wizualnie bez zmian: nagłówki nadal Montserrat, tekst Inter (sprawdzić
      `font-family` w DevTools na `/` i dowolnej podstronie).
- [ ] `npm run check` przechodzi.

## Uwagi

Elementy `public/elo/stary.js` i inne artefaktu legacy nie są objęte tym ticketem.

## Comments