function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Zbiorczy");
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ error: "Nie znaleziono arkusza 'Zbiorczy'" }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
    var data = sheet.getDataRange().getValues();
    var result = {};
    
    var currentClass = null;
    var currentHeaders = [];
    
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      if (row.length === 0 || !row[0]) continue; // Pomiń puste wiersze
      
      // Wykrywanie wiersza nagłówkowego (szukamy frazy NR, START, STOP)
      if (row[1] === "NR" && row[2] === "START") {
        currentClass = String(row[0]).trim(); // Np. "2D", "3D"
        result[currentClass] = {};
        currentHeaders = [];
        
        // Parsujemy poziome daty (od kolumny o indeksie 4)
        for (var j = 4; j < row.length; j++) {
          if (row[j]) {
            var dateVal = row[j];
            var dateStr = "";
            if (dateVal instanceof Date) {
              dateStr = Utilities.formatDate(dateVal, ss.getSpreadsheetTimeZone(), "yyyy-MM-dd");
            } else {
              dateStr = String(dateVal).trim();
            }
            currentHeaders.push({ index: j, date: dateStr });
          }
        }
        continue; // Przejdź do kolejnego wiersza (lekcji)
      }
      
      // Jeśli jesteśmy wewnątrz bloku danej klasy i wiersz zawiera definicję lekcji (np. numer lekcji w kolumnie B)
      if (currentClass && row[1] !== undefined && row[1] !== "") {
        var lessonNr = String(row[1]).trim();
        var startTime = row[2] ? String(row[2]).trim() : "";
        var stopTime = row[3] ? String(row[3]).trim() : "";
        
        // Przypisujemy wartości przedmiotów do odpowiednich dat
        currentHeaders.forEach(function(header) {
          var subject = row[header.index] ? String(row[header.index]).trim() : "";
          
          // Tworzymy strukturę daty, jeśli jeszcze nie istnieje
          if (!result[currentClass][header.date]) {
            result[currentClass][header.date] = [];
          }
          
          // Dodajemy lekcję do tablicy dla danej daty
          result[currentClass][header.date].push({
            nr: lessonNr,
            start: startTime,
            stop: stopTime,
            subject: subject
          });
        });
      }
    }
    
    // Zwrócenie sparsowanego wyniku jako JSON
    return ContentService.createTextOutput(JSON.stringify(result, null, 2))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}