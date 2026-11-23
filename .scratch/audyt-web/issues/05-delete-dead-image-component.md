# 05 — Usunięcie martwego komponentu `src/components/Image.astro`

Status: claimed
Type: task
Priority: P4 (higiena; raport oznacza 🔴, ale ryzyko = 0)
Blocked by: —
Źródło: raport §4.1, `spec.md` §3.1

## Problem (zweryfikowane)

`src/components/Image.astro` (16 linii) nie jest importowany **nigdzie** —
grep po `*.astro|*.ts|*.tsx|*.mdx` w `src/` dla `components/Image`, `import Image`,
`from ... Image.astro` → **0 wyników**. Komponenty używają `astro:assets`
(`Image`/`Picture`) bezpośrednio.

Dodatkowo plik jest wadliwy, więc pozostawienie go to pułapka dla przyszłego autora:

- `srcset={`${src} 1200w, ${src} 800w, ${src} 400w`}` — ten sam plik pod trzema
  deskryptorami (bez realnego skalowania, przeglądarka pobiera pełny obraz tak czy tak);
- sztywne `width="1200" height="800"` niezależnie od rzeczywistych proporcji → CLS;
- brak `decoding`, brak wsparcia AVIF/WebP.

## Zakres

Usunąć plik `src/components/Image.astro`. **Nie naprawiać** — dublowałby
`astro:assets`.

## Kryteria akceptacji

- [x] Plik usunięty.
- [x] Ponowny grep po całym repo (łącznie z `public/`, `docs/`, `.scratch/`) nie znajduje
      nieaktualnych odniesień do tego komponentu; zaktualizowane wzmianki w raportach/spec/issue 20.
- [ ] `npm run check` bez błędów (brak wiszących importów/typów).
- [ ] `npm run build` przechodzi.
- [x] `npm test` przechodzi.

## Comments

- 2026-11-23: Usunięto `src/components/Image.astro` (potwierdzony brak importów w `src/`). Zaktualizowano odniesienia w `RAPORT_MODERN_WEB_GUIDANCE.md`, `.scratch/audyt-web/RAPORT_MODERN_WEB_GUIDANCE.md`, `.scratch/audyt-web/spec.md`, `.scratch/audyt-web/issues/20-regression-guards-audit-scan.md`.
- Weryfikacja: `npm test` ✅ (3 pliki, 17 testów). `npm run check` ❌ kończy się błędami pre-existing (24 błędy w istniejących plikach, brak związku z `Image.astro`). `npm run build` ❌ kończy się pre-existing błędem `[UNRESOLVED_IMPORT] /pagefind/pagefind.js` z `src/components/MegaNav.astro:331` (potwierdzone `git blame`, poza zakresem ticketu).