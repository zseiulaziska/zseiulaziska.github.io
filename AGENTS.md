# ZSEiU — strona szkoły

Strona internetowa Zespołu Szkół Energetycznych i Usługowych w Łaziskach Górnych. Astro 7 + Tailwind 4 + Keystatic, wyszukiwanie Pagefind, testy Vitest, hosting na Cloudflare. Treści po polsku. Produkcja: https://www.zseiulaziska.pl/

## Start pracy

- Uruchamiaj serwer dev w tle: `astro dev --background`. Zarządzanie: `astro dev stop`, `astro dev status`, `astro dev logs`.
- Pozostałe komendy (`check`, `test`, `build`, `preview`, `deploy`) czytaj z `package.json` — nie ufaj kopiom w dokumentacji.
- Wymagany Node >= 22.12.0.

## Mapa repozytorium

- `src/pages/` — strony i trasy; `src/content/` — kolekcje (blog, `podreczniki/`, `kalendarz/`, dane `teacher/` i `field/`); `src/data/` — JSON-y.
- `src/routes.ts` — Katalog Tras: kanoniczne adresy, nazwy, breadcrumb-rodzice, ikony, aliasy.
- `src/components/`, `src/layouts/`, `src/styles/` — UI i design system.
- `keystatic.config.ts` — konfiguracja CMS; `scripts/` — postbuild, preview, walidacja danych strukturalnych.
- `.scratch/` — lokalny issue tracker (specy i tickety); `docs/` — ADR-y, konfiguracja agentów i fakty o szkole.

## Dokumentacja dla agentów

- **Słownik** — `GLOSSARY.md`. Czytaj przed nazwaniem czegokolwiek w kodzie lub tickecie i używaj terminów stamtąd (Trasa, Katalog Tras, Alias).
- **Decyzje** — `docs/adr/`. Czytaj ADR dotykające obszaru, w którym pracujesz; nie zmieniaj ich bez pytania.
- **Konfiguracja agentów** — `docs/agents/`: `issue-tracker.md` (tracker w `.scratch/`), `triage-labels.md` (role triage), `domain.md` (jak czytać dokumenty domenowe).
- **Fakty o szkole** — `docs/reference/szkola-fakty.md`: nazwy, adres, kontakt, historia, kierunki. Czytaj przy pisaniu i weryfikacji treści.

## Dostępność i publikacja

- Interfejs i treści muszą spełniać WCAG 2.2 AA; deklaracja szkoły: `src/pages/dostepnosc.astro`.
- Hosting: Cloudflare. Commity na GitHub → build/host na Cloudflare; GitHub Pages to mirror/preview. Szczegóły: `docs/adr/0002-deployment-channel-and-security-headers.md`.

## Dokumentacja zewnętrzna

- Astro: https://docs.astro.build — routing, komponenty, content collections, style.
- Oficjalne dokumenty Tailwind 4, Keystatic i Pagefind — sięgaj po nie w razie potrzeby.
