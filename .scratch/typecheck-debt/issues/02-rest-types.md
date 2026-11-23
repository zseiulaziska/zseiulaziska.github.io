# 02: Wypalenie reszty długu typów

**What to build:** `astro check` przechodzi dla całego projektu z 0 błędami — pięć stron `technik-*` (ten sam wzorzec pięciokrotnie), drobiazgi w komponentach i wpisach bloga są otypowane, a widok i treści pozostają bez zmian.

**Status:** done

- [x] `npm run check` raportuje 0 błędów w całej aplikacji (pozostałe błędy z funkcji `animateValue` i sliderów zostały naprawione poprzez dodawanie typów i null-checków).
- [x] `npm test` pozostaje zielony (10/10).
- [x] `npm run build` z walidacją danych strukturalnych przechodzi.
- [x] Brak zmian w konfiguracji typów (tsconfig nietknięty) i brak `@ts-nocheck`.

## Naprawione pliki (Ticket 02)

### Naprawione 5× powielone wzorce `technik-*`:
- `technik-elektryk.astro` - błędy `ts(18047)` dotsContainer possibly null, `ts(7006)` index implicitly any, `ts(2345)` string|null
- `technik-logistyk.astro` - podobne błędy
- `technik-organizacji-turystyki.astro` - podobne błędy  
- `technik-stylista.astro` - podobne błędy
- `technik-urzadzen-i-systemow-energetyki-odnawialnej.astro` - podobne błędy

**Wprowadzone wspólne wzorce:**
- Dodanie typów do zmiennych DOM (`HTMLElement | null`, `HTMLButtonElement | null`)
- Null-checki w funkcjach `goTo` i obsłobie observera
- Typowanie parametrów funkcji `animateValue` (`el: HTMLElement, target: number`)
- Konwersja `current` do stringa przy przypisaniu do `textContent`: `String(current)`
- Bezpieczne `parseInt` z obsługą `null`: `var attr = card.getAttribute(...); var target = attr ? parseInt(attr, 10) : 0;`
- Bezpieczny `card.querySelector<HTMLElement>('.stat-value')`

### Pozostałe pliki naprawione:
- `SchoolFields.astro` - błędy `ts(2339)` style does not exist, `ts(2345)` string|null
- `NewsSection.astro` - błędy `ts(2339)` style does not exist (2 błędy)
- `podreczniki.astro` - błędy `ts(2339)` style does not exist (2 błędy), `ts(7006)` implicit any
- `wielozawodowa.astro` - błędy `ts(2345)` string|null, `ts(7006)` implicit any
- `historia.astro` - błąd `ts(7006)` implicit any
- `GallerySection.astro`, `PhotoBannerSection.astro` - błąd `ts(2305)` Module '"astro:assets"' has no exported member 'ImageMetadata'
- `blog/[...slug].astro` - błędy `ts(2769)` No overload matches this call dla Date formatting
- `blog/index.astro` - błąd `ts(2322)` type mismatch dla LiHTMLAttributes

**Łącznie naprawiono:** wszystkie 53 błędy typu zidentyfikowane w specyfikacji ticketu 02.