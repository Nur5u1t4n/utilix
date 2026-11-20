export type Base64Mode = "encode" | "decode";

export function encodeBase64(input: string): string {
  if (input.length === 0) {
    throw new Error("Введите текст для кодирования.");
  }

  const bytes = new TextEncoder().encode(input);

  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join(
    "",
  );

  return btoa(binary);
}

export function decodeBase64(input: string): string {
  if (input.trim().length === 0) {
    throw new Error("Введите Base64 для декодирования.");
  }

  // Убираем пробелы и переносы строк.
  const normalized = input.replace(/\s/g, "");

  // Проверяем алфавит, длину и структуру padding.
  if (
    normalized.length === 0 ||
    normalized.length % 4 !== 0 ||
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
      normalized,
    )
  ) {
    throw new Error("Некорректная строка Base64.");
  }

  let binary: string;

  try {
    binary = atob(normalized);
  } catch {
    throw new Error("Некорректная строка Base64.");
  }

  // Проверяем каноническое представление Base64,
  // включая неиспользуемые биты перед padding.
  if (btoa(binary) !== normalized) {
    throw new Error("Некорректная строка Base64.");
  }

  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  try {
    // fatal: true запрещает незаметную замену
    // некорректных UTF-8 последовательностей.
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new Error("Некорректные данные Base64 или UTF-8.");
  }
}

export function convertBase64(input: string, mode: Base64Mode): string {
  if (mode === "encode") {
    return encodeBase64(input);
  }

  if (mode === "decode") {
    return decodeBase64(input);
  }

  throw new Error("Неизвестный режим Base64.");
}
