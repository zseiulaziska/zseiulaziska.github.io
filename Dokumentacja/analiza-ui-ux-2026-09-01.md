# Audyt UI/UX – ZSEiU Łaziska Górne – 2026-09-01

> **Zakres:** pełna analiza strony w `src/` pod względem UI/UX – design system, nawigacja, IA, hierarchia treści, responsywność, dostępność (WCAG 2.2 AA), wydajność, treść/mikrocopy i SEO techniczne.  
> **Stack:** Astro 7.2 `astro.config.mjs:17`, Tailwind 4 `src/styles/global.css:3`, Keystatic, Pagefind, Cloudflare adaptor.

---

## 1. Podsumowanie wykonawcze

**Ocena ogólna: 7.5 / 10**

Strona jest nowoczesna, spójna narracyjnie i mocna rekrutacyjnie. Największy potencjał do poprawy to: ujednolicenie systemu wizualnego (kolory/załamania/cień), mobilna architektura informacji (mega-menu → akordeon) oraz wydajność mediów (wideo/obrazki/fonty). Po wdrożeniu priorytetów **P0** projekt bez zastrzeżeń przechodzi audyt WCAG AA.

| Obszar | Ocena | Komentarz |
|---|---:|---|
| Design system / spójność wizualna | 3.5/5 | dobre tokeny, ale miks `gray/slate/navy` i 4 promienie |
| Nawigacja / IA | 3/5 | świetny desktop mega-menu, słaby mobile panel (30+ linków flat) |
| Hierarchia treści / homepage | 4/5 | jasny lejek rekrutacyjny, drobne problemy z kontrastami CTA |
| Responsywność | 3.5/5 | `MobileBottomBar` + `UtilityBar` duplikują się, 1px mismatch breakpointu |
| Dostępność | 4/5 | bardzo dobry baseline (skip-link, focus-ring, high-contrast), kilka progów kontrastu |
| Wydajność | 3.5/5 | webp srcset OK, ale 1 MB png i 6 nieoptymalizowanych wideo |
| Treść / mikrocopy | 4/5 | jasne, rekrutacyjne, powtarzalne „termin zostanie podany” |
| SEO techniczne | 4.5/5 | JSON-LD, canonical, sitemap, RSS — brak 404 |

---

## 2. Co działa bardzo dobrze (utrzymać)

- **Tokeny Tailwind `@theme`** `src/styles/global.css:6-42` – `primary-50..700`, `accent`, `navy-950..50`, utilities `card-base`, `btn-primary/secondary`, `section-padding`.
- **A11y baseline:** `SkipLink.astro`, global `focus-visible:ring-4 ring-primary-500` `global.css:56-72`, `prefers-reduced-motion: reduce` `global.css:400-408`, `.reveal` via `IntersectionObserver` `Layout.astro:86-107`, `high-contrast.css` (233 linie) + przełączniki `UtilityBar.astro:32-57`.
- **Nawigacja:** mega-menu z `backdrop`, focus-trap, `Esc` `MegaNav.astro:398-461`, stan `active` po `pathname` `MegaNav.astro:505-515`, `Breadcrumbs.astro:125` JSON-LD `BreadcrumbList`.
- **Homepage storytelling** `src/pages/index.astro:27-136` – sekwencja Hero → Success → Gallery → WhyChoose → Kierunki (`SchoolFields`) → PhotoBanner → Mundurowe → Partners → News → CTA – wzorowy lejek.
- **Detale:** `PartnersSection.astro:66-113` marquee z `mask-image` i `prefers-reduced-motion`, `NewsSection.astro:52` featured `lg:col-span-2`.

---

## 3. System wizualny

### 3.1 Kolory
Zdefiniowane poprawnie `global.css:6`, ale w komponentach miks: `bg-white` / `bg-slate-50` / `bg-navy-950` / `border-gray-200`. Przykład: `Hero.astro:5` `bg-navy-950`, `SuccessSection.astro:4` `from-slate-50 via-white to-blue-50 dark:from-navy-900`, `WhyChooseSection.astro:110` `border-slate-200`. Dark mode skacze między odcieniami.

