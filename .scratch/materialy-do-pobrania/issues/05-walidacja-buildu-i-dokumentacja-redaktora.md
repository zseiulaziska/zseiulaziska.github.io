# 05: Walidacja buildu i dokumentacja redaktora

**What to build:** Build sam wykrywa uszkodzony katalog, a redaktor ma po polsku opisaną procedurę dodawania, aktualizacji i usuwania materiałów — bez wiedzy programistycznej. Na końcu wykonana jest pełna weryfikacja z wymagań źródłowych i raport z wdrożenia.

**Blocked by:** 02, 04

**Status:** open

**Label:** ready-for-agent

- [ ] Walidacja wyjścia buildu sprawdza wygenerowany HTML katalogu: wymagane atrybuty Pagefind na kartach, brak kart nieopublikowanych, brak pustych kategorii.
- [ ] Walidacja sprawdza, że każdy odnośnik do pliku ma odpowiadający plik w wyjściu buildu, i kończy build błędem przy niespójności.
- [ ] Dokumentacja dla redaktora jest po polsku, zrozumiała dla osoby nieprogramującej i zawiera co najmniej dwa kompletne przykłady wpisów z różnych kategorii.
- [ ] Dokumentacja wyraźnie oznacza, które pliki są placeholderami i że należy je usunąć przed produkcją.
- [ ] Build przechodzi; wykonano ręczną weryfikację zgodnie z listą kontrolną w specu (materiały, walidacja, filtry, polskie znaki, pusty wynik, linki, ścieżki, mobilność, klawiatura, ukrywanie nieopublikowanych, brak zmian w komponentach przy dodaniu materiału).
- [ ] Raport końcowy zawiera opis rozwiązania, listę utworzonych i zmodyfikowanych plików, instrukcję dodania materiału, wyniki testów/buildu oraz ewentualne ograniczenia.
