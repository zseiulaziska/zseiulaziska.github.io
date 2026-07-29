# Plan modernizacji UI/UX — ZSEiU Łaziska Górne

Na podstawie: `Dokumentacja/modernizacja.md`

---

## Faza 1 — Design System (global.css + komponenty bazowe)

| # | Zadanie | Pliki | Szczegóły |
|---|---------|-------|-----------|
| 1.1 | Dostosowanie palety kolorów w `@theme` | `src/styles/global.css` | Primary → #0F172A / #1E3A8A, Secondary → #2563EB, Accent CTA → #D97706. Zachować istniejącą skalę `navy-*` jako uzupełnienie |
| 1.2 | Refaktoryzacja `SchoolFields.astro` | `SchoolFields.astro`, `school-groups.json` | Usunięcie kolorowych gradientów w nagłówkach grup. Karty kierunków: białe tło, subtelna ramka, delikatny cień, zaokrąglenia, kolor tylko jako akcent |
| 1.3 | Dodanie utility klasy `.focus-visible` i WCAG | `global.css` | Wzmocnienie `:focus-visible` dla wszystkich elementów interaktywnych |

## Faza 2 — Hero i Utility Bar

| # | Zadanie | Pliki | Szczegóły |
|---|---------|-------|-----------|
| 2.1 | Dodanie stałego paska szybkiego dostępu (desktop + mobile) | `Layout.astro` lub nowy `UtilityBar.astro` | Elementy: E-Dziennik, Plan Lekcji, Zastępstwa, Dzwonki, BIP, Deklaracja dostępności, Kontrast, Powiększenie tekstu |
| 2.2 | Dostosowanie Hero | `Hero.astro` | Poprawa nakładki na `rgba(0,0,0,0.65)`, dostosowanie CTA: "Odkryj kierunki" + "Rekrutacja 2026/2027" |
| 2.3 | Mobile bottom bar | `index.astro` | Zamiana obecnego mobile quick-links na dolny pasek: [E-dziennik] [Plan] [Zastępstwa] |

## Faza 3 — Oferta edukacyjna

| # | Zadanie | Pliki | Szczegóły |
|---|---------|-------|-----------|
| 3.1 | Dodanie systemu filtrowania kierunków | `SchoolFields.astro` | Zakładki: Wszystkie, Technikum, Szkoła Branżowa I Stopnia, Kwalifikacyjne Kursy. Active: pełne wypełnienie Primary + kontrastowy tekst |
| 3.2 | Dostosowanie siatki kierunków do nowego modelu karty | `SchoolFields.astro` | Układ: Ikona branży + Tag \| Nazwa zawodu \| Krótki opis \| "Sprawdź szczegóły →" |
| 3.3 | Dodanie zdjęć kierunków | `SchoolFields.astro`, nowe assety | Zdjęcia dla każdego kierunku (np. Technik informatyk, logistyk, elektryk, energetyk) — wyświetlane w karcie lub na stronie szczegółów |

## Faza 4 — Nowy układ strony (storytelling)

| # | Zadanie | Pliki | Szczegóły |
|---|---------|-------|-----------|
| 4.1 | Restrukturyzacja `index.astro` | `index.astro` | Nowa kolejność sekcji: (1) Hero → (2) Statystyki → (3) Oferta edukacyjna → (4) Partnerzy → (5) Aktualności |
| 4.2 | Wydzielenie statystyk do osobnej sekcji | Nowy `StatsBar.astro` lub rozbudowa `SuccessSection` | Pasek: zdawalność, pracownie, partnerzy, praktyki |
| 4.3 | Przebudowa `PartnersSection` | `PartnersSection.astro` | Ciemny banner zamiast jasnej siatki. Slider logo partnerów |
| 4.4 | Zmiana układu `NewsSection` | `NewsSection.astro` | Układ "1+2": 1 duży artykuł + 2 mniejsze na desktopie |

## Faza 5 — Accessibility i Responsive

| # | Zadanie | Pliki | Szczegóły |
|---|---------|-------|-----------|
| 5.1 | Audyt kontrastu WCAG 2.1 AA | Wszystkie | Minimalne wartości: text 4.5:1, nagłówki 3:1 |
| 5.2 | Obsługa klawiatury | Wszystkie | `:focus-visible` na każdym elemencie interaktywnym |
| 5.3 | Mobile: karty kierunków | `SchoolFields.astro` | Single column na mobile (lub horizontal swipe) |
| 5.4 | Mobile: pasek szybkiego dostępu | `index.astro` / `UtilityBar.astro` | Dolny fixed bar z kluczowymi linkami |

## Priorytety

| Priorytet | Obszar | Efekt |
|-----------|--------|-------|
| CRITICAL | Design System — usunięcie kolorowych kafelków | Redukcja chaosu wizualnego |
| HIGH | UX Navigation — pasek E-dziennik / Plan lekcji | Szybszy dostęp użytkowników |
| HIGH | Accessibility — WCAG 2.1 AA | Dostępność i zgodność prawna |
| HIGH | Hero — nowe CTA i komunikacja | Lepsza konwersja kandydatów |
| MEDIUM | Layout — sekcje storytellingowe | Nowoczesny wygląd |
| MEDIUM | Aktualności — układ 1+2 | Lepsza prezentacja treści |

## Kryteria zakończenia

- Strona posiada spójny Design System
- Usunięto nadmiar kolorów
- Najważniejsze funkcje dostępne w max 1 kliknięciu
- Oferta edukacyjna łatwa do filtrowania
- Strona działa poprawnie na mobile
- Spełnia WCAG 2.1 AA
- Użytkownik natychmiast rozumie: czym jest szkoła, jakie oferuje kierunki, dlaczego warto, gdzie znaleźć usługi
