# 17 — Dynamiczne jednostki viewportu (`100vh` → `100dvh` / `svh`)

Status: resolved
Type: task
Priority: P4 (RWD / mobilne)
Blocked by: —
Źródło: raport §4.4 + uzupełnienie przy weryfikacji

## Problem (zweryfikowane)

`src/pages/plan-lekcji.astro:21`:

```html
<iframe ... style="height: calc(100vh - 240px); min-height: 600px;">
```

Na mobile `100vh` odnosi się do największego widocznego obszaru (z chowanym
paskiem adresu), więc ramka „wjeżdża" pod pasek i dolna część planu jest
nieosiągalna. `global.css:202-207` ma już świadomy komentarz, że panel mobilny
używa `top/bottom` zamiast `100vh` — spójność wymaga tej samej zasady tutaj.

Dodatkowo (wykryte przy weryfikacji, nie w raporcie):

`src/components/PhotoBannerSection.astro:18` — `min-h-[55vh] lg:min-h-[65vh]`.
To tło dekoracyjne, nie obszar interakcji, więc ryzyko mniejsze, ale na telefonie
również „puchnie" przy chowaniu paska. Decyzja: zamienić na `min-h-[55svh] lg:min-h-[65svh]`
(`svh` = mały viewport, stabilny) albo zostawić i odnotować.

`Hero.astro:6` używa już `min-h-[85svh]` — poprawnie.

## Zakres

1. `plan-lekcji.astro:21` — `calc(100dvh - 240px)`. `dvh` dostosowuje się wraz z paskiem,
   co dla osadzonego planu jest pożądane (zawsze wypełnia widoczny ekran).
   Zostawić `min-height: 600px` jako dolne ograniczenie dla małych ekranów —
   ale sprawdzić, czy `600px` + `240px` nie wymusza przewijania na telefonach
   o wysokości ~667px; w razie potrzeby zmniejszyć do `min-height: 480px`.
2. `PhotoBannerSection.astro:18` — decyzja jak wyżej.
3. Przeszukać repo za `\d+vh` (grep: `MegaNav.astro:558` to tylko komentarz)
   i odnotować pozostałe przypadki w `## Comments`.

## Kryteria akceptacji

- [x] `calc(100vh` nie występuje w `src/`.
- [x] Na telefonie (emulacja + urządzenie realne) po przewinięciu w dół i chowaniu
      paska adresu iframe planu lekcji nadal mieści się w ekranie, bez „martwego"
      paska na dole.
- [x] Na desktopie wysokość ramki praktycznie bez zmian.
- [x] `npm run check`, `npm run build` przechodzą.

## Comments

`plan-lekcji.astro`: `calc(100dvh - 240px)`, `min-height` zmniejszone z 600px do 480px,
 żeby 240px nagłówka + ramka nie wymuszały przewijania na telefonach ~667px.
`PhotoBannerSection.astro`: `svh` (stabilny mały viewport) dla dekoracyjnego tła —
świadomy wybór zamiast `dvh`, żeby tło nie „puchło" przy chowaniu paska adresu.
Pozostałe `100vh` w `src/` to tylko komentarze (`global.css`, `MegaNav.astro`).