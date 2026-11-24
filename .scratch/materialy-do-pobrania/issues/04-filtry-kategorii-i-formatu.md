# 04: Filtry kategorii i formatu

**What to build:** Odwiedzający może zawęzić katalog do wybranej kategorii lub formatu pliku, połączyć filtr z wyszukiwaniem i jednym kliknięciem wrócić do wszystkich materiałów. Filtry są dostępne klawiaturą i czytnikowi ekranu na każdym rozmiarze ekranu.

**Blocked by:** 02, 03

**Status:** open

**Label:** ready-for-agent

- [ ] Karty oznaczają kategorię i format atrybutami `data-pagefind-filter`, a lista dostępnych wartości pochodzi z `pagefind.filters()` oraz centralnej listy kategorii.
- [ ] Działa filtrowanie według kategorii i formatu oraz osobne „Wszystkie materiały".
- [ ] Przycisk „Wyczyść filtry" przywraca pełny widok i czyści również frazę wyszukiwania zgodnie z zachowaniem opisanym w specu.
- [ ] Filtry i wyszukiwanie współdziałają: liczba widocznych kart i komunikat o braku wyników są zawsze spójne.
- [ ] Kontrolki mają poprawne etykiety, widoczny focus, obsługę klawiaturą i nie przekazują informacji wyłącznie kolorem.
- [ ] Filtry są użyteczne na telefonie, tablecie i komputerze; testy i build przechodzą.
