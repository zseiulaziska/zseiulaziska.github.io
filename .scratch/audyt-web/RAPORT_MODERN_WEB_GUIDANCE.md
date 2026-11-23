# Kompleksowy Raport i Specyfikacja Modernizacji Webowej (Modern Web Guidance)

**Data audytu:** 23 listopada 2026 r.  
**Narzędzie:** `modern-web-guidance@latest` (wersja reguł: `2026_11_10-47b4c80e`)  
**Projekt:** Zespół Szkół Energetycznych i Usługowych w Łaziskach Górnych (`zseiulaziska.pl`)  
**Stack technologiczny:** Astro 5/7, Tailwind CSS v4, Cloudflare (Pages/Workers), Pagefind, Keystatic, TypeScript  
**Pliki źródłowe audytu:** `.scratch/audyt-web/spec.md`, `.scratch/audyt-web/RAPORT_MODERN_WEB_GUIDANCE.md`  

---

## 1. Wstęp i synteza obu raportów

Porównanie raportu wygenerowanego przez asystenta z plikiem `spec.md` wykazało **bardzo wysoką synergię i wzajemne uzupełnianie się ustaleń**. Wszystkie fakty techniczne w `spec.md` są poprawne, a połączenie obu analiz daje kompletny, całościowy audyt witryny.

