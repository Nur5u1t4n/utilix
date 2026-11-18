export type CsvDelimiter = "," | ";" | "\t";

export function parseCsv(input: string, delimiter: CsvDelimiter): string[][] {
  // Удаляем UTF-8 BOM, если он присутствует.
  const source = input.replace(/^\uFEFF/, "");

  if (source.length === 0) {
    throw new Error("Добавьте CSV-текст.");
  }

  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  let afterQuote = false;

  const pushCell = () => {
    row.push(cell);
    cell = "";
    afterQuote = false;
  };

  const pushRow = () => {
    pushCell();
    rows.push(row);
    row = [];
  };

  for (let i = 0; i < source.length; i++) {
    const char = source[i];

    if (inQuotes) {
      if (char === '"') {
        if (source[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
          afterQuote = true;
        }
      } else {
        cell += char;
      }

      continue;
    }

    if (afterQuote) {
      if (char === delimiter) {
        pushCell();
        continue;
      }

      if (char === "\r" || char === "\n") {
        pushRow();

        if (char === "\r" && source[i + 1] === "\n") {
          i++;
        }

        continue;
      }

      throw new Error(
        "После закрывающей кавычки допускается только разделитель или перенос строки.",
      );
    }

    if (char === '"') {
      if (cell.length > 0) {
        throw new Error(
          "Кавычка внутри некавыченного значения CSV. Проверьте формат данных.",
        );
      }

      inQuotes = true;
      continue;
    }

    if (char === delimiter) {
      pushCell();
      continue;
    }

    if (char === "\r" || char === "\n") {
      pushRow();

      if (char === "\r" && source[i + 1] === "\n") {
        i++;
      }

      continue;
    }

    cell += char;
  }

  if (inQuotes) {
    throw new Error("Обнаружена незакрытая кавычка в CSV.");
  }

  // Не добавляем лишнюю пустую запись после последнего переноса строки.
  if (cell.length > 0 || row.length > 0 || afterQuote) {
    pushRow();
  }

  return rows;
}