**Rekomendacja:** wybrać jeden neutral (zalecane `slate` – najbliżej marki edukacyjnej) i konsekwentnie `slate-50/900` ↔ `navy-900/950`.

### 3.2 Typografia
`Inter` (body 300/400/600/700) + `Montserrat` (display 600/700) `astro.config.mjs:35-54` – dobry dobór. Problemy:
- Hero `text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold` `Hero.astro:18` – na 320px za duże, brak `clamp()`.
- Podtytuł `text-primary-200 italic` `Hero.astro:19` na `rgba(0,0,0,0.65)` `Hero.astro:10` ma kontrast ~2.8:1 (<4.5:1).
- Wszystkie sekcje `text-4xl sm:text-5xl font-black` – monotonia H2. Brak skali `h1 > h2 > h3`.

### 3.3 Promienie / cienie / spacing
`rounded-full` (pill), `rounded-[2rem]` (`SuccessSection:32`), `rounded-xl` (`SchoolFields:244`), `rounded-2xl` (`NewsSection:57`), `rounded-md` (`UtilityBar`) – 4 systemy. Cienie `shadow-sm` vs `shadow-xl shadow-primary-600/25` vs `shadow-2xl`. **Ujednolicić:** `xl=12px` karty, `2xl=16px` sekcje, `full` tylko badge.

---

## 4. Nawigacja i architektura informacji

### 4.1 Desktop mega-menu
`mega-panel: w-[min(58rem,calc(100vw-3rem))] left-1/2 translate(-50%)` `global.css:245`. Dla dwóch ostatnich sekcji (`Uczniowie i rodzice`, `Projekty`) panel wychodzi poza viewport – `mega-panel--right { right:auto }` `global.css:249` nie koryguje `translate`. Dodatkowo otwieranie na `mouseenter` `MegaNav.astro:484` bez delay powoduje przypadkowe otwarcia na trackpadzie.

**Fix:** tylko `click` (obecny też), dodać 150 ms debounce, dynamicznie korygować `left/right` JS-em (sprawdzić `getBoundingClientRect`).

### 4.2 Mobile panel
`mobile-nav__panel: fixed inset-x-3 top-18 max-h-[calc(100vh-5.25rem)]` `global.css:176`, `mobile-nav__grid: sm:grid-cols-2` `198`. `mobileSections` `MegaNav.astro:106-120` spłaszcza hierarchię `sections → groups` do 30+ linków w dwóch kolumnach bez nagłówków sticky. Użytkownik scrolluje 2 ekrany.

**Fix:** akordeon 4 sekcje (`O szkole`, `Oferta`, `Uczniowie i rodzice`, `Projekty`) z `details/summary`, zachować `groups`.

### 4.3 Top bar vs bottom bar
`UtilityBar.astro:3-7` 4 linki (`E-Dziennik`, `Plan`, `Plan LO`, `Dzwonki`) ukryte na mobile `utility-bar__link--hidden-mobile` `global.css:510`, zduplikowane w `MobileBottomBar.astro:2-31` (`fixed bottom-0 md:hidden`). Dwa źródła prawdy + ukryty scrollbar `global.css:489`.

**Fix:** jedno źródło – zostawić `MobileBottomBar` (ma 44px target), w `UtilityBar` na mobile pokazać tylko toggles (theme/kontrast/font).

### 4.4 Wyszukiwarka
`MegaNav.astro:329-397` Pagefind ładowany dynamicznie `/pagefind/pagefind.js:348`. W `astro dev` (`ready=false`) po wpisaniu 2 znaków brak feedbacku „indeks się ładuje”. Popover `w-96` `global.css:352` na <375px za szeroki. `mobile-search-results: static mt-2!` `global.css:355` używa `!important` hack.