### Główne punkty zbieżne (potwierdzone w obu raportach):
1. **ES2023 `toSorted()`**: `src/pages/grono-pedagogiczne.astro:14` – zastąpienie płytkiej kopii `[...teachers].sort(...)` niemutującą metodą `toSorted()`.
2. **Natywne `replaceChildren()`**: `src/components/MegaNav.astro:447` – czyszczenie listy przez `replaceChildren()` zamiast wywoływania parsera HTML przez `innerHTML = ''`.
3. **Podatność i sink XSS w wyszukiwarce**: `src/components/MegaNav.astro:485` – pole `item.excerpt` jako jedyne wstawiane jest bez funkcji `escapeHtml()`.
4. **[ZROBIONE #05] Usunięto martwy komponent `Image.astro`**: plik nie był nigdzie importowany; usunięty w ramach porządków repo.
5. **Niepełna ochrona `prefers-reduced-motion`** w animacjach.
6. **Kwestia Service Workera i assetów w `public/`**.

### Kluczowa wartość dodana wniesiona przez `spec.md`:
- **Brak nagłówków bezpieczeństwa (CSP, HSTS itp.)**: identyfikacja braku `public/_headers` i konfiguracji w `wrangler.jsonc`.
- **Brak `rel="noopener noreferrer"` w `dokumenty.astro:29, 37, 45`**: precyzyjne namierzenie 3 jedynych zewnętrznych linków BIP podatnych na reverse tabnabbing.
- **[ZROBIONE #05] Weryfikacja martwego kodu `Image.astro`**: potwierdzono brak importów; plik usunięty.
- **Nadużycie wzorca ARIA Tabs w `SchoolFields.astro:184-199`**: filtry kierunków mają `role="tablist"`/`role="tab"`, ale brak im obsługi klawiatury (ArrowLeft/Right, roving tabindex) – powinny być przyciskami `aria-pressed`.
- **Zidentyfikowanie podprojektu `public/elo/`**: wyjaśnienie obecności `sw.js` i `manifest.json` oraz namierzenie tam starych wzorców `innerHTML = ''`.
- **Semantyczny tag `<search>`**: możliwość wdrożenia w oknie wyszukiwania.

### Kluczowa wartość dodana naszego raportu (i korekta założeń `spec.md`):
- **Ważna korekta LCP w `Hero.astro`**: W `spec.md` oznaczono LCP jako "wzorcowy z `priority`". **Uwaga:** atrybut `priority` to konwencja z Next.js (`next/image`), natomiast w komponencie `<Picture>` Astro należy upewnić się, że tag `<img>` otrzymuje natywne atrybuty HTML: `loading="eager"` oraz `fetchpriority="high"`. Bez nich przeglądarka może nie podnieść priorytetu sieciowego LCP.
- **Tryb ciemny i theming (`color-scheme`)**: identyfikacja braku `<meta name="color-scheme" content="light dark">` oraz deklaracji CSS `color-scheme: light dark;` / `color-scheme: dark;` (co powoduje, że natywne paski przewijania i formularze w trybie ciemnym pozostają białe).
- **Fałszywy `cursor-pointer` na nieklikalnych `<div>`**: wykrycie klas `cursor-pointer` na statycznych kafelkach profilu mundurowego (`index.astro:67,79,91`) oraz dyrektorów szkoły (`historia.astro:267-300`), co wprowadza użytkowników w błąd i łamie zasady affordancji.
- **Błędny `tabindex="0"` na artykułach timeline**: `TimelineEvent.astro:67` niepotrzebnie zanieczyszcza sekwencję tabulatora dla użytkowników klawiatury.
- **Dynamiczne jednostki viewportu (`100dvh` vs `100vh`)**: w `plan-lekcji.astro:21` zapobiegające przeskokom na urządzeniach mobilnych.
- **Martwe czcionki Atkinson**: `src/assets/fonts/atkinson-*.woff` – zbędne pliki pozostawione po szablonie Astro.

---

## 2. Zharmonizowana macierz priorytetów wdrożeniowych

---

### Priorytet 1 — Bezpieczeństwo i Integralność (Krytyczny / Najwyższy ROI)

#### 1.1 Konfiguracja nagłówków bezpieczeństwa Cloudflare (`public/_headers`) 🔴
- **Problem:** Brak nagłówków HTTP w projekcie Cloudflare Pages / Workers.
- **Rozwiązanie:** Utworzenie pliku `public/_headers` z regułami:
  ```http
  /*
    X-Content-Type-Options: nosniff
    X-Frame-Options: SAMEORIGIN
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: camera=(), microphone=(), geolocation=()
    Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
    Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; frame-src 'self' https://zseiulaziska.github.io https://www.google.com https://maps.google.com; connect-src 'self' https://script.google.com;
  ```

#### 1.2 Zabezpieczenie linków zewnętrznych BIP (`rel="noopener noreferrer"`) 🟡
- **Lokalizacja:** `src/pages/dokumenty.astro:29, 37, 45`
- **Rozwiązanie:** Dopisanie atrybutu `rel="noopener noreferrer"` do 3 linków otwierających statuty w nowej karcie (`target="_blank"`), zapobiegając atakom typu *reverse tabnabbing*.

#### 1.3 Zabezpieczenie sinka XSS w wyszukiwarce 🟡
- **Lokalizacja:** `src/components/MegaNav.astro:485`
- **Rozwiązanie:** Opakowanie fragmentu tekstu w istniejącą funkcję sanityzującą:
  ```javascript
  // Przed:
  '<span class="search-result-excerpt">' + (item.excerpt || '') + '</span>'
  // Po:
  '<span class="search-result-excerpt">' + escapeHtml(item.excerpt || '') + '</span>'
  ```

---

### Priorytet 2 — Dostępność cyfrowa (WCAG 2.1 AA dla szkoły publicznej)

#### 2.1 Zamiana niepoprawnego wzorca Tabs na `aria-pressed` w `SchoolFields.astro` 🟡
- **Lokalizacja:** `src/components/SchoolFields.astro:184-199` oraz `344-389`
- **Problem:** Elementy mają `role="tablist"` i `role="tab"`, ale brak jakiejkolwiek obsługi klawiatury (`ArrowLeft/Right`, Home/End, roving tabindex). W rzeczywistości jest to panel filtrujący, a nie zestaw paneli zakładek.
- **Rozwiązanie:** Usunięcie `role="tablist"` / `role="tab"`, zamiana na grupę przycisków z `aria-pressed="true|false"` (analogicznie jak w `HarmonogramTurnusow.astro:99-125`).

#### 2.2 Usunięcie mylącego `cursor-pointer` ze statycznych elementów 🟡
- **Lokalizacja:** `src/pages/index.astro:67, 79, 91` oraz `src/pages/historia.astro:267-300`
- **Problem:** Klasa `cursor-pointer` oraz stany `hover:shadow-...` na zwykłych `<div>`ach sugerują klikalność, wprowadzając użytkowników w błąd.
- **Rozwiązanie:** Usunięcie klasy `cursor-pointer` ze statycznych kart.

#### 2.3 Usunięcie zbędnego `tabindex="0"` z kafelków timeline 🟡
- **Lokalizacja:** `src/components/TimelineEvent.astro:67`
- **Rozwiązanie:** Usunięcie `tabindex="0"`. Treści statyczne nie powinny być umieszczane w sekwencji tabulacji klawiatury.

#### 2.4 Rozszerzenie obsługi `prefers-reduced-motion` 🔵
- **Lokalizacja:** `src/pages/kalendarz.astro:107-140` oraz `src/styles/global.css:544-562`
- **Rozwiązanie:**
  1. W `kalendarz.astro` dodać sprawdzenie `window.matchMedia('(prefers-reduced-motion: reduce)').matches` i w razie prawdy natychmiast ustawić wartość docelową licznika bez animacji `setInterval`.
  2. W `global.css` przenieść regułę `.reveal` tak, aby `@media (prefers-reduced-motion: reduce)` bezwzględnie nadpisywał ukrycie `opacity: 0`.

#### 2.5 Dostępność fokusu w trybie wysokiego kontrastu 🟡
- **Lokalizacja:** `src/styles/high-contrast.css:113`
- **Rozwiązanie:** Zastąpienie `outline: none !important;` wyraźnym obrysem `outline: 2px solid #ffff00 !important;` z odstępem `outline-offset: 2px`.
- **Integracja z systemem:** Dodanie reguł `@media (forced-colors: active)` i `(prefers-contrast: more)` w celu automatycznego włączania optymalizacji kontrastu dla użytkowników Windows High Contrast Mode.

---

### Priorytet 3 — Standardy platformy webowej (Modern Web Guidance & ES2023)

#### 3.1 Nowoczesne sortowanie tablic ES2023 `toSorted()` (`js/copying-array-methods`)
- **Lokalizacja:** `src/pages/grono-pedagogiczne.astro:14`
- **Rozwiązanie:**
  ```typescript
  // Przed:
  const sorted: Teacher[] = [...teachers].sort((a, b) => lastName(a.name).localeCompare(lastName(b.name), "pl"));
  // Po:
  const sorted: Teacher[] = teachers.toSorted((a, b) => lastName(a.name).localeCompare(lastName(b.name), "pl"));
  ```

#### 3.2 Czyszczenie DOM przez `replaceChildren()` (`js/replace-children-innerhtml`)
- **Lokalizacja:** `src/components/MegaNav.astro:447` oraz `public/elo/index.html:432, 443`
- **Rozwiązanie:**
  ```javascript
  // Przed:
  listbox.innerHTML = '';
  // Po:
  listbox.replaceChildren();
  ```

#### 3.3 Semantyczny znacznik `<search>` (Baseline 2023)
- **Lokalizacja:** `src/components/MegaNav.astro:145`
- **Rozwiązanie:** Zmiana `<div class="site-search">` na semantyczny `<search class="site-search">`.

#### 3.4 Pełna deklaracja `color-scheme` dla Dark Mode (`visual-design/dark-mode`)
- **Lokalizacja:** `src/components/BaseHead.astro` oraz `src/styles/global.css`
- **Rozwiązanie:**
  1. W `<head>` dodać: `<meta name="color-scheme" content="light dark" />`.
  2. W `:root` CSS dodać: `color-scheme: light dark;`, a w `html.dark`: `color-scheme: dark;`.
  Dzięki temu natywne paski przewijania, pola `input`, `select` i domyślne tło płótna automatycznie przyjmują ciemne barwy bez białych rozbłysków.

---

### Priorytet 4 — Wydajność, RWD i higiena repozytorium

#### 4.1 Usunięcie martwego komponentu `Image.astro` ✅ [ZROBIONE #05]
- **Lokalizacja:** `src/components/Image.astro` (usunięty)
- **Działanie:** Potwierdzono brak importów; plik usunięty z repo.

#### 4.2 Usunięcie osieroconych czcionek Atkinson 🔵
- **Lokalizacja:** `src/assets/fonts/atkinson-bold.woff`, `atkinson-regular.woff`
- **Działanie:** Usunąć pliki woff – projekt ładuje czcionki Inter i Montserrat przez Google Font Provider w `astro.config.mjs`.

#### 4.3 Prawidłowe atrybuty LCP dla banera głównego (`performance/optimize-image-priority`)
- **Lokalizacja:** `src/components/Hero.astro:8-17`
- **Rozwiązanie:** Upewnić się, że komponent `<Picture>` generuje `loading="eager"` i `fetchpriority="high"` (sam atrybut `priority` nie jest natywnym parametrem Astro Picture).

#### 4.4 Dynamiczne jednostki wysokości w planie lekcji
- **Lokalizacja:** `src/pages/plan-lekcji.astro:21`
- **Rozwiązanie:** Zamiana `height: calc(100vh - 240px);` na `height: calc(100dvh - 240px);` w celu eliminacji skoków wysokości przy chowaniu pasków przeglądarek mobilnych.

#### 4.5 Uporządkowanie Service Workera i manifestu w `public/`
- **Lokalizacja:** `public/sw.js` oraz `public/manifest.json`
- **Rozwiązanie:** Przenieść `sw.js` i `manifest.json` do katalogu `public/elo/` (gdzie rzeczywiście są używane przez `public/elo/index.html`) lub zaktualizować manifest tak, aby reprezentował całą szkołę ZSEiU, a nie tylko plan lekcji klas 2D-5D.

---

## 3. Rekomendowana kolejność realizacji

```text
Krok 1: Bezpieczeństwo krytyczne
  ├── Utworzenie public/_headers (CSP, HSTS, nagłówki bezpieczeństwa)
  ├── Dodanie rel="noopener noreferrer" w src/pages/dokumenty.astro
  └── Dodanie escapeHtml(item.excerpt) w src/components/MegaNav.astro:485

Krok 2: Czyszczenie martwego kodu
  ├── [ZROBIONE #05] Usunięcie nieużywanego src/components/Image.astro
  └── Usunięcie nieużywanych czcionek src/assets/fonts/atkinson-*.woff

Krok 3: Poprawki dostępności cyfrowej (WCAG 2.1 AA)
  ├── Konwersja filtrów w SchoolFields.astro z role="tab" na aria-pressed
  ├── Usunięcie cursor-pointer ze statycznych <div> (index.astro, historia.astro)
  ├── Usunięcie tabindex="0" z TimelineEvent.astro
  └── Dodanie obsługi prefers-reduced-motion dla liczników w kalendarz.astro

Krok 4: Nowoczesny JS i Theming (Modern Web Guidance)
  ├── Zamiana na toSorted() w grono-pedagogiczne.astro
  ├── Zamiana na replaceChildren() w MegaNav.astro
  ├── Dodanie <meta name="color-scheme" content="light dark"> i reguł CSS color-scheme
  └── Wdrożenie tagu <search> w MegaNav.astro

Krok 5: Optymalizacje RWD i wydajności
  ├── Zamiana 100vh na 100dvh w plan-lekcji.astro
  └── Weryfikacja fetchpriority="high" i loading="eager" w Hero.astro
```
