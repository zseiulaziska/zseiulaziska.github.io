# 02 — Egzekwowanie CSP i parytet nagłówków na GitHub Pages

Status: open
Type: task
Priority: P1
Blocked by: 01
Źródło: raport §1.1 (rozszerzenie — luka wykryta przy weryfikacji)

## Problem

Raport zakłada, że `public/_headers` załatwia sprawę. Nie załatwia, bo projekt ma
**dwa kanały wdrożenia**:

1. `npm run deploy` → `wrangler deploy` (Workers + static assets, `wrangler.jsonc`).
2. `.github/workflows/deploy.yml` → `withastro/action@v6` + `actions/deploy-pages@v5`
   (**GitHub Pages**, build z `GITHUB_ACTIONS` → `staticBuild`, bez adaptera).

Ograniczenia potwierdzone w dokumentacji Cloudflare (Workers → Static assets → Headers):

- `_headers` **nie stosuje się** do odpowiedzi generowanych przez kod Workera
  (SSR / `assets.run_worker_first`). Dotyczy to tras admina Keystatic.
- GitHub Pages **ignoruje** `_headers` całkowicie — nie ma mechanizmu nagłówków
  użytkownika. Na tym kanale nagłówki z ticketu 01 nie istnieją.

## Zakres

1. Zebrać naruszenia z ticketu 01, poprawić dyrektywy, zamienić
   `Content-Security-Policy-Report-Only` na `Content-Security-Policy`.
2. Ustalić i udokumentować, który kanał jest produkcyjny dla `zseiulaziska.pl`
   (pytanie otwarte w `map.md`).
3. Zapewnić nagłówki na kanale GitHub Pages — wybrać i wdrożyć jedną opcję:
   - **Cloudflare Response Header Modification / Transform Rules** przed GH Pages
     (zalecane, jeśli domena i tak jest na Cloudflare — zero kodu);
   - albo `<meta http-equiv="Content-Security-Policy">` w `BaseHead.astro` jako fallback
     (uwaga: meta nie obsługuje `frame-ancestors`, `report-uri` ani HSTS — to degradacja,
     nie równoważnik);
   - albo świadoma decyzja: GH Pages to tylko mirror/preview i nie wymaga nagłówków
     (wtedy odnotować w ADR).
4. Zdecydować o `preload` w HSTS (świadomie, z listą subdomen) — dopisać albo uzasadnić
   brak.
5. Rozważyć `Cache-Control: public, max-age=31536000, immutable` dla `/_astro/*`
   (assety z hashem) — osobna reguła w `_headers`, po głównej regule `/*`.

## Kryteria akceptacji

- [ ] CSP w trybie wymuszającym, zero naruszeń na liście podstron z ticketu 01.
- [ ] Zweryfikowane `curl -I` na **produkcyjnym** URL-u: wszystkie nagłówki obecne.
- [ ] Jeśli wybrano reguły Cloudflare — konfiguracja opisana w `docs/` (nazwa reguły,
      kolejność, wyrażenie dopasowania), bo nie ma jej w repo.
- [ ] Decyzja o `preload` i o roli GH Pages zapisana w `map.md` / ADR
      (`docs/adr/`, kolejny numer po `0001-route-catalog.md`).
- [ ] `npm run build` + `npm test` przechodzą.

## Ryzyka

CSP w trybie wymuszającym potrafi cicho zabić: wyszukiwarkę Pagefind (dynamiczny import),
lazy-load miniatur w wynikach, iframe mapy, embed planu lekcji, panel Keystatic.
Testować każdy z tych przepływów, nie tylko ładowanie stron.

## Comments

**2026-11-23 — ustalenia z wdrożenia ticketu 01.**

- Punkt 5 zakresu (Cache-Control dla `/_astro/*`) jest już zrealizowany przez
  adapter: `npm run build` loguje `Injected immutable Cache-Control for /_astro/*
  into _headers`, a reguła pojawia się w `dist/client/_headers`. Nie dodawać
  duplikatu — skutkowałby złączeniem dwóch wartości `Cache-Control` przecinkiem.
- `dist/server/wrangler.json` (generowany przez adapter) ma `assets.directory:
  "../client"`, więc `_headers` z `dist/client` jest tym, co Cloudflare faktycznie
  czyta. Główny `wrangler.jsonc` z `assets.directory: "./dist"` jest w tym miejscu
  nieaktualny — do wyjaśnienia przy wyborze kanału wdrożenia.
- pierwszym krokiem ticketa 02 jest **przegląd konsoli w przeglądarce** na liście
  podstron z ticketu 01 (w tym Pagefind i przełączniki motywu/kontrastu) — w tickecie
  01 wykonano tylko statyczny skan zasobów.
- **2026-11-23, decyzja użytkownika:** pozostawiamy Report-Only bez `report-uri`/`report-to`.
  Chrome pokazuje ostrzeżenie, że polityka nic nie zgłasza. Przy przejściu na
  `Content-Security-Policy` ostrzeżenie zniknie (polityka zacznie blokować). Jeśli
  zależy nam na raportach przed egzekwowaniem, trzeba osobno dodać endpoint
  (`report-uri /csp-report` + `Reporting-Endpoints`/`report-to`, SSR route w
  `src/pages/api/`, logi w Cloudflare Observability) — nie jest to część ticketu 01.