### 4.5 Breadcrumbs
`Breadcrumbs.astro:15` `/opm: 'Oddział Przygotowania Morskiego'` – literówka, powinno być **Mundurowego** (zgodnie z `Footer.astro:72`, `SchoolFields`). `iconForHref` duplikuje `'/blog': 'news'` `161`.

---

## 5. Strona główna – hierarchia i sekcje

| Sekcja | Plik | Mocne | Do poprawy |
|---|---|---|---|
| Hero | `Hero.astro:4-30` | `min-h-[85svh]`, `fetchpriority=high` `8`, webp srcset | Podwójny overlay `rgba(0,0,0,0.65)` + `from-black/40` `10-11` – zdjęcie traci detal. Badge `bg-white/10 backdrop-blur` słabo widoczny na jasnym kadrze. Secondary CTA `border-white/20` kontrast ~3:1. |
| Success | `SuccessSection.astro:4` | gradient + blur dekoratory, 2 kolumny `1.1fr/0.9fr` | Przyciski `rounded-full` vs reszta `rounded-xl` – niespójne. |
| Gallery | `GallerySection.astro:25` | `auto-rows-[15vw] lg:grid-cols-6`, hover-play | Hack `left-1/2 w-screen -translate-x-1/2` – powoduje h-scroll bez `overflow-x:hidden` na `body` `global.css:421`. Wideo bez `poster`, bez `controls`, generyczne `alt`, tylko hover/click, brak `prefers-reduced-motion`. |
| WhyChoose | `WhyChooseSection.astro:57` | featured `lg:row-span-2` `80`, stat `Grecja & Sycylia` | Grid `lg:grid-cols-3` z `lg:col-span-2` foto `147` – przy zmianie liczby kart layout pęka. Ikony `stroke-width=2` vs `SchoolFields 1.75`. |
| Kierunki | `SchoolFields.astro:161` | filtry `filterTabs:50`, karty z `accentGrad` `245`, `hover:-translate-y-0.5` | Brak licznika wyników, brak empty-state po filtrze (`374` ukrywa grupę). Badge zawsze `bg-blue-50` `256` – marnuje `fieldThemeStyle:69`. |
| Mundurowe | `index.astro:62-96` | 3 karty + CTA `bg-slate-900` | Karty `cursor-pointer` bez `href/role=button` – nieklikalne, mylące. CTA linkuje do `/kontakt` zamiast `/opw`. |
| Partnerzy | `PartnersSection.astro:12` | marquee 45s, `mask-image` fade, `prefers-reduced-motion` | Logo `logo_pgg.png 95kB`, `logo-szkoly-mono 1MB` – do webp. Na mobile brak wskazania scrollowalności. |
| Aktualności | `NewsSection.astro:52` | `lg:col-span-2` dla 1. wpisu, `categoryColors:20` | Filtr ukrywa `display:none` bez komunikatu, brak sync z URL, `toLocaleDateString` może hydratować inaczej. |
| CTA końcowe | `index.astro:121` | `bg-navy-950` + zdjęcie `opacity-20` | Oba przyciski `text-lg` równej wagi, secondary znowu `border-white/20`. |

---

## 6. Responsywność

- **Bottom bar breakpoint mismatch:** `MobileBottomBar` `md:hidden` (768px) vs `body { padding-bottom:3.5rem @max-width 767px }` `global.css:539` – 1px okno gdzie treść chowa się pod barem.
- **Main:** `max-w-screen-2xl mx-auto px-4 py-8` `Layout.astro:79` vs sekcje full-bleed (`Gallery`, `Partners`) z `max-w-7xl` – inny rytm boczny.
- **Tabele/iframe:** `plan-lekcji.astro:18` `height: calc(100vh - 240px)` – podwójny scrollbar (strona + iframe), brak skeleton/fallback gdy `plan-lekcji-vulcan` offline.
- **Target size:** `UtilityBar` label `10px` `global.css:498`, przycisk `px-2.5 py-1.5` ~28px < 44px (WCAG 2.5.5).

