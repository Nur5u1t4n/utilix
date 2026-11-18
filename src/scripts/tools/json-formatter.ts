export type JsonMode = "pretty" | "minify";

export function formatJson(input: string, mode: JsonMode): string {
  if (!input.trim()) {
    throw new Error("Вставьте JSON для обработки.");
  }

  // Проверяем синтаксис, не преобразуя исходные числовые значения.
  try {
    JSON.parse(input);
  } catch {
    throw new Error("Некорректный JSON. Проверьте синтаксис и разделители.");
  }

  const pretty = mode === "pretty";
  let output = "";
  let depth = 0;

  // Для каждого открытого объекта или массива храним,
  // содержит ли он элементы.
  const stack: boolean[] = [];

  let i = 0;

  while (i < input.length) {
    const char = input[i];

    // Пробелы вне строк не влияют на содержимое JSON.
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Строки копируем целиком, сохраняя экранирование.
    if (char === '"') {
      if (stack.length) {
        stack[stack.length - 1] = true;
      }

      const start = i;
      i++;

      while (i < input.length) {
        if (input[i] === "\\") {
          i += 2;
          continue;
        }

        if (input[i] === '"') {
          i++;
          break;
        }

        i++;
      }

      output += input.slice(start, i);
      continue;
    }

    // Открытие объекта или массива.
    if (char === "{" || char === "[") {
      if (stack.length) {
        stack[stack.length - 1] = true;
      }

      output += char;
      depth++;
      stack.push(false);

      let next = i + 1;

      while (next < input.length && /\s/.test(input[next])) {
        next++;
      }

      const closing = char === "{" ? "}" : "]";

      if (pretty && input[next] !== closing) {
        output += "\n" + "  ".repeat(depth);
      }

      i++;
      continue;
    }

    // Закрытие объекта или массива.
    if (char === "}" || char === "]") {
      const hasItems = stack.pop() ?? false;
      depth--;

      if (pretty && hasItems) {
        output += "\n" + "  ".repeat(depth);
      }

      output += char;
      i++;
      continue;
    }

    // Разделение элементов.
    if (char === ",") {
      output += pretty ? ",\n" + "  ".repeat(depth) : ",";

      i++;
      continue;
    }

    // Разделение ключа и значения.
    if (char === ":") {
      output += pretty ? ": " : ":";
      i++;
      continue;
    }

    // Числа и логические значения копируем без изменений.
    if (stack.length) {
      stack[stack.length - 1] = true;
    }

    const start = i;

    while (i < input.length && !/[\s,\]}:]/.test(input[i])) {
      i++;
    }

    output += input.slice(start, i);
  }

  return output;
}
