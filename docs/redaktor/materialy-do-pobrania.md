# Materiały do pobrania — instrukcja dla redaktora

Ten poradnik opisuje, jak dodawać, zmieniać i wycofywać materiały w katalogu
**[Materiały do pobrania](https://www.zseiulaziska.pl/materialy-do-pobrania/)**.
Nie trzeba znać Astro, HTML-a ani programowania — wszystko robi się w panelu
Keystatic w przeglądarce.

## Gdzie pracujesz

1. Wejdź na **https://www.zseiulaziska.pl/keystatic/** (w wersji testowej strony
   użyj adresu tej wersji z dopiskiem `/keystatic/` na końcu).
2. Zaloguj się na konto szkoły.
3. W menu po lewej wybierz **„Materiały do pobrania"**.
4. Każdy materiał to jeden **wpis** na liście. Kliknij wpis, żeby go poprawić,
   albo przycisk **„Nowy wpis"**, żeby dodać nowy.

Zmiany zapisują się od razu na komputerze (repozytorium), a na stronie
publicznej pojawią się po tym, jak osoba prowadząca stronę opublikuje build.
Nie musisz przy tym nic zmieniać w kodzie strony, liście kategorii ani
licznikach — katalog sam wykrywa nowe wpisy.

## Jak dodać nowy materiał — krok po kroku

1. W panelu Keystatic otwórz **Materiały do pobrania** i kliknij **Nowy wpis**.
2. Wpisz **Tytuł** — krótko, np. „Ulotka rekrutacyjna 2026/2027". Tytuł staje
   się też nazwą pliku wpisu; nie używaj znaków `<`, `>`, `:` ani `/`.
3. Wpisz **Opis** — jedno lub dwa zdania o tym, co zawiera plik. Opis widać na
   karcie i w wyszukiwarce.
4. Wybierz **Kategorię** z listy. Nie wpisuj jej ręcznie — lista jest taka sama
   jak na stronie:
   - Identyfikacja wizualna
   - Materiały promocyjne
   - Dokumenty i publikacje
   - Media i partnerzy
   - Multimedia
5. Wybierz jedną z dwóch opcji:
   - **Plik do pobrania** — kliknij pole i wskaż plik z komputera. Zostanie
     wgrany do katalogu `public/downloads` i udostępniony pod adresem
     `/downloads/…`. **Typ pliku (PDF, DOCX, PNG itd.) wyliczymy sami z rozszerzenia — nie wpisuj go nigdzie.**
   - **Zewnętrzny adres URL** — wpisz pełny adres (z `https://`), jeśli plik
     jest hostowany gdzie indziej. Wtedy zostaw pole pliku puste. Nie wolno
     wskazać pliku i adresu jednocześnie.
6. Wpisz **Rozmiar pliku** ręcznie, w formacie „liczba spacja jednostka",
   np. `2.4 MB`, `1,39 MB`, `542 kB`, `800 B`. jednostka to `B`, `kB`, `MB`
   albo `GB`. Błędny zapis (np. samo `2.4`) zablokuje zapis wpisu.
7. Wybierz **Datę publikacji**. To data, która domyślnie widnieje na karcie.
8. (Opcjonalnie) zaznacz **Wyróżnione**, jeśli materiał ma mieć plakietkę
   „Polecane" i ma być pokazywany jako pierwszy w swojej kategorii.
9. (Opcjonalnie) wpisz **Tagi** — słowa, po których będzie można znaleźć
   materiał w wyszukiwarce, np. `rekrutacja`, `ulotka`.
10. (Opcjonalnie) wybierz **Datę aktualizacji**, jeśli plik był już aktualizowany.
    Wtedy na karcie zamiast daty publikacji pojawi się „aktualizacja" i ta
    nowsza data.
11. (Opcjonalnie) wpisz **Kolejność** — liczbę całkowitą pomagającą ustawić
    porządek, gdy kilka materiałów ma tę samą datę. Mniejsza liczba jest
    wcześniej.
12. (Opcjonalnie) wpisz **Sugerowaną nazwę pobieranego pliku**, jeśli plik ma
    się pobierać pod inną nazwą niż na serwerze. Nie używaj `/` ani `\`.
13. **Ważne:** zaznacz **Opublikowane** dopiero wtedy, gdy materiał jest gotowy
    do pokazania. Niezaznaczony wpis nie pojawi się na stronie, ale nadal
    będzie widoczny w panelu — możesz do niego wrócić później.
14. Kliknij **Zapisz**. Sprawdź wpis na stronie katalogu po najbliższej
    publikacji.

## Jak zmienić lub wycofać materiał

- **Zmiana treści lub pliku:** otwórz wpis, popraw wybrane pola i zapisz.
  Jeśli wgrywasz nowy plik pod inną nazwą, pamiętaj, żeby usunąć stary plik
  z `public/downloads` (lub poprosić o to osobę prowadzącą repozytorium).
- **Wycofanie bez usuwania:** odznacz **Opublikowane** i zapisz. Karta zniknie
  z katalogu, a wpis zostanie w panelu.
- **Usunięcie:** otwórz wpis i użyj opcji usunięcia w Keystatic. Jeśli materiał
  miał plik w `public/downloads`, usuń też ten plik — inaczej będzie nadal
  dostępny pod bezpośrednim adresem, nawet gdy karty nie ma na stronie.

## Polityka prywatności — bardzo ważne

Pliki w `public/downloads` są **publiczne z chwilą wgrania**, nawet jeśli
odznaczysz „Opublikowane" albo w ogóle nie utworzysz wpisu. Ktoś, kto zna
adres, może je pobrać. Dlatego:

- nie wgrywaj dokumentów wewnętrznych, danych osobowych, umów ani protokołów;
- nie traktuj ukrycia karty jako zabezpieczenia;
- przed wgraniem sprawdź, czy plik może zostać udostępniony wszystkim
  odwiedzającym.

## Przykład 1 — identyfikacja wizualna, plik lokalny

Poniżej kompletny przykład wpisu. W Keystatic wypełniasz te same dane w
formularzu — nie musisz wpisywać znaczników `---` ani niczego programować.

```yaml
---
title: "Logo szkoły — wersja pozioma"
description: "Oficjalne logo ZSEiU Łaziska Górne w wersji poziomej, do użycia w materiałach drukowanych i na stronach www."
category: "identyfikacja-wizualna"
file: "/downloads/logo-szkoly-poziome.pdf"
fileSize: "2.4 MB"
pubDate: 2026-11-24
published: true
featured: true
tags:
  - logo
  - identyfikacja wizualna
