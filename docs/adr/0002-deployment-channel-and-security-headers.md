# Kanał wdrożenia produkcyjnego i parytet nagłówków bezpieczeństwa

## Status

Accepted — 2026-11-23

## Kontekst

Repo ma dwa kanały wdrożenia: GitHub Pages (`.github/workflows/deploy.yml`, `withastro/action` + `deploy-pages`) oraz Cloudflare Workers/Assets (`wrangler.jsonc`, `npm run deploy`). `public/_headers` jest honorowane przez Cloudflare dla statycznych assetów, ale ignorowane przez GitHub Pages i nie dotyczy odpowiedzi generowanych przez Worker (SSR, np. Keystatic admin).

Ticket 01 wdrożył nagłówki w trybie `Content-Security-Policy-Report-Only`. Ticket 02 wymagał decyzji, który kanał jest produkcyjny i jak zapewnić parytet nagłówków.

## Decyzja

- **Kanał produkcyjny `zseiulaziska.pl`: Cloudflare.** Zmiany są commitowane do GitHuba; Cloudflare buduje i hostuje stronę na Cloudflare Workers/Assets.
- **GitHub Pages to mirror/preview.** Workflow GH Pages pozostaje, ale nie gwarantuje parytetu nagłówków bezpieczeństwa. Nie dodajemy fallbacku `<meta http-equiv="Content-Security-Policy">` (nie pokrywa `frame-ancestors`, HSTS, X-Frame-Options itp.) ani zewnętrznych Transform Rules jako wymagania repo.
- **CSP egzekwowana na kanale Cloudflare.** Po weryfikacji konsoli przeglądarki na liście podstron z ticketu 01 przełączamy `Content-Security-Policy-Report-Only` na `Content-Security-Policy` w `public/_headers`.
- **HSTS bez `preload`.** Pozostaje `Strict-Transport-Security: max-age=31536000; includeSubDomains`. Dodanie `preload` jest odłożone do osobnej, świadomej decyzji po audycie subdomen (preload jest praktycznie nieodwracalny).
- **`/_astro/*` Cache-Control.** Reguła immutable jest wstrzykiwana przez `@astrojs/cloudflare` podczas buildu; nie duplikujemy jej ręcznie w `public/_headers`.

## Konsekwencje

- Nagłówki bezpieczeństwa są źródłowo zarządzane w `public/_headers` i weryfikowane testem `src/security-headers.test.ts` na wyjściu buildu.
- Weryfikacja produkcyjna nagłówków ma być wykonywana na URL-u Cloudflare (`curl -I https://zseiulaziska.pl/`), nie na URL-u GitHub Pages.
- Ewentualne przyszłe wymuszenie parytetu na GH Pages wymaga osobnej decyzji (Cloudflare Transform Rules lub zmiana architektury wdrożenia) i aktualizacji tego ADR.
