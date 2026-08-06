# Plan modernizacji strony głównej ZSEiU

Wdrożenie zaleceń z `Dokumentacja/zalecenia.md`. Zatwierdzono 05.08.2026.

## Decyzje

- Docelowa szerokość layoutu: `max-w-screen-2xl` (1536px)
- Nowe sekcje: 1 pełnowymiarowy baner foto (po Kierunkach) + CTA jako ciemny band ze zdjęciem
- Animowane liczniki: vanilla JS (IntersectionObserver + rAF), bez nowych zależności
- SchoolFields: zmiana globalna (wszystkie strony: /, /rekrutacja, /kierunki)

## Kolejność implementacji

1. **Layout.astro** — `<main>`: `max-w-6xl` → `max-w-screen-2xl` (podstrony mają własne kontenery, zmiana bezpieczna)
2. **Hero.astro** — `min-h-[70vh]` → `min-h-[85svh]`; `h1` do `lg:text-7xl` + `text-balance`; kontener wewnętrzny `max-w-7xl`; `py-28 lg:py-40`
3. **SuccessSection.astro** (Dashboard) — kontener `max-w-screen-2xl`, `py-24`, tło `bg-white`; karty `p-8`, liczby `text-5xl font-black`, ikony SVG; animowane liczniki (vanilla JS, `prefers-reduced-motion` → wartość końcowa)
4. **WhyChooseSection.astro** — tło `bg-slate-50`; nagłówek `text-4xl sm:text-5xl`; układ asymetryczny `lg:grid-cols-3`: karta Erasmus `lg:col-span-1 lg:row-span-2` + 5 mniejszych
5. **SchoolFields.astro** (globalnie) — grid `xl:grid-cols-4`, karty `p-5`, ikony `size-14`
6. **PhotoBannerSection.astro** (NOWY) — `h-[55vh] lg:h-[65vh]`, zdjęcie + gradient overlay, hasło + CTA, lazy loading, warianty dark/high-contrast
7. **index.astro** — Kierunki: `max-w-screen-2xl py-24`, nagłówek `text-4xl sm:text-5xl`; Mundurowe: szerszy kontener + typografia; CTA: band `bg-navy-950` ze zdjęciem `333_mundurowi.jpg`, `py-24 lg:py-32`
8. **PartnersSection.astro** — logotypy `max-h-16`, kafelki `h-32`, `px-12`, gap `2rem`, hover `scale-105`, kontener `max-w-screen-2xl`
9. **NewsSection.astro** — grid edytorski: post #1 `lg:col-span-2` (zdjęcie `h-80 lg:h-96`), pozostałe w prawej kolumnie, `lg:auto-rows-fr`, kontener `max-w-screen-2xl`

## Rytm sekcji (nowy)

```
Hero (foto, ciemny)
↓
Dashboard (bg-white)
↓
Dlaczego warto (bg-slate-50)
↓
Kierunki (bg-white)
↓
Baner foto pełnej szerokości
↓
Mundurowe (bg-slate-50)
↓
Partnerzy (bg-navy-950)
↓
Aktualności (bg-white)
↓
CTA (bg-navy-950 + zdjęcie)
```

## Wymagania

- Zero nowych zależności; JS wyłącznie vanilla
- Zachować dark mode i high-contrast w nowych sekcjach
- Lazy loading obrazów, `width`/`height` atrybuty, WebP gdzie istnieje
- `prefers-reduced-motion` w animacjach

## Weryfikacja

- `astro dev --background` — podgląd 1920px, mobile, dark, high-contrast
- `npm run build` (build + scripts/postbuild.cjs)
- Kontrola Lighthouse (bez regresji wydajności)
