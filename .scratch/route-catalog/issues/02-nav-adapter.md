# 02: Menu jako adapter katalogu

**What to build:** Menu desktopowe i mobilne korzystają z tych samych faktów o Trasach co breadcrumbs. Odwiedzający widzi identyczne nazwy w obu wersjach menu, a zestaw symboli nie zawiera wpisów, do których nie prowadzi żadna Trasa.

**Blocked by:** 01: Katalog Tras i pierwszy adapter breadcrumbów.

**Status:** ready-for-agent

- [x] Menu desktopowe pobiera sekcje, grupy, etykiety, skróty i opisy z katalogu Tras zamiast z własnych tablic.
- [x] Menu mobilne pobiera te same dane; znikają nieużywany zbiór linków mobilnych oraz zduplikowany wpis aktualności w mapie ikon.
- [x] Ikony są wybierane po nazwie zapisanej w Trasie, a ścieżki grafik pozostają w adapterze menu; nieużywana ikona zostaje usunięta.
- [x] Skróty menu są wariantami Trasy, a nie nowymi kanonicznymi nazwami.
- [x] Build projektu, sprawdzanie typów i dotychczasowa walidacja przechodzą; przegląd widoku desktopowego i mobilnego nie wykazuje zmian układu poza poprawionymi nazwami.

## Comments

- Implementacja: `f7f9cbb`, merge na integrację: `c23a871`.
- Po przeglądzie (`b848138`) lokalny `menuLayout` został przeniesiony do `sections` w katalogu; kolejność menu pochodzi wyłącznie z katalogu. Opisy i aria-linki zewnętrzne również czytane są z katalogu.
- Widok desktopowy i mobilny zweryfikowany strukturalnie: 37 linków desktopowych i 47 mobilnych bez zmian liczby i układu.