---

## 7. Dostępność – audyt WCAG 2.2 AA

### Zaliczone
Skip-link, `focus-visible:ring-4` `global.css:56`, `aria-expanded` `MegaNav.astro:276`, `aria-modal` `245`, `high-contrast` tryb, `prefers-reduced-motion`.

### Do poprawy
- **Kontrast:** `text-slate-400` na `bg-slate-950` w Footer `Footer.astro:25` 4.2:1 (<4.5:1 dla 13-14px), `primary-200` w Hero, `slate-400` w Partners `PartnersSection.astro:23`.
- **Wideo:** brak `controls`, brak pauzy klawiaturą/`Esc`, brak napisów – niespełnione 1.2.2, 2.1.1.
- **Ikony:** duplikat `/blog` `MegaNav.astro:161`, brak ikon `/plan-lekcji`, `/kontakt` – fallback `info`.
- **High-contrast:** `main#content * { background:#000 !important; color:#fff !important }` `high-contrast.css:134` nadpisuje `mark`, `selection`, focus. Zawęzić selektory.
- **Live regions:** brak `aria-live="polite"` dla wyników Pagefind i filtrów `SchoolFields`/`NewsSection`.

---

## 8. Wydajność

- **Obrazy:** Hero webp 120kB + jpg 105kB – OK (srcset 480w/768w/1200w `Hero.astro:7`). Ale `mundurowi.jpg 150kB`, `blog-placeholder-4.jpg 38kB` jpg bez webp/AVIF, `Herb_Polski.svg.png 765kB` + `logo-szkoly-mono 1MB` – nieużywane, do usunięcia/konwersji. Brak `width/height` w `GallerySection` – CLS.
- **Wideo:** 6× mp4 (`video3.mp4` itd. `GallerySection.astro:10`) – 2–5 MB każdy, `preload="metadata"` ale hover ładuje całość. Na 4G ~15s. Dodać `poster`, rozważyć lazy `IntersectionObserver`.
- **Fonty:** 6 plików ~130kB, `preload` oba `Font` `BaseHead.astro:53` blokuje render. Wystarczy `Inter 400/700`, `Montserrat 700` + `subset latin-ext`.
- **CSS:** `global.css 557` + `high-contrast.css 233` duplikacja, `@custom-variant dark` `global.css:1` zbędne w Tailwind 4, `transition: background-color 0.3s` na `body/header/card/footer` `383` – jank na słabszych urządzeniach.

---

## 9. Treść i mikrocopy

- **CTA hierarchia:** Hero `px-9 py-4 text-lg` oba przyciski równej wielkości `Hero.astro:23` – primary „Rozpocznij rekrutację” vs secondary „Poznaj kierunki” OK, ale final CTA `index.astro:131` oba `text-lg` z `border-white/20` – secondary ginie.
- **Rekrutacja:** `rekrutacja.astro:45-49` 5× „termin zostanie podany” – frustrujące. Lepsze: „Harmonogram MEN – marzec, zapisz się na powiadomienie” + mailto.
- **Kierunki:** `kierunki.astro:11` `prose max-w-4xl` vs karty `max-w-screen-2xl` – wąski lejek.
- **Breadcrumbs:** etykieta `/opm` do poprawy jw.

---

## 10. SEO techniczne – bardzo dobrze, drobne

Zaliczone: `BaseHead.astro:36` `EducationalOrganization` JSON-LD, `Breadcrumbs.astro:125` `BreadcrumbList`, `canonical` `BaseHead.astro:57`, `og:*`/`twitter:*`, `sitemap`, `rss.xml`, unikalne `title/description` na każdej stronie.

Brak: `src/pages/404.astro` – GitHub Pages pokaże domyślną 404, niespójną wizualnie.

---

## 11. Rekomendacje – priorytety

### P0 – krytyczne (1 sprint)

1. **Mega-panel overflow** – dynamiczna korekta `left/right` JS (`getBoundingClientRect`), `max-width: min(58rem, 100vw - 2rem)` bez `translate(-50%)` dla `index>1` (`MegaNav.astro:282`, `global.css:249`).
2. **Mobile nav akordeon** – 4× `details/summary` zamiast flat `mobileSections` (`MegaNav.astro:106`), sticky nagłówki grup.
3. **Jeden pasek mobilny** – usunąć `utility-bar__link--hidden-mobile` (`UtilityBar.astro:3`, `global.css:510`) lub zostawić tylko `MobileBottomBar`. Poprawić breakpoint `539` → `md`.
4. **Empty-state filtrów** – `SchoolFields.astro:374` + `NewsSection.astro:127` dodać komunikat „Brak wyników” + `aria-live` + sync URL `?kategoria=`.
5. **Kontrasty** – Footer `slate-400→slate-300`, Hero subtitle `primary-200→white`, secondary CTA `bg-white text-navy-900` zamiast `border-white/20`.
6. **Plan lekcji iframe** – skeleton + `title` + fallback offline + dynamiczna wysokość `postMessage` (`plan-lekcji.astro:18`).
7. **Fix breadcrumbs** – `/opm` → `Oddział Przygotowania Mundurowego` (`Breadcrumbs.astro:15`).

### P1 – ważne (kolejny sprint)

8. **Ujednolicić tokeny** – jeden neutral (`slate`), jeden radius (`xl=12px` karty, `2xl=16px` sekcje), usunąć `gray`.
9. **Galeria wideo** – `poster`, `controls` on focus, pauza `Esc`, `prefers-reduced-motion` zatrzymuje autoplay (`GallerySection.astro:65`).
10. **Optymalizacja mediów** – webp/AVIF dla `public/images` (95kB→20kB, 1MB→80kB), dodać `width/height` + `aspect-ratio`, `Image` z `astro:assets` zamiast ręcznego srcset.
11. **Fonty** – zostawić `Inter 400/700`, `Montserrat 700`, `preload` tylko 400.
12. **Karty Mundurowe** – dodać `href` lub usunąć `cursor-pointer` (`index.astro:62`), CTA → `/opw`.

### P2 – nice to have

13. **Przepisać `high-contrast.css`** bez `!important *` (`:where(html.high-contrast)`).
14. **View Transitions** Astro dla przejść między kierunkami.
15. **404** – dodać `src/pages/404.astro` w `Layout`.
16. **Blog** – paginacja, użyć `description` z frontmatter zamiast `getExcerpt` 3 zdań (`blog/index.astro:8`).
17. **Drobne:** usunąć duplikat `'/blog'` w `linkIcons` (`MegaNav.astro:161`), dodać licznik wyników filtrów.

---

## 12. Pliki referencyjne

- `src/styles/global.css:6-42` – tokeny
- `src/styles/high-contrast.css:1-233` – tryb HC
- `src/layouts/Layout.astro:19-79` – layout + `max-w-screen-2xl`
- `src/components/MegaNav.astro:1-518` – nawigacja
- `src/components/UtilityBar.astro:1-115` – top bar + toggles
- `src/components/SchoolFields.astro:50-379` – kierunki/filtry
- `src/components/WhyChooseSection.astro:57-186` – sekcja 6 powodów
- `src/components/GallerySection.astro:25-91` – galeria wideo
- `src/components/PartnersSection.astro:12-113` – marquee partnerów
- `src/components/NewsSection.astro:35-138` – aktualności
- `src/components/Hero.astro:4-31` – hero
- `src/pages/index.astro:19-140` – homepage
- `src/pages/plan-lekcji.astro:18` – iframe planu
- `src/components/Breadcrumbs.astro:15` – literówka OPM
- `astro.config.mjs:35-54` – fonty

---

*Wygenerowano automatycznie na podstawie analizy statycznej `src/` – do weryfikacji na żywym buildzie (Lighthouse, axe, keyboard nav, Pagefind index).*
