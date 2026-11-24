# 03: Wyszukiwanie Pagefind na kartach

**What to build:** Odwiedzający wpisuje frazę i bez przeładowania strony widzi tylko pasujące karty. Wyszukiwanie korzysta z istniejącego Pagefind: każda karta jest osobnym sub-resultem, a wynik wskazuje na jej stabilny identyfikator. W środowisku deweloperskim, gdy indeks nie istnieje, strona działa bez błędów.

**Blocked by:** 01

**Status:** resolved

**Label:** ready-for-agent

- [x] Każda karta ma stabilny `id` oraz `data-pagefind-title`, dzięki czemu Pagefind zwraca ją jako sub-result z kotwicą.
- [x] Po wpisaniu co najmniej dwóch znaków skrypt czyta `sub_results` i odsłania wyłącznie pasujące karty; nie ma przeładowania strony.
- [x] Wyszukiwanie ignoruje wielkość liter i poprawnie obsługuje polskie znaki.
- [x] Przy braku wyników wyświetlany jest czytelny komunikat, a nie pusta przestrzeń.
- [x] Gdy indeks Pagefind nie jest dostępny (dev przed buildem), wyszukiwarka degraduje się bez błędów w konsoli i bez psucia katalogu.
- [x] Mapowanie wyników Pagefind na widoczne karty jest wydzielone jako czysta funkcja z testami na jej publicznym interfejsie.
- [x] Nie dodano nowych zależności produkcyjnych ani testowych; testy i build przechodzą.

## Comments

Zaimplementowano plasterek 03: wyszukiwanie Pagefind bez przeładowania strony. Karta ma stabilny `id`, `data-pagefind-title` oraz atrybuty `data-pagefind-filter`. Ponieważ Pagefind 1.5 dzieli sub-results na nagłówki z `id`, kotwicą karty jest `id` nagłówka jej tytułu (`<item.id>-tytul`); czysta funkcja `cardIdFromTitleAnchor` odtwarza z niej identyfikator karty. Tagi wpisu są włączone do indeksu jako tekst czytnika ekranu wewnątrz sekcji karty. Moduł `src/utils/downloads-search.ts` mapuje `sub_results` na identyfikatory kart i łączy wyszukiwanie z filtrami; testy publicznego interfejsu: 11 przypadków.

W środowisku dev indeks nie jest pobierany (`import.meta.env.PROD`), więc nie ma żądań 404 ani błędów w konsoli, a katalog pozostaje w pełni widoczny. Weryfikacja w przeglądarce (build + dev): frazy `ULOTKA`, `rekrutacyjna`, tag `do podmiany`, pusty wynik, brak przeładowania, 0 błędów konsoli. `npm test` (63 testy), `npm run check` (0 błędów), `npm run build` z Pagefind — zielone.

Po recenzji kodu ujednolicono sufiks kotwicy przez współdzieloną stałą, usunięto nieużywane atrybuty i zduplikowaną logikę resetu oraz powiązano listę kategorii z centralnym `DOWNLOAD_CATEGORY_IDS`.
