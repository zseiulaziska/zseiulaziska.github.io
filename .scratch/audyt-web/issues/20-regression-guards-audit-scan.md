# 20 — Strażnik regresji: automatyczny skan wzorców z audytu

Status: open
Type: task
Priority: P2 (zapobieganie nawrotom)
Blocked by: 03, 04, 05, 07, 08, 09, 13, 14
Źródło: wniosek z wdrożenia raportu (nie punkt raportu)

## Problem

Wszystkie usterki z audytu to wzorce, które łatwo wrócą przy kolejnej zmianie:
nowy `target="_blank"` bez `rel`, nowy `innerHTML = ''`, nowy statyczny
`cursor-pointer`, `[...arr].sort()`. Repozytorium ma już `npm test` (vitest)
uruchamiany w CI (`.github/workflows/deploy.yml:33-34`), więc najtaniej
dołożyć testy asercyjne zamiast polegać na pamięci.

Uwaga: `src/routes.test.ts` już istnieje — wzorzec testów jest ustawiony.

## Zakres

Dodać `src/audit.test.ts` (albo `scripts/audit-patterns.mjs` + test owijający),
który czyta pliki źródłowe i asertywnie sprawdza:

| Wzorzec | Oczekiwanie | Lokalizacja |
|---|---|---|
| `target="_blank"` bez `rel="noopener` w tym samym tagu | 0 | `src/**/*.astro` |
| `innerHTML = ''` / `innerHTML=""` | 0 | `src/**`, `public/elo/index.html` |
| `[...\w+].sort(` | 0 | `src/**` |
| `cursor-pointer` na `<div` bez linku/handlera | 0 (allowlista dla znanych wyjątków) | `src/pages/index.astro`, `historia.astro`, `TimelineEvent.astro` |
| `tabindex="0"` na `role="article"` | 0 | `src/**` |
| `role="tablist"`/`role="tab"` bez obsługi `keydown` | 0 | `src/**/*.astro` |
| `item.excerpt` w `innerHTML` | 0 | `MegaNav.astro` |
| martwy komponent `Image.astro` (usunięty #05), `atkinson-*.woff`, `public/sw.js`, `public/manifest.json` | nie istnieją | FS |
| `public/_headers` | istnieje i zawiera `Content-Security-Policy` | FS |
| `<meta name="color-scheme"` | istnieje w `BaseHead.astro` | FS |

Implementacja: `fs.readFileSync` + `globSync` z `node:fs`/`tinyglobby` (jeśli
dostępne) albo jawna lista katalogów — bez dodawania nowych zależności.
Komunikat o błędzie musi zawierać `ścieżka:linia`, żeby test był użyteczny.

## Kryteria akceptacji

- [ ] `npm test` przechodzi po wdrożeniu ticketów 01–19.
- [ ] Celowe wprowadzenie każdego z 10 wzorców do kopii pliku w teście
      powoduje czerwony test (test testu) — wystarczy jeden przypadek
      dla wybranego wzorca jako dowód, że asercje nie są martwe.
- [ ] Test nie błędnie oznacza poprawnych przypadków: `<a class="cursor-pointer">`,
      `<summary class="cursor-pointer">`, `listbox.innerHTML = data.map(...)`.
- [ ] Czas wykonania < 2 s; brak nowych zależności w `package.json`.

## Uwagi

To ticket „po fakcie" — nie blokuje wdrożenia poprawek, ale domyka audyt
i uzasadnia istnienie pozostałych ticketów w CI.

## Comments