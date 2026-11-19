export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

export type PasswordOptions = {
  length: number;
  lower: boolean;
  upper: boolean;
  numbers: boolean;
  symbols: boolean;
};

const CHAR_SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{}",
} as const;

type RandomBytes = (length: number) => Uint8Array;

function getRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

function randomInt(max: number, randomBytes: RandomBytes): number {
  if (!Number.isInteger(max) || max < 1 || max > 256) {
    throw new Error("Некорректный диапазон случайного числа.");
  }

  const limit = Math.floor(256 / max) * max;

  while (true) {
    const byte = randomBytes(1)[0];

    if (byte === undefined) {
      throw new Error("Не удалось получить случайные данные.");
    }

    if (byte < limit) {
      return byte % max;
    }
  }
}

export function generatePassword(
  options: PasswordOptions,
  randomBytes: RandomBytes = getRandomBytes,
): string {
  const { length, lower, upper, numbers, symbols } = options;

  if (!Number.isInteger(length)) {
    throw new Error("Длина пароля должна быть целым числом.");
  }

  if (length < MIN_PASSWORD_LENGTH || length > MAX_PASSWORD_LENGTH) {
    throw new Error(
      `Длина пароля должна быть от ${MIN_PASSWORD_LENGTH} до ${MAX_PASSWORD_LENGTH} символов.`,
    );
  }

  const selectedSets = [
    lower ? CHAR_SETS.lower : "",
    upper ? CHAR_SETS.upper : "",
    numbers ? CHAR_SETS.numbers : "",
    symbols ? CHAR_SETS.symbols : "",
  ].filter(Boolean);

  if (selectedSets.length === 0) {
    throw new Error("Выберите хотя бы один набор символов.");
  }

  if (length < selectedSets.length) {
    throw new Error("Длина пароля меньше количества выбранных наборов.");
  }

  const allChars = selectedSets.join("");
  const password: string[] = [];

  // Гарантируем минимум один символ из каждого выбранного набора.
  for (const set of selectedSets) {
    const index = randomInt(set.length, randomBytes);
    const char = set[index];

    if (char === undefined) {
      throw new Error("Не удалось создать пароль.");
    }

    password.push(char);
  }

  // Заполняем оставшуюся длину символами из общего набора.
  while (password.length < length) {
    const index = randomInt(allChars.length, randomBytes);
    const char = allChars[index];

    if (char === undefined) {
      throw new Error("Не удалось создать пароль.");
    }

    password.push(char);
  }

  // Криптографически стойкое перемешивание Fisher–Yates.
  for (let i = password.length - 1; i > 0; i--) {
    const j = randomInt(i + 1, randomBytes);
    [password[i], password[j]] = [password[j]!, password[i]!];
  }

  return password.join("");
}
