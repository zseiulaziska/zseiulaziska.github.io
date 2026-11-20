# 03: Stopka jako adapter katalogu

**What to build:** Stopka przestaje być osobną pamięcią adresów i nazw. Odwiedzający widzi w niej te same Trasy co w menu, z zachowaniem dłuższych nazw tam, gdzie stopka pełni inną funkcję.

**Blocked by:** 01: Katalog Tras i pierwszy adapter breadcrumbów.

**Status:** ready-for-agent

- [x] Grupy linków w stopce są budowane z katalogu Tras.
- [x] Dłuższe nazwy używane w stopce pozostają jawnymi wariantami Trasy, a nie zastępują etykiety kanonicznej.
- [x] Linki prawne oraz plany lekcji korzystają z faktów katalogu: wewnętrzne strony jako Trasy, zewnętrzne adresy jako linki zewnętrzne.
- [x] W stopce nie pozostają rozproszone, własne stringi opisujące trasy.
- [x] Build projektu i dotychczasowa walidacja przechodzą; wygląd stopki pozostaje bez zmian poza poprawionymi nazwami.

## Comments

- Implementacja: `8167ca6`, merge na integrację: `21f2438`.
- Grupy stopki pochodzą z `footerGroups`, nazwy z `footerLabel ?? label` (po przeglądzie wyciągnięte do helpera `etykietaStopki`), linki zewnętrzne z katalogu.
- Po przeglądzie usunięto literal `/rekrutacja` — wyróżnienie stylistyczne czyta `sections[].highlight`. Aria-labeli z katalogu używają zewnętrzne linki.
