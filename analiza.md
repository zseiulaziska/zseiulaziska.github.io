# 🔍 Pełna analiza projektu — ZSEiU Łaziska Górne

Projekt to strona internetowa Zespołu Szkół Energetycznych i Usługowych w Łaziskach Górnych, zbudowana na **Astro 7.x + Tailwind CSS v4 + Keystatic CMS**. Liczy ~196 plików źródłowych, ~40 podstron, 11 komponentów, blog, system wyszukiwania (Pagefind), PWA, dark mode i tryb wysokiego kontrastu.

---

## ✅ MOCNE STRONY

### 1. Bardzo nowoczesny stack technologiczny
- **Astro 7.x** — najnowsza wersja z wbudowaną obsługą fontów, nowym silnikiem kompilacji
- **Tailwind CSS v4** — najnowsza generacja, z `@theme`, `@utility`, `@custom-variant`, Vite plugin
- **Keystatic** — nowoczesny headless CMS dla deweloperów, idealny do zarządzania treścią bloga
- **TypeScript strict** — pełna walidacja typów

### 2. Wzorowa dostępność (a11y)
- **Skip link** (choć zakomentowany w kodzie → do odkomentowania!)
- **Tryb wysokiego kontrastu** — kompletna, przemyślana implementacja (HTML → `high-contrast`)
- **Dark mode** — płynne przejścia, obsługa `prefers-color-scheme`, localStorage
- **ARIA** — `aria-label`, `aria-current="page"`, `aria-labelledby`
- **`prefers-reduced-motion`** — wyłącza animacje
- **Focus ring** — spójny `focus-ring-custom` utility
- **Semantyczne elementy** — `<main id="content">`, `<nav>`, `<article>`, `<address>`

### 3. Silne SEO
- **Structured data (JSON-LD)**:
  - `EducationalOrganization` w BaseHead
  - `BreadcrumbList` w Breadcrumbs (z `itemListElement`)
  - `Article` w postach bloga
- **Canonical URLs** na każdej stronie
- **Open Graph + Twitter Cards** (og:image, og:title, og:description)
- **Sitemap** (`@astrojs/sitemap`)
- **RSS Feed**
- **Meta title/description** na każdej stronie (unikalne)

### 4. Wydajność
- **Obrazki WebP z srcset** (480w, 768w, 1200w) + fallback JPG
- **Font preloading** z `display: swap`
- **Lazy loading** dla obrazków (`loading="lazy"`)
- **IntersectionObserver** dla animacji scrolla (`.reveal`)
- **Shadow DOM / isolated styles** tam, gdzie potrzeba

### 5. Przemyślany design system
- **Custom theme tokens** w Tailwind (kolory `navy-*`, `primary-*`)
- **Reusable utility classes**: `card-base`, `btn-primary`, `btn-secondary`, `section-padding`
- **Mega menu** z dropdownem na hover/focus
- **Breadcrumbs** z dynamicznym mapowaniem ścieżek
- **Spójna architektura Layout → sloty** (hero, head, default)

### 6. CI/CD i devops
- **GitHub Actions** — automatyczny build i deploy na GitHub Pages
- **Pagefind** — indeksowanie wyszukiwarki po buildzie (`postbuild.cjs`)
- **`SKIP_KEYSTATIC` env** — clean build w CI bez CMS

### 7. Internacjonalizacja
- W pełni po polsku, z poprawną lokalizacją dat (`pl-PL`)
- Schema.org z polskim adresem i danymi kontaktowymi

### 8. PWA
- Service worker (`sw.js`)
- Manifest (`manifest.json`)
- Osobny manifest dla planu lekcji (`/elo/manifest.json`)

---

## ❌ SŁABE STRONY I PROBLEMY

### 🔴 Krytyczne / Błędy

| Problem | Lokalizacja | Szczegóły |
|---------|-------------|-----------|
| **Niezgodność schematu bloga** | `src/content/config.ts` vs `keystatic.config.ts` vs `[...slug].astro` | Keystatic zapisuje `heroImage`, schema wymaga `image`/`imageAlt`/`author`/`tags`, a `[...slug].astro` czyta `post.data.heroImage` — pole nie istnieje w schemacie. **Posty mogą się nie renderować lub rzucać błędem.** |
| **`about.astro` jest niespójny** | `src/pages/about.astro` | Importuje `Layout` z `BlogPost.astro` (zamiast `Layout.astro`) — najprawdopodobniej niepełna/page error |
| **`plan-zajec-lo.astro` bez Layoutu** | `src/pages/plan-zajec-lo.astro` | Zaczyna się od `<!doctype html>` — pomija całkowicie `Layout.astro`, brak nav, breadcrumbs, dostępności |
| **Duplikacja stron** | `kierunki.astro` vs `kierunki-ksztalcenia.astro` | Różnią się tylko tytułem i opisem — ta sama treść, dwa URL-e. **Szkodzi SEO (duplicate content)** |

