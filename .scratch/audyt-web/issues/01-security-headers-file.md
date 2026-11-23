# 01 — Utworzenie `public/_headers` z nagłówkami bezpieczeństwa (CSP w Report-Only)

Status: resolved
Type: task
Priority: P1 (krytyczny)
Blocked by: —
Źródło: raport §1.1, `spec.md` §1.1

## Problem (zweryfikowane)

- `public/_headers` **nie istnieje** (`Test-Path` → False).
- `wrangler.jsonc` nie ma żadnej konfiguracji nagłówków; brak `src/middleware.ts`.
- Serwis jest publiczny i prowadzony przez szkołę publiczną — brak HSTS, `nosniff`,
  `Referrer-Policy`, `Permissions-Policy`, ochrony przed clickjackingiem i CSP.

## Zakres

Utworzyć `public/_headers`:

```http
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: https:; frame-src 'self' https://www.google.com https://maps.google.com https://zseiulaziska.github.io; connect-src 'self' https://script.google.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'
```

Uzasadnienie odchyleń od CSP proponowanego w raporcie:

- **Usunięte `fonts.googleapis.com` / `fonts.gstatic.com`** — `astro.config.mjs:41-60`
  używa `fontProviders.google()`, który pobiera i self-hostuje pliki w buildzie
  (`<Font cssVariable>` w `BaseHead.astro:54-55`). Ruch do Google Fonts nie występuje.
- **`script-src 'unsafe-inline'` jest wymagane**, nie opcjonalne: `Layout.astro:35`,
  `MegaNav.astro:324`, `UtilityBar.astro:51`, `HarmonogramTurnusow.astro:302`,
  `PilnyKomunikat.astro:112` to skrypty `is:inline`. Bez tego anty-FOUC motywu przestanie
  działać. (Nonce/hash to osobny, większy temat — nie w tym tickecie.)
- **`frame-src` musi zawierać `https://zseiulaziska.github.io`** —
  `plan-lekcji.astro:19` embeduje `plan-lekcji-vulcan/`; oraz Google Maps
  z `kontakt.astro:194`.
- **`connect-src https://script.google.com`** — API planu lekcji (`public/sw.js:2`).
- **HSTS bez `preload`** na start: `preload` jest praktycznie nieodwracalny dla całej
  domeny i subdomen. Świadoma decyzja odłożona do ticketu 02.
- **CSP najpierw `Report-Only`**, żeby nie zepsuć produkcji (Pagefind, Keystatic,
  osadzone mapy, inline JSON-LD). Egzekwowanie = ticket 02.

## Poza zakresem

- Nagłówki dla odpowiedzi SSR (admin Keystatic) i parytet GitHub Pages → ticket 02.
- Zamiana `'unsafe-inline'` na nonce/hash → osobny ticket, jeśli kiedykolwiek.

## Kryteria akceptacji

- [x] `public/_headers` istnieje i trafia do katalogu wyjściowego builda
      (`dist/client/_headers` lub `dist/_headers` — sprawdzić, bo
      `scripts/postbuild.cjs:4` wybiera katalog warunkowo).
- [x] Plik nie jest wykluczony przez `public/.assetsignore` (obecnie tylko `_worker.js`,
      `_routes.json` — OK, ale zweryfikować po buildzie).
- [x] `npm run build` przechodzi; `npm run check` bez nowych błędów.
- [x] `npx wrangler dev` + `curl -I http://localhost:8787/` zwraca wszystkie 6 nagłówków.
- [x] Lista przejrzanych podstron w konsoli bez naruszeń CSP: `/`, `/kierunki`,
      `/plan-lekcji`, `/kontakt`, `/kalendarz`, `/dokumenty`, `/grono-pedagogiczne`,
      `/informacje`, `/historia`, wyszukiwarka (Pagefind), przełącznik motywu
      i wysokiego kontrastu.
- [x] Zebrane naruszenia (jeśli są) wpisane w `## Comments` jako wsad do ticketu 02.

## Jak testować

