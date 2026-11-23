# 10 — Pełna obsługa `prefers-reduced-motion` (reveal + liczniki + smooth scroll)

Status: open
Type: task
Priority: P2 (WCAG 2.3.3 Animation from Interactions)
Blocked by: —
Źródło: raport §2.4, `spec.md` §2.3

## Problem (zweryfikowane)

### A. `.reveal` pozostaje ukryty przy reduced motion

- `src/styles/global.css:544-551` — media query wyłącza **tylko** `transition: none !important`.
- `src/styles/global.css:553-557` — **poniżej** media query zdefiniowano
  `.reveal { opacity: 0; transform: translateY(1.5rem); transition: ... }`.
- `Layout.astro:95-135` — klasa `.visible` dodawana przez JS/IntersectionObserver;
  `<noscript>` w `Layout.astro:28-33` ma awaryjny `opacity: 1 !important`.

Przy włączonym „ograniczaniu ruchu" i sprawnym JS treść wciąż zależy od animatora
(choć przejście jest wyłączone, `opacity: 0` nadal obowiązuje do momentu dodania
klasy). Reguła powinna **bezwzględnie** ustawiać stan docelowy.

### B. Guard nie obejmuje `animation` i `scroll-behavior`

- `global.css:495` — `html { scroll-behavior: smooth }` nie jest wyłączany.
- Brak `@keyframes`/`animation:` w CSS (potwierdzone: 0 trafień), ale reguła
  `animation: none !important` powinna być dodana profilaktycznie, zgodnie
  z wytyczną.

### C. Liczniki w kalendarzu animują się mimo prefers-reduced-motion

`src/pages/kalendarz.astro:107-140`: `animateValue()` (112-123) inkrementuje liczbę
przez `setInterval(..., 30)`. Brak sprawdzenia `matchMedia`.

## Zakres

1. `global.css` — przenieść/rozszerzyć media query **po** definicjach `.reveal`
   (albo dodać drugi blok na końcu pliku), żeby dzięki kolejności źródeł
   wygrywał stan docelowy:

```css
@media (prefers-reduced-motion: reduce) {
  html, html *, html *::before, html *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .reveal,
  .reveal.visible {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

   Uwaga: zachować `!important` tylko tam, gdzie potrzebne do nadpisania —
   istniejący blok (544) można scalć z nowym, ale **kolejność względem `.reveal`
   jest kluczowa**.

2. `kalendarz.astro` — w `animateValue` dodać na wejściu:

```ts
if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
  el.textContent = String(target);
  return;
}
```

3. Sprawdzić pozostałe liczniki/animacje JS w `src/` (`setInterval`, `requestAnimationFrame`,
   `scrollIntoView({ behavior: 'smooth' })`) — jeśli są, objąć tym samym podejściem
   i wypisać je w `## Comments`.

## Kryteria akceptacji

- [ ] Przy `prefers-reduced-motion: reduce` (emulacja w DevTools → Rendering)
      wszystkie sekcje `.reveal` są widoczne **natychmiast**, bez JS i z JS.
- [ ] Brak animacji przejścia / brak przewijania „gładkiego" przy kliknięciu
      linku „Pomiń do treści" i-linków.
- [ ] Liczniki w `/kalendarz` pokazują wartość końcową od razu przy wejściu
      w widoczny obszar; tryb normalny nadal animuje.
- [ ] `<noscript>` fallback nadal działa.
- [ ] `npm run check`, `npm test`, `npm run build` przechodzą.

## Comments

Zastosowano wariant zgodny z wytycznymi `motion`: stan docelowy `.reveal` w media
query po definicjach klasy oraz `scroll-behavior: auto`; **nie** dodano globalnego
`animation-duration: 0.01ms`. Dodano natomiast `animation: none !important` w tym samym
bloku — w repo istnieją nieskończone animacje CSS (`opm`, `opw`, `pracownie`,
`wielozawodowa`, `technik-*`, `PartnersSection`), więc założenie „0 trafień” z raportu
było błędne.

Liczniki `animateValue()` objęto wczesnym wyjściem w 11 plikach (`kalendarz`,
`lo-dla-doroslych`, `opm`, `opw`, `technik-*`, `wielozawodowa`). Auto-slide galerii
(`setInterval(..., 5000)` w `opm`, `opw` i 6 stronach `technik-*`) również nie startuje
przy reduced motion; pozostaje osobny temat pełnej kontrolki Pause/Play (WCAG 2.2.2).
`requestAnimationFrame` w `MegaNav` obsługuje tylko pozycjonowanie panelu (jednorazowe).