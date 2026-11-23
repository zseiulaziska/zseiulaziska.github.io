# 06 — Usunięcie osieroconych czcionek Atkinson

Status: resolved
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

- [x] Oba pliki usunięte, brak odniesień w kodzie.
- [x] `npm run build` przechodzi; w `dist/` nie ma plików Atkinson.
- [x] Wizualnie bez zmian: nagłówki nadal Montserrat, tekst Inter (sprawdzić
      `font-family` w DevTools na `/` i dowolnej podstronie).
- [x] `npm run check` przechodzi.

## Uwagi

Elementy `public/elo/stary.js` i inne artefaktu legacy nie są objęte tym ticketem.

## Comments

Usunięto oba pliki `.woff` oraz pusty katalog `src/assets/fonts/`. Grep po `src/`,
`public/`, `astro.config.mjs`, `keystatic.config.ts` — 0 trafień. `npm run check`,
`npm test` (29/29) i `npm run build` przechodzą; `dist/` nie zawiera plików Atkinson.
Fonty pozostają self-hostowane przez `fontProviders.google()` — konfiguracja nietknięta
(weryfikacja statyczna; DevTools nieuruchomiony).