# Katalog tras jako jedyne źródło faktów o trasach

Serwis ma 43 trasy statyczne, których etykiety, sekcje, breadcrumbs, ikony, skróty i redirecty są dziś rozproszone po sześciu modułach; rozjazd widać już na `/opm` (`Morskiego` vs `Mundurowego`). Decydujemy, że `src/routes.ts` jest jedynym źródłem faktów **Trasy**: trzyma kanoniczną etykietę z tytułu/h1 strony, opcjonalne warianty `navLabel`/`footerLabel`, przynależność do sekcji, breadcrumb-rodzica, nazwę ikony, aliasy redirectów oraz osobny eksport `externalLinks`. `astro.config.mjs` importuje z tego samego katalogu mapę `redirects` zbudowaną z aliasów Tras; nie prowadzi się drugiej, ręcznej listy adresów.

Odrzucamy content collection i Keystatic dla tego zbioru: dają wygodną edycję w interfejsie, ale wymagają nowego schematu i nie dają typów bez dodatkowej warstwy. Zależy nam na sprawdzaniu przez `astro check` oraz testach przez jeden interfejs katalogu.
