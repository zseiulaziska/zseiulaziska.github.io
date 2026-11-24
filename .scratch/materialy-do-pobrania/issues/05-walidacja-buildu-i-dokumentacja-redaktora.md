# 05: Walidacja buildu i dokumentacja redaktora

**What to build:** Build sam wykrywa uszkodzony katalog, a redaktor ma po polsku opisaną procedurę dodawania, aktualizacji i usuwania materiałów — bez wiedzy programistycznej. Na końcu wykonana jest pełna weryfikacja z wymagań źródłowych i raport z wdrożenia.

**Blocked by:** 02, 04

**Status:** resolved

**Label:** ready-for-agent

- [x] Walidacja wyjścia buildu sprawdza wygenerowany HTML katalogu: wymagane atrybuty Pagefind na kartach, brak kart nieopublikowanych, brak pustych kategorii.
- [x] Walidacja sprawdza, że każdy odnośnik do pliku ma odpowiadający plik w wyjściu buildu, i kończy build błędem przy niespójności.
- [x] Dokumentacja dla redaktora jest po polsku, zrozumiała dla osoby nieprogramującej i zawiera co najmniej dwa kompletne przykłady wpisów z różnych kategorii.
- [x] Dokumentacja wyraźnie oznacza, które pliki są placeholderami i że należy je usunąć przed produkcją.
- [x] Build przechodzi; wykonano ręczną weryfikację zgodnie z listą kontrolną w specu (materiały, walidacja, filtry, polskie znaki, pusty wynik, linki, ścieżki, mobilność, klawiatura, ukrywanie nieopublikowanych, brak zmian w komponentach przy dodaniu materiału).
- [x] Raport końcowy zawiera opis rozwiązania, listę utworzonych i zmodyfikowanych plików, instrukcję dodania materiału, wyniki testów/buildu oraz ewentualne ograniczenia.

## Comments

Zaimplementowano plasterek 05: czysty moduł `scripts/validate-downloads-output.mjs` (10 testów w `scripts/validate-downloads-output.test.mjs`) oraz adapter `scripts/validate-downloads-build.mjs` wywoływany z `scripts/postbuild.cjs` po Pagefind i walidacji BreadcrumbList. Walidacja sprawdza atrybuty Pagefind kart, wpisy nieopublikowane, puste kategorie, zgodność licznika i istnienie każdego pliku `/downloads/…` w wyjściu buildu; przy niespójności build kończy się kodem 1. Poradnik redaktora: `docs/redaktor/materialy-do-pobrania.md` — trzy kompletne przykłady z różnych kategorii, opis pól, zasady RODO i tabela placeholderów do usunięcia.

Recenzja kodu wykryła, że zewnętrzny `<article>` strony powodował pominięcie pierwszej karty. Błąd naprawiono przez skanowanie tagów otwierających kart; dodano test regresji i potwierdzono wykrycie uszkodzonego odnośnika na pierwszej karcie prawdziwego buildu.

Weryfikacja: `npm test` (8 plików / 73 testy), `npm run check` (0 błędów, 32 istniejące podpowiedzi), `npm run build` zielony (47 stron, 3813 słów, 2 filtry; obie walidacje OK). Ręcznie na buildzie produkcyjnym sprawdzono m.in. 5 kart i kategorii, wyszukiwanie `ULOTKA` (1 wynik), pusty wynik, filtry i reset, 5 odnośników HTTP 200, układ 375 px, focus klawiaturą oraz brak konieczności zmiany komponentów przy dodaniu wpisu. Pełny raport: `.scratch/materialy-do-pobrania/raport-wdrozeniowy.md`.
