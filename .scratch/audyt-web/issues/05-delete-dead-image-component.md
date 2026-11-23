# 05 — Usunięcie martwego komponentu `src/components/Image.astro`

Status: open
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

- [ ] Plik usunięty.
- [ ] Ponowny grep po całym repo (łącznie z `public/`, `docs/`, `.scratch/`) nie znajduje
      odniesień do tego komponentu; jeśli znajdzie — zaktualizować.
- [ ] `npm run check` bez błędów (brak wiszących importów/typów).
- [ ] `npm run build` przechodzi.
- [ ] `npm test` przechodzi.

## Comments