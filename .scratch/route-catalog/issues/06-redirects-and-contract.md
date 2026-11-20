# 06: Redirecty i usunięcie starej wiedzy o trasach

**What to build:** Katalog Tras jest po tym tickecie jedynym miejscem, z którego korzystają wszystkie adaptery. Stary adres nadal przekierowuje, ale nikt nie musi go już opisywać w dwóch listach, a link partnerski prowadzi do istniejącej strony.

**Blocked by:** 02: Menu jako adapter katalogu; 03: Stopka jako adapter katalogu; 04: Paski szybkiego dostępu i linki zewnętrzne; 05: Układ strony i tytuły wyszukiwania.

**Status:** ready-for-agent

- [x] Konfiguracja redirectów korzysta z aliasów zdefiniowanych w katalogu Tras; stary adres „kierunki-ksztalcenia” nadal prowadzi do aktualnej oferty.
- [x] Wszystkie stare, rozproszone mapy tras, etykiet i ikon zniknęły — pozostaje jeden katalog oraz grafiki w adapterze menu.
- [x] Link „Poznaj naszych partnerów” prowadzi do istniejącej strony zamiast pod nieistniejący adres.
- [x] Testy katalogu, sprawdzanie typów, build projektu i walidacja danych strukturalnych po buildzie przechodzą razem.
- [x] Słownik pojęć i ADR pozostają zgodne z finalnym stanem: katalog Tras jest jedynym źródłem faktów o trasach.

## Comments

- Implementacja: `7644a4c`, merge na integrację: `662c32e`.
- `astro.config.mjs` importuje `redirects` zbudowane z aliasów Tras; `dist/client/_redirects` zawiera przekierowanie `/kierunki-ksztalcenia → /kierunki (301)`.
- Link partnerski był już naprawiony w `54d6206`; ticket 06 tylko to zweryfikował.
- Słownik i ADR zaktualizowane o definicje „Katalog Tras” i „Alias” oraz finalny kontrakt.
