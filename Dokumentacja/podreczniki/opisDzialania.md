Przy generowaniu pełnego JSON-a przyjmij następujące zasady:

- zachowanie wszystkich nazw dokładnie jak w PDF,
- zachowanie wielkości liter,
- zachowanie wszystkich opisów bez skracania,
- brak poprawiania literówek i formatowania,
- klasy 1–5 jako osobne sekcje,
- przedmioty ogólnokształcące jako lista,
- przedmioty z podziałem (np. Matematyka) jako warianty podstawowy i rozszerzony,
- kształcenie zawodowe jako lista kierunków,
- kierunki zawierające listę przedmiotów,
- wpisy typu „Wykaz publikacji zalecanych zostanie podany na zajęciach we wrześniu.” pozostają jako zwykłe opisy.

docelowa struktura pliku JSON:

{
  "rok_szkolny": "2026/2027",
  "typ_szkoly": "Technikum",
  "klasy": [zobacz teraz 
    {
      "klasa": "2",
      "przedmioty_ogolnoksztalcace": [
        {
          "nazwa": "Matematyka",
          "warianty": [
            {
              "nazwa": "Zakres rozszerzony",
              "opis": "Matematyka z plusem. Podręcznik do liceum i technikum. Część 1 i 2, M. Dobrowolska, M. Karpiński, J. Lech, wyd. GWO."
            },
            {
              "nazwa": "Zakres podstawowy",
              "opis": "Matematyka z plusem. Podręcznik do liceum i technikum. Część 1 i 2, M. Dobrowolska, M. Karpiński, J. Lech, wyd. GWO."
            }
          ]
        }
      ]
    }
  ]
}

