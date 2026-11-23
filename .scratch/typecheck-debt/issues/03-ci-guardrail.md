# 03: Guardrail w CI — check i testy w workflow deploy

**What to build:** Każdy push uruchamia `npm run check` i `npm test` przed deployem; czerwony typ albo nieprzechodzące testy zatrzymują deploy. Regresja długu typów staje się niemożliwa — następny taki nawias wróciłby na czerwono w CI, nie w pamięci kolejnego agenta.

**Blocked by:** 01: Wypalenie długu typów w planie zajęć LO; 02: Wypalenie reszty długu typów.

**Status:** done

- [x] Workflow deployujący uruchamia `npm run check` i `npm test` i nie deployuje przy niezerowym kodzie wyjścia któregokolwiek z nich.
- [x] Pipeline jest zielony na obecnym stanie (check + test + build przechodzą).
- [x] Kolejność kroków sprawdzona: install → check/test → build/deploy.

## Changes

Plik `.github/workflows/deploy.yml` rozszerzony o dwa kroki po installe:
1. `npm run check` — astro check, zgłasza błędy typów
2. `npm test` — uruchamia testy vitest (10 testów katalogu Tras)

Kolejność kroków w jobie `build`:
1. Checkout
2. Setup Node.js (v22.12.0)
3. **Run astro check** (blokuje dalsze kroki przy błędach)
4. **Run tests** (blokuje dalsze kroki przy niepowodzeniach)
5. Install + build + upload (withastro/action)

Dzięki temu każdy push z nieprzezwycięzonymi błędami typu lub testami automatycznie blokuje deploy — chroni to przed regresją długu typów w przyszłości.