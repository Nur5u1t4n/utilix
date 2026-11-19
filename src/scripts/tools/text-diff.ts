export type DiffOperation =
  | {
      type: "equal";
      value: string;
    }
  | {
      type: "add";
      value: string;
    }
  | {
      type: "remove";
      value: string;
    };

export function compareTexts(first: string, second: string): DiffOperation[] {
  // Пустой текст означает отсутствие строк.
  // В остальных случаях сохраняем пустые строки внутри текста.
  const a = first === "" ? [] : first.split(/\r\n|\n|\r/);
  const b = second === "" ? [] : second.split(/\r\n|\n|\r/);

  // Ограничиваем размер таблицы, чтобы избежать чрезмерного расхода памяти.
  const maxCells = 1_000_000;

  if ((a.length + 1) * (b.length + 1) > maxCells) {
    throw new Error(
      "Тексты слишком большие для сравнения. Сократите количество строк.",
    );
  }

  const rows = a.length + 1;
  const cols = b.length + 1;

  const dp: number[][] = Array.from({ length: rows }, () =>
    Array<number>(cols).fill(0),
  );

  // Строим таблицу наибольшей общей подпоследовательности.
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      if (a[i] === b[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const result: DiffOperation[] = [];

  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      result.push({
        type: "equal",
        value: a[i],
      });

      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({
        type: "remove",
        value: a[i],
      });

      i++;
    } else {
      result.push({
        type: "add",
        value: b[j],
      });

      j++;
    }
  }

  while (i < a.length) {
    result.push({
      type: "remove",
      value: a[i],
    });

    i++;
  }

  while (j < b.length) {
    result.push({
      type: "add",
      value: b[j],
    });

    j++;
  }

  return result;
}
