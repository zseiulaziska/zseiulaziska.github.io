# Mapa: wdrożenie audytu Modern Web Guidance

Effort: `audyt-web`
Źródło: `RAPORT_MODERN_WEB_GUIDANCE.md` (2026-11-23) + `.scratch/audyt-web/spec.md`
Tickety: `.scratch/audyt-web/issues/NN-<slug>.md`

## Notes

Każdy ticket został **zweryfikowany w kodzie** przed utworzeniem (numery linii potwierdzone
stanem repo z 2026-11-23). Trzy ustalenia raportu okazały się nieścisłe — patrz
„Decisions-so-far”. Zakres ticketów pokrywa 100% punktów raportu (1.1–4.5) oraz punkty
z `spec.md`, których raport nie powtórzył (wideo, scrollspy).

Kolejność realizacji = kolejność numeracji. Numery 01–04 to bezpieczeństwo, 05–06 martwy
kod, 07–12 dostępność, 13–16 standardy platformy, 17–19 wydajność/RWD, 20 strażnik
regresji, 21–22 backlog opcjonalny.

Środowisko: `node_modules` **nie jest zainstalowane**. Przed walidacją (`npm run check`,
`npm test`, `npm run build`) wymagane `npm install`.

## Decisions-so-far

- **Korekta 4.3 (Hero LCP) — fałszywy alarm.** Raport twierdzi, że `priority` to konwencja
  Next.js i nie działa w Astro `<Picture>`. To nieprawda: `priority` jest natywnym propem
  Astro od **5.10.0** i ustawia na wewnętrznym `<img>` dokładnie `loading="eager"`,
  `decoding="sync"`, `fetchpriority="high"`. Projekt używa Astro 7. `Hero.astro:16` jest
  poprawny → ticket **18** to wyłącznie weryfikacja w buildzie, nie zmiana kodu.
  → `issues/18-hero-lcp-verification.md`
- **Korekta 3.4 (color-scheme) — zakres mniejszy niż w raporcie.** Deklaracje CSS już
  istnieją: `global.css:494` (`html { color-scheme: light }`), `:516` (`html.dark`),
  `:520` (`html.high-contrast`). Brakuje **tylko** `<meta name="color-scheme">` w
  `BaseHead.astro`. Nie dodawać `color-scheme: light dark` na `:root` — projekt steruje
  motywem klasą `.dark` z `localStorage`, a `light dark` oddałby kontrolę systemowi.
  → `issues/16-color-scheme-meta-tag.md`
- **Korekta 1.1 (nagłówki) — `_headers` to nie pełne rozwiązanie.** Projekt deployuje się
  dwoma kanałami: `wrangler deploy` (Workers + static assets) oraz
  `.github/workflows/deploy.yml` → **GitHub Pages**. `_headers` działa dla statycznych
  assetów Workers, ale (a) **nie** dla odpowiedzi generowanych przez Worker (SSR, np.
  admin Keystatic) i (b) jest **całkowicie ignorowany** przez GitHub Pages. Dlatego
  nagłówki rozdzielone na ticket 01 (wdrożenie + CSP Report-Only) i 02 (egzekwowanie +
  parytet GH Pages).
- **CSP z raportu wymaga korekty dyrektyw.** `font-src`/`style-src` dla
  `fonts.googleapis.com`/`fonts.gstatic.com` są zbędne — Astro `fontProviders.google()`
  (`astro.config.mjs:41-60`) **self-hostuje** pliki czcionek w buildzie. Za to konieczne
  jest `script-src 'unsafe-inline'` (5 skryptów `is:inline`, m.in. anty-FOUC motyw
  w `Layout.astro:35`) oraz `frame-src` dla Google Maps (`kontakt.astro:194`)
  i `https://zseiulaziska.github.io` (`plan-lekcji.astro:19`).
- **`escapeHtml(item.excerpt)` wprost zepsuje podświetlanie.** Pagefind zwraca `excerpt`
  z celowym `<mark>`. Naiwne escapowanie (jak w raporcie 1.3) usunie wyróżnienie frazy.
  Ticket 04 wymaga sanityzacji z allowlistą `<mark>`.
- **`public/sw.js` i `public/manifest.json` są bit-identyczne z kopiami w `public/elo/`**
  (porównanie hashy). Nie ma żadnego odwołania do wersji z katalogu głównego → ticket 19
  to usunięcie duplikatów, nie „przenoszenie”.
- **Reduced motion: dziura jest realna, ale inna niż opisana.** `global.css:544-551`
  wyłącza tylko `transition`. Reguła `.reveal { opacity: 0 }` jest **niżej** (553) i nie
  jest nadpisywana — przy `prefers-reduced-motion` treść nadal zależy od JS. Guard nie
  obejmuje też `animation`/`scroll-behavior: smooth` (`global.css:495`).

## Fog / otwarte pytania

- Czy podprojekt `public/elo/` jest jeszcze utrzymywany, czy to zamrożony artefakt?
  Wpływa na zakres ticketów 14 i 19 (dotykać legacy czy tylko usunąć duplikaty).

## Rozstrzygnięte (ticket 02, 2026-11-23)

- **Kanał produkcyjny:** Cloudflare buduje i hostuje `zseiulaziska.pl` (commity na GitHub → Cloudflare). GH Pages to mirror/preview bez gwarancji parytetu nagłówków. Decyzja w `docs/adr/0002-deployment-channel-and-security-headers.md`.
- **HSTS preload:** odłożony (brak `preload`, decyzja świadoma po audycie subdomen).
- **CSP:** przełączona z Report-Only na egzekwowanie po przeglądzie konsoli na liście podstron z ticketu 01 (Playwright/Chromium, brak naruszeń).