Status: ready-for-agent

# Katalog Tras — specyfikacja

## Problem Statement

Serwis szkoły ma 43 trasy statyczne, ale wiedza o nich jest rozproszona po kilku adapterach nawigacyjnych. Etykiety, przynależność do sekcji, ikony, breadcrumb-rodzice, skróty używane w menu i stopce oraz aliasy redirectów są utrzymywane osobno. Efektem są rozjazdy widoczne dla odwiedzających: ta sama Trasa ma różne nazwy,部分 linki prowadzą do nieistniejących adresów, a nowa strona nie dostaje automatycznie ścieżki nawigacyjnej. Osoba zmieniają jedną nazwę musi wiedzieć, w ilu miejscach ją poprawić, a błąd wychodzi dopiero po buildzie — jeśli w ogóle wychodzi.

## Solution

Wprowadzamy katalog Tras jako jedyne źródło faktów o publicznych adresach serwisu. Jedna typowana tablica opisuje każdą Trasę: kanoniczną ścieżkę, etykietę wziętą z tytułu lub nagłówka strony, opcjonalne warianty kontekstowe, sekcję, breadcrumb-rodzica, grupę i opis w menu, nazwę ikony, aliasy redirectów oraz tytuł używany przez wyszukiwarkę. Sekcje oraz linki zewnętrzne są eksportowane z tego samego katalogu jako odrębne zbiory. Adaptery nawigacyjne przestają własnymi słowami opisywać trasy i zaczynają czytać z katalogu; konfiguracja redirectów również jest z niego generowana. Jeden seam testowy — interfejs katalogu — pozwala sprawdzić spójność całej sieci Tras przed buildem.

## User Stories

1. Jako odwiedzający chcę zobaczyć tę samą nazwę strony w menu, breadcrumbach i stopce, żeby nie zastanawiać się, czy trafiłem na właściwą podstronę.
2. Jako odwiedzający stronę OPM chcę zobaczyć poprawną nazwę „Oddział Przygotowania Mundurowego”, żeby nie czytać błędnej nazwy „Morskiego”.
3. Jako odwiedzający stronę OPW chcę spójnej formy nazwy między menu a ścieżką nawigacyjną.
4. Jako uczeń chcę znaleźć „Pracownicy młodociani” w ścieżce nawigacyjnej, żeby wiedzieć, w której części serwisu jestem.
5. Jako rodzic chcę, aby strona „Pracownie” miała poprawny breadcrumb, nawet jeśli nie prowadzi do niej menu główne.
6. Jako kandydat chcę, aby link „Poznaj naszych partnerów” prowadził do istniejącej strony, a nie pod adres, który nie istnieje.
7. Jako odwiedzający chcę, aby stary adres „kierunki-ksztalcenia” nadal przekierowywał na aktualną ofertę, żeby zachowane linki nie prowadziły donikąd.
8. Jako odwiedzający chcę zobaczyć w breadcrumbach aktualny rok szkolny zamiast przestarzałej etykiety „Oferta 2025/2026”.
9. Jako użytkownik telefonu chcę, aby menu mobilne korzystało z tych samych nazw co menu desktopowe.
10. Jako użytkownik telefonu chcę, aby szybkie linki do Dziennika, planów i Dzwonków miałyjedną, spójną nazwę.
11. Jako użytkownik klawiatury chcę, aby nazwy linków w menu i stopce były przewidywalne i nie zmieniały się w zależności od adaptera.
12. Jako użytkownik czytnika ekranu chcę, aby ścieżka nawigacyjna miała logiczną strukturę i poprawne oznaczenie bieżącej strony.
13. Jako użytkownik wyszukiwarki chcę zobaczyć zwięzły tytuł wyniku bez powtarzającego się sufiksu szkoły.
14. Jako użytkownik wyszukiwarki chcę, aby tytuł wyniku zgadzał się z nazwą Trasy, pod którą strona jest prezentowana w nawigacji.
15. Jako autor treści chcę, aby nazwa strony w wyszukiwarce nie wymagała osobnego pola ustawianego przy każdej stronie.
16. Jako twórca strony chcę dodać nową Trasę w jednym miejscu i widzieć ją w menu, breadcrumbach, stopce i wyszukiwarce.
17. Jako twórca strony chcę zmienić nazwę Trasy w jednym miejscu i zobaczyć zmianę wszędzie tam, gdzie jest używana.
18. Jako twórca strony chcę mieć jeden typ opisujący Trasę, żeby edytor podpowiadał mi wymagane pola.
19. Jako twórca strony chcę, aby kolejność linków w menu wynikała z kolejności wpisów w katalogu, a nie z przypadkowego mapowania.
20. Jako twórca strony chcę, aby skrót w menu i dłuższa nazwa w stopce były wyraźnie oznaczonymi wariantami tej samej Trasy.
21. Jako twórca strony chcę, aby dłuższy tekst w stopce nie zastępował kanonicznej nazwy w breadcrumbach.
22. Jako twórca strony chcę, aby opis linku w menu był częścią Trasy, a nie osobnym tekstem rozproszonym po adapterze.
23. Jako twórca strony chcę, aby nazwa ikony była częścią Trasy, ale ścieżki grafik pozostały detailom menu.
24. Jako twórca strony chcę, aby sekcje serwisu miały jedno źródło nazw i adresów.
25. Jako twórca strony chcę, aby breadcrumb sekcji zachował dotychczasowy adres z końcowym ukośnikiem i nie zmienił danych strukturalnych.
26. Jako twórca strony chcę, aby wpisy bloga nadal miały ścieżkę „Aktualności → tytuł wpisu” bez dodawania sekcji.
27. Jako twórca strony chcę, aby strona główna nie miała breadcrumbów, tak jak dotąd.
28. Jako twórca strony chcę, aby nieznana ścieżka nadal dostawała bezpieczny breadcrumb zamiast pustego wyniku.
29. Jako twórca strony chcę, aby linki zewnętrzne były opisane osobno od Tras, bo nie mają własnych stron w serwisie.
30. Jako twórca strony chcę, aby E-Dziennik, plan lekcji, plan LO, BIP i media społecznościowe miały jedno wspólne miejsce opisu.
31. Jako twórca strony chcę, aby wewnętrzna strona planu lekcji nie była mylona z zewnętrznym adresem planu używanym w szybkich linkach.
32. Jako twórca strony chcę usunąć nieużywane dane menu, które wyglądają na źródło prawdy, a nie są nigdzie renderowane.
33. Jako twórca strony chcę usunąć zduplikowany wpis ikony dla aktualności, żeby mapa nie miała dwóch kluczy o tym samym znaczeniu.
34. Jako twórca strony chcę usunąć ikonę, do której nie prowadzi żadna Trasa, żeby zestaw symboli był minimalny.
35. Jako twórca strony chcę, aby redirectybyły generowane z katalogu Tras, a nie wpisywane ręcznie w konfiguracji.
36. Jako twórca strony chcę, aby alias redirectu był rozpoznawany jako fakt Trasy, a nie jako osobny wpis z własną, przestarzałą etykietą.
37. Jako recenzent changes chcę zobaczyć w jednym diffie, że nowa nazwa Trasy została zmieniona tylko raz.
38. Jako recenzent chcę, aby testy sprawdzały komplet Tras i nie pozwalały dodać strony bez opisu.
39. Jako recenzent chcę, aby testy wykrywały zduplikowaną kanoniczną ścieżkę.
40. Jako recenzent chcę, aby testy sprawdzały, że każdy alias prowadzi do istniejącej Trasy.
41. Jako recenzent chcę, aby testy ścieżki nawigacyjnej obejmowały stronę główną, zwykłą Trasę, wpis bloga i ścieżkę nieznaną.
42. Jako twórca strony chcę uruchomić testy jednym poleceniem bez instalowania kolejnych narzędzi poza jednym runnerem.
43. Jako twórca strony chcę sprawdzać typy katalogu jednym poleceniem razem z resztą projektu.
44. Jako agent pracujący w repozytorium chcę czytać słownik pojęć, żeby nazywać Trasy zgodnie z ustalonym językiem.
45. Jako agent chcę czytać ADR, żeby nie proponować z powrotem edytora treści dla katalogu Tras.
46. Jako przyszły twórca chcę, aby stara, rozproszona wiedza o trasach zniknęła po migracji wszystkich konsumentów.
47. Jako użytkownik chcę, aby zmiana katalogu nie zmieniała wyglądu strony poza nazwami i ścieżkami nawigacyjnymi.
48. Jako użytkownik chcę, aby dane strukturalne nadal przechodziłydotychczasową walidację po buildzie.
49. Jako administrator chcę, aby build i deploy nie wymagały ręcznej aktualizacji listy redirectów.
50. Jako nauczyciel chcę, aby strona „Grono pedagogiczne” i inne strony kadry nadal działały bez zmiany treści.

## Implementation Decisions

- Jedynym źródłem faktów o Trasach jest jeden typowany katalog w formie tablicy; kolejność wpisów jest znacząca, bo wyznacza kolejność w menu.
- Wpis Trasy niesie: kanoniczną ścieżkę, etykietę kanoniczną, opcjonalny skrót menu, opcjonalną dłuższą nazwę stopki, opis menu, sekcję, breadcrumb-rodzica, grupę menu, nazwę ikony, aliasy oraz tytuł wyszukiwania domyślnie równy etykiecie kanonicznej.
- Etykieta kanoniczna jest brana z tytułu lub nagłówka strony. Warianty kontekstowe istnieją tylko wtedy, gdy tekst pełni inną funkcję, a nie gdy jest stylistycznym duplikatem.
- Sekcje serwisu i linki zewnętrzne są eksportowane z katalogu jako odrębne zbiory. Linki zewnętrzne nie są Trasami.
- Ścieżki kanoniczne nie mają końcowego ukośnika; adresy breadcrumbów sekcji zachowują dotychczasowy format z końcowym ukośnikiem.
- Funkcja budująca ścieżkę nawigacyjną jest częścią katalogu i jest czysta: przyjmuje bieżącą ścieżkę oraz opcjonalny tytuł wpisu bloga i zwraca listę okruszków.
- Dotychczasowy specjalny przypadek wpisów bloga zostaje: ścieżka zawiera „Aktualności” i tytuł wpisu, bez okruszka sekcji.
- Konfiguracja redirectów importuje aliasy z katalogu; nie prowadzi się drugiej, ręcznej listy.
- Adaptery są migrowane kolejno: pierwszy breadcrumbs, potem menu główne, stopka, paski szybkiego dostępu i układ strony. Stare mapy są usuwane dopiero po migracji ostatniego konsumenta.
- Graficzne ścieżki ikon pozostają w adapterze menu; katalog przechowuje tylko nazwę ikony.
- W ramach migracji usuwane są: nieużywany zbiór linków mobilnych, zduplikowany wpis aktualności w mapie ikon, nieużywana ikona oraz martwy wpis o starym adresie „about”.
- Poprawiony zostaje link partnerski prowadzący do nieistniejącej trasy; zyskują go brakujące Trasy dla stron pracowniczych.
- Język projektu jest utrzymywany w słowniku pojęć, a wybór katalogu nadal edytowalnej kolekcji treści został utrwalony w ADR.
- Dodawany jest jeden runner testów oraz skrypt sprawdzania typów.

## Testing Decisions

- Dobry test sprawdza zachowanie widoczne na zewnątrz przez jeden seam katalogu Tras: zwróconą listę okruszków, rozwiązanie aliasu albo komplet wpisów. Nie testuje wewnętrznych struktur danych ani szczegółów renderowania adapterów.
- Testowaniu podlega wyłącznie katalog Tras jako jedyny seam: komplet oczekiwanych Tras, unikalność ścieżek, poprawność aliasów oraz cztery przypadki funkcji ścieżki nawigacyjnej — strona główna, zwykła Trasa, wpis bloga i ścieżka nieznana.
- Adaptery nawigacyjne nie dostają własnych testów jednostkowych. Są weryfikowane przez build projektu, dotychczasową walidację danych strukturalnych po buildzie oraz krótki przegląd widoku desktopowego i mobilnego.
- Prior art w repozytorium nie istnieje: nie ma test runnera ani testów katalogu. Jedynym istniejącym automatycznym sprawdzeniem jest walidator danych strukturalnych działający na wygenerowanym HTML; pozostaje on niezmieniony i nadal sprawdza gotowy wynik, nie źródło Tras.

## Out of Scope

- Poprzedni refaktor sprzed pulla, w tym pliki konfiguracji kierunków, motywy, ikony i baselines HTML.
- Zmiana treści, tytułów stron i nagłówków poza wyborem etykiet kanonicznych.
- Wprowadzenie edytora treści dla katalogu Tras ani nowych kolekcji zawartości.
- Dodawanie nowych stron, endpointów ani wpisów bloga.
- Traktowanie stron RSS i API jako Tras.
- Zmiana kształtu danych strukturalnych w breadcrumbach oraz dotychczasowego sposobu ich walidacji.
- Zmiana stylów, układu wizualnego i zachowań wyszukiwarki poza źródłem tytułu wyniku.
- Rozwiązywanie pozostałych, niezwiązanych z trasami konfliktów opisów w treści stron.

## Further Notes

- Specyfikacja korzysta z terminu **Trasa** zdefiniowanego w słowniku projektu.
- Decyzja architektoniczna jest zapisana jako ADR-0001 i nie powinna być re-litigowana przy okazji tej zmiany.
- Tickets powstają w lokalnym trackerze, jeden plik na ticket, w kolejności zależności.
