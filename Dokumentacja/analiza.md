Pełna analiza projektu — ZSEiU Łaziska Górne                                                                                                              
                                                                                                                                                              
 Projekt to strona internetowa Zespołu Szkół Energetycznych i Usługowych w Łaziskach Górnych, zbudowana na Astro 7.x + Tailwind CSS v4 + Keystatic CMS. Liczy 
 ~196 plików źródłowych, ~40 podstron, 11 komponentów, blog, system wyszukiwania (Pagefind), PWA, dark mode i tryb wysokiego kontrastu.                       
                                                                                                                                                              
 ────────────────────────────────────────────────────────────────────────────────                                                                             
                                                                                                                                                              
 ✅ MOCNE STRONY                                                                                                                                              
                                                                                                                                                              
 ### 1. Bardzo nowoczesny stack technologiczny                                                                                                                
                                                                                                                                                              
 - Astro 7.x — najnowsza wersja z wbudowaną obsługą fontów, nowym silnikiem kompilacji                                                                        
 - Tailwind CSS v4 — najnowsza generacja, z @theme, @utility, @custom-variant, Vite plugin                                                                    
 - Keystatic — nowoczesny headless CMS dla deweloperów, idealny do zarządzania treścią bloga                                                                  
 - TypeScript strict — pełna walidacja typów                                                                                                                  
                                                                                                                                                              
 ### 2. Wzorowa dostępność (a11y)                                                                                                                             
                                                                                                                                                              
 - Skip link (choć zakomentowany w kodzie → do odkomentowania!)                                                                                               
 - Tryb wysokiego kontrastu — kompletna, przemyślana implementacja (HTML → high-contrast)                                                                     
 - Dark mode — płynne przejścia, obsługa prefers-color-scheme, localStorage                                                                                   
 - ARIA — aria-label, aria-current="page", aria-labelledby                                                                                                    
 - prefers-reduced-motion — wyłącza animacje                                                                                                                  
 - Focus ring — spójny focus-ring-custom utility                                                                                                              
 - Semantyczne elementy — <main id="content">, <nav>, <article>, <address>                                                                                    
                                                                                                                                                              
 ### 3. Silne SEO                                                                                                                                             
                                                                                                                                                              
 - Structured data (JSON-LD):                                                                                                                                 
     - EducationalOrganization w BaseHead                                                                                                                     
     - BreadcrumbList w Breadcrumbs (z itemListElement)                                                                                                       
     - Article w postach bloga                                                                                                                                
 - Canonical URLs na każdej stronie                                                                                                                           
 - Open Graph + Twitter Cards (og:image, og:title, og:description)                                                                                            
 - Sitemap (@astrojs/sitemap)                                                                                                                                 
 - RSS Feed                                                                                                                                                   
 - Meta title/description na każdej stronie (unikalne)                                                                                                        
                                                                                                                                                              
 ### 4. Wydajność                                                                                                                                             
                                                                                                                                                              
 - Obrazki WebP z srcset (480w, 768w, 1200w) + fallback JPG                                                                                                   
 - Font preloading z display: swap                                                                                                                            
 - Lazy loading dla obrazków (loading="lazy")                                                                                                                 
 - IntersectionObserver dla animacji scrolla (.reveal)                                                                                                        
 - Shadow DOM / isolated styles tam, gdzie potrzeba                                                                                                           
                                                                                                                                                              
 ### 5. Przemyślany design system                                                                                                                             
                                                                                                                                                              
 - Custom theme tokens w Tailwind (kolory navy-*, primary-*)                                                                                                  
 - Reusable utility classes: card-base, btn-primary, btn-secondary, section-padding                                                                           
 - Mega menu z dropdownem na hover/focus                                                                                                                      
 - Breadcrumbs z dynamicznym mapowaniem ścieżek                                                                                                               
 - Spójna architektura Layout → sloty (hero, head, default)                                                                                                   
                                                                                                                                                              
 ### 6. CI/CD i devops                                                                                                                                        
                                                                                                                                                              
 - GitHub Actions — automatyczny build i deploy na GitHub Pages                                                                                               
 - Pagefind — indeksowanie wyszukiwarki po buildzie (postbuild.cjs)                                                                                           
 - SKIP_KEYSTATIC env — clean build w CI bez CMS                                                                                                              
                                                                                                                                                              
 ### 7. Internacjonalizacja                                                                                                                                   
                                                                                                                                                              
 - W pełni po polsku, z poprawną lokalizacją dat (pl-PL)                                                                                                      
 - Schema.org z polskim adresem i danymi kontaktowymi                                                                                                         
                                                                                                                                                              
 ### 8. PWA                                                                                                                                                   
                                                                                                                                                              
 - Service worker (sw.js)                                                                                                                                     
 - Manifest (manifest.json)                                                                                                                                   
 - Osobny manifest dla planu lekcji (/elo/manifest.json)                                                                                                      
                                                                                                                                                              
 ────────────────────────────────────────────────────────────────────────────────                                                                             
                                                                                                                                                              
 ❌ SŁABE STRONY I PROBLEMY                                                                                                                                   
                                                                                                                                                              
 ### 🔴 Krytyczne / Błędy                                                                                                                                     
                                                                                                                                                              
 ┌─────────────────────────┬───────────────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────────┐ 
 │ Problem                 │ Lokalizacja                               │ Szczegóły                                                                          │ 
 ├─────────────────────────┼───────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┤ 


 │ plan-zajec-lo.astro bez │ src/pages/plan-zajec-lo.astro             │ ✅ NAPRAWIONE — owinięty w Layout.astro, dodane widoki dzień/miesiąc/semestr/rok,   │ 
 │ Layoutu                 │                                           │ nawigacja, druk, obsługa klawiatury, dane z Google Apps Script.                     │ 
 ├─────────────────────────┼───────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┤ 
 │ Błąd Tailwind `@apply`  │ src/pages/plan-zajec-lo.astro             │ ✅ NAPRAWIONE — zastąpiono @apply czystym CSS ze zmiennymi projektu (tailwind v4)   │ 
 ├─────────────────────────┼───────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┤ 
 │ Podgląd sąsiednich dni  │ src/pages/plan-zajec-lo.astro             │ ✅ ZROBIONE — w widoku Dzień na desktopie pokazywane 3 karty: poprzedni/bieżący/    │ 
                         │                                           │ następny dzień (boczne przyciemnione). Na mobile tylko bieżący.                     │ 
 ├─────────────────────────┼───────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┤ 
 │ Nawigacja dni w widokach│ src/pages/plan-zajec-lo.astro             │ ✅ ZROBIONE — na mobile (<768px) strzałki przechodzą między dniami także w          │ 
 │ miesięcznych/semestral. │                                           │ widokach Miesiąc, Semestr, Rok.                                                    │ 
 ├─────────────────────────┼───────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┤ 
 │ Rok szkolny w widoku   │ src/pages/plan-zajec-lo.astro             │ ✅ ZROBIONE — widok Rok grupuje daty według roku szkolnego (IX–VI) z etykietą      │ 
 │ Rok                     │                                           │ np. „Rok szkolny 2024/2025”.                                                       │ 
 └─────────────────────────┴───────────────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────────┘ 
                                                                                              
 ### 🟡 Średnie
                                                                                                                                                              
 ┌──────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ 
 │ Problem                  │ Szczegóły                                                                                                                     │ 
 ├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
 │ Adapter Node.js na       │ astro.config.mjs używa node({ mode: 'standalone' }) gdy SKIP_KEYSTATIC jest false. Na GitHub Pages nie można hostować serwera │ 
 │ GitHub Pages             │ Node — przy buildzie lokalnym lub po usunięciu SKIP_KEYSTATIC deployment się wysypie                                          │ 
 ├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
 │ Dead code —              │ W index.astro ~80 linii komentarza (Features, sekcje infrastruktury, projektów). Zaśmieca kod                                 │ 
 │ zakomentowane sekcje     │                                                                                                                               │ 
 ├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
 ├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
 │ Niepotrzebne komponenty  │ Header.astro, HeaderLink.astro — nie są używane (zastąpione przez MegaNav). Features.astro — nie importowany.                 │ 
 │                          │ TableOfContents.astro — nie używany.                                                                                          │ 
 └──────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ 
                                                                                                                                                              
 ### 🔵 Drobne / Czystość kodu                                                                                                                                
                                                                                                                                                              
 ┌─────────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ 
 │ Problem                             │ Szczegóły                                                                                                          │ 
 ├─────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
 │ Duplikacja styli high-contrast      │ Te same reguły !important powtórzone w Layout.astro (style is:global), index.astro i prawdopodobnie innych         │ 
 │                                     │ stronach                                                                                                           │ 
 ├─────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
 │ Brak kolekcji content dla           │ events.json, spotkania.json, dni-wolne.json są importowane bezpośrednio zamiast przez defineCollection             │ 
 │ kalendarza                          │                                                                                                                    │ 
 ├─────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
 │ Treść hardcoded w komponentach      │ DlaUczniowSection.astro, DlaRodzicowSection.astro, HistoriaSection.astro mają całą treść zakodowaną na sztywno —   │ 
 │                                     │ CMS nie ma do nich dostępu                                                                                         │ 
 ├─────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
 │ Brak strony 404                     │ Brak src/pages/404.astro — GitHub Pages pokaże domyślną, niepasującą stronę                                        │ 
 ├─────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
 │ Ręczne obrazki zamiast              │ Obrazki ze srcset są ręcznie przygotowane — brak automatycznej optymalizacji, placeholdera, AVIF                   │ 
 │ @astrojs/image                      │                                                                                                                    │ 
 ├─────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
 │ @astrojs/markdoc w dependencies     │ Jest zainstalowany (@astrojs/markdoc) ale nigdzie nie używany                                                      │ 
 ├─────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
 │ Brak Pagefind w dev                 │ Pagefind działa tylko w postbuild.cjs — nie ma indeksu podczas astro dev                                           │ 
 ├─────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
 └─────────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ 
                                                                                                                                                              
 ────────────────────────────────────────────────────────────────────────────────                                                                             
                                                                                                                                                              
 💡 CO I JAK POPRAWIĆ                                                                                                                                         
                                                                                                                                                              
 ### 1. 🔧 Adapter dla GitHub Pages
                                                                                                                                                              
 W CI używasz SKIP_KEYSTATIC=true → adapter: undefined → domyślny tryb static. To działa, ale jest kruche. Lepsze rozwiązania:                                
                                                                                                                                                              
 Opcja A: Użyj @astrojs/static zawsze, z Keystatic tylko w dev:                                                                                               
                                                                                                                                                              
 ```mjs                                                                                                                                                       
   import staticAdapter from '@astrojs/static';                                                                                                               
   export default defineConfig({                                                                                                                              
     adapter: keystaticEnabled ? undefined : staticAdapter(),                                                                                                 
     // ...                                                                                                                                                   
   });                                                                                                                                                        
 ```                                                                                                                                                          
                                                                                                                                                              
 Opcja B: Zachowaj obecny mechanizm (adapter: undefined = static) ale dodaj sprawdzenie w CI:                                                                 
                                                                                                                                                              
 ```yaml                                                                                                                                                      
   env:                                                                                                                                                       
     SKIP_KEYSTATIC: true                                                                                                                                     
   # to już masz ✅                                                                                                                                           
 ```                                                                                                                                                          
                                                                                                                                                              
 ### 2. 🔧 Ujednolić plan-zajec-lo.astro
                                                                                                                                                              
 Owiń w Layout:                                                                                                                                               
                                                                                                                                                              
 ```astro                                                                                                                                                     
   ---                                                                                                                                                        
   import Layout from '../layouts/Layout.astro';                                                                                                              
   ---                                                                                                                                                        
   <Layout title="Plan zajęć LO">                                                                                                                             
     <!-- tu dotychczasowa treść -->                                                                                                                          
   </Layout>                                                                                                                                                  
 ```                                                                                                                                                          
                                                                                                                                                              
 ### 3. 🧹 Cleanup dead code
                                                                                                                                                              
 - Usuń zakomentowane sekcje z index.astro (lub przenieś do osobnych komponentów)                                                                             
 - Usuń Header.astro, HeaderLink.astro, Features.astro, TableOfContents.astro — jeśli nie są używane                                                          
 - Usuń @astrojs/markdoc z dependencies jeśli nie jest używany                                                                                                
                                                                                                                                                              
 ### 4. 🧹 Konsolidacja high-contrast
                                                                                                                                                              
 Przenieś wszystkie reguły high-contrast do jednego pliku, np. src/styles/high-contrast.css i zaimportuj go warunkowo:                                        
                                                                                                                                                              
 ```css                                                                                                                                                       
   /* src/styles/high-contrast.css */                                                                                                                         
   html.high-contrast body { background: #000 !important; color: #fff !important; }                                                                           
   html.high-contrast a { color: #ffff00 !important; }                                                                                                        
   /* ... całość w jednym miejscu ... */                                                                                                                      
 ```                                                                                                                                                          
                                                                                                                                                              
 ### 5. 📦 Content collections dla kalendarza
                                                                                                                                                              
 Dodaj do src/content/config.ts:                                                                                                                              
                                                                                                                                                              
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
                                                                                                                                                              
 ### 6. 📝 Wyciągnij treść z komponentów do CMS
                                                                                                                                                              
 Dla DlaUczniowSection, DlaRodzicowSection, HistoriaSection — utwórz content collection pages lub użyj MDX w src/content/pages/:                              
                                                                                                                                                              
 ```                                                                                                                                                          
   src/content/pages/                                                                                                                                         
     dla-uczniow.mdx                                                                                                                                          
     dla-rodzicow.mdx                                                                                                                                         
     historia.mdx                                                                                                                                             
 ```                                                                                                                                                          
                                                                                                                                                              
 ### 7. ➕ Dodaj stronę 404
                                                                                                                                                              
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
                                                                                                                                                              
 ### 8. 🖼️ Zautomatyzuj obrazki (opcjonalnie)
                                                                                                                                                              
 Zainstaluj @astrojs/image i użyj <Image /> z komponentu astro:assets zamiast ręcznego srcset:                                                                
                                                                                                                                                              
 ```astro                                                                                                                                                     
   import { Image } from 'astro:assets';                                                                                                                      
   import heroImg from '../assets/hero.jpg';                                                                                                                  
   <Image src={heroImg} alt="" widths={[480, 768, 1200]} formats={['webp', 'avif']} />                                                                        
 ```                                                                                                                                                          
                                                                                                                                                              
 ### 9. 🎯 Dodaj @tailwindcss/typography
                                                                                                                                                              
 Zamiast ręcznego .prose w BlogPost.astro:                                                                                                                    
                                                                                                                                                              
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
                                                                                                                                                              
 ────────────────────────────────────────────────────────────────────────────────                                                                             
                                                                                                                                                              
 📊 PODSUMOWANIE                                                                                                                                              
                                                                                                                                                              
 ┌──────────────────────┬────────────┬───────────────────────────────────────────────────┐                                                                    
 │ Aspekt               │ Ocena      │ Priorytet poprawy                                 │                                                                    
 ├──────────────────────┼────────────┼───────────────────────────────────────────────────┤                                                                    
 │ Technologie          │ ⭐⭐⭐⭐⭐ │ —                                                 │                                                                    
 ├──────────────────────┼────────────┼───────────────────────────────────────────────────┤                                                                    
 │ Dostępność           │ ⭐⭐⭐⭐⭐ │ —                                                 │
 ├──────────────────────┼────────────┼───────────────────────────────────────────────────┤                                                                    
 │ SEO                  │ ⭐⭐⭐⭐⭐ │ —                                                 │
 ├──────────────────────┼────────────┼───────────────────────────────────────────────────┤                                                                    
 │ Wydajność            │ ⭐⭐⭐⭐   │ Dodać automatyczną optymalizację obrazków (niski) │                                                                    
 ├──────────────────────┼────────────┼───────────────────────────────────────────────────┤                                                                    
 │ Czystość kodu        │ ⭐⭐⭐     │ Dead code, duplikacja styli (średni)              │                                                                    
 ├──────────────────────┼────────────┼───────────────────────────────────────────────────┤                                                                    
 │ Spójność danych      │ ⭐⭐⭐⭐   │ —                                                 │ 
 ├──────────────────────┼────────────┼───────────────────────────────────────────────────┤                                                                    
 │ Niezawodność deployu │ ⭐⭐⭐     │ Kruchy mechanizm adaptera (średni)                │                                                                    
 ├──────────────────────┼────────────┼───────────────────────────────────────────────────┤                                                                    
 │ UX treści            │ ⭐⭐⭐⭐   │ Brak strony 404 (niski)                           │                                                                    
 └──────────────────────┴────────────┴───────────────────────────────────────────────────┘                                                                    
                                                                                                                                                              
 ### 🎯 Rzeczy do zrobienia w pierwszej kolejności:
                                                                                                     
 1. **Adapter GitHub Pages** – zastąpić node() na static() lub warunkowo wyłączać adapter gdy SKIP_KEYSTATIC                                                          
 2. **Strona 404** – dodać src/pages/404.astro                                                                                                             
 3. **Dead code** – usunąć @astrojs/markdoc; usunąć Header.astro, HeaderLink.astro, Features.astro, TableOfContents.astro; wyczyścić index.astro          
 4. **High-contrast** – skonsolidować powtarzające się style high-contrast do jednego pliku                                                                
 5. **Content collections dla kalendarza** – zdefiniować kolekcję dla events.json, spotkania.json, dni-wolne.json                                         
 6. **Wyciągnięcie treści do CMS** – przenieść hardcoded treści z DlaUczniowSection, DlaRodzicowSection, HistoriaSection do Keystatic                      
 7. **@astrojs/image** – dodać automatyczną optymalizację obrazków                                                                                         
 8. **@tailwindcss/typography** – dodać dla ładnego formatowania treści                                                                                    