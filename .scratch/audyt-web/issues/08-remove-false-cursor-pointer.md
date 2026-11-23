# 08 — Usunięcie fałszywego `cursor-pointer` ze statycznych kafelków

Status: open
Type: task
Priority: P2 (affordancja / WCAG 1.3.1, 3.2.4)
Blocked by: —
Źródło: raport „wartość dodana” (cursor-pointer), rozszerzone przy weryfikacji

## Problem (zweryfikowane)

`cursor:pointer` na nieklikalnych `<div>` sugeruje interakcję, której nie ma.
Potwierdzone lokalizacje:

| Plik | Linie | Element |
|---|---|---|
| `src/pages/index.astro` | 67, 79, 91 | kafelki profilu mundurowego (`<div class="reveal ... cursor-pointer">`) |
| `src/pages/historia.astro` | 267, 271, 275, 279, 283, 287, 291, 295, 299 | 9 kafelków dyrektorów szkoły |
| `src/components/TimelineEvent.astro` | 61 | karta wydarzenia na timeline (powiązane z ticketem 09) |

**Nie ruszać** `cursor-pointer` tam, gdzie jest poprawny — na `<a>`, `<button>`,
`<summary>` i elementach z handlerem: `Hero.astro:32,33`, `index.astro:111,145,146`,
`Footer.astro:237`, `PhotoBannerSection.astro:42`, `PilnyKomunikat.astro:99`,
`pracownicy-mlodociani.astro:168,180,192,204` (`<summary>`),
`global.css:164,261,592` (`<summary>`/przyciski).

## Zakres

1. Usunąć klasę `cursor-pointer` z wymienionych statycznych `<div>`.
2. Rozważyć (decyzja projektowa, zanotować w `## Comments`): usunąć też
   `hover:shadow-*` / `hover:border-*` z tych kafelków. Sam hover-shadow bez kursora
   wciąż sugeruje interakcję; ale subtelny hover bywa świadomą dekoracją.
   Minimalny zakres ticketu = sam `cursor-pointer`.
3. Sprawdzić, czy któryś z tych kafelków **miał** być klikalny (np. karta dyrektora
   z linkiem do biografii). Jeśli tak — to nie usuwać kursora, a dodać realny link
   i wynieść do osobnego ticketu.

## Kryteria akceptacji

- [ ] Wskazane `<div>` nie mają `cursor-pointer`; kursor nad nimi to domyślny.
- [ ] Wszystkie interaktywne elementy z listy „nie ruszać” zachowują `cursor-pointer`.
- [ ] Bez zmian wizualnych innych niż kursor (i ewentualnie hover, jeśli zdecydowano).
- [ ] `npm run check`, `npm run build` przechodzą.

## Powiązane

Ticket 09 usuwa `tabindex="0"` z tej samej karty `TimelineEvent.astro` — wygodnie
zrobić oba w jednym PR.

## Comments