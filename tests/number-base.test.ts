import { describe, it, expect } from "vitest";
import { convertBase } from "../src/scripts/tools/number-base";

describe("Конвертер систем счисления", () => {
  it("переводит десятичное число в двоичное", () => {
    expect(convertBase("255", 10, 2)).toBe("11111111");
  });

  it("переводит десятичное число в шестнадцатеричное", () => {
    expect(convertBase("255", 10, 16)).toBe("FF");
  });

  it("переводит шестнадцатеричное число в десятичное", () => {
    expect(convertBase("FF", 16, 10)).toBe("255");
  });

  it("поддерживает разные системы счисления", () => {
    expect(convertBase("77", 8, 10)).toBe("63");
    expect(convertBase("1010", 2, 16)).toBe("A");
    expect(convertBase("Z", 36, 10)).toBe("35");
  });

  it("поддерживает отрицательные числа", () => {
    expect(convertBase("-255", 10, 2)).toBe("-11111111");
  });

  it("поддерживает положительный знак", () => {
    expect(convertBase("+255", 10, 16)).toBe("FF");
  });

  it("игнорирует регистр шестнадцатеричных символов", () => {
    expect(convertBase("ff", 16, 10)).toBe("255");
  });

  it("удаляет лишние пробелы по краям", () => {
    expect(convertBase("  255  ", 10, 16)).toBe("FF");
  });

  it("обрабатывает ведущие нули", () => {
    expect(convertBase("000255", 10, 16)).toBe("FF");
  });

  it("не теряет точность больших чисел", () => {
    expect(convertBase("900719925474099312345", 10, 16)).toBe(
      "30D40000000001B6D9",
    );
  });

  it("поддерживает одинаковые системы счисления", () => {
    expect(convertBase("1010", 2, 2)).toBe("1010");
  });

  it("отклоняет пустое значение", () => {
    expect(() => convertBase("", 10, 2)).toThrow();
    expect(() => convertBase("   ", 10, 2)).toThrow();
  });

  it("отклоняет недопустимые символы", () => {
    expect(() => convertBase("12abc!", 10, 2)).toThrow();
  });

  it("отклоняет цифры, недопустимые для основания", () => {
    expect(() => convertBase("102", 2, 10)).toThrow();
    expect(() => convertBase("19", 8, 10)).toThrow();
  });

  it("отклоняет некорректное основание", () => {
    expect(() => convertBase("10", 1, 10)).toThrow();
    expect(() => convertBase("10", 10, 37)).toThrow();
    expect(() => convertBase("10", 2.5, 10)).toThrow();
  });

  it("отклоняет знак без числа", () => {
    expect(() => convertBase("-", 10, 2)).toThrow();
    expect(() => convertBase("+", 10, 2)).toThrow();
  });
});
