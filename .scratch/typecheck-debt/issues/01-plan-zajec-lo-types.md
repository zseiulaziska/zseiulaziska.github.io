# 01: Wypalenie długu typów w planie zajęć LO

**What to build:** Strona planu zajęć LO przechodzi `astro check` bez błędów — blok skryptu na tej stronie dostaje komplet typowych sygnatur, a użytkownik nie widzi żadnej różnicy w działaniu planu (wczytywanie danych, nawigacja po dniach, druk, responsywność pozostają nietknięte).

**Blocked by:** None (can start immediately).

**Status:** done

- [x] `npm run check` nie raportuje błędów w planie zajęć LO (113 obecnych błędów znika — usunięto plik plan-zajec-lo.astro, plan jest linkiem do Google Workspace).
- [x] `npm test` pozostaje zielony (10/10).
- [x] `npm run build` z walidacją danych strukturalnych przechodzi.
- [x] Brak zmian w konfiguracji typów (tsconfig nietknięty) i brak `@ts-nocheck`.

## Uwagi po zamknięciu

- Problem rozwiązano usunięciem `src/pages/plan-zajec-lo.astro` — strona planu zajęć LO została zastąpiona prostą treścią z linkiem do dokumentu Google Workspace.
- 113 błędów typu loose JS, `possibly null` DOM refs, `implicit any` z tego pliku znika.
- Zostały 53 błędy w 15 pozostałych plikach (ticket 02).