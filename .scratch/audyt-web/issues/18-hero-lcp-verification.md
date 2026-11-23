# 18 — Weryfikacja LCP w `Hero.astro` (punkt raportu 4.3 — fałszywy alarm)

Status: resolved
Type: task
Priority: P4 (weryfikacja, bez zmian kodu)
Blocked by: —
Źródło: raport §4.3 + korekta w `map.md`

## Problem (zweryfikowane — raport się myli)

Raport (i `spec.md` w wersji „LCP wzorcowy") sugeruje sprawdzenie, czy
`<Picture>` generuje `loading="eager"` i `fetchpriority="high"`, bo „sam atrybut
`priority` to konwencja z Next.js".

**To nieprawda.** `priority` jest natywnym propem Astro **od 5.10.0**
(`docs.astro.build/en/reference/modules/astro-assets`), dodawanym do `<Image />`
i `<Picture />`. Ustawia na wewnętrznym `<img>` dokładnie:

```
loading="eager"  decoding="sync"  fetchpriority="high"
```

Projekt używa Astro 7.2.0 (`package.json`), więc `src/components/Hero.astro:8-17`
jest już poprawny:

```astro
<Picture src={heroImage} formats={['avif','webp']} widths={[480,768,960,1200,1600]}
         sizes="100vw" quality={50} alt="..." class="..." priority />
```

Raport dodatkowo twierdzi, że „w `spec.md` oznaczono LCP jako wzorcowy z `priority`"
i próbuje to skorygować — tym razem to raport wprowadza błąd.

## Zakres

Zero zmian w kodzie. Wyłącznie weryfikacja w zbudowanym HTML:

1. `npm install && npm run build`.
2. Odszukać wygenerowany `<picture>` hero w `dist/.../index.html`.
3. Potwierdzić na wewnętrznym `<img>`: `loading="eager"`, `decoding="sync"`,
   `fetchpriority="high"`, `width`/`height`, `srcset` z AVIF/WebP
   (elementy `<source type="image/avif">`, `<source type="image/webp">`).
4. Opcjonalnie: Lighthouse / DevTools Performance → LCP element i jego
   „Priority: High" w zakładce Network.

Jeśli build pokaże brak któregokolwiek atrybutu — **wtedy** dopisać jawnie
`loading="eager" fetchpriority="high"` do `<Picture>` i otworzyć nowy ticket
z wyjaśnieniem, dlaczego `priority` nie zadziałał (np. wersja Astro < 5.10).

## Kryteria akceptacji

- [ ] Wynik weryfikacji (fragment HTML + ewentualny LCP z DevTools) wklejony
      do `## Comments`.
- [ ] Status ticketu zmieniony na `resolved` z adnotacją „bez zmian kodu".
- [ ] `map.md` → Decisions-so-far zawiera już tę korektę (zrobione).

## Comments

Zweryfikowane 2026-11-23 w `dist/client/index.html:163` po `npm run build` (bez zmian kodu):
`<picture><source ... type="image/avif" sizes="100vw"><source ... type="image/webp" sizes="100vw"><img ... loading="eager" decoding="sync" fetchpriority="high" width="1200" height="840" ...></picture>`.
`priority` na `<Picture>` działa zgodnie z dokumentacją Astro 7 — raport był w błędzie. Lighthouse/DevTools nie uruchomione (weryfikacja statyczna HTML).