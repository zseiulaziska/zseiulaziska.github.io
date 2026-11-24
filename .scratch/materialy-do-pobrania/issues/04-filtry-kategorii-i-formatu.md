# 04: Filtry kategorii i formatu

**What to build:** Odwiedzający może zawęzić katalog do wybranej kategorii lub formatu pliku, połączyć filtr z wyszukiwaniem i jednym kliknięciem wrócić do wszystkich materiałów. Filtry są dostępne klawiaturą i czytnikowi ekranu na każdym rozmiarze ekranu.

**Blocked by:** 02, 03

**Status:** resolved

**Label:** ready-for-agent

- [x] Karty oznaczają kategorię i format atrybutami `data-pagefind-filter`, a lista dostępnych wartości pochodzi z `pagefind.filters()` oraz centralnej listy kategorii.
- [x] Działa filtrowanie według kategorii i formatu oraz osobne „Wszystkie materiały".
- [x] Przycisk „Wyczyść filtry" przywraca pełny widok i czyści również frazę wyszukiwania zgodnie z zachowaniem opisanym w specu.
- [x] Filtry i wyszukiwanie współdziałają: liczba widocznych kart i komunikat o braku wyników są zawsze spójne.
- [x] Kontrolki mają poprawne etykiety, widoczny focus, obsługę klawiaturą i nie przekazują informacji wyłącznie kolorem.
- [x] Filtry są użyteczne na telefonie, tablecie i komputerze; testy i build przechodzą.

## Comments

Zaimplementowano plasterek 04: semantyczny pasek `<search>` z polem wyszukiwania, selectem formatu i radiogrupą kategorii (domyślnie „Wszystkie kategorie"). Przycisk „Wszystkie materiały" czyści filtry, a „Wyczyść filtry" dodatkowo czyści frazę i wyniki wyszukiwania. Dostępne wartości filtrów pochodzą z `pagefind.filters()`, są ograniczone do centralnych list `DOWNLOAD_CATEGORY_IDS` i `DOWNLOAD_FORMATS`, a gdy indeksu nie ma — do wartości odczytanych z kart.

Licznik przy nazwie kategorii oraz komunikat `role="status"` aktualizują się przy każdej zmianie wyszukiwania lub filtrów, więc widoczna liczba i stan pusty są zawsze spójne. Kontrolki mają etykiety `for`/`id`, `legend` dla grupy, widoczny focus z globalnego systemu stylów, cel dotykowy min. 44 px i działają na 375 px oraz na klawiaturze.

Weryfikacja w przeglądarce (build + dev): filtr kategorii i formatu, reset, współdziałanie z frazą, pusty wynik, widok mobilny, focus, 0 błędów konsoli. `npm test` (63 testy), `npm run check` (0 błędów), `npm run build` — zielone.