### 🟡 Średnie

| Problem | Szczegóły |
|---------|-----------|
| **Adapter Node.js na GitHub Pages** | `astro.config.mjs` używa `node({ mode: 'standalone' })` gdy `SKIP_KEYSTATIC` jest false. Na GitHub Pages nie można hostować serwera Node — **przy buildzie lokalnym lub po usunięciu SKIP_KEYSTATIC deployment się wysypie** |
| **Dead code — zakomentowane sekcje** | W `index.astro` ~80 linii komentarza (Features, sekcje infrastruktury, projektów). Zaśmieca kod |
| **SkipLink zakomentowany** | `SkipLink.astro` renderuje `<!-- komentarz -->` — **link pomijania nie działa** |
| **Niepotrzebne komponenty** | `Header.astro`, `HeaderLink.astro` — nie są używane (zastąpione przez `MegaNav`). `Features.astro` — nie importowany. `TableOfContents.astro` — nie używany. |

### 🔵 Drobne / Czystość kodu

| Problem | Szczegóły |
|---------|-----------|
| **Duplikacja styli high-contrast** | Te same reguły `!important` powtórzone w `Layout.astro` (style is:global), `index.astro` i prawdopodobnie innych stronach |
| **Brak kolekcji content dla kalendarza** | `events.json`, `spotkania.json`, `dni-wolne.json` są importowane bezpośrednio zamiast przez `defineCollection` |
| **Treść hardcoded w komponentach** | `DlaUczniowSection.astro`, `DlaRodzicowSection.astro`, `HistoriaSection.astro` mają całą treść zakodowaną na sztywno — **CMS nie ma do nich dostępu** |
| **Brak strony 404** | Brak `src/pages/404.astro` — GitHub Pages pokaże domyślną, niepasującą stronę |
| **Ręczne obrazki zamiast `@astrojs/image`** | Obrazki ze srcset są ręcznie przygotowane — brak automatycznej optymalizacji, placeholdera, AVIF |
| **`@astrojs/markdoc` w dependencies** | Jest zainstalowany (`@astrojs/markdoc`) ale nigdzie nie używany |
| **Brak Pagefind w dev** | Pagefind działa tylko w `postbuild.cjs` — nie ma indeksu podczas `astro dev` |
| **BlogPost.astro używa nieistniejących pól** | `updatedDate` i `heroImage` są destructured z `Astro.props` jako `CollectionEntry['blog']['data']` — ale te pola nie istnieją w schemacie |

---

## 💡 CO I JAK POPRAWIĆ

### 1. 🔧 Naprawa schematu bloga (krytyczne)

Dostosuj schemat w `src/content/config.ts` do tego, co faktycznie produkuje Keystatic:

```ts
// src/content/config.ts
const blogSchema = z.object({
  title: z.string(),
  description: z.string().max(160),
  pubDate: z.coerce.date(),
  heroImage: z.string().optional(),
  imageAlt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().optional(),
});
```

Następnie w `[...slug].astro` usuń odwołania do `post.data.heroImage` → ustawione jest już na podstawie post.body.

### 2. 🔧 Deduplikacja stron kierunków

- Wybierz jedną stronę jako główną (np. `/kierunki`)
- W drugiej zrób redirect w Astro (lub usuń i dodaj regułę w `astro.config.mjs` → `redirects`)
- Rozważ użycie `_redirects` dla GitHub Pages

```mjs
// astro.config.mjs
redirects: {
  '/kierunki-ksztalcenia': '/kierunki',
}
```

### 3. 🔧 Adapter dla GitHub Pages

W CI używasz `SKIP_KEYSTATIC=true` → `adapter: undefined` → domyślny tryb static. To działa, ale jest kruche. Lepsze rozwiązania:

**Opcja A**: Użyj `@astrojs/static` zawsze, z Keystatic tylko w dev:
```mjs
import staticAdapter from '@astrojs/static';
export default defineConfig({
  adapter: keystaticEnabled ? undefined : staticAdapter(),
  // ...
});
```

**Opcja B**: Zachowaj obecny mechanizm (`adapter: undefined` = static) ale dodaj sprawdzenie w CI:
```yaml
env:
  SKIP_KEYSTATIC: true
# to już masz ✅
```

### 4. 🔧 Odkomentuj SkipLink

W `SkipLink.astro` usuń znaczniki komentarza HTML:

