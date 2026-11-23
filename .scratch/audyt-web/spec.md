# Spec: Audyt nowoczesny strony (modern-web-guidance)

> Status: ready-for-agent
> Źródło: kompletna analiza projektu z 2026-11-23 (skill `modern-web-guidance`, wersja `2026_11_10-47b4c80e`).
> Cel: wdrożyć poprawki wg priorytetów poniżej.

Stack: Astro 7 + Tailwind 4, Cloudflare (Pages/Workers), Pagefind, Keystatic. Strona statyczna szkoły, brak backendu i formularzy (`<form>` nie występuje w `src`).

---

## Priorytet 1 — Bezpieczeństwo (największy zwrot)

### 1.1 Brak nagłówków bezpieczeństwa 🔴
- Brak `public/_headers`, brak sekcji nagłówków w `wrangler.jsonc`, brak `src/middleware.ts`.
- Dodać: **CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options / frame-ancestors**.
- Uwaga: CSP musi zezwalać na zasoby Pagefind, Google Fonts/iframe (kontakt), Google Apps Script (plan lekcji) — ustalić minimalną listę dyrektyw.

### 1.2 `target="_blank"` bez `rel="noopener noreferrer"` 🟡
- `src/pages/dokumenty.astro:29, 37, 45` (linki BIP — jedyne 3 przypadki w projekcie).
- Pozostałe linki (kalendarz, DlaRodzicow/DlaUczniow, dla-uczniow, Footer) mają poprawny `rel`.

### 1.3 Potencjalny sink XSS w wyszukiwarce 🟡
- `src/components/MegaNav.astro:485` — `item.excerpt` wstawiany do `innerHTML` **bez `escapeHtml()`** (pozostałe pola escapowane, funkcja `escapeHtml` jest w linii 341).
- Ryzyko praktyczne niskie (dane z Pagefind = własna treść), poprawka: opakować `escapeHtml(item.excerpt)`.

---

## Priorytet 2 — Dostępność

### 2.1 Filtry kierunków jako nietrafny wzorzec tabs 🟡
- `src/components/SchoolFields.astro:184-199` — `role="tablist"`/`role="tab"` + `aria-controls="field-groups"`, ale **brak nawigacji strzałkami** (brak `ArrowLeft/Right`, roving tabindex — sprawdzone: zero `keydown` w pliku).
- To filtrowanie, nie zakładki. Rekomendacja: przełączyć na `aria-pressed` jak w `src/components/HarmonogramTurnusow.astro:99-125` (spójność + brak zobowiązania klawiaturowego). JS filtrujący w liniach 344-389 do przerobienia razem z tym.

### 2.2 High-contrast: `outline: none !important` 🟡
- `src/styles/high-contrast.css:113` — stan fokusu kompensowany borderem; zweryfikować jednoznaczność w każdym trybie.

### 2.3 Reduced motion niepełny 🔵
- `src/styles/global.css` — guard `prefers-reduced-motion` obejmuje tylko `transition`, nie `animation`.
- Liczniki statystyk `src/pages/kalendarz.astro:107-140` animują cyfry przez `setInterval` — dodać warunek `matchMedia('(prefers-reduced-motion: reduce)')` (natychmiastowe ustawienie wartości).

### 2.4 Do potwierdzenia (już dobrze, nie psuć)
- Wszystkie `<img>` mają `alt` (scan PCRE2 — 0 braków).
- `sr-only <label>` przy wszystkich 4 polach wyszukiwania (MegaNav ×2, grono-pedagogiczne, HarmonogramTurnusow).
- `aria-live="polite"` na regionie wyników, `aria-pressed` w harmonogramie, `aria-expanded`/`aria-label` w MegaNav, `nav aria-label` w breadcrumbs/stopce, `title` w iframe.

---

## Priorytet 3 — Wydajność / porządek w kodzie

### 3.1 Martwy komponent `Image.astro` ✅ [ZROBIONE #05]
- `src/components/Image.astro` był martwy (0 importów) i wadliwy (potrójny `srcset`, sztywne wymiary).
- **Zrealizowano:** plik usunięty; komponenty używają `astro:assets` bezpośrednio.

### 3.2 Wideo `public/wideo` 🔵
- `video.mp4` 7,3 MB, `video3.mp4` 5 MB — obsługiwane poprawnie (`preload="none"` + poster w `GallerySection.astro`), ale rozważyć transkodowanie do VP9/AV1 + mniejsze bitrate.

### 3.3 Service worker 🔵
- `public/sw.js` (NetworkFirst dla jednego URL Google Apps Script) rejestruje **wyłącznie** `public/elo/index.html:674`; reszta serwisu go nie używa.
- Decyzja: usunąć albo przenieść rejestrację do Layout.astro. `unregister()` starego SW (elo:671) to porządek, nie błąd.

### 3.4 Semantyka HTML 🔵
- Brak elementu `<search>` w oknie wyszukiwarki (`MegaNav.astro:145`) — dodać.

---

## Priorytet 4 — Legacy findings (automatyczny skan, 5 sztuk)

| # | Plik:linia | Problem | Poprawka |
|---|---|---|---|
| 4.1 | `src/pages/grono-pedagogiczne.astro:14` | `[...teachers].sort(...)` | `teachers.toSorted(...)` |
| 4.2 | `src/components/MegaNav.astro:447` | `el.innerHTML = ''` | `el.replaceChildren()` |
| 4.3 | `public/elo/index.html:432, 443` | `app.innerHTML = ''` | `.replaceChildren()` |
| 4.4 | `public/elo/index.html:~552` | Scrollspy na IntersectionObserver | `scroll-target-group: auto` + `:target-current` (Chrome/Edge 140+) z fallbackiem IO — wg wytycznej trzymać IO jako fallback |

### Dodatkowa okazja (scrollspy)
- `src/pages/informacje.astro:294-304` — sticky spis treści **bez aktywnego stanu** (brak jakiegokolwiek JS scrollspy). Rozważyć natywne `scroll-target-group` bez JS.

---

## Kolejność wdrożenia

1. Nagłówki bezpieczeństwa (1.1)
2. Szybkie poprawki: `escapeHtml` w MegaNav (1.3) + `rel` w dokumenty.astro (1.2)
3. [ZROBIONE #05] Usunięcie martwego `Image.astro` (3.1)
4. SchoolFields tabs → `aria-pressed` (2.1) + reduced-motion dla liczników (2.3)
5. Legacy findings (4.x) — kosmetyka niskiego ryzyka

## Nie robić (potwierdzone jako poprawne)

- LCP w `Hero.astro` wzorcowy: `priority` + AVIF + `Picture`.
- Brak inline handlerów (`onclick=` itp.) w `.astro`.
- `set:html` wyłącznie dla JSON-LD (`JSON.stringify`) i lokalnych danych SVG/opisów — bezpieczne.
- Guardy `'IntersectionObserver' in window` w 8 plikach — spójne.
- Brak `@keyframes`/`animation` w CSS — mały powierzchnia animacji.

## Uwagi środowiskowe

- `node_modules` nie jest zainstalowane → `npm test` (vitest) nie działa przed `npm install`.
- Komendy skilla do powtórzenia skanu:
  `npx -y modern-web-guidance@latest search|retrieve|legacy-scan ... --skill-version 2026_11_10-47b4c80e`
