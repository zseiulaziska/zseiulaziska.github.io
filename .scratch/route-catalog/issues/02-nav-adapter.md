# 02: Menu jako adapter katalogu

**What to build:** Menu desktopowe i mobilne korzystają z tych samych faktów o Trasach co breadcrumbs. Odwiedzający widzi identyczne nazwy w obu wersjach menu, a zestaw symboli nie zawiera wpisów, do których nie prowadzi żadna Trasa.

**Blocked by:** 01: Katalog Tras i pierwszy adapter breadcrumbów.

**Status:** ready-for-agent

- [ ] Menu desktopowe pobiera sekcje, grupy, etykiety, skróty i opisy z katalogu Tras zamiast z własnych tablic.
- [ ] Menu mobilne pobiera te same dane; znikają nieużywany zbiór linków mobilnych oraz zduplikowany wpis aktualności w mapie ikon.
- [ ] Ikony są wybierane po nazwie zapisanej w Trasie, a ścieżki grafik pozostają w adapterze menu; nieużywana ikona zostaje usunięta.
- [ ] Skróty menu są wariantami Trasy, a nie nowymi kanonicznymi nazwami.
- [ ] Build projektu, sprawdzanie typów i dotychczasowa walidacja przechodzą; przegląd widoku desktopowego i mobilnego nie wykazuje zmian układu poza poprawionymi nazwami.
