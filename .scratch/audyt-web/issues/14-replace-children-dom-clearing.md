# 14 — `replaceChildren()` zamiast `innerHTML = ''` (MegaNav + legacy `elo`)

Status: open
Type: task
Priority: P3 (modern web guidance: `js/replace-children-innerhtml`)
Blocked by: —
Źródło: raport §3.2, `spec.md` §4.2, §4.3

## Problem (zweryfikowane)

Czyszczenie list przez wywołanie parsera HTML, mimo że wystarczy usunięcie dzieci:

| Plik | Linia | Kod |
|---|---|---|
| `src/components/MegaNav.astro` | 447 | `listbox.innerHTML = '';` |
| `public/elo/index.html` | 432 | `document.getElementById('a...').innerHTML = ''` |
| `public/elo/index.html` | 443 | `dayTabs.innerHTML = '';` |

W `MegaNav.astro:467,496` są też przypisania `listbox.innerHTML = ...` — **te zostawić**:
generują rzeczywisty markup (i są objęte ticketem 04). Ticket dotyczy tylko
**pustych** przypisań.

## Zakres

1. `MegaNav.astro:447` → `listbox.replaceChildren();`
2. `public/elo/index.html:432,443` → `.replaceChildren();`
   (jeśli podprojekt `elo` jest zamrożony — patrz pytanie w `map.md` — rozważyć
   pominięcie i odnotowanie decyzji).
3. Opcjonalnie, w ramach tego samego wzorca: w `MegaNav.astro:467` rozważyć
   `listbox.replaceChildren(...parsedNodes)` zamiast `innerHTML = string`
   — ale to dużo większa zmiana i wchodzi w zakres ticketu 04. Nie łączyć bez
   uzgodnienia.

## Kryteria akceptacji

- [ ] Brak `innerHTML = ''` (i `innerHTML=""`) w `src/` i `public/`.
- [ ] Wyszukiwarka: wpisanie 1 znaku, wymazanie, ponowne wpisanie czyści i wypełnia
      listę poprawnie; nie ma duplikatów wyników.
- [ ] `public/elo/index.html`: zmiana dnia/turnusu czyści listę godzin bez błędów
      w konsoli.
- [ ] `npm run check`, `npm test`, `npm run build` przechodzą.

## Powiązane

Ticket 04 dotyka tego samego bloku w `MegaNav.astro` — koordynować PR-y.

## Comments