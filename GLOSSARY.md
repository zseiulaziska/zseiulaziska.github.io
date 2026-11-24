# Strona szkoły

Słownik pojęć używanych w projekcie strony ZSEiU Łaziska Górne.

## Language

**Trasa**:
Kanoniczny publiczny adres strony w serwisie szkoły wraz z nazwą, pod którą jest prezentowana w nawigacji i ścieżce nawigacyjnej.
_Avoid_: Route, Strona, Link

**Katalog Tras**:
Jedyne źródło faktów o Trasach: kanoniczne adresy, nazwy, sekcje, breadcrumb-rodzice, ikony i aliasy. Adaptery nawigacyjne czytają z niego dane, a nie utrzymują własnych map.

**Alias**:
Dodatkowy adres Trasy zachowany po zmianie jej adresu kanonicznego. Aliasy są faktem Trasy i jedynym źródłem konfiguracji redirectów.
_Avoid_: Przekierowanie, Stary adres

**Dziennik**:
Kanoniczna nazwa szkolnego dziennika, używana w nawigacji, tekstach stron i dokumentacji. Nazwa systemu pozostaje faktem w dokumencie referencyjnym, nie nazwą linku.
_Avoid_: E-Dziennik, e-dziennik, Dziennik Vulcan, dziennik elektroniczny

**Plan LO dla Dorosłych**:
Kanoniczna nazwa zewnętrznego arkusza planu zajęć Liceum Ogólnokształcącego dla Dorosłych.
_Avoid_: Plan LO, Plan zajęć LO