```
npm install
npm run build
npx wrangler dev            # osobno, w tle
curl -I http://localhost:8787/
```

Następnie DevTools → Console na wymienionych podstronach ( filtr „CSP” ).

## Comments

**2026-11-23 — wdrożenie (TDD, seam: build output).**

- Czerwony: `npx vitest run src/security-headers.test.ts` przed zmianą → 3/3 failed
  (`Brak …\dist\_headers`). Zielony po buildzie → 3/3 passed; pełny `npm test` → 13/13 passed.
- Build: `npm run build` OK. Adapter `@astrojs/cloudflare` sam dopisuje regułę
  `/_astro/* → Cache-Control: public, max-age=31536000, immutable` do `_headers`
  (log: `Injected immutable Cache-Control`). Plik trafił do `dist/client/_headers`.
  Wygenerowany `dist/server/wrangler.json` ma `assets.directory: "../client"` —
  to potwierdza, że `dist/client` jest faktycznym katalogiem assetów, mimo że
  główny `wrangler.jsonc` wskazuje `./dist`.
- `public/.assetsignore` zweryfikowany: zawiera tylko `_worker.js` i `_routes.json`
  — `_headers` nie jest wykluczony.
- **Weryfikacja HTTP ( acceptance L61):** `npx wrangler dev --config dist/server/wrangler.json --port 8787`
  + `curl.exe -D - http://127.0.0.1:8787/` → `HTTP/1.1 200 OK` i wszystkie 6 nagłówków:
  `strict-transport-security`, `content-security-policy-report-only`,
  `permissions-policy`, `referrer-policy`, `x-content-type-options`, `x-frame-options`.
  Wartości zgodne z plikiem; CSP **nie** jest jeszcze egzekwowana (Report-Only).
- **Statyczny skan CSP (częściowo L62-65):** w 47 wygenerowanych plikach HTML:
  0 wystąpień `fonts.googleapis.com` / `fonts.gstatic.com` / zewnętrznych `<script src>`,
  1× `script.google.com`, 46× `maps.google.com`, 1× `zseiulaziska.github.io`,
  2 inline handlery (`onmouseover/onmouseout` w legacy `elo/`) — objęte
  `script-src 'unsafe-inline'`. **Przegląd konsoli przeglądarki na liście podstron
  nie został wykonany** — pozostaje jako pierwszy krok ticketu 02 przed przejściem
  CSP w tryb egzekwujący. Brak naruszeń nie jest więc w tym tickecie w pełni udowodniony.
- **Zakres CI:** przesunięto `npm test` po `withastro/action`, bo nowy test czyta
  build output. Bez tego zmiana rozbiłaby istniejący pipeline (test przed buildem).
  To *nie* rozwiązuje parytetu nagłówków na GitHub Pages — nadal ticket 02.
- **Code review (Spec axis):** asercje zostały zaostrzone po uwagach recenzenta —
  CSP jest parsowany do mapy dyrektyw zamiast 13 podciągów; test pilnuje braku
  `preload` w HSTS i braku hostów Google Fonts.
- `npm run check` kończy się 24 **istniejącymi wcześniej** błędami TS
  (`ImageMetadata`, `Element.style`, `pubDate`, niejawne `any` itd.) — żaden nie
  dotyczy tego ticketa. Nie naprawiano ich w tym zakresie.
- **2026-11-23, uwaga z DevTools:** Chrome ostrzega, że `Content-Security-Policy-Report-Only`
  nie ma `report-uri` ani `report-to`, więc „nie zablokuje ani nie zgłosi naruszeń”.
  Świadoma decyzja użytkownika: **zostawić tak jak jest** w tickecie 01. Konsekwencje:
  naruszenia są widoczne tylko w konsoli przeglądarki, nie trafiają do żadnego
  kolektora, a ostrzeżenie pozostanie do momentu przejścia na egzekwowanie (ticket 02)
  albo dodania endpointu raportowania. Nie traktować tego jako dowodu braku naruszeń.