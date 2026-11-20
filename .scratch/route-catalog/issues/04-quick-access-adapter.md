# 04: Paski szybkiego dostępu i linki zewnętrzne

**What to build:** Szybkie linki do Dziennika, planów i Dzwonków mają jedno źródło nazw. Użytkownik nie widzi już rozbieżnych opisów tego samego adresu w różnych paskach.

**Blocked by:** 01: Katalog Tras i pierwszy adapter breadcrumbów.

**Status:** ready-for-agent

- [x] Pasek narzędziowy pobiera linki zewnętrzne z katalogu Tras.
- [x] Nieużywany pasek dolny zostaje usunięty; jeśli pojawi się ponownie, będzie korzystał z tego samego zbioru linków zewnętrznych.
- [x] E-Dziennik, plan lekcji, plan LO i Dzwonki mają jedną, spójną nazwę we wszystkich adapterach, które je pokazują.
- [x] Wewnętrzna strona planu lekcji pozostaje Trasą, a zewnętrzny adres planu pozostaje linkiem zewnętrznym; oba są wyraźnie rozróżnione.
- [x] Build projektu i dotychczasowa walidacja przechodzą; widoczny zestaw szybkich linków pozostaje bez zmian poza poprawionymi nazwami.

## Comments

- Implementacja: `ac2ab9e`, merge na integrację: `910a65e`.
- `MobileBottomBar.astro` nie został usunięty: jest zamontowany w `src/pages/index.astro:4,27`, więc usunięcie zmieniłoby stronę główną. Zamiast tego pasek korzysta z katalogowego `quickAccessLinks()` i współdzielnego modułu ikon `quick-access-icons.ts`. To świadoma rozbieżność z checklistą „nieużywany pasek dolny zostaje usunięty”, zgłoszona już przez eksploratora przed implementacją.
- Nazwy „E-Dziennik”, „Plan lekcji”, „Plan LO” mają jedno źródło w katalogu; wewnętrzna Trasa `/plan-lekcji` pozostaje odróżniona od zewnętrznego planu.
