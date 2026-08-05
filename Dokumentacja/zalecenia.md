# Specyfikacja dla AI Agenta
## Refaktoryzacja strony głównej ZSEiU (Astro + Tailwind CSS)

## Cel

Przeprowadzić kompleksową modernizację strony głównej przy zachowaniu obecnej identyfikacji wizualnej, wszystkich treści oraz funkcjonalności. Celem jest uzyskanie nowoczesnego wyglądu zgodnego z trendami projektowania stron internetowych w 2026 roku, poprawienie hierarchii wizualnej oraz lepsze wykorzystanie przestrzeni na monitorach Full HD i większych.

---

# Zasady ogólne

- Nie zmieniać kolorystyki marki.
- Zachować wszystkie istniejące treści.
- Zachować obecną architekturę informacji.
- Nie usuwać żadnych sekcji.
- Skupić się na poprawie UI, UX oraz kompozycji.
- Projektować zgodnie z Mobile First.
- Wykorzystać możliwości Astro oraz Tailwind CSS.
- Stosować nowoczesne utility classes zamiast nadmiernej ilości własnego CSS.

---

# 1. Poprawa szerokości layoutu

## Problem

Większość sekcji wykorzystuje zbyt małą część ekranu na monitorach Full HD i 4K.

Efekt:

- duże puste marginesy,
- strona wygląda na węższą niż współczesne serwisy,
- niewykorzystana przestrzeń robocza.

## Zadania

- Zwiększyć szerokość głównego kontenera.
- Nie stosować jednego kontenera dla całej strony.
- Wprowadzić kilka wariantów szerokości.

Przykładowe klasy:

```
max-w-7xl
max-w-screen-2xl
max-w-[1600px]
```

Sekcje tekstowe mogą pozostać węższe.

Sekcje prezentacyjne powinny być znacznie szersze.

Dotyczy przede wszystkim:

- Dashboard
- Kierunki
- Partnerzy
- Aktualności
- CTA
- Hero

---

# 2. Zróżnicowanie rytmu strony

## Problem

Większość sekcji posiada:

- białe tło,
- podobną wysokość,
- podobną kompozycję.

Powoduje to monotonny odbiór.

## Zadania

Przeprojektować układ tak, aby kolejne sekcje posiadały różny charakter.

Przykład:

```
Hero

↓

Dashboard

↓

Sekcja jasna

↓

Sekcja szara

↓

Sekcja ciemna

↓

Sekcja pełnej szerokości

↓

Galeria

↓

Aktualności

↓

CTA
```

Naprzemiennie stosować:

- bg-white
- bg-slate-50
- bg-blue-50 (bardzo delikatnie)
- ciemny granat dla sekcji o największej wadze.

---

# 3. Większe wykorzystanie fotografii

## Problem

Na stronie dominuje duża liczba kart.

Brakuje dużych elementów wizualnych.

## Zadania

Dodać sekcje wykorzystujące fotografie pełnej szerokości.

Przykładowe miejsca:

- pracownia informatyczna,
- laboratorium energetyczne,
- logistyka,
- klasy mundurowe,
- uczniowie podczas zajęć.

Zdjęcia powinny posiadać:

- delikatny overlay,
- krótkie hasło,
- przycisk CTA.

---

# 4. Powiększenie Hero

## Problem

Hero posiada dobry projekt, lecz jest zbyt niski.

## Zadania

- zwiększyć wysokość do około 80–90% wysokości okna,
- zwiększyć ilość pustej przestrzeni,
- zwiększyć marginesy pionowe,
- powiększyć nagłówek,
- poprawić ekspozycję CTA.

Hero powinien być najbardziej dominującym elementem strony.

---

# 5. Przebudowa Dashboardu

## Problem

Kafelki statystyczne są zbyt małe.

Nie przyciągają wzroku.

## Zadania

Przeprojektować sekcję statystyk.

Każda karta powinna zawierać:

- dużą liczbę,
- opis,
- ikonę,
- animowany licznik.

Karty powinny być:

- większe,
- bardziej przestrzenne,
- lepiej widoczne.

---

# 6. Przebudowa sekcji "Dlaczego warto"

## Problem

Sekcja składa się wyłącznie z równorzędnych kart.

Brakuje hierarchii.

## Zadania

Przebudować układ.

Możliwe rozwiązania:

