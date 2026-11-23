# 22 — [Backlog opcjonalny] Transkodowanie wideo w `public/wideo/`

Status: open
Type: task
Priority: P5 (backlog, nie wprost w raporcie)
Blocked by: —
Źródło: `spec.md` §3.2

## Problem (zweryfikowane)

Zawartość `public/wideo/` (rozmiary z dysku):

| Plik | Rozmiar |
|---|---|
| `video.mp4` | 7,31 MB |
| `video2.mp4` | 2,57 MB |
| `video3.mp4` | 4,98 MB |
| `video4.mp4` | 1,82 MB |
| `video5.mp4` | 0,89 MB |

Łącznie ~17,6 MB. `spec.md` stwierdza, że są one **obsługiwane poprawnie**:
`GallerySection.astro` używa `preload="none"` i `poster`, więc nic nie jest
pobierane przy ładowaniu strony. To **nie jest bug** — potencjalna optymalizacja
transferu przy odtworzeniu.

## Zakres

1. Zinwentaryzować, gdzie który plik jest używany (`GallerySection.astro`,
   `src/content`, `keystatic.config.ts`) — nie transkodować nieużywanych.
2. Dla największych (`video.mp4`, `video3.mp4`) przygotować wersje VP9/AV1
   (WebM) albo H.265 z niższym bitrate, zachowując H.264 jako fallback
   w tym samym `<video>` przez dodatkowy `<source>`.
3. Porównać jakość wizualną i rozmiar; usunąć oryginały tylko jeśli nowe
   wersje są akceptowalne.
4. Dodać `preload="metadata"` tylko jeśli to nie zwiększy ruchu (uwaga:
   `preload="none"` jest obecnie świadomym wyborem — nie zmieniać bez pomiaru).

## Kryteria akceptacji

- [ ] Zmierzony zysk rozmiaru (np. ≥ 40% na `video.mp4`) udokumentowany
      w `## Comments`.
- [ ] Wideo odtwarza się w Chrome, Firefox, Safari (H.264 fallback obecny).
- [ ] `poster` i `preload="none"` bez zmian.
- [ ] `npm run build` przechodzi, rozmiar `dist/` nie wzrośnie.

## Ryzyka

Transkodowanie AV1/V9 jest kosztowne i może wydłużyć build/ręczne utrzymanie.
Jeśli zysk < 40% — zamknąć ticket jako „nieopłacalne" i odnotować w `map.md`.

## Comments