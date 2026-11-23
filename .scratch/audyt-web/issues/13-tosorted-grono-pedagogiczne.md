# 13 — ES2023 `toSorted()` w `grono-pedagogiczne.astro`

Status: resolved
Type: task
Priority: P3 (modern web guidance: `js/copying-array-methods`)
Blocked by: —
Źródło: raport §3.1, `spec.md` §4.1

## Problem (zweryfikowane)

`src/pages/grono-pedagogiczne.astro:14`:

```ts
const sorted: Teacher[] = [...teachers].sort((a, b) =>
  lastName(a.name).localeCompare(lastName(b.name), "pl")
);
```

Płytka kopia + mutujący `.sort()`. `toSorted()` (Baseline 2023) wyraża intencję
niemutowania wprost i eliminuje zbędną kopię.

## Zakres

```ts
const sorted: Teacher[] = teachers.toSorted((a, b) =>
  lastName(a.name).localeCompare(lastName(b.name), "pl")
);
```

Sprawdzić `tsconfig.json` — `lib` musi zawierać `ES2023` (albo `ESNext`) i
`target`/`engines` (Node >=22.12 w `package.json`) to obsługuje. Jeśli `lib`
jest starsze — dodać `ES2023.Array` do `lib` zamiast rezygnować ze zmiany.

## Kryteria akceptacji

- [x] `[...teachers].sort(` nie występuje w pliku (i w całym `src/` — sprawdzić
      grepem; inne pliki również mogą mieć ten wzorzec).
- [x] Kolejność nauczycieli na stronie identyczna jak przed zmianą (porównać
      zrzut listy nazwisk przed/po).
- [x] `npm run check` bez błędów TS (to jest realny test wsparcia `lib`).
- [x] `npm test`, `npm run build` przechodzą.

## Comments

`[...teachers].sort(` zastąpione przez `teachers.toSorted(...)` z tym samym
comparatorem — kolejność na stronie bez zmian. Drugi wzorzec (`[...aliasy].sort()`)
znaleziony w `src/routes.test.ts` również zamieniony, żeby spełnić kryterium
„w całym `src/`”. `tsconfig.json` nietknięty — `astro check` potwierdza wsparcie
`toSorted` przez aktualny `lib`.