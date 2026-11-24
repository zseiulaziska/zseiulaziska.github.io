# Raport wdrożeniowy: Katalog materiałów do pobrania

Ticket: `.scratch/materialy-do-pobrania/issues/05-walidacja-buildu-i-dokumentacja-redaktora.md`
Spec: `.scratch/materialy-do-pobrania/spec.md`

## Rozwiązanie

Build samodzielnie wykrywa uszkodzony katalog materiałów. Czysty moduł
`scripts/validate-downloads-output.mjs` sprawdza wygenerowany HTML strony
`/materialy-do-pobrania/`: wymagane atrybuty Pagefind na każdej karcie
(`data-pagefind-title`, filtry `format:` i `kategoria:`), brak kart z wpisów
nieopublikowanych, brak pustych kategorii, spójność licznika z liczbą kart
oraz to, że każdy odnośnik `/downloads/…` ma plik w wyjściu buildu.
Adapter `scripts/validate-downloads-build.mjs` czyta wyjście buildu i wpisy
z `src/content/downloads/`, a `scripts/postbuild.cjs` wywołuje go po indeksacji
Pagefind i walidacji danych strukturalnych. Przy niespójności build kończy się
błędem (kod 1) z listą problemów.

Dla redaktora powstał poradnik `docs/redaktor/materialy-do-pobrania.md`:
krok po kroku po polsku, opis wszystkich pól, trzy kompletne przykłady wpisów
(identyfikacja wizualna, dokumenty i publikacje, materiał z zewnętrznego
adresu), zasady RODO oraz tabela pięciu oznaczonych placeholderów z instrukcją
usunięcia ich przed produkcją.

Podczas recenzji kodu wykryto i naprawiono błąd: zewnętrzny `<article>`
obejmujący stronę powodował, że pierwsza karta nie była walidowana. Moduł
skanuje teraz tagi otwierające karty zamiast par `<article>…</article>`;
regresja ma własny test i została potwierdzona na prawdziwym wyjściu buildu.

## Utworzone i zmodyfikowane pliki

**Utworzone:**

- `scripts/validate-downloads-output.mjs` — czysta funkcja walidująca HTML katalogu.
- `scripts/validate-downloads-output.test.mjs` — 10 testów zachowania (Seam 3).
- `scripts/validate-downloads-build.mjs` — adapter CLI czytający wyjście buildu i wpisy.
- `docs/redaktor/materialy-do-pobrania.md` — instrukcja dla redaktora po polsku.
- `.scratch/materialy-do-pobrania/raport-wdrozeniowy.md` — ten raport.

**Zmodyfikowane:**

- `scripts/postbuild.cjs` — wywołanie nowej walidacji po Pagefind i BreadcrumbList.
- `.scratch/materialy-do-pobrania/issues/05-walidacja-buildu-i-dokumentacja-redaktora.md` — status, lista kontrolna i komentarz.

Nie zmieniano komponentów Astro, konfiguracji kolekcji, Keystatic, Tras,
nagłówków bezpieczeństwa ani ADR-ów.

## Jak dodać materiał

1. Otworzyć panel Keystatic pod `/keystatic/` i wybrać „Materiały do pobrania".
2. Utworzyć wpis: tytuł, opis, kategoria z listy, wgrany plik albo adres
   zewnętrzny, rozmiar (np. `2.4 MB`), data publikacji; opcjonalnie wyróżnienie,
   tagi, data aktualizacji, kolejność i nazwa pobieranego pliku.
3. Zaznaczyć „Opublikowane" i zapisać. Nowa karta pojawia się automatycznie
   po kolejnym buildzie — bez edycji kodu, listy kategorii czy liczników.

Szczegóły i pełne przykłady: `docs/redaktor/materialy-do-pobrania.md`.

## Wyniki testów i buildu

- `npm test` — 8 plików / 73 testy, wszystkie zielone.
- `npm run check` — 0 błędów (32 istniejące podpowiedzi, bez zmian).
- `npm run build` — zielony: Pagefind zindeksował 47 stron / 3813 słów / 2 filtry;
  walidacja BreadcrumbList i nowa walidacja katalogu: `OK`.
