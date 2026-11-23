# 09 — Usunięcie `tabindex="0"` z karty `TimelineEvent.astro`

Status: open
Type: task
Priority: P2 (WCAG 2.4.3 Focus Order)
Blocked by: —
Źródło: raport „wartość dodana” (tabindex)

## Problem (zweryfikowane)

`src/components/TimelineEvent.astro:60-69`:

```html
<div class="... cursor-pointer" tabindex="0" role="article">
  <slot />
</div>
```

Statyczna treść (wpis na osi czasu) nie ma żadnego handlera, linku ani kontrolki,
a mimo to jest w sekwencji tabulacji. Użytkownik klawiatury przechodzi przez tyle
pustych zatrzymań, ile jest wydarzeń — bez możliwości wykonania akcji. Dodatkowo
`role="article"` na elementcie bez nazwy (`aria-label`) wnosi niewiele.

## Zakres

1. Usunąć `tabindex="0"` z linii 67.
2. Zweryfikować, czy wewnątrz `<slot />` nie ma linków/ przycisków, które stracą
   dostęp — one pozostają w tab orderze niezależnie od rodzica (sprawdzić wywołania
   komponentu w `historia.astro`).
3. `role="article"` pozostawić (jest poprawny semantycznie) albo usunąć, jeśli
   nie niesie wartości — zanotować decyzję w `## Comments`. Nie zmieniać `cursor-pointer`
   w tym tickecie (→ ticket 08).

## Kryteria akceptacji

- [ ] Brak `tabindex` na tym `<div>`; `grep -n 'tabindex' src/components/TimelineEvent.astro`
      zwraca 0 wyników (lub tylko uzasadnione przypadki).
- [ ] Tabulator przechodzi bezpośrednio od poprzedniego elementu do następnego
      (bez pustych zatrzymań na kartach timeline) — test ręczny na `/historia`.
- [ ] Ewentualne linki wewnątrz wpisów nadal są osiągalne klawiaturą.
- [ ] `npm run check` przechodzi.

## Comments