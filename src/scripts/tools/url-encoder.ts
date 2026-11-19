export type UrlMode = "encode" | "decode";

/**
 * Кодирует текст как URI-компонент.
 */
export function encodeUrl(input: string): string {
  return encodeURIComponent(input);
}

/**
 * Декодирует URI-компонент.
 * Некорректные последовательности автоматически вызовут URIError.
 */
export function decodeUrl(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    throw new Error(
      "Не удалось декодировать текст. Проверьте правильность URL-кодирования: обнаружена некорректная последовательность символов.",
    );
  }
}

/**
 * Выполняет кодирование или декодирование.
 */
export function convertUrl(input: string, mode: UrlMode): string {
  if (mode === "encode") {
    return encodeUrl(input);
  }

  if (mode === "decode") {
    return decodeUrl(input);
  }

  throw new Error("Неизвестный режим URL-кодирования.");
}
