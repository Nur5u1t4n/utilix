const MIN_BASE = 2;
const MAX_BASE = 36;

function validateBase(base: number): void {
  if (!Number.isInteger(base) || base < MIN_BASE || base > MAX_BASE) {
    throw new Error("Система счисления должна иметь основание от 2 до 36.");
  }
}

export function convertBase(
  value: string,
  fromBase: number,
  toBase: number,
): string {
  validateBase(fromBase);
  validateBase(toBase);

  const input = value.trim().toLowerCase();

  if (!input) {
    throw new Error("Введите целое число.");
  }

  const isNegative = input.startsWith("-");
  const digits = input.replace(/^[+-]/, "");

  if (!digits) {
    throw new Error("Введите корректное целое число.");
  }

  if (!/^[0-9a-z]+$/.test(digits)) {
    throw new Error("Число содержит недопустимые символы.");
  }

  let number = 0n;
  const radix = BigInt(fromBase);

  for (const char of digits) {
    const code = char.charCodeAt(0);

    const digit = code >= 48 && code <= 57 ? code - 48 : code - 87;

    if (digit >= fromBase) {
      throw new Error(
        `Цифра "${char}" недопустима для системы счисления с основанием ${fromBase}.`,
      );
    }

    number = number * radix + BigInt(digit);
  }

  if (isNegative) {
    number = -number;
  }

  return number.toString(toBase).toUpperCase();
}
