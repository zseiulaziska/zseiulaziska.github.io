# 01: Pierwszy materiał widoczny w katalogu

**What to build:** Użytkownik wchodzi na `/materialy-do-pobrania/` i widzi pierwszy opublikowany materiał jako kartę z działającym przyciskiem pobierania. Trasa jest częścią Katalogu Tras, więc katalog jest linked z głównego menu i stopki. Redaktor może zmienić ten materiał w Keystatic bez dotykania kodu.

**Blocked by:** None (can start immediately)

**Status:** resolved

**Label:** ready-for-agent

- [x] Podstrona pod adresem `/materialy-do-pobrania/` działa przy bezpośrednim wejściu, z poprawnym tytułem, meta description, adresem kanonicznym i breadcrumbs.
- [x] Nowa Trasa znajduje się w Katalogu Tras; odnośnik w głównym menu (sekcja „Szkoła") i w stopce pochodzi z katalogu, nie z osobnej listy.
- [x] Kolekcja treści `downloads` jest zarejestrowana w aktywnej konfiguracji Astro z walidacją Zod (loader plików MDX z frontmatter).
- [x] W Keystatic istnieje kolekcja edytorów z polami: tytuł, opis, kategoria z centralnej listy, plik z publicznego katalogu plików, rozmiar pliku, data, opublikowane oraz pola opcjonalne zgodne ze specem.
- [x] Jeden opublikowany materiał wyświetla się jako karta z ikoną formatu, tytułem, opisem, rozmiarem, datą i wyraźnym „Pobierz"; plik pobiera się poprawnie.
- [x] `format` jest wyliczany z rozszerzenia pliku, a `fileSize` jest wpisywany ręcznie i walidowany; wpis z brakującym wymaganym polem lub złą ścieżką jest odrzucany.
- [x] Wpis nieopublikowany nie pojawia się w katalogu.
- [x] Testy istniejącego seamu Katalogu Tras oraz nowego seamu czystego modułu katalogu przechodzą; `npm run check` i `npm test` są zielone.

## Comments

Zaimplementowano plasterek 01: nowa Trasa i strona katalogu, kolekcja `downloads` (aktywny `src/content.config.ts`, glob + Zod), kolekcja edytora Keystatic współdzieląca centralną listę kategorii i walidację rozmiaru z czystym modułem `src/utils/downloads-catalog.ts`, pierwszy oznaczony przykład PDF w `public/downloads/` oraz karta z atrybutami Pagefind.

Weryfikacja: `npm test` (6 plików / 46 testów), `npm run check` (0 błędów), `npm run build` z Pagefind i walidacją BreadcrumbList. Sprawdzono w wygenerowanym HTML: tytuł, meta description, kanoniczny adres, breadcrumbs, jedną kartę, odnośnik do pliku oraz atrybuty `data-pagefind-title` / `data-pagefind-filter`. Testowy wpis z `published: false` został usunięty z repozytorium i nie pojawił się na stronie w dodatkowym buildzie.