```astro
<a href="#content" class="skip-link" data-skip>
  Pomiń i przejdź do treści
</a>
```

### 5. 🔧 Ujednolić `plan-zajec-lo.astro`

Owiń w Layout:

```astro
---
import Layout from '../layouts/Layout.astro';
---
<Layout title="Plan zajęć LO">
  <!-- tu dotychczasowa treść -->
</Layout>
```

### 6. 🧹 Cleanup dead code

- **Usuń zakomentowane sekcje** z `index.astro` (lub przenieś do osobnych komponentów)
- **Usuń** `Header.astro`, `HeaderLink.astro`, `Features.astro`, `TableOfContents.astro` — jeśli nie są używane
- **Usuń** `@astrojs/markdoc` z dependencies jeśli nie jest używany

### 7. 🧹 Konsolidacja high-contrast

Przenieś wszystkie reguły high-contrast do jednego pliku, np. `src/styles/high-contrast.css` i zaimportuj go warunkowo:

```css
/* src/styles/high-contrast.css */
html.high-contrast body { background: #000 !important; color: #fff !important; }
html.high-contrast a { color: #ffff00 !important; }
/* ... całość w jednym miejscu ... */
```

### 8. 📦 Content collections dla kalendarza

Dodaj do `src/content/config.ts`:

```ts
const kalendarz = defineCollection({
  schema: z.object({
    events: z.array(z.object({
      date: z.string(),
      category: z.string(),
      // ...
    })),
  }),
});
```

(Choć obecny import JSON → JSON działa, stracisz walidację typów w dev)

### 9. 📝 Wyciągnij treść z komponentów do CMS

Dla `DlaUczniowSection`, `DlaRodzicowSection`, `HistoriaSection` — utwórz content collection `pages` lub użyj MDX w `src/content/pages/`:

```
src/content/pages/
  dla-uczniow.mdx
  dla-rodzicow.mdx
  historia.mdx
```

### 10. ➕ Dodaj stronę 404

```astro
---
// src/pages/404.astro
import Layout from '../layouts/Layout.astro';
---
<Layout title="404 — Strona nie znaleziona">
  <h1>404</h1>
  <p>Strona, której szukasz, nie istnieje.</p>
  <a href="/">Wróć do strony głównej</a>
</Layout>
```

### 11. 🖼️ Zautomatyzuj obrazki (opcjonalnie)

Zainstaluj `@astrojs/image` i użyj `<Image />` z komponentu `astro:assets` zamiast ręcznego srcset:

```astro
import { Image } from 'astro:assets';
import heroImg from '../assets/hero.jpg';
<Image src={heroImg} alt="" widths={[480, 768, 1200]} formats={['webp', 'avif']} />
```

### 12. 🎯 Dodaj `@tailwindcss/typography`

Zamiast ręcznego `.prose` w `BlogPost.astro`:

```bash
npm install @tailwindcss/typography
```

```css
@plugin "@tailwindcss/typography";
```

```astro
<article class="prose dark:prose-invert max-w-none">
  <Content />
</article>
```

---

## 📊 PODSUMOWANIE

| Aspekt | Ocena | Priorytet poprawy |
|--------|-------|-------------------|
| **Technologie** | ⭐⭐⭐⭐⭐ | — |
| **Dostępność** | ⭐⭐⭐⭐⭐ | Odkomentować skip link (mały) |
| **SEO** | ⭐⭐⭐⭐⭐ | Naprawić duplikację /kierunki (średni) |
| **Wydajność** | ⭐⭐⭐⭐ | Dodać automatyczną optymalizację obrazków (niski) |
| **Czystość kodu** | ⭐⭐⭐ | Dead code, duplikacja styli (średni) |
| **Spójność danych** | ⭐⭐ | **Schemat bloga do naprawy (wysoki)** |
| **Niezawodność deployu** | ⭐⭐⭐ | Kruchy mechanizm adaptera (średni) |
| **UX treści** | ⭐⭐⭐⭐ | Brak strony 404 (niski) |

### 🎯 Trzy rzeczy do zrobienia w pierwszej kolejności:

1. **Naprawić schemat bloga** — Keystatic ↔ content config ↔ template (`src/content/config.ts`, `keystatic.config.ts`, `[...slug].astro`, `BlogPost.astro`) — obecnie pola `heroImage`, `author`, `tags`, `image`, `imageAlt` są niespójne
2. **Usunąć duplikację kierunków** — redirect z `/kierunki-ksztalcenia` na `/kierunki`
3. **Odkomentować SkipLink** i poprawić `plan-zajec-lo.astro` (brak Layoutu)