downloadName: "logo-zseiulaziska-poziome.pdf"
---
```

Efekt: wyróżniona karta „Logo szkoły — wersja pozioma" w kategorii
**Identyfikacja wizualna**, z plakietką „Polecane", formatem **PDF** wyliczonym
z rozszerzenia, rozmiarem `2.4 MB` i przyciskiem **Pobierz**, który zapisuje
plik jako `logo-zseiulaziska-poziome.pdf`.

## Przykład 2 — dokumenty i publikacje, plik zaktualizowany

```yaml
---
title: "Regulamin rekrutacji 2026/2027"
description: "Aktualny regulamin rekrutacji do klas pierwszych. Wersja z poprawkami zatwierdzonymi przez radę pedagogiczną."
category: "dokumenty-i-publikacje"
file: "/downloads/regulamin-rekrutacji-2026-2027.docx"
fileSize: "1,39 MB"
pubDate: 2026-03-15
updatedDate: 2026-11-20
published: true
featured: false
tags:
  - rekrutacja
  - regulamin
sortOrder: 1
---
```

Efekt: karta w kategorii **Dokumenty i publikacje** z formatem **DOCX**,
rozmiarem `1,39 MB` i datą „aktualizacja 20 listopada 2026". W wyszukiwarce
można znaleźć ją po frazach „regulamin", „rekrutacja", a także po nazwie
kategorii. Wyszukiwanie nie rozróżnia wielkości liter i obsługuje polskie
znaki („rekrutacja" zadziała tak samo jak „REKRUTACJA").

## Przykład 3 — materiał z zewnętrznego adresu

Gdy plik nie leży na naszej stronie, zamiast pola `file` wpisz `externalUrl`:

```yaml
---
title: "Raport z konkursu na stronie partnera"
description: "Raport dostępny na stronie instytucji partnerującej; otwiera się w nowej karcie."
category: "media-i-partnerzy"
externalUrl: "https://partner.example.pl/pliki/raport-2026.pdf"
fileSize: "3.1 MB"
pubDate: 2026-10-02
published: true
---
```

Taka karta ma ikonę otwarcia w nowej karcie i informację dla czytnika ekranu,
że opuszczasz domenę szkoły.

## Placeholdery — koniecznie usunąć przed produkcją

Na czas wdrożenia katalog zawiera **pięć przykładowych plików PDF** z napisem
**„PRZYKŁAD — DO PODMIANY"** na pierwszej stronie. Nie mają logo ani pieczątki
szkoły i **nie są materiałami docelowymi**. Należy je podmienić lub usunąć,
zanim katalog zostanie uznany za gotowy.

| Wpis w `src/content/downloads/` | Plik w `public/downloads/` | Kategoria |
| --- | --- | --- |
| `material-przykladowy.mdx` | `przykladowy-material.pdf` | Dokumenty i publikacje |
| `identyfikacja-wizualna-przyklad.mdx` | `identyfikacja-wizualna-przyklad.pdf` | Identyfikacja wizualna |
| `materialy-promocyjne-przyklad.mdx` | `materialy-promocyjne-przyklad.pdf` | Materiały promocyjne |
| `media-i-partnerzy-przyklad.mdx` | `media-i-partnerzy-przyklad.pdf` | Media i partnerzy |
| `multimedia-przyklad.mdx` | `multimedia-przyklad.pdf` | Multimedia |

Co zrobić z placeholderem:

1. Jeśli masz już prawdziwy dokument — w Keystatic otwórz przykładowy wpis,
   wgraj właściwy plik i uzupełnij pola (albo utwórz nowy wpis i usuń stary).
2. Jeśli dokumentu jeszcze nie ma — usuń wpis i usuń odpowiadający plik PDF.
3. Usuń **zarówno wpis, jak i plik**. Samo odznaczenie „Opublikowane" wystarczy,
   żeby karty nie było na stronie, ale plik nadal będzie dostępny pod adresem
   `/downloads/...`.
4. Po zmianie sprawdź katalog na stronie — puste kategorie znikają same.

## Co się stanie, gdy coś jest nie tak

Build strony kończy się błędem, jeśli:

- wpis nie ma wymaganego pola (tytuł, opis, kategoria, rozmiar, data, plik
  albo adres zewnętrzny, status opublikowania);
- ścieżka pliku nie prowadzi do `/downloads/` albo plik ma nieobsługiwane
  rozszerzenie;
- odnośnik do pliku w wygenerowanej stronie nie ma odpowiadającego pliku
  w wyjściu buildu;
- na stronie pojawi się karta wpisu nieopublikowanego albo pusta kategoria.

Dzięki temu uszkodzony katalog nie trafia na produkcję. Jeśli build zgłosi
problem, popraw wskazany wpis w Keystatic i spróbuj ponownie. W razie wątpliwości
zwróć się do osoby prowadzącej stronę — komunikat błędu zawiera nazwę pliku
i opis problemu.
