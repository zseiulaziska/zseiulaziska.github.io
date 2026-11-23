# Dług typów `astro check` + guardrail w CI

## Problem Statement

`npm run check` (`astro check`) raportuje 53 błędów w 15 plikach (po usunięciu `src/pages/plan-zajec-lo.astro`, które zawierało 113 błędów). Zostały one zlokalizowane w pięciu kopiach powtarzalnego wzorca na stronach `technik-*`, a pozostałych plikach: `SchoolFields`, `NewsSection`, `blog/*`, `index`, `podreczniki`, `wielozawodowa`, `historia`, `GallerySection`, `PhotoBannerSection`.

## Solution

Spalamy dług w trzech ticketach:

1. **Ticket 01** – `src/pages/plan-zajec-lo.astro`: usunięto całą stronę (plan przeniesiony do Google Workspace jako link), co Eliminated 113 błędów typu loose JS, `possibly null` DOM refs, `implicit any`.

2. **Ticket 02** – pozostałe ~53 błędów w 15 plikach: pięć stron `technik-*` powiela ten sam wzorca, błędy w `SchoolFields`, `NewsSection`, `blog/*`, `index`, `podreczniki`, `wielozawodowa`, `historia`, `GallerySection`, `PhotoBannerSection`. Błędy dotyczą głównie `ts(18047)` (null posible), `ts(7006)` (implicit any), `ts(2339)`/`ts(2345)` (typowe błędy elementu DOM). Dodano guardrail w CI (ticket 03), dzięki któregokolwiek regresja typu causuje awarię pipeline'a.

3. **Ticket 03** – Guardrail w CI: workflow deployujący uruchamia `npm run check` i `npm test` przed deployem; czerwony typ albo nieprzechodzące testy zatrzymują deploy. dzięki temu regresja długu typów staje się niemożliwa — następny taki nawias wróciłby na czerwono w CI, nie w pamięci kolejnego agenta.

## Out of Scope

- Zmiana `tsconfig.json` (wyłączanie `strict`, `exclude` plików, `@ts-nocheck` jako strategia) — naprawiamy błędy, nie zawężamy checka.
- Nowe funkcjonalności, refaktory poza naprawą typów.
- Inne workflow niż deployowy.

## Testing Decisions

- Jedyny miernik to `npm run check`: 0 błędów po ticketach 01+02 (obecnie 53 błędy pozostało do naprawy w ticketu 02).
- `npm test` (10 testów katalogu Tras) musi pozostać zielony po każdym tickecie.
- `npm run build` + walidacja danych strukturalnych po buildzie musi przejść przed zamknięciem ticketów 01 i 02.
- Workflow deployujący zawiera teraz `npm run check` i `npm test` jako kroki blokujące deploy.