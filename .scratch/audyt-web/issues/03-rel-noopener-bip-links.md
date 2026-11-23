# 03 — `rel="noopener noreferrer"` w linkach BIP (`dokumenty.astro`)

Status: open
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

- [ ] Wszystkie trzy linki mają `rel="noopener noreferrer"`.
- [ ] W całym `src/` nie ma `target="_blank"` bez `rel` zawierającego `noopener`
      (weryfikacja skryptem — patrz ticket 20).
- [ ] `npm run check` i `npm test` przechodzą.
- [ ] Kafelki nadal otwierają PDF w nowej karcie, `sr-only „(otwiera się w nowej karcie)”`
      zachowany.

## Uwagi

Tanie i bezpieczne — dobry pierwszy commit w gałęzi audytu.

## Comments