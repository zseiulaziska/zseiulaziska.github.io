# 19 — Porządek w `public/`: usunięcie duplikatów `sw.js` i `manifest.json`

Status: open
Type: task
Priority: P4
Blocked by: —
Źródło: raport §4.5, `spec.md` §3.3

## Problem (zweryfikowane — korekta raportu)

Raport sugeruje „przenieść `sw.js` i `manifest.json` do `public/elo/` **albo**
zaktualizować manifest, żeby reprezentował całą szkołę". Weryfikacja pokazuje,
że oba warianty są zbędne:

- `public/sw.js` i `public/elo/sw.js` — **bit-identyczne** (porównanie `Get-FileHash`).
- `public/manifest.json` i `public/elo/manifest.json` — **bit-identyczne**.
- `public/elo/index.html:667-675` rejestruje SW **relatywnie** (`./sw.js`),
  więc używa kopii z `elo/`.
- `public/elo/index.html:7` linkuje `manifest.json` relatywnie — również kopię
  z `elo/`.
- **Żadne** odwołanie do wersji z katalogu głównego nie istnieje w `src/`,
  `public/` ani `scripts/` (grep `sw.js|manifest.json|serviceWorker`).
- Obie kopie opisują **plan lekcji klas 2D–5D** (`"name": "Plan lekcji"`,
  `start_url: "."`, cache `plan-lekcji-api-v2`, URL Google Apps Script) —
  nie całą szkołę.

Katalog główny `public/` zawiera więc dwa całkowicie martwe pliki, które
w dodatku są serwowane publicznie pod `/sw.js` i `/manifest.json`
(przez przeglądarki mogą zostać zarejestrowane przez przypadek — np. przy
starej wersji strony lub z cache).

## Zakres

1. Usunąć `public/sw.js` i `public/manifest.json` (zostawić wersje
   `public/elo/` — one są używane).
2. Sprawdzić, czy usunięcie nie wpływa na PWA main site — obecnie nie ma
   manifestu dla całej szkoły. Jeśli taki PWA jest planowany, to **osobny**
   ticket z nowym, własnym manifestem (`name: ZSEiU Łaziska Górne`,
   ikony szkoły z `public/logo-szkoly-mono-light.jpg` / `favicon.svg`,
   `start_url: "/"`). Nie mieszać z legacy planem lekcji.
3. `public/elo/index.html:671` ma `unregister()` starego SW — zostawić,
   to porządek, nie błąd (`spec.md:60`).

## Kryteria akceptacji

- [ ] `public/sw.js` i `public/manifest.json` usunięte; `public/elo/` nienaruszone.
- [ ] `curl -I https://.../sw.js` → 404 po deployu (na preview: `wrangler dev`).
- [ ] `/elo/` działa: manifest się ładuje (DevTools → Application → Manifest),
      SW rejestruje się pod `/elo/sw.js`, plan pobiera dane z Google Apps Script.
- [ ] Brak błędów w konsoli przy wejściu na `/elo/`.
- [ ] `npm run build` przechodzi.

## Ryzyka

Jeśli zewnętrzne (poza repo) systemy linkują do `https://zseiulaziska.pl/manifest.json`
albo stare instalacje PWA próbują zarejestrować `/sw.js`, usunięcie zwróci 404.
Wymaga decyzji: dodać `_redirects` na `/sw.js` → `/elo/sw.js` czy zostawić 404
(404 jest bezpieczniejsze — nie zarejestruje się przypadkowo niewłaściwy SW
na głównym zakresie).

## Comments