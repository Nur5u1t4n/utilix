export type RemoveDuplicatesResult = {
  result: string;
  removed: number;
};

export function removeDuplicates(input: string): RemoveDuplicatesResult {
  if (input.length === 0) {
    throw new Error("Добавьте текст для удаления дубликатов.");
  }

  // Разделяем строки с учётом LF, CRLF и одиночного CR.
  const lines = input.split(/\r\n|\n|\r/);

  const unique = [...new Set(lines)];

  return {
    result: unique.join("\n"),
    removed: lines.length - unique.length,
  };
}
