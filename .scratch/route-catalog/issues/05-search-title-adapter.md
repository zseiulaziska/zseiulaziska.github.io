# 05: Układ strony i tytuły wyszukiwania

**What to build:** Wyniki wyszukiwania noszą nazwę Trasy zamiast tytułu wyciąganego z dowolnego nagłówka. Użytkownik widzi zwięzły, spójny tytuł bez sufiksu szkoły, a autor treści nie musi go ustawiać osobno przy każdej stronie.

**Blocked by:** 01: Katalog Tras i pierwszy adapter breadcrumbów.

**Status:** ready-for-agent

- [x] Układ strony emituje tytuł wyszukiwania z katalogu Tras.
- [x] Wycinanie sufiksu szkoły z tytułu znika; domyślnym tytułem wyszukiwania jest etykieta kanoniczna Trasy.
- [x] Dodatkowy prop do ręcznego ustawiania tytułu wyszukiwania znika, chyba że Trasa wyraźnie zdefiniuje własny tytuł.
- [x] Tytuł strony, metadane udostępniania i treść pozostają niezmienione.
- [x] Build projektu przechodzi, a przegląd wyników wyszukiwania potwierdza nowe, zwięzłe tytuły.

## Comments

- Implementacja: `52aa598`, merge na integrację: `abca35b`.
- `Layout.astro` pobiera tytuł przez `resolveSearchTitle()` z katalogu; martwy prop `pagefindTitle` i wycinanie sufiksu w adapterze usunięte.
- Po przeglądzie przywrócono czyszczenie sufiksu „ZSEiU” dla nie-Tras oraz jawne `searchTitle` dla `/blog` („Aktualności”) i Trasy OZE, aby tytuł wyniku zgadzał się z nazwą w menu.
