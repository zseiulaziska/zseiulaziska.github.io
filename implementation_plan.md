# Analiza UI/UX — Strona ZSEiU Łaziska Górne

Kompleksowy raport z analizy interfejsu użytkownika i doświadczeń użytkownika (UI/UX) strony internetowej Zespołu Szkół Energetycznych i Usługowych w Łaziskach Górnych.

> [!NOTE]
> Raport powstał na podstawie dogłębnej analizy **wszystkich plików projektu**: 28 stron, 14 komponentów, 2 layoutów, stylów globalnych, konfiguracji Astro, zasobów graficznych i struktury treści. Żadne zmiany nie zostały jeszcze wprowadzone.

---

## Spis treści

1. [Podsumowanie wykonawcze](#podsumowanie-wykonawcze)
2. [Architektura i spójność systemu designu](#1-architektura-i-spójność-systemu-designu)
3. [Typografia](#2-typografia)
4. [Paleta kolorów i theming](#3-paleta-kolorów-i-theming)
5. [Nawigacja i architektura informacji](#4-nawigacja-i-architektura-informacji)
6. [Strona główna](#5-strona-główna-indexastro)
7. [Podstrony merytoryczne](#6-podstrony-merytoryczne)
8. [Plan lekcji — oddzielna aplikacja](#7-plan-lekcji--oddzielna-aplikacja)
9. [Blog i system treści](#8-blog-i-system-treści)
10. [Stopka](#9-stopka-footerastro)
11. [Responsywność](#10-responsywność)
12. [Dostępność (a11y)](#11-dostępność-a11y)
13. [Wydajność](#12-wydajność)
14. [SEO i meta tagi](#13-seo-i-meta-tagi)
15. [Komponenty i reużywalność](#14-komponenty-i-reużywalność)
16. [Martwy kod i artefakty](#15-martwy-kod-i-artefakty)
17. [Priorytetyzacja zmian](#priorytetyzacja-zmian)

---

## Podsumowanie wykonawcze

Strona ZSEiU jest zbudowana na **Astro 7 + Tailwind CSS 4** z Keystatic CMS i posiada solidny fundament technologiczny. Mega-nawigacja, hero section i paleta kolorów navy/primary tworzą profesjonalne pierwsze wrażenie. Jednak głębsza analiza ujawnia **znaczące problemy spójności, architektury i UX**, które obniżają ogólną jakość doświadczenia:

### Kluczowe problemy (top 5)

| #   | Problem                                                                                                      | Wpływ                                           |
| --- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| 1   | **Plan lekcji to oddzielna aplikacja** z inną kolorystyką (czerwień vs niebieski), bez nawigacji i brandingu | Użytkownik „gubi się" — wygląda jak inna strona |
| 2   | **~15 stron-zaślepek** z 1-2 linkami zamiast treści                                                          | Frustracja: kliknięcie w menu prowadzi donikąd  |
| 3   | **3+ rodziny fontów** (Atkinson, Inter+Poppins, EB Garamond) bez spójnej hierarchii                          | Chaos typograficzny                             |
| 4   | **Brak komponentu `<BaseHead>`** w layoutach — brak OG tags, favicon, canonical URL                          | Słabe SEO, brak podglądu w social media         |
| 5   | **Ogromna duplikacja treści** — te same dane w 3+ miejscach, hardcoded                                       | Koszt utrzymania, ryzyko niespójności           |

---

## 1. Architektura i spójność systemu designu

### Stan obecny

Projekt posiada zdefiniowane tokeny kolorów w [global.css](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/styles/global.css) (`@theme` block), ale **nie ma pełnego design systemu** — brak zdefiniowanych:

- Tokenów spacingowych (różne padding-y na sekcjach: `py-2`, `py-8`, `py-12`, `py-20`, `py-28`)
- Tokenów zaokrągleń (`rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl` — używane zamiennie)
- Tokenów cieni (`shadow-sm`, `shadow-xl`, `shadow-2xl` + niestandardowe `shadow-[...]`)
- Komponentów przycisków (każdy button ma inny zestaw klas)

### Propozycje zmian

#### P1.1 — System tokenów designu (Priorytet: 🔴 Wysoki)

Zdefiniować w `global.css` spójne tokeny:

```css
/* Propozycja: ustandaryzowane sekcje */
@utility section-padding {
  @apply py-16 lg:py-24;
}
@utility card-base {
  @apply rounded-2xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 p-6 shadow-sm;
}
@utility btn-primary {
  @apply inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20;
}
@utility btn-secondary {
  @apply inline-flex items-center px-6 py-3 border border-gray-200 dark:border-navy-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-navy-750 transition-all;
}
```

#### P1.2 — Jeden layout bazowy (Priorytet: 🔴 Wysoki)

[BlogPost.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/layouts/BlogPost.astro) duplikuje cały HTML shell z [Layout.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/layouts/Layout.astro), z **różną logiką dark mode** (BlogPost czyta `localStorage`, Layout nie). Rozwiązanie:

- BlogPost powinien rozszerzać Layout.astro
- Jedna implementacja dark mode (z `localStorage`)
- Jedna strategia ładowania fontów

#### P1.3 — Użycie BaseHead.astro (Priorytet: 🔴 Wysoki)

Komponent [BaseHead.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/components/BaseHead.astro) zawiera kompletne meta tagi (OG, Twitter, canonical, favicon, RSS, sitemap) ale **nie jest importowany przez żaden layout**. Należy go zintegrować z Layout.astro.

---

## 2. Typografia

### Stan obecny — chaos fontowy

| Źródło                                                                                                                                                                                                                           | Font                                                | Gdzie                                      |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------ |
| [astro.config.mjs](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/astro.config.mjs)                                                                                                                              | **Atkinson** (local, `--font-atkinson`)             | Skonfigurowany, ale nie widać użycia w CSS |
| [Layout.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/layouts/Layout.astro#L23)                                                                                                                      | **Inter** (300,400,600,700) + **Poppins** (600,700) | Google Fonts `<link>`                      |
| [informacje.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/informacje.astro#L9) / [historia.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/historia.astro#L10) | **EB Garamond** (500-800)                           | Dodatkowy Google Fonts na 2 stronach       |
| [plan-lekcji.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/plan-lekcji.astro#L33)                                                                                                              | **System fonts**                                    | Własne                                     |
| [Hero.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/components/Hero.astro#L15)                                                                                                                       | `font-display` class                                | Klasa nigdzie niezdefiniowana              |

### Propozycje zmian

#### P2.1 — Zunifikowana hierarchia typograficzna (Priorytet: 🔴 Wysoki)

Wybrać **maksymalnie 2 rodziny fontów** i konsekwentnie je stosować:

- **Body/UI**: Inter (już ładowany) — czytelny, profesjonalny
- **Display/Nagłówki**: Poppins (już ładowany) — mocniejszy charakter

Usunąć:

- Atkinson z konfiguracji Astro (albo odwrotnie — zastąpić Inter Atkinsonem)
- EB Garamond z poszczególnych stron
- Zdefiniować klasy `font-display` i `font-body` w CSS
  STATUS: wykonano

#### P2.2 — Ładowanie fontów (Priorytet: 🟡 Średni)

Zamiast podwójnego ładowania (Astro local fonts + Google Fonts `<link>`):

- Użyć **wyłącznie** Astro font provider (`fontProviders.google()`) dla spójności
- Lub przenieść wszystkie fonty na local loading (woff2) dla lepszej wydajności
- Usunąć render-blocking `<link>` tag z Google Fonts
  STATUS: wykonano

---

## 3. Paleta kolorów i theming

### Stan obecny

Dobrze zdefiniowana paleta w `global.css`:

- **Primary** (niebieski): 7 odcieni — solidna skala
- **Accent** (pomarańczowy): 3 odcienie — używany sporadycznie
- **Navy** (granat): 13 odcieni — rozbudowany system dla dark mode

### Problemy

#### Favicon nie pasuje do palety

[favicon.svg](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/public/favicon.svg) używa koloru `#5F2EEA` (fiolet) — **kompletnie odbiega** od niebiesko-granatowej palety strony.

#### Dark mode niespójny

- [Layout.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/layouts/Layout.astro#L27-L37): dark mode oparty tylko na `prefers-color-scheme` (brak `localStorage`)
- [BlogPost.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/layouts/BlogPost.astro#L24-L38): dark mode z `localStorage` + `prefers-color-scheme`
- Przycisk toggle w nawigacji zmienia klasę, ale Layout nie zapamiętuje preferencji

#### Plan lekcji — czerwona paleta

[plan-lekcji.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/plan-lekcji.astro#L17-L31): `--primary: #e94560` (czerwony) zamiast `#06a6ff` (niebieski).

### Propozycje zmian

#### P3.1 — Favicon w kolorystyce strony (Priorytet: 🟡 Średni)

Zmienić kolor tła faviconu z `#5F2EEA` na `#0070b0` (primary-600) lub `#0a1628` (navy-900).

#### P3.2 — Zunifikowany dark mode (Priorytet: 🔴 Wysoki)

Jedna implementacja w Layout.astro:

1. Sprawdź `localStorage('theme')`
2. Fallback na `prefers-color-scheme`
3. Przycisk toggle zapisuje do `localStorage`
4. Wszystkie layouty dziedziczą tę logikę
   STATUS: wykonano

#### P3.3 — Accent color strategy (Priorytet: 🟢 Niski)

Kolor akcentowy `#ff7a59` (pomarańczowy) jest używany **tylko na jednym przycisku** ("Rekrutacja" w CTA). Warto:

- Albo go więcej wykorzystać (np. odznaki „Nowe!", przyciski CTA)
- Albo uprosić paletę do primary + navy
  STATUS: wykonano

---

## 4. Nawigacja i architektura informacji

### Stan obecny

[MegaNav.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/components/MegaNav.astro) (444 linii, 19KB) to najbardziej rozbudowany komponent. Posiada:

- ✅ Desktop mega-menu z panelami (hover + click)
- ✅ Mobile menu (progressive enhancement via `<details>`)
- ✅ Wyszukiwanie klienckie
- ✅ Dark mode toggle
- ✅ Social links + BIP
- ✅ Active page highlighting

### Problemy

> [!WARNING]
> **Zepsuty link**: Quick link „Plan lekcji" prowadzi do `/#` (linia 98) — powinien wskazywać na `/plan-lekcji`.

#### Architektura informacji prowadzi do ślepych uliczek

Mega-menu obiecuje bogate treści, ale **~15 z 28 stron to zaślepki** z 1-2 linkami:

| Strona                                                                                                                            | Zawartość                 | Rozmiar |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------- |
| [dla-uczniow.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/dla-uczniow.astro)                   | 1 link                    | 276B    |
| [klasy-mundurowe.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/klasy-mundurowe.astro)           | 1 link                    | 325B    |
| [klasa-policyjna.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/klasa-policyjna.astro)           | 1 link                    | 338B    |
| [klienci-i-partnerzy.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/klienci-i-partnerzy.astro)   | Redirect do `/informacje` | 341B    |
| [nasza-spolecznosc.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/nasza-spolecznosc.astro)       | 1 link                    | 301B    |
| [podreczniki.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/podreczniki.astro)                   | 1 external link           | 290B    |
| [dyrekcja.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/dyrekcja.astro)                         | Redirect do `/kontakt`    | 442B    |
| [egzaminy-zawodowe.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/egzaminy-zawodowe.astro)       | 1 link                    | 365B    |
| [kalendarz.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/kalendarz.astro)                       | 1 iframe link             | 544B    |
| [dokumenty-szkolne.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/dokumenty-szkolne.astro)       | 2 linki                   | 467B    |
| [kierunki-ksztalcenia.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/kierunki-ksztalcenia.astro) | 2 linki                   | 438B    |

### Propozycje zmian

#### P4.1 — Naprawić zepsuty link (Priorytet: 🔴 Krytyczny)

Zmienić `['Plan lekcji', '/#']` na `['Plan lekcji', '/plan-lekcji']` w [MegaNav.astro linia 98](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/components/MegaNav.astro#L98).

#### P4.2 — Wyeliminować strony-zaślepki (Priorytet: 🔴 Wysoki)

Dwa podejścia:

- **Opcja A**: Wypełnić strony-zaślepki treścią (opisy kierunków, informacje dla rodziców, etc.)
- **Opcja B**: Usunąć strony-zaślepki i w mega-menu linkować bezpośrednio do zewnętrznych zasobów lub sekcji na `/informacje`

#### P4.3 — Usprawnienia nawigacji mobilnej (Priorytet: 🟡 Średni)

- Dodać **focus trap** w panelu mobilnym (klawiatura)
- Zamykać panel po kliknięciu na backdrop
- Dodać animację otwierania/zamykania (slide-down)
  STATUS: wykonano

#### P4.4 — Breadcrumbs (Priorytet: 🟡 Średni)

Dodać komponent breadcrumbs na podstronach — użytkownik nie wie gdzie jest w hierarchii strony.

---

## 5. Strona główna ([index.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/index.astro))

### Stan obecny

Strona główna ma **solidną strukturę wizualną**: hero z tłem, karty aktualności, sekcja klas mundurowych, struktura organizacyjna, kierunki kształcenia i CTA.

### Problemy

#### Karty klas mundurowych nie są klikalne

Linie 119-153: Karty mają `cursor-pointer` i `hover:shadow-xl`, ale **nie są linkami ani przyciskami** — to `<div>`. Użytkownik klika i nic się nie dzieje.

#### 80 linii zakomentowanego kodu

Linie 219-296: Stare sekcje (misja, infrastruktura, projekty) zakomentowane — zaśmiecają plik.

#### Duplikacja sekcji „Struktura organizacyjna"

Linie 181-213 są **identyczne** z kodem w [informacje.astro linie 72-101](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/informacje.astro#L72-L101).

#### Brak animacji wejścia

Sekcje pojawiają się statycznie — brak efektu „scroll reveal" który nadaje dynamikę.

### Propozycje zmian

#### P5.1 — Klikalne karty mundurowe (Priorytet: 🔴 Wysoki)

Zamienić `<div>` na `<a>` z linkami do odpowiednich podstron lub sekcji.

#### P5.2 — Wyodrębnić sekcję struktury do komponentu (Priorytet: 🟡 Średni)

Stworzyć `<SchoolStructure />` komponent i używać go na obu stronach.

#### P5.3 — Usunąć zakomentowany kod (Priorytet: 🟡 Średni)

80 linii zakomentowanego HTML nie powinno być w produkcyjnym kodzie.

#### P5.4 — Animacje scroll-reveal (Priorytet: 🟢 Niski)

Dodać delikatne animacje `fade-in-up` przy scrollu dla sekcji. Użyć `IntersectionObserver` z klasami CSS:

```css
.reveal {
  opacity: 0;
  transform: translateY(1.5rem);
  transition: all 0.6s ease-out;
}
.reveal.visible {
  opacity: 1;
  transform: none;
}
```

#### P5.5 — Sekcja „Liczby" z animacją countUp (Priorytet: 🟢 Niski)

Statystyki (520 uczniów, 57 nauczycieli, 22 oddziały) mogłyby mieć efekt licznika — od 0 do docelowej wartości przy scroll-in.

---

## 6. Podstrony merytoryczne

### [informacje.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/informacje.astro) — 39KB, 467 linii

> [!IMPORTANT]
> To jest **największy plik** w projekcie. Cała treść szkoły jest umieszczona w jednym pliku z hardcoded HTML — lista kierunków, infrastruktura, projekty, kontakt i mapa.

**Propozycje:**

- **P6.1** — Podzielić na sekcje ładowane z content collections
- **P6.2** — Wyodrębnić powtarzalne wzorce (karty kierunków, karty infrastruktury) do komponentów
- **P6.3** — Sticky table-of-contents (sidebar na desktop, accordion na mobile)

### [grono-pedagogiczne.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/grono-pedagogiczne.astro) — 17KB, 515 linii

**40+ nauczycieli** zhardkodowanych w frontmatter. Idealny kandydat na content collection.

**Propozycje:**

- **P6.4** — Przenieść dane nauczycieli do JSON/YAML w content collection
- **P6.5** — Dodać **filtrowanie/wyszukiwanie** po imieniu lub przedmiocie
- **P6.6** — Avatary/inicjały nauczycieli (nawet generowane, np. kolorowe kółka z inicjałami)

### [historia.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/historia.astro) — 25KB, 366 linii

Jedyna strona z dobrym komponentem reużywalnym (`TimelineEvent`). Ale:

- **P6.7** — Przenieść wydarzenia do content collection (Markdown/YAML)
- **P6.8** — Poprawić timeline na mobile — linia jest ukryta ale offsety zostają

### [kontakt.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/kontakt.astro)

Dobrze zaprojektowana strona. Drobne uwagi:

- **P6.9** — Google Maps iframe może nie działać (placeholder embed URL) — zweryfikować i zaktualizować
- **P6.10** — Dodać noscript fallback dla mapy (statyczny obrazek lub link do Google Maps)

---

## 7. Plan lekcji — oddzielna aplikacja

> [!CAUTION]
> [plan-lekcji.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/plan-lekcji.astro) (699 linii, 19KB) to **kompletnie oddzielna aplikacja SPA** z własnym HTML shell, CSS resetem (400+ linii inline), kolorystyką i logiką. Nie używa Layout.astro, nie ma nawigacji do reszty strony.

### Porównanie wizualne

| Cecha            | Reszta strony         | Plan lekcji      |
| ---------------- | --------------------- | ---------------- |
| Primary color    | `#06a6ff` 🔵          | `#e94560` 🔴     |
| Background       | `#ffffff` / `#0a1628` | `#0f0f1a`        |
| Font             | Inter + Poppins       | System fonts     |
| Border radius    | `rounded-2xl`         | `10px`           |
| Framework        | Tailwind CSS          | Vanilla CSS      |
| Nawigacja        | MegaNav               | ❌ Brak          |
| Footer           | ✅ Tak                | ❌ Brak          |
| Dark mode toggle | ✅ Tak                | ❌ Zawsze ciemny |

### Propozycje zmian

#### P7.1 — Integracja z Layout.astro (Priorytet: 🔴 Wysoki)

Osadzić plan lekcji wewnątrz standardowego layoutu strony. Opcje:

- **Opcja A**: Owinąć istniejący SPA w Layout.astro z nawigacją i stopką, ale zachować wewnętrzne style (island)
- **Opcja B**: Przepisać CSS planu lekcji na Tailwind i użyć palety kolorów strony

#### P7.2 — Link „powrót do strony" (Priorytet: 🔴 Krytyczny — quick fix)

Jako minimum: dodać link/przycisk powrotu do strony głównej w headerze planu lekcji.

#### P7.3 — Dopasowanie kolorystyki (Priorytet: 🟡 Średni)

Zmienić `--primary: #e94560` na `--primary: #06a6ff` (lub primary-600 ze strony) aby zachować spójność brandingową.

---

## 8. Blog i system treści

### Stan obecny

- Blog działa na Astro Content Collections ✅
- [BlogPost.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/layouts/BlogPost.astro) ma własny HTML shell ❌
- [about.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/about.astro) zawiera **Lorem Ipsum** i tytuł „About Me" ❌
- Text „Last updated on" jest po angielsku ❌

### Propozycje zmian

#### P8.1 — Usunąć lub zastąpić about.astro (Priorytet: 🔴 Wysoki)

Strona z Lorem Ipsum szkodzi profesjonalizmowi. Albo usunąć, albo wypełnić treścią „O szkole".

#### P8.2 — BlogPost layout → rozszerzenie Layout.astro (Priorytet: 🟡 Średni)

Zamiast duplikować HTML, BlogPost powinien rozszerzać główny layout.

#### P8.3 — Tłumaczenie na polski (Priorytet: 🔴 Wysoki)

- „Last updated on" → „Ostatnia aktualizacja:"
- `FormattedDate` — dodać explicit locale `'pl-PL'`

#### P8.4 — Styl artykułów blogowych (Priorytet: 🟡 Średni)

Klasa `.prose` w BlogPost.astro używa **hardcoded kolorów** (`#334155`, `#cbd5e1`). Zamienić na tokeny z design systemu.

#### P8.5 — Content collections dla innych danych (Priorytet: 🟡 Średni)

Kandydaci na content collections:

- **Nauczyciele** (obecnie hardcoded w grono-pedagogiczne.astro)
- **Kierunki kształcenia** (hardcoded w informacje.astro i features.astro)
- **Historia/Timeline** (hardcoded w historia.astro)

---

## 9. Stopka ([Footer.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/components/Footer.astro))

### Stan obecny

Minimalistyczna stopka z 3 kolumnami: dane szkoły, kontakt, przydatne linki.

### Propozycje zmian

#### P9.1 — Rozbudowana stopka (Priorytet: 🟡 Średni)

Dodać:

- Logo szkoły
- Social media (Facebook, Instagram) — obecne w headerze ale nie w stopce
- Link BIP
- Linki do RODO i deklaracji dostępności (wymóg prawny — szczególnie ważne na dole strony)
- Przycisk „Powrót na górę"
- `aria-label="Nawigacja w stopce"` na `<footer>` (brakuje)

#### P9.2 — Hover transitions (Priorytet: 🟢 Niski)

Linki w stopce mają `hover:text-primary-500` ale brakuje `transition-colors` (jest w headerze).

---

## 10. Responsywność

### Stan obecny

Strona jest responsywna dzięki Tailwind breakpoints (`sm`, `md`, `lg`, `xl`). Mobile quicklinks bar na homepage to dobry pattern.

### Propozycje zmian

#### P10.1 — Testowanie na prawdziwych urządzeniach (Priorytet: 🟡 Średni)

Sprawdzić:

- Mega-menu panele na tabletach (768-1024px) — czy nie wychodzą poza viewport
- Google Maps iframe na małych ekranach
- Plan lekcji na urządzeniach z notchem (safe areas)

#### P10.2 — Container queries (Priorytet: 🟢 Niski)

Dla kart informacyjnych — zamiast `md:grid-cols-2 lg:grid-cols-3`, użyć container queries aby karty były responsive względem kontenera, nie viewportu.

---

## 11. Dostępność (a11y)

### Co działa dobrze

- ✅ Skip link (`<SkipLink />`)
- ✅ `aria-label` na nawigacji i linkach społecznościowych
- ✅ `aria-hidden="true"` na ikonach dekoracyjnych
- ✅ `aria-expanded` na mega-menu triggerach
- ✅ Escape zamyka menu
- ✅ `prefers-reduced-motion` wyłącza animacje
- ✅ `html lang="pl"` — poprawny język

### Propozycje zmian

#### P11.1 — Focus trap w mobile nav (Priorytet: 🟡 Średni)

Użytkownik klawiatury może wytabować się z otwartego panelu mobilnego. Dodać focus trap.

#### P11.2 — ARIA roles na mega-menu (Priorytet: 🟢 Niski)

Dodać `role="menu"` i `role="menuitem"` na elementach mega-menu.

#### P11.3 — Features cards — usunąć cursor-pointer (Priorytet: 🔴 Wysoki)

[Features.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/components/Features.astro#L18): `<div class="... cursor-pointer">` — sugeruje klikalność, ale element nie jest interaktywny. Albo dodać `<a>`, albo usunąć `cursor-pointer`.

#### P11.4 — Label na wyszukiwarce (Priorytet: 🟡 Średni)

`<input type="search" placeholder="Szukaj...">` — brak `<label>` (placeholder nie jest zamiennikiem labela).

---

## 12. Wydajność

### Problemy

#### Ogromny obraz w public/

[222_mundurowi.jpg](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/public/images/222_mundurowi.jpg) waży **7MB**. Nawet jeśli nie jest aktualnie serwowany, to:

- Zwiększa rozmiar repozytorium
- Może być przypadkowo podlinkowany

#### Brak Astro `<Image>` optimization

Wszystkie obrazy na stronie używają surowego `<img>` zamiast Astro `<Image>`:

- [Hero.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/components/Hero.astro#L6): `<img src="/images/333_mundurowi.jpg">`
- Blog karty na stronie głównej: `<img src={post.data.heroImage}>`
- Logo w nawigacji: `<img src="/images/logo-szkoly-light.png">`

#### Global transition na wszystkich elementach

[global.css linie 292-297](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/styles/global.css#L292-L297):

```css
html,
html *,
html *::before,
html *::after {
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    ...;
}
```

To dodaje transition do **każdego elementu na stronie** — potencjalne problemy z wydajnością (repaints).

#### Render-blocking Google Fonts

`<link>` do Google Fonts w `<head>` blokuje renderowanie.

### Propozycje zmian

#### P12.1 — Optymalizacja obrazów (Priorytet: 🔴 Wysoki)

- Usunąć lub skompresować `222_mundurowi.jpg` (7MB → ~200KB)
- Przenieść obrazy z `public/images/` do `src/assets/` i użyć `<Image>` komponentu Astro
- Dodać `loading="lazy"` na obrazach poniżej fold

#### P12.2 — Ograniczyć global transitions (Priorytet: 🟡 Średni)

Zamiast `html *`, stosować transitions tylko na elementach które tego potrzebują (header, karty, przyciski).

#### P12.3 — Lazy loading Google Fonts (Priorytet: 🟡 Średni)

Użyć `<link rel="preload" as="style">` + `onload` pattern lub Astro font providers.

---

## 13. SEO i meta tagi

### Stan obecny

> [!WARNING]
> [Layout.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/layouts/Layout.astro#L25) ustawia `<meta name="description" content={title}>` — opis jest **identyczny z tytułem**. Brak:
>
> - Open Graph tags
> - Twitter Cards
> - Canonical URL
> - Favicon `<link>`
> - Sitemap `<link>`
> - RSS `<link>`
>
> Wszystko to **istnieje** w [BaseHead.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/components/BaseHead.astro), który **nie jest używany**.

### Propozycje zmian

#### P13.1 — Zintegrować BaseHead.astro (Priorytet: 🔴 Krytyczny)

Importować `<BaseHead>` w Layout.astro i przekazywać props `title`, `description`, `image`.

#### P13.2 — Unikalne meta description na każdej stronie (Priorytet: 🟡 Średni)

Każda strona powinna mieć unikalny opis. Dodać prop `description` do Layout.astro i używać go na podstronach.

#### P13.3 — Structured data (JSON-LD) (Priorytet: 🟢 Niski)

Dodać schema.org markup:

- `EducationalOrganization` na stronie głównej
- `Article` na wpisach blogowych
- `BreadcrumbList` na podstronach

---

## 14. Komponenty i reużywalność

### Nieużywane komponenty (dead code)

| Komponent                                                                                                                  | Status                           |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| [BaseHead.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/components/BaseHead.astro)             | ❌ Nie importowany               |
| [Header.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/components/Header.astro)                 | ❌ Zastąpiony MegaNav            |
| [HeaderLink.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/components/HeaderLink.astro)         | ❌ Zastąpiony inline links       |
| [Image.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/components/Image.astro)                   | ❌ Nie używany                   |
| [IconContact.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/components/icons/IconContact.astro) | ❌ Tylko w zakomentowanym kodzie |
| [IconLab.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/components/icons/IconLab.astro)         | ❌ Tylko w zakomentowanym kodzie |
| [IconMission.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/components/icons/IconMission.astro) | ❌ Tylko w zakomentowanym kodzie |
| [IconStats.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/components/icons/IconStats.astro)     | ❌ Tylko w zakomentowanym kodzie |

### Brakujące komponenty

Wiele wzorców powtarza się na stronach ale nie ma dla nich komponentów:

#### P14.1 — Nowe komponenty do stworzenia (Priorytet: 🟡 Średni)

| Komponent             | Uzasadnienie                                                          |
| --------------------- | --------------------------------------------------------------------- |
| `<SectionHeader />`   | Nagłówek sekcji z eyebrow + tytuł + opis — powtarza się 10+ razy      |
| `<Card />`            | Karta z ikoną, tytułem, opisem — powtarza się 20+ razy                |
| `<SchoolStructure />` | Identyczny kod na homepage i informacje                               |
| `<PageHero />`        | Hero section podstrony z tytułem — każda strona ma inną implementację |
| `<Icon />`            | Zunifikowany komponent SVG icon — zamiast 20+ inline SVG              |
| `<Breadcrumbs />`     | Nawigacja kontekstowa                                                 |
| `<MapEmbed />`        | Google Maps z fallbackiem                                             |

---

## 15. Martwy kod i artefakty

### Do usunięcia/konsolidacji

| Element                                                                                                            | Opis                                    | Akcja                              |
| ------------------------------------------------------------------------------------------------------------------ | --------------------------------------- | ---------------------------------- |
| [about.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/pages/about.astro)                | Lorem Ipsum, tytuł "About Me"           | Usunąć lub zastąpić polską treścią |
| [Header.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/components/Header.astro) (51KB!) | Stary komponent nawigacji               | Usunąć                             |
| [HeaderLink.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/components/HeaderLink.astro) | Stary link component                    | Usunąć                             |
| [Nav.astro](file:///c:/Users/piotr/Documents/GitHub/zseiulaziska.github.io/src/components/Nav.astro) (51KB!)       | Stary/alternatywny nav — ogromny plik   | Usunąć                             |
| 4 × Icon\*.astro                                                                                                   | Używane tylko w zakomentowanym kodzie   | Usunąć lub reaktywować             |
| `src/assets/blog-placeholder-*`                                                                                    | 6 placeholder obrazów ze startera Astro | Usunąć                             |
| `public/images/222_mundurowi.jpg`                                                                                  | 7MB obraz                               | Usunąć lub skompresować            |
| `public/logo-szkoly-mono-light.jpg`                                                                                | Duplikat w root public                  | Przenieść do images/               |
| Zakomentowany HTML w index.astro                                                                                   | 80 linii                                | Usunąć                             |

---

## Priorytetyzacja zmian

### 🔴 Faza 1 — Krytyczne (natychmiastowe naprawy)

| #     | Zmiana                                    | Estymacja | Pliki             |
| ----- | ----------------------------------------- | --------- | ----------------- |
| P4.1  | Naprawić zepsuty link „Plan lekcji"       | 5 min     | MegaNav.astro     |
| P7.2  | Dodać link powrotu w planie lekcji        | 15 min    | plan-lekcji.astro |
| P8.1  | Usunąć/zastąpić about.astro (Lorem Ipsum) | 15 min    | about.astro       |
| P8.3  | Tłumaczenie „Last updated on" → polski    | 5 min     | BlogPost.astro    |
| P11.3 | Usunąć cursor-pointer z nieklikanych kart | 5 min     | Features.astro    |
| P5.1  | Uczynić karty mundurowe klikalnymi        | 15 min    | index.astro       |

### 🔴 Faza 2 — Architektura i SEO (1-2 dni)

| #     | Zmiana                                    | Estymacja | Pliki                                           |
| ----- | ----------------------------------------- | --------- | ----------------------------------------------- |
| P13.1 | Zintegrować BaseHead.astro z Layout.astro | 1h        | Layout.astro, BaseHead.astro                    |
| P1.2  | Jeden layout bazowy (BlogPost → Layout)   | 2h        | BlogPost.astro, Layout.astro                    |
| P3.2  | Zunifikowany dark mode z localStorage     | 1h        | Layout.astro                                    |
| P2.1  | Uporządkować fonty (max 2 rodziny)        | 1h        | global.css, Layout.astro, astro.config.mjs      |
| P1.1  | Zdefiniować tokeny designu                | 2h        | global.css                                      |
| P15   | Usunąć martwy kod                         | 30 min    | Header.astro, Nav.astro, HeaderLink.astro, etc. |
| P12.1 | Optymalizacja obrazów                     | 1h        | Hero.astro, index.astro, public/images/         |

### 🟡 Faza 3 — Komponenty i UX (3-5 dni)

| #     | Zmiana                              | Estymacja | Pliki                               |
| ----- | ----------------------------------- | --------- | ----------------------------------- |
| P14.1 | Stworzyć reużywalne komponenty      | 4h        | Nowe pliki w components/            |
| P4.2  | Wypełnić lub usunąć strony-zaślepki | 4h        | ~15 plików w pages/                 |
| P7.1  | Integracja planu lekcji z layoutem  | 3h        | plan-lekcji.astro                   |
| P6.4  | Content collections dla nauczycieli | 2h        | grono-pedagogiczne.astro, nowy YAML |
| P9.1  | Rozbudowana stopka                  | 1h        | Footer.astro                        |
| P4.4  | Breadcrumbs                         | 1h        | Nowy komponent + Layout.astro       |
| P3.1  | Favicon w kolorystyce strony        | 15 min    | favicon.svg                         |

### 🟢 Faza 4 — Polerowanie (opcjonalne)

| #     | Zmiana                                       | Estymacja |
| ----- | -------------------------------------------- | --------- |
| P5.4  | Animacje scroll-reveal                       | 2h        |
| P5.5  | Animowany licznik statystyk                  | 1h        |
| P6.5  | Filtrowanie nauczycieli                      | 2h        |
| P13.3 | Structured data (JSON-LD)                    | 2h        |
| P10.2 | Container queries                            | 1h        |
| P8.5  | Content collections dla kierunków, historii  | 3h        |
| P6.3  | Sticky table of contents na informacje.astro | 2h        |

---

> [!IMPORTANT]
> **Pytanie do decyzji**: Jak podejść do strony planu lekcji?
>
> - **Opcja A** (szybka): Owinąć w Layout.astro z nawigacją, zmienić kolory na niebieskie, ale zachować wewnętrzny CSS
> - **Opcja B** (gruntowna): Przepisać plan lekcji na Tailwind i pełną integrację z design systemem
>
> Opcja A jest zalecana na start — daje natychmiastową poprawę spójności przy minimalnym ryzyku rozbicia istniejącej logiki SPA.

> [!IMPORTANT]
> **Pytanie do decyzji**: Co zrobić ze stronami-zaślepkami (15 stron z 1-2 linkami)?
>
> - **Opcja A**: Wypełnić treścią (wymaga dostarczenia contentu)
> - **Opcja B**: Usunąć i przekierować linki w mega-menu do sekcji na istniejących stronach lub bezpośrednio do zewnętrznych zasobów
