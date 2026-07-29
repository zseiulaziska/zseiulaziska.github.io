# AI Agent Specification: UI/UX Refactoring & Frontend Implementation Plan
## Zespół Szkół Energetycznych i Usługowych — Modernizacja Interfejsu Strony Internetowej

---

# 1. Role i zakres działania agenta AI

## Typ agenta

Agent odpowiedzialny za kompleksową analizę, projektowanie i implementację zmian frontendowych:

- UI/UX Designer Agent
- Frontend Developer Agent
- Accessibility QA Agent
- Content Structure Agent

Agent powinien działać jako doświadczony projektant i programista stron internetowych instytucji edukacyjnych.

---

# 2. Cel projektu

## Cel główny

Przeprowadzić kompleksową refaktoryzację obecnego interfejsu strony internetowej Zespołu Szkół Energetycznych i Usługowych.

Aktualny projekt należy przekształcić z klasycznego, przeładowanego wizualnie układu opartego na wielu kolorowych kartach w:

- nowoczesną platformę informacyjną szkoły,
- intuicyjny system komunikacji z uczniami i rodzicami,
- profesjonalny serwis edukacyjny,
- stronę zgodną ze standardami dostępności WCAG 2.1 AA,
- responsywny interfejs dostosowany do urządzeń mobilnych.

---

# 3. Główne grupy użytkowników

Projekt należy optymalizować dla dwóch podstawowych grup odbiorców.

---

## Grupa A — Kandydaci i rodzice

### Potrzeby użytkowników:

- szybkie poznanie oferty edukacyjnej,
- znalezienie kierunków kształcenia,
- poznanie atutów szkoły,
- dostęp do informacji rekrutacyjnych,
- możliwość kontaktu ze szkołą.

### Najważniejsze elementy:

- Oferta edukacyjna
- Rekrutacja
- Profile zawodów
- Statystyki szkoły
- Opinie i sukcesy uczniów

---

## Grupa B — Obecni uczniowie i nauczyciele

### Potrzeby użytkowników:

Natychmiastowy dostęp do codziennie używanych usług.

### Priorytetowe elementy:

- E-dziennik
- Plan lekcji
- Zastępstwa
- Dzwonki
- Ogłoszenia
- Dokumenty szkolne
- BIP

---

# 4. Audyt obecnego UI/UX

---

# Problem 1 — Nadmierny chaos wizualny

## Diagnoza

Obecny projekt wykorzystuje wiele intensywnych kolorów dla poszczególnych kafelków:

- czerwony,
- zielony,
- niebieski,
- pomarańczowy,
- fioletowy,
- seledynowy.

Każdy element konkuruje o uwagę użytkownika.

---

## Negatywny efekt UX

Powoduje:

- przeciążenie poznawcze,
- brak hierarchii informacji,
- utratę spójności marki,
- amatorski wygląd strony,
- trudność w identyfikacji najważniejszych akcji.

---

## Wymagana zmiana

Zastąpić wielokolorowe moduły jednolitym systemem wizualnym.

Kolor powinien pełnić funkcję informacyjną, a nie dekoracyjną.

---

# Problem 2 — Niepoprawna architektura informacji

## Diagnoza

Aktualna strona wykorzystuje wiele podobnych sekcji:

- karty,
- kafelki,
- siatki ikon,
- boksy informacyjne.

Elementy są ułożone pionowo bez jasnej hierarchii.

---

## Negatywny efekt UX

Użytkownik musi długo przewijać stronę.

Najważniejsze funkcje:

- E-dziennik,
- Plan lekcji,
- Rekrutacja,
- BIP,

są traktowane tak samo jak elementy promocyjne.

---

## Wymagana zmiana

Należy stworzyć hierarchię:

1. Najważniejsze zadania użytkownika.
2. Oferta szkoły.
3. Przewagi konkurencyjne.
4. Aktualności.
5. Informacje dodatkowe.

---

# Problem 3 — Brak hierarchii wizualnej

## Diagnoza

Strona wykorzystuje zbyt wiele jednakowych komponentów:

- karta,
- karta,
- karta,
- kolejna karta.

Brakuje elementów prowadzących wzrok użytkownika.

---

## Wymagana zmiana

Wprowadzić:

- sekcje naprzemienne,
- różne typy bloków,
- większe przestrzenie,
- wyróżnione CTA,
- elementy typu hero,
- statystyki,
- storytelling.

---

# Problem 4 — Dostępność WCAG

## Problemy:

- niewystarczający kontrast tekstu,
- jasny tekst na jasnych tłach,
- zbyt mała typografia,
- słaba obsługa urządzeń mobilnych.

---

## Wymagania:

Strona musi spełniać:

WCAG 2.1 poziom AA.

---

# 5. Plan implementacji

---

# FAZA 1 — Budowa Design System

## Zadanie dla AI Designer / CSS Agent

Przygotować spójny system wizualny.

---

# System kolorów

## Primary

Kolor dominujący:
#0F172A


lub


#1E3A8A


Zastosowanie:

- nagłówki,
- sekcje premium,
- nawigacja,
- elementy brandingowe.

---

## Secondary

Kolor interaktywny:


#2563EB


