# 04 — Sanityzacja `item.excerpt` w wyszukiwarce (z zachowaniem `<mark>`)

Status: open
Type: task
Priority: P1
Blocked by: —
Źródło: raport §1.3, `spec.md` §1.3

## Problem (zweryfikowane)

`src/components/MegaNav.astro:485`:

```js
'<span class="search-result-excerpt">' + (item.excerpt || '') + '</span>'
```

To jedyne pole wstawiane do `innerHTML` (linia 467) bez sanityzacji. Pozostałe
(`item.url`, `title`, `image`, `date`, `id`) przechodzą przez `escapeHtml()`
zdefiniowane w linii **341**.

Ryzyko praktycznie niskie (dane pochodzą z własnego indeksu Pagefind), ale to jedyny
niespójny sink w komponencie i realna droga XSS, gdyby indeks kiedykolwiek objął treść
z zewnątrz (Keystatic, import CSV, treści redaktorów).

## Pułapka — nie stosować poprawki 1:1 z raportu

Raport proponuje `escapeHtml(item.excerpt || '')`. **To zepsuje funkcję.**
Pagefind zwraca `excerpt` z celowym znacznikiem `<mark>` wokół dopasowanej frazy
(`high-contrast.css:125` ma dla `mark` osobne style — podświetlenie jest przewidziane
w projekcie). Pełne escapowanie zamieni `<mark>` w widoczny tekst `&lt;mark&gt;`.

## Zakres

Wprowadzić sanityzację z allowlistą, np. funkcję `sanitizeExcerpt(value)` obok
`escapeHtml` (linia ~341):

1. Escapuj całość przez `escapeHtml`.
2. Przywróć **wyłącznie** literalne `&lt;mark&gt;` → `<mark>` i
   `&lt;/mark&gt;` → `</mark>` (bez atrybutów, bez innych tagów).
3. Użyj jej w linii 485.

Alternatywa (preferowana, jeśli pasuje do stylu komponentu): zbudować węzeł przez
`textContent` + `replaceChildren()` i wstrzyknąć `<mark>` przez `createElement`
— całkowicie bez `innerHTML` dla tej gałęzi. Uwaga: to zmienia kształt kodu wokół
linii 467-489, więc wymaga więcej uwagi na istniejące `escapeHtml` i listenery `error`
miniatur (492-494).

## Kryteria akceptacji

- [ ] Wyszukiwanie frazy nadal podświetla dopasowanie (`<mark>` w DOM, nie w tekście).
- [ ] Wstrzyknięcie testowego payloadu (np. tymczasowy `excerpt` z
      `<img src=x onerror=alert(1)>` oraz `<mark onclick=...>`) nie wykonuje kodu
      i nie tworzy elementów/atrybutów innych niż `mark`.
- [ ] Wyniki: miniatury, data, tytuł, link, obsługa klawiatury
      (ArrowUp/Down/Home/End/Enter/Escape) działają bez regresji.
- [ ] Test jednostkowy (vitest, `npm test`) dla funkcji sanityzującej:
      payload XSS, pusty string, `undefined`, zagnieżdżony `mark`, `mark` z atrybutem.
- [ ] `npm run check` przechodzi.

## Powiązane

Ticket 14 (`replaceChildren()`) dotyka tego samego bloku — warto robić razem lub
sekwencyjnie, żeby uniknąć konfliktu.

## Comments