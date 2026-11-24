Status: open
Label: ready-for-agent

# Spec: Katalog materiałów do pobrania

## Problem Statement

Szkoła udostępnia odwiedzającym oficjalne materiały (logo, ulotki, dokumenty, zdjęcia, prezentacje), ale nie ma miejsca, w którym można je publikować i porządkować bez modyfikowania kodu strony. Każda zmiana wymagałaby dziś edycji komponentów Astro, a pliki i ich opisy są rozproszone. Redaktor nie ma narzędzia do dodania, aktualizacji ani wycofania materiału, a odwiedzający nie ma jak przeszukać katalogu ani odfiltrować go według kategorii i formatu.

## Solution

Nowa Trasa `/materialy-do-pobrania/` z katalogiem materiałów zasilanym z kolekcji treści edytowanej w Keystatic. Każdy materiał to wpis z frontmatter oraz plik w publicznym katalogu plików. Strona generuje karty automatycznie, udostępnia wyszukiwanie przez istniejący Pagefind (sub-results na poziomie karty) oraz filtry kategorii i formatu, a całość pozostaje statyczna i zgodna z istniejącym systemem designu. Na czas wdrożenia katalog wypełniają wyraźnie oznaczone placeholdery, które redaktor podmieni na prawdziwe dokumenty szkoły.

## User Stories

1. Jako odwiedzający chcę wejść na `/materialy-do-pobrania/` bezpośrednio z adresu, żeby mieć pewność, że katalog jest samodzielną, indeksowalną stroną.
2. Jako odwiedzający chcę zobaczyć katalog w głównym menu w sekcji „Szkoła" oraz w stopce, żeby łatwo go znaleźć z dowolnej strony.
3. Jako odwiedzający chcę zobaczyć ścieżkę nawigacyjną prowadzącą do katalogu, żeby wiedzieć, gdzie się znajduję.
4. Jako odwiedzający chcę zobaczyć tytuł „Materiały do pobrania" i krótki opis katalogu, żeby od razu zrozumieć jego przeznaczenie.
5. Jako odwiedzający chcę zobaczyć materiały pogrupowane w kategorie: identyfikacja wizualna, materiały promocyjne, dokumenty i publikacje, media i partnerzy, multimedia — żeby szybko odnaleźć interesujący mnie typ materiału.
6. Jako odwiedzający chcę zobaczyć tylko te kategorie, w których są opublikowane materiały, żeby nie klikać w puste sekcje.
7. Jako odwiedzający chcę zobaczyć liczbę materiałów przy nazwie kategorii, żeby ocenić zakres zasobów.
8. Jako odwiedzający chcę zobaczyć kartę z ikoną formatu, tytułem, opisem, formatem, rozmiarem pliku i datą, żeby wiedzieć, co pobieram, zanim kliknę.
9. Jako odwiedzający chcę zobaczyć oznaczenie „Polecane" lub „Nowość" na wybranych kartach, żeby szybko trafić do najważniejszych materiałów.
10. Jako odwiedzający chcę wyraźny przycisk „Pobierz", żeby bez dwuznaczności rozpocząć pobieranie pliku.
11. Jako odwiedzający chcę wyszukiwać po tytule, opisie, tagach i nazwie kategorii, żeby znaleźć materiał po tym, jak go pamiętam.
12. Jako odwiedzający chcę, żeby wyszukiwanie działało bez przeładowania strony i ignorowało wielkość liter, żeby nie tracić miejsca na stronie.
13. Jako odwiedzający chcę, żeby wyszukiwanie poprawnie obsługiwało polskie znaki, żeby zapytanie „ulotka rekrutacyjna" działało tak samo jak „ULOTKA".
14. Jako odwiedzający chcę zobaczyć czytelny komunikat o braku wyników, żeby wiedzieć, że wyszukiwanie zadziałało, a nie zawiodło.
15. Jako odwiedzający chcę filtrować materiały według kategorii i formatu oraz czyścić filtry jednym kliknięciem, żeby zawęzić listę i do niej wrócić.
16. Jako odwiedzający chcę zobaczyć wszystkie materiały jako domyślny widok, żeby mieć pełny obraz katalogu.
17. Jako odwiedzający chcę widzieć wyniki wyszukiwania jako pasujące karty na tej samej stronie, żeby nie przechodzić na strony szczegółów każdego pliku.
18. Jako odwiedzający chcę widzieć datę ostatniej aktualizacji katalogu, jeśli jest dostępna, żeby wiedzieć, jak świeże są materiały.
19. Jako odwiedzający na telefonie chcę mieć dostęp do wyszukiwarki i filtrów, żeby korzystać z katalogu w każdej sytuacji.
20. Jako odwiedzający korzystający z klawiatury chcę obsłużyć wyszukiwarkę i filtry bez myszy, z widocznym focusem, żeby katalog był dostępny.
21. Jako odwiedzający korzystający z czytnika ekranu chcę usłyszeć etykiety pól, liczbę wyników i komunikaty o pustym stanie, żeby zrozumieć zawartość strony.
22. Jako odwiedzający chcę, żeby informacja o formacie i kategorii nie była przekazywana wyłącznie kolorem, żeby móc odróżnić materiały niezależnie od percepcji barw.
23. Jako odwiedzający chcę, żeby strona spełniała WCAG 2.2 AA, spójnie z pozostałymi stronami szkoły, żeby dostępność była jednolita w całym serwisie.
24. Jako odwiedzający chcę poprawny tytuł strony, meta description, adres kanoniczny i breadcrumbs, żeby strona była poprawnie indeksowana i rozpoznawalna w wynikach wyszukiwania.
25. Jako odwiedzający chcę, żeby linki do plików działały zarówno na kanale produkcyjnym Cloudflare, jak i na mirrorze GitHub Pages, żeby materiały były zawsze dostępne.
26. Jako redaktor chcę dodać materiał w Keystatic, wypełniając kilka pól i wgrywając plik, żeby nie musieć znać Astro ani HTML-a.
27. Jako redaktor chcę wybrać plik z poziomu CMS i mieć go zapisanego w publicznym katalogu plików, żeby nie musieć ręcznie kopiować go do repozytorium.
28. Jako redaktor chcę wybrać kategorię z listy, żeby nie wpisywać identyfikatora kategorii z pamięci.
29. Jako redaktor chcę wpisać rozmiar pliku w wybranym formacie (np. „2.4 MB") i otrzymać ostrzeżenie przy błędnym formacie, żeby karta zawsze wyświetlała sensowną informację.
30. Jako redaktor nie chcę wpisywać formatu pliku, bo chcę, żeby był wyliczany z rozszerzenia pliku, żeby nie wprowadzać sprzecznych danych.
31. Jako redaktor chcę zaznaczyć materiał jako opublikowany lub ukryć go jednym przełącznikiem, żeby móc przygotować wpis przed publikacją i wycofać go bez usuwania.
32. Jako redaktor chcę dodać tagi, wyróżnić materiał i ustawić datę publikacji oraz opcjonalnie datę aktualizacji, żeby móc porządkować i promować treści.
33. Jako redaktor chcę opcjonalnie wskazać zewnętrzny adres URL zamiast pliku lokalnego, żeby udostępniać materiały hostowane gdzie indziej.
34. Jako redaktor chcę zobaczyć błąd walidacji, gdy brakuje pola wymaganego lub ścieżka pliku jest nieprawidłowa, żeby nie opublikować uszkodzonego wpisu.
35. Jako redaktor chcę dodać nowy materiał bez modyfikowania komponentów, list kategorii ani liczników, żeby codzienna praca była szybka.
36. Jako redaktor chcę dokumentacji po polsku z co najmniej dwoma kompletnymi przykładami wpisów z różnych kategorii, żeby móc zacząć bez pomocy programisty.
37. Jako redaktor chcę wiedzieć, które pliki są placeholderami i że należy je usunąć przed produkcją, żeby nie opublikować materiałów oznaczonych jako przykładowe.
38. Jako utrzymujący serwis chcę, żeby lista kategorii była zdefiniowana centralnie i współdzielona przez CMS oraz stronę, żeby dodanie kategorii nie wymagało kilku edycji.
39. Jako utrzymujący serwis chcę, żeby materiały były automatycznie wykrywane, przypisywane do kategorii, sortowane i liczone, żeby katalog aktualizował się sam po commicie.
40. Jako utrzymujący serwis chcę, żeby build kończył się błędem, gdy wpis jest niekompletny albo wskazuje na nieistniejący plik, żeby uszkodzony katalog nie trafił na produkcję.
41. Jako utrzymujący serwis chcę użyć istniejących komponentów, stylów i mechanizmu wyszukiwania zamiast nowych, żeby nie duplikować rozwiązań i nie powiększać zależności.
42. Jako utrzymujący serwis chcę statycznego wyjścia bez bazy danych i serwera aplikacyjnego dla katalogu, żeby utrzymanie i koszt pozostały niskie.
43. Jako utrzymujący serwis chcę, żeby żaden prywatny dokument ani dane osobowe nie trafiły do publicznego katalogu, żeby nie naruszać RODO i wewnętrznych zasad szkoły.
44. Jako utrzymujący serwis chcę pamiętać, że pliki w publicznym katalogu plików są publiczne nawet gdy nie są pokazane na stronie, żeby nie traktować ukrycia karty jako zabezpieczenia.
45. Jako odwiedzający chcę, żeby linki zewnętrzne były odpowiednio oznaczone, żeby wiedzieć, że opuszczam domenę szkoły.

## Implementation Decisions

- Nowa Trasa `/materialy-do-pobrania/` trafia do Katalogu Tras z etykietą, przynależnością do sekcji „O szkole", breadcrumb-rodzicem i ikoną. Adaptery nawigacji, stopki i breadcrumbs czytają wyłącznie z Katalogu Tras; nie tworzymy drugiej listy linków. Nowa Trasa nie ma Aliasów.
- Strona katalogu korzysta z istniejącego układu strony, istniejącego nagłówka, stopki, komponentu breadcrumbs oraz istniejącego systemu stylów; nie wprowadzamy alternatywnego systemu stylowania ani nowych komponentów tam, gdzie wystarczają istniejące.
- Kolekcja treści `downloads` zostaje zarejestrowana w aktywnej konfiguracji kolekcji Astro (wersja 7, loader `glob`, schemat Zod). Wpisy zapisujemy jako pojedyncze pliki MDX z frontmatter, zgodnie z wzorcem istniejącej kolekcji bloga; treść wpisu jest opcjonalna, a karta czyta pola frontmatter.
- W Keystatic powstaje kolekcja edytorów z polami: tytuł (slug), opis (tekst wielowierszowy), kategoria (wybór z centralnej listy), plik (`fields.file` z katalogiem publicznym i ścieżką publiczną), rozmiar pliku (tekst z walidacją formatu), data publikacji, opublikowane (przełącznik), wyróżnione, tagi, opcjonalnie data aktualizacji, adres zewnętrzny, kolejność i sugerowana nazwa pobieranego pliku.
- `format` jest wyliczany z rozszerzenia pliku i nie jest polem edytowanym; `fileSize` pozostaje polem ręcznym z walidacją. Walidacja wymaganych pól i ścieżek odbywa się w schemacie kolekcji oraz w walidacji wyjścia buildu.
- Lista kategorii A–E jest zdefiniowana jednokrotnie i współdzielona przez Keystatic oraz renderowanie strony. Dodanie zwykłego materiału nie wymaga zmiany listy ani komponentów.
- Pojedynczy czysty moduł katalogu materiałów grupuje logikę: filtrowanie wpisów opublikowanych, wyliczanie formatu, walidacja, grupowanie wg kategorii, liczenie i sortowanie. Komponenty strony korzystają z jego publicznego interfejsu.
- Karta materiału ma stabilny identyfikator, `data-pagefind-title` oraz atrybuty `data-pagefind-filter` dla kategorii i formatu. Skrypt strony czyta `sub_results` z Pagefind i na podstawie kotwicy `#id` odsłania pasującą kartę; filtry korzystają z `pagefind.filters()`. W środowisku deweloperskim, gdy indeks Pagefind nie istnieje, wyszukiwarka degraduje się bez błędów — zgodnie z istniejącym wzorcem.
- Wyszukiwanie opiera się na istniejącym Pagefind; nie dodajemy bibliotek wyszukiwania ani testowego jsdom/Playwrighta. Obsługa polskich znaków jest domeną Pagefind.
- Na czas wdrożenia dodajemy pięć wyraźnie oznaczonych placeholderów PDF — po jednym w każdej kategorii — z napisem „PRZYKŁAD — DO PODMIANY", bez logo i pieczątki szkoły. Dokumentacja dla redaktora zawiera adnotację o usunięciu ich przed produkcją.
- Dokumentacja dla redaktora jest po polsku, zrozumiała dla osoby nieprogramującej i zawiera co najmniej dwa kompletne przykłady wpisów z różnych kategorii.
- Strona spełnia WCAG 2.2 AA (nie 2.1), wykorzystuje semantyczny HTML, zapewnia obsługę klawiaturą, widoczny focus, etykiety formularzy i komunikaty dla czytników ekranu. Układ jestresponsywny dla komputera, laptopa, tabletu i telefonu.
- SEO: unikalny tytuł, meta description, adres kanoniczny, poprawna hierarchia nagłówków H1–H3, breadcrumbs i linkowanie wewnętrzne z Katalogu Tras. Ścieżki plików działają przy aktualnej konfiguracji `site`, bez `base`, zgodnie z kanałem produkcyjnym Cloudflare i mirror GitHub Pages.
- Walidacja wyjścia buildu rozszerza istniejący wzorzec walidacji danych strukturalnych: sprawdza wygenerowany HTML katalogu oraz to, że każdy odnośnik do pliku ma odpowiadający plik w wyjściu buildu. Nie naruszamy nagłówków bezpieczeństwa ani ustaleń z ADR dotyczącego kanału wdrożenia.

## Testing Decisions

- **Seam 1 — istniejący Katalog Tras:** obecny test zgodności katalogu z plikami stron automatycznie pokrywa parę nowa strona / nowa Trasa. Nie dodajemy nowego testu nawigacji.
- **Seam 2 — czysty moduł katalogu materiałów:** testy Vitest wyłącznie przez publiczny interfejs modułu. Testujemy zachowanie: ukrywanie wpisów nieopublikowanych, wyliczanie formatu z rozszerzenia, grupowanie wg kategorii, liczby, sortowanie, odrzucanie wpisów z brakującymi wymaganymi polami i nieprawidłową ścieżką. Wzorzec: istniejące testy czystych funkcji narzędziowych (np. test sanitizera fragmentów wyszukiwania).
- **Seam 3 — wyjście buildu:** rozszerzenie istniejącego skryptu walidacji wywoływanego po buildzie. Testuje widoczny efekt: karty mają wymagane atrybuty Pagefind, nie ma kart nieopublikowanych, puste kategorie nie są renderowane, każdy link do pliku ma plik w wyjściu.
- Testy opisują zachowanie, nie implementację: nie mockujemy wewnętrznych zależności modułu katalogu i nie testujemy prywatnych funkcji. Oczekiwane wartości pochodzą z przykładów zdefiniowanych w tym specie.
- Nie testujemy automatycznie zachowania Pagefind w przeglądarce, focusu, kontrastu i responsywności — pozostaje ręczna weryfikacja wg listy z wymagań źródłowych (build, wykrywanie materiałów, walidacja pól, filtry, wyszukiwanie z polskimi znakami, pusty wynik, linki do plików, ścieżki, widok mobilny, klawiatura, ukrywanie nieopublikowanych, brak konieczności zmiany komponentów).
- Podstawą testów są dane z wpisów i kategorii, nie rzeczywiste dokumenty szkoły; placeholderi są danymi testowymi i nie mogą być traktowane jako materiały docelowe.

## Out of Scope

- Strony szczegółów pojedynczego materiału i katalogi pobrania pakietów ZIP.
- Przebudowa innych stron, zmiana globalnego wyglądu serwisu, usuwanie istniejących komponentów i funkcjonalności.
- Zmiana kanału wdrożenia, nagłówków bezpieczeństwa, ADR-ów oraz konfiguracji hostingu.
- Dodawanie nowych zależności produkcyjnych lub testowych.
- Tworzenie prawdziwych dokumentów szkoły, pieczątek, logo ani materiałów prasowych — w tym specie powstają wyłącznie oznaczone placeholdery.
- Publikowanie dokumentów wewnętrznych i danych osobowych.
- Zmiana nazewnictwa w Słowniku poza dodaniem terminów opisujących nowy obszar, jeśli okażą się potrzebne.

## Further Notes

- Decyzje podjęte z użytkownikiem: materiały docelowe dostarczy użytkownik, na czas wdrożenia dopuszczalne są oznaczone placeholdery; edycja odbywa się w Keystatic; wyszukiwanie wykorzystuje Pagefind; rozmiar pliku wpisuje ręcznie redaktor; format wyliczamy z rozszerzenia.
- Wymagania źródłowe z pliku `docs/agents/dodawanie-podstrony.md` zostały przeniesione do tego specu i nie są utrzymywane jako drugie źródło prawdy.
- Terminy z Słownika obowiązują: Trasa, Katalog Tras, Alias. Nowa Trasa nie wprowadza Aliasu.
- Nie proponujemy ADR: wybór CMS-owego źródła edycji i wyszukiwarki jest odwracalny i nie zmienia architektury wdrożenia.
- Następny krok w przepływie: podział specu na pionowe plasterki z jawnymi zależnościami (`/to-tickets`), a następnie implementacja ticket po tickecie z `/tdd` i `/code-review`.
