# 03: Wyszukiwanie Pagefind na kartach

**What to build:** Odwiedzający wpisuje frazę i bez przeładowania strony widzi tylko pasujące karty. Wyszukiwanie korzysta z istniejącego Pagefind: każda karta jest osobnym sub-resultem, a wynik wskazuje na jej stabilny identyfikator. W środowisku deweloperskim, gdy indeks nie istnieje, strona działa bez błędów.

**Blocked by:** 01

**Status:** open

**Label:** ready-for-agent

- [ ] Każda karta ma stabilny `id` oraz `data-pagefind-title`, dzięki czemu Pagefind zwraca ją jako sub-result z kotwicą.
- [ ] Po wpisaniu co najmniej dwóch znaków skrypt czyta `sub_results` i odsłania wyłącznie pasujące karty; nie ma przeładowania strony.
- [ ] Wyszukiwanie ignoruje wielkość liter i poprawnie obsługuje polskie znaki.
- [ ] Przy braku wyników wyświetlany jest czytelny komunikat, a nie pusta przestrzeń.
- [ ] Gdy indeks Pagefind nie jest dostępny (dev przed buildem), wyszukiwarka degraduje się bez błędów w konsoli i bez psucia katalogu.
- [ ] Mapowanie wyników Pagefind na widoczne karty jest wydzielone jako czysta funkcja z testami na jej publicznym interfejsie.
- [ ] Nie dodano nowych zależności produkcyjnych ani testowych; testy i build przechodzą.
