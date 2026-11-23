# 03 — `rel="noopener noreferrer"` w linkach BIP (`dokumenty.astro`)

Status: resolved
Type: task
Priority: P1
Blocked by: —
Źródło: raport §1.2, `spec.md` §1.2

## Problem (zweryfikowane)

`src/pages/dokumenty.astro`, linie **29, 37, 45** — trzy kafelki „Statuty szkół”
mają `target="_blank"` **bez** `rel`:

- 29: `https://zseiu.bip.gov.pl/fobjects/download/2364777/statut-technikum-nr-1-...`
- 37: `.../2364778/statut-bsis-pd1-3-...`
- 45: `.../2364779/statut-lod-...`

To jedyne trzy wystąpienia w projekcie. Pozostałe linki zewnętrzne (Footer, MegaNav,
kontakt, kalendarz, erasmus-*, praktyki-zawodowe, Dla*Section, MobileBottomBar,
UtilityBar, `dokumenty.astro:72,77`) mają już poprawny `rel`.

Ryzyko: reverse tabnabbing (`window.opener`). Nowoczesne przeglądarki implicite stosują
`noopener` dla `target="_blank"`, ale `noreferrer` chroni dodatkowo przed wyciekiem
pełnego URL-a w `Referer` i domyka zgodność ze starszymi UA.

## Zakres

Dopisać `rel="noopener noreferrer"` do trzech `<a>` w liniach 29, 37, 45.
Nie zmieniać klas ani struktury — kafelki mają `group`/`hover:` i działają poprawnie.

## Kryteria akceptacji

- [x] Wszystkie trzy linki mają `rel="noopener noreferrer"`.
- [x] W całym `src/` nie ma `target="_blank"` bez `rel` zawierającego `noopener`
      (weryfikacja skryptem — patrz ticket 20).
- [x] `npm run check` i `npm test` przechodzą.
- [x] Kafelki nadal otwierają PDF w nowej karcie, `sr-only „(otwiera się w nowej karcie)”`
      zachowany.

## Uwagi

Tanie i bezpieczne — dobry pierwszy commit w gałęzi audytu.

## Comments
## Answer

Dodano el="noopener noreferrer" do trzech linków BIP w src/pages/dokumenty.astro (linie 29, 37, 45). Zweryfikowano skryptem, że w całym src/ nie ma 	arget="_blank" bez 
oopener w tym samym lub kolejnych 2 wierszach atrybutu. 
pm run check: 24 błędy pre-existing (bez nowych). 
pm test: 13/13 passed. Struktura kafelków i sr-only bez zmian.
