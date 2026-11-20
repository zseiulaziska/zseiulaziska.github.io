# 03: Stopka jako adapter katalogu

**What to build:** Stopka przestaje być osobną pamięcią adresów i nazw. Odwiedzający widzi w niej te same Trasy co w menu, z zachowaniem dłuższych nazw tam, gdzie stopka pełni inną funkcję.

**Blocked by:** 01: Katalog Tras i pierwszy adapter breadcrumbów.

**Status:** ready-for-agent

- [ ] Grupy linków w stopce są budowane z katalogu Tras.
- [ ] Dłuższe nazwy używane w stopce pozostają jawnymi wariantami Trasy, a nie zastępują etykiety kanonicznej.
- [ ] Linki prawne oraz plany lekcji korzystają z faktów katalogu: wewnętrzne strony jako Trasy, zewnętrzne adresy jako linki zewnętrzne.
- [ ] W stopce nie pozostają rozproszone, własne stringi opisujące trasy.
- [ ] Build projektu i dotychczasowa walidacja przechodzą; wygląd stopki pozostaje bez zmian poza poprawionymi nazwami.