- Negatywna próba na fixture: brak pliku w wyjściu → `PROBLEMY (1)`, kod wyjścia 1.
- Negatywna próba na prawdziwym buildzie (uszkodzony odnośnik w pierwszej
  karcie) → wykryty `brak pliku w buildzie: /downloads/BRAK.pdf`, kod 1;
  plik HTML przywrócono po teście.

## Ręczna weryfikacja z listy kontrolnej specu

| Element | Wynik |
| --- | --- |
| Materiały | 5 kart w 5 kategoriach, liczniki `1`, status „Wyświetlono 5 z 5 materiałów." |
| Walidacja | wymagane atrybuty Pagefind na wszystkich kartach; testy i negatywne próby buildu przechodzą |
| Filtry | format PDF i przyciski „Wszystkie materiały" / „Wyczyść filtry" przywracają pełny widok; licznik i stan pusty spójne |
| Polskie znaki | zapytanie `ULOTKA` (wielkie litery) zwróciło dokładnie 1 kartę „ulotka rekrutacyjna" |
| Pusty wynik | `nieistniejacy` → „Brak wyników. Wyświetlono 0 z 5 materiałów.", 0 widocznych kart i sekcji |
| Linki i ścieżki | 5 odnośników `/downloads/*.pdf` → HTTP 200 `application/pdf`; kanoniczny adres `https://zseiulaziska.pl/materialy-do-pobrania/`, bez `base` |
| Mobilność | 375×812: wyszukiwarka, format i kategorie widoczne; brak poziomego przewijania (`scrollWidth = 375`) |
| Klawiatura | focus na wyszukiwarce i po Tab na selekcie formatu: `:focus-visible`, widoczny pierścień (box-shadow) |
| Ukrywanie nieopublikowanych | walidacja porównuje wpisy `published !== true` z kartami; test pokrywa kartę nieopublikowanego wpisu |
| Brak zmian w komponentach | dodanie materiału to nowy wpis MDX + plik w `public/downloads/`; strona czyta kolekcję automatycznie |

Weryfikacja przeglądarkowa przeprowadzona na buildzie produkcyjnym
(`dist/client`), nie na serwerze dev — indeks Pagefind powstaje dopiero w buildzie.

## Ograniczenia i uwagi

- Walidacja opiera się na wyrażeniach regularnych nad wyjściem HTML (bez nowej
  zależności, zgodnie ze specem) i zakłada obecny kontrakt znaczników karty.
  Zmiana `[data-pagefind-title]` / filtrów / `href` wymaga aktualizacji modułu
  i testów — regresja z zewnętrznym `<article>` jest już objęta testem.
- Rozmiar pliku pozostaje polem ręcznym; walidacja nie porównuje go z rzeczywistym
  rozmiarem pliku (decyzja ze specu). Adresy zewnętrzne nie są pobierane przy buildzie —
  sprawdzany jest tylko format z rozszerzenia.
- W trybie dev wyszukiwarka degraduje się bez błędów, bo nie ma indeksu Pagefind;
  pełne działanie weryfikowano na buildzie.
- Kontrast i responsywność nie są testowane automatycznie (zgodnie ze specem);
  sprawdzono je ręcznie dla jednej szerokości mobilnej.
- Placeholdery nadal są w katalogu i muszą zostać podmienione lub usunięte przez
  redaktora przed produkcją — instrukcja w poradniku.
- Recenzja kodu (oś Spec) wskazała też rozbieżność w dosłownym brzmieniu Seam 3:
  walidacja jest osobnym skryptem wywoływanym z tego samego kroku `postbuild`,
  zgodnie z decyzją specu o rozszerzeniu „istniejącego wzorca walidacji".
  Dodatkowa kontrola zgodności licznika z liczbą kart została utrzymana jako
  część wykrywania uszkodzonego katalogu.
- W trakcie pracy w repozytorium pojawiła się niezwiązana zmiana użytkownika
  w `docs/reference/szkola-fakty.md` (telefon, typ szkoły, dziennik Vulcan).
  Została zostawiona nienaruszona i wyłączona z commita dla tego ticketa.
