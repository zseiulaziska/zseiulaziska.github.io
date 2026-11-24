# ZSEiU — strona szkoły

Strona internetowa Zespołu Szkół Energetycznych i Usługowych w Łaziskach Górnych: https://www.zseiulaziska.pl/

## Stack

Astro 7, Tailwind CSS 4, Keystatic (CMS), Pagefind (wyszukiwanie), React (wybrane wyspy), Vitest (testy), Cloudflare (hosting). Wymagany Node >= 22.12.0.

## Komendy

| Komenda            | Opis                                          |
| ------------------ | --------------------------------------------- |
| `npm run dev`      | lokalny serwer deweloperski                   |
| `npm run check`    | sprawdzenie typów Astro                       |
| `npm test`         | testy Vitest                                  |
| `npm run build`    | build strony + postbuild                       |
| `npm run preview`  | build i podgląd przez `wrangler dev`           |
| `npm run deploy`   | build i wdrożenie na Cloudflare                |

Serwer dev w pracy agentów uruchamiamy w tle: `astro dev --background` (obsługa: `astro dev stop`, `astro dev status`, `astro dev logs`).

## Gdzie jest co

- `src/pages/` — strony, `src/content/` — kolekcje treści, `src/data/` — dane JSON.
- `src/routes.ts` — Katalog Tras (adresy, nazwy, aliasy, breadcrumbs).
- `docs/reference/szkola-fakty.md` — fakty o szkole (nazwy, daty, kontakt).
- `docs/adr/` — decyzje architektoniczne, `docs/agents/` — konfiguracja agentów, `.scratch/` — lokalny issue tracker.
- Zasady pracy w repo: `AGENTS.md`.

## Publikacja i dostępność

Commity na GitHub → Cloudflare buduje i hostuje stronę; GitHub Pages działa jako mirror/preview (szczegóły: `docs/adr/0002-deployment-channel-and-security-headers.md`). Interfejs spełnia WCAG 2.2 AA; deklaracja dostępności znajduje się pod `/dostepnosc`.