Zastosowanie:

- linki,
- aktywne elementy,
- hover,
- oznaczenia.

---

## Accent CTA

Kolor akcji:


#D97706


Używać wyłącznie dla:

- Rekrutacja,
- Aplikuj,
- Najważniejsze przyciski.

---

## Neutral

Baza:


#FFFFFF
#F8FAFC
#334155
#E2E8F0


---

# Refaktoryzacja kart kierunków

## Obecny model:

Kolorowe pełne tło kafelka.

---

## Nowy model:

Karta:

| Ikona branży Tag |
| |
| Nazwa zawodu |
| Krótki opis |
| |
| Sprawdź szczegóły → |

---

Wymagania:

- białe tło,
- subtelna ramka,
- delikatny cień,
- zaokrąglenia,
- kolor tylko jako akcent.

---

# FAZA 2 — Hero oraz szybki dostęp

## Zadanie dla Frontend Agent

Przebudować górną część strony.

---

# Utility Bar

Dodać stały pasek szybkiego dostępu.

Elementy:


E-Dziennik
Plan Lekcji
Zastępstwa
Dzwonki


oraz:


Kontrast
Powiększenie tekstu
Deklaracja dostępności
BIP


---

# Sekcja Hero

Wymagania:

- duże zdjęcie szkoły,
- ciemna nakładka:


rgba(0,0,0,0.65)


- jasny nagłówek,
- mocne CTA.

---

## Przyciski:

### Primary CTA


Odkryj kierunki


### Secondary CTA


Rekrutacja 2026/2027


---

# FAZA 3 — Oferta edukacyjna

## Zadanie dla Component Agent

Przebudować sekcję kierunków.

---

# System filtrowania

Dostępne zakładki:


Wszystkie

Technikum

Szkoła Branżowa I Stopnia

Kwalifikacyjne Kursy


---

## Stan aktywny

Aktywna zakładka musi posiadać:

- pełne wypełnienie kolorem Primary,
- kontrastowy tekst,
- wyraźne wskazanie wyboru.

---

# FAZA 4 — Nowy układ strony

Zastosować układ storytellingowy.

---

# Sekcja 1

## Hero

Elementy:

- zdjęcie,
- hasło szkoły,
- CTA,
- szybki dostęp.

---

# Sekcja 2

## Najważniejsze atuty szkoły

Forma:

Pasek statystyk.

Przykłady:

- zdawalność egzaminów,
- nowoczesne pracownie,
- współpraca z firmami,
- praktyki zagraniczne.

---

# Sekcja 3

## Oferta edukacyjna

Interaktywna siatka zawodów.

---

# Sekcja 4

## Partnerzy szkoły

Zmiana:

Z:

- wielu małych kafelków.

Na:

- ciemny banner,
- elegancki slider logo,
- sekcja premium.

---

# Sekcja 5

## Aktualności

Układ:


+----------------+
| |
| Główny artykuł |
| |
+----------------+

+---------+
| news 1 |
+---------+

+---------+
| news 2 |
+---------+


Układ desktop:

1 duży artykuł + 2 mniejsze.

---

# FAZA 5 — Accessibility oraz Responsive Design

## Zadanie dla QA Agent

Przeprowadzić audyt końcowy.

---

# WCAG 2.1 AA

Sprawdzić:

## Kontrast

Minimalne wartości:

Tekst standardowy:


4.5:1


Duże nagłówki:


3:1


---

## Klawiatura

Każdy element interaktywny musi posiadać:


:focus-visible


---

# Mobile UX

## Karty kierunków

Desktop:


grid


Mobile:


single column


lub:


horizontal swipe cards


---

## Pasek szybkiego dostępu

Na urządzeniach mobilnych:

zastąpić dolnym paskiem:


[E-dziennik]
[Plan]
[Zastępstwa]


---

# 6. Priorytety wdrożenia

| Priorytet | Obszar | Zadanie | Efekt |
|---|---|---|---|
| CRITICAL | Design System | Usunięcie kolorowych kafelków | Redukcja chaosu wizualnego |
| HIGH | UX Navigation | Pasek E-dziennik / Plan lekcji | Szybszy dostęp użytkowników |
| HIGH | Accessibility | WCAG 2.1 AA | Dostępność i zgodność prawna |
| HIGH | Hero | Nowe CTA i komunikacja | Lepsza konwersja kandydatów |
| MEDIUM | Layout | Sekcje storytellingowe | Nowoczesny wygląd |
| MEDIUM | Aktualności | Układ 1+2 | Lepsza prezentacja treści |

---

# 7. Kryteria zakończenia projektu

Projekt można uznać za zakończony, gdy:

- strona posiada spójny Design System,
- usunięto nadmiar kolorów,
- najważniejsze funkcje są dostępne w maksymalnie 1 kliknięciu,
- oferta edukacyjna jest łatwa do filtrowania,
- strona działa poprawnie na mobile,
- spełnia wymagania WCAG 2.1 AA,
- użytkownik natychmiast rozumie:
  - czym jest szkoła,
  - jakie oferuje kierunki,
  - dlaczego warto ją wybrać,
  - gdzie znaleźć najważniejsze usługi.