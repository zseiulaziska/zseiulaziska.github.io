# 16 — `<meta name="color-scheme">` w `BaseHead.astro` (zakres skorygowany)

Status: open
Type: task
Priority: P3 (dark mode / FOUC)
Blocked by: —
Źródło: raport §3.4 — **uwaga: zakres poprawiony po weryfikacji**

## Problem (zweryfikowane — korekta raportu)

Raport twierdzi, że brakuje zarówno metatagu, jak i deklaracji CSS `color-scheme`.
To nieścisłość:

| Lokalizacja | Stan |
|---|---|
| `src/styles/global.css:494` | `html { color-scheme: light; ... }` ✅ |
| `src/styles/global.css:515-517` | `html.dark { color-scheme: dark; }` ✅ |
| `src/styles/global.css:519-521` | `html.high-contrast { color-scheme: dark; }` ✅ |
| `src/components/BaseHead.astro` | **brak** `<meta name="color-scheme" ...>` ❌ |
| `src/layouts/Layout.astro:26-27` | `<meta name="theme-color">` dla light/dark ✅ |

Brak metatagu oznacza, że przed załadowaniem CSS przeglądarka rysuje natywne
paski przewijania, pola formularzy i tło okna wg własnego domyślnego motywu —
widoczny biały rozbłysk przy systemowym ciemnym motywie.

**Nie** dodawać `color-scheme: light dark` do `:root` z raportu — projekt explicit
steruje motywem klasą `.dark` z `localStorage` (`Layout.astro:35-82`).
Wartość `light dark` oddałaby decyzję systemowi i zduplikowała logikę.

## Zakres

Dodać w `BaseHead.astro` obok `<meta name="viewport">` (linia 24):

```html
<meta name="color-scheme" content="light dark" />
```

Treść `light dark` w metatagu jest poprawna: informuje przeglądarkę, że strona
obsługuje oba motywy; konkretny wybór i tak wynika z CSS (`html`/`html.dark`).

## Kryteria akceptacji

- [ ] Metatag obecny w `<head>` każdej strony (sprawdzić w buildzie:
      `grep -c 'name="color-scheme"' dist/.../index.html` > 0).
- [ ] Przy systemowym ciemnym motywie i pustym `localStorage` nie ma białego
      rozbłysku paska przewijania / pól `input[type="search"]`.
- [ ] Ręczne przełączenie motywu (UtilityBar) nadal działa i zmienia natywne
      kontrolki zgodnie z klasą `html.dark`.
- [ ] Nie dodano duplikujących reguł `color-scheme` w CSS.
- [ ] `npm run check`, `npm run build` przechodzą.

## Comments