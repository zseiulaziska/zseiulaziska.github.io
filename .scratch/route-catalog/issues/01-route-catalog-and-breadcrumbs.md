# 01: Katalog Tras i pierwszy adapter breadcrumbów

**What to build:** Jedno typowane źródło faktów o wszystkich Trasach serwisu oraz ścieżki nawigacyjne, które z niego korzystają. Po tym tickecie zmiana nazwy Trasy w jednym miejscu powinna zmienić jej nazwę w breadcrumbach, a błędna nazwa OPM powinna zniknąć.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [x] Katalog zawiera jedną Trasę dla każdej z 43 stron statycznych oraz dla zbioru aktualności; kolejność wpisów wyznacza przyszłą kolejność menu.
- [x] Każda Trasa udostępnia kanoniczną ścieżkę i etykietę oraz, gdzie potrzeba, warianty kontekstowe, opis, sekcję, breadcrumb-rodzica, grupę menu, nazwę ikony, aliasy i tytuł wyszukiwania domyślnie równy etykiecie.
- [x] Sekcje serwisu i linki zewnętrzne są dostępne jako odrębne zbiory w tym samym katalogu.
- [x] Funkcja ścieżki nawigacyjnej działa poprawnie dla strony głównej, zwykłej Trasy, wpisu bloga i ścieżki nieznanej; wpisy bloga zachowują dotychczasową ścieżkę „Aktualności → tytuł wpisu”.
- [x] Adresy okruszków sekcji zachowują dotychczasowy format z końcowym ukośnikiem, więc dane strukturalne nie zmieniają kształtu.
- [x] Breadcrumb dla `/opm` używa poprawnej nazwy kanonicznej; Trasy dla stron pracowniczych otrzymały brakujące wpisy; martwy wpis o starym adresie „about” i przestarzała etykieta aliasu zniknęły.
- [x] Jeden runner testów i skrypt sprawdzania typów działają jednym poleceniem i przechodzą, testując katalog przez jego interfejs: komplet Tras, unikalność ścieżek, poprawność aliasów i cztery przypadki ścieżki nawigacyjnej.
- [x] Build projektu i dotychczasowa walidacja danych strukturalnych po buildzie przechodzą bez zmiany zachowania widoku.

## Comments

- `npm test` — 10/10 testów zielonych przez jeden seam (`src/routes.ts`).
- `npm run build` — build i walidator danych strukturalnych przechodzą: „Pliki HTML: 48, bloki BreadcrumbList: 46”.
- `npm run check` uruchamia się poprawnie po obniżeniu TypeScript do 6.x (TS 7 nie udostępnia API wymaganego przez `@astrojs/check`). Nie zgłasza błędów w `src/routes.ts`, `src/routes.test.ts` ani `src/components/Breadcrumbs.astro`. Raportuje natomiast 178 błędów istniejących wcześniej w niezmienionych plikach (m.in. `MegaNav.astro`, `plan-zajec-lo.astro`, `content/config.ts`); ich usunięcie wykracza poza zakres ticketa i częściowo nastąpi wraz z migracją adapterów 02–05.
- OPM i OPW mają jedną formę kanoniczną („Oddział …”) we wszystkich kontekstach; warianty liczby mnogiej pozostają wyłącznie w `footerLabel`, gdzie pełnią inną funkcję.
- `/blog` zachowuje etykietę kanoniczną „Blog” z nagłówka strony; skrót „Aktualności” pozostaje w `navLabel` i nadal zasila breadcrumb wpisów bloga.
- Po przeglądzie kodu poprawiono: podwójny `aria-current="page"` (teraz wyłącznie na ostatnim okruszku), breadcrumb `/kierunki` (przez `breadcrumbParent` zachowuje „Oferta”, a w menu pozostaje w „O szkole”), martwy link partnerski w `WhyChooseSection.astro` oraz nazewnictwo `Trasa`/`trasy`/`findTrasa` zgodne ze słownikiem. Usunięto też dodatkowe testy struktur i pole `highlight` bez konsumenta.
- Weryfikacja HTML po buildzie: `/informacje`, `/kierunki` i `/opm` mają dokładnie jedno `aria-current="page"` i poprawne okruszki sekcji.
