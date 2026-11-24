# 02: Pełne kategorie i oznaczone placeholdery

**What to build:** Katalog ma wszystkie pięć kategorii z centralnej listy, ale pokazuje tylko te, w których są materiały. Każda kategoria ma po jednym wyraźnie oznaczonym przykładowym pliku, który redaktor później podmieni na prawdziwy dokument szkoły. Karty niosą informację o wyróżnieniu i dacie, a katalog ma czytelny stan pusty.

**Blocked by:** 01

**Status:** resolved

**Label:** ready-for-agent

- [x] Centralna lista kategorii A–E (identyfikacja wizualna, promocja, dokumenty i publikacje, media i partnerzy, multimedia) jest jedynym źródłem kategorii dla Keystatic i dla strony.
- [x] W każdej z pięciu kategorii znajduje się jeden placeholder PDF z wyraźnym napisem „PRZYKŁAD — DO PODMIANY" na pierwszej stronie, bez logo i pieczątki szkoły.
- [x] Kategoria bez opublikowanych materiałów nie jest renderowana; kategoria z materiałami pokazuje ich liczbę.
- [x] Wyróżnione materiały mają widoczne oznaczenie, a data publikacji/aktualizacji jest czytelna na karcie.
- [x] Karty są sortowane w deterministyczny sposób (wyróżnione, potem data, potem tytuł).
- [x] Gdy nie ma żadnych opublikowanych materiałów, strona pokazuje czytelny komunikat zamiast pustej siatki.
- [x] Testy czystego modułu katalogu dla grupowania, liczenia i sortowania przechodzą; build i testy są zielone.

## Comments

Zaimplementowano plasterek 02: cztery brakujące placeholdery PDF (po jednym w kategoriach identyfikacja wizualna, materiały promocyjne, media i partnerzy, multimedia) oraz odpowiadające im wpisy w kolekcji `downloads`. Wszystkie pięć plików ma na pierwszej stronie napis „PRZYKŁAD — DO PODMIANY" i żadnego logo ani pieczątki. Na karcie dodano widoczną plakietkę „Polecane" dla wpisów wyróżnionych; jednym z przykładów jest wyróżniony, a przykład z multimediów ma datę aktualizacji. `groupDownloads` sortuje karty w grupie niezależnie od kolejności wpisów — porządek jest deterministyczny (wyróżnione, data, tytuł).

Po recenzji kodu poprawiono też porządek kart: datą porównywaną jest data widoczna na karcie (`updatedDate ?? pubDate`), dodano ostateczne wyróżniki (`sortOrder`, identyfikator), a licznik kategorii odmienia poprawnie po polsku („1 materiał", „2 materiały", „5 materiałów") w tekście dla czytnika ekranu.

Weryfikacja: `npx vitest run src/utils/downloads-catalog.test.ts` (18 testów), `npm test` (6 plików / 52 testy), `npm run check` (0 błędów), `npm run build` z Pagefind i walidacją BreadcrumbList. W wygenerowanym HTML sprawdzono pięć sekcji kategorii, liczniki z poprawną odmianą, jedną plakietkę „Polecane", daty (w tym „aktualizacja") oraz pięć odnośników do plików obecnych w `dist/client/downloads/`.