- jedna duża karta + pięć mniejszych,
- zdjęcie + lista zalet,
- układ asymetryczny.

Najważniejszy argument powinien być wizualnie dominujący.

---

# 7. Partnerzy

## Problem

Logotypy są zbyt małe.

Nie eksponują prestiżu współpracy.

## Zadania

- zwiększyć rozmiar logotypów,
- zwiększyć odstępy,
- poprawić prezentację,
- zastosować subtelne animacje hover,
- rozważyć automatyczny slider.

Sekcja powinna sprawiać wrażenie współpracy z dużymi przedsiębiorstwami.

---

# 8. Aktualności

## Problem

Sekcja jest poprawna, lecz bardzo klasyczna.

## Zadania

- powiększyć wyróżniony artykuł,
- zwiększyć fotografie,
- poprawić proporcje kart,
- zastosować bardziej nowoczesny grid.

---

# 9. Dodanie sekcji emocjonalnych

## Problem

Strona prezentuje informacje, ale słabo buduje emocjonalny odbiór szkoły.

## Zadania

Dodać sekcje wykorzystujące:

- duże fotografie,
- krótkie hasła,
- cytaty uczniów,
- krótkie filmy,
- CTA.

Sekcje mają budować atmosferę szkoły.

---

# 10. Zwiększenie różnorodności kompozycji

## Problem

Większość sekcji wygląda podobnie.

## Zadania

Projektować sekcje naprzemiennie:

- zdjęcie po lewej,
- zdjęcie po prawej,
- pełna szerokość,
- grid,
- masonry,
- dashboard,
- timeline,
- galeria.

Każda kolejna sekcja powinna różnić się od poprzedniej.

---

# 11. Ograniczenie liczby małych kart

## Problem

Na stronie występuje bardzo duża liczba podobnych kart.

## Zadania

Zmniejszyć ilość małych elementów.

Zastąpić część z nich:

- dużymi banerami,
- zdjęciami,
- sekcjami z ikonami,
- infografikami,
- dashboardami.

---

# 12. Lepsza hierarchia wizualna

## Problem

Wszystkie sekcje posiadają podobną wagę.

## Zadania

Wprowadzić wyraźną hierarchię.

Elementy o największym znaczeniu powinny być największe.

Kolejność ważności:

1. Hero
2. Kierunki
3. Dashboard
4. Rekrutacja
5. Partnerzy
6. Aktualności
7. Pozostałe sekcje

---

# 13. Większe odstępy pionowe

## Zadania

Zwiększyć spacing pomiędzy sekcjami.

Stosować:

```
py-24
py-28
py-32
```

Zamiast:

```
py-12
py-16
```

Strona ma sprawiać wrażenie przestronnej.

---

# 14. Typografia

## Zadania

Zwiększyć czytelność poprzez:

- większe nagłówki,
- większą interlinię,
- większy kontrast,
- krótszą długość akapitów.

Nagłówki sekcji powinny być bardziej wyeksponowane.

---

# 15. Animacje

Zastosować wyłącznie subtelne animacje.

Preferowane:

- fade-in,
- slide-up,
- scale,
- hover,
- animowane liczniki,
- delikatny parallax.

Unikać agresywnych efektów.

---

# 16. Wydajność

Nie pogarszać wydajności strony.

Priorytety:

- Lighthouse >95
- szybkie ładowanie
- lazy loading obrazów
- optymalizacja WebP/AVIF
- minimalizacja JavaScript

---

# 17. Zachowanie spójności

Po zakończeniu refaktoryzacji strona powinna:

- wyglądać bardziej premium,
- lepiej wykorzystywać szerokość ekranu,
- posiadać wyraźniejszą hierarchię,
- być bardziej przestronna,
- przypominać nowoczesne strony uczelni technicznych i firm technologicznych,
- zachować profesjonalny charakter odpowiedni dla szkoły średniej.

---

# Oczekiwany efekt końcowy

Projekt powinien sprawiać wrażenie nowoczesnej strony instytucji edukacyjnej klasy premium, łącząc estetykę współczesnych serwisów technologicznych z wysoką czytelnością i użytecznością. Strona ma skutecznie wspierać rekrutację, budować zaufanie rodziców oraz eksponować mocne strony szkoły poprzez odpowiednią hierarchię treści, wykorzystanie przestrzeni i atrakcyjną prezentację wizualną.