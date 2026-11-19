import { describe, expect, it, vi } from "vitest";
import {
  generatePassword,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  type PasswordOptions,
} from "../src/scripts/tools/password";

const defaultOptions: PasswordOptions = {
  length: 16,
  lower: true,
  upper: true,
  numbers: true,
  symbols: false,
};

const predictableRandom = () => new Uint8Array([0]);

describe("generatePassword", () => {
  it("generates a password with the requested length", () => {
    const password = generatePassword(defaultOptions, predictableRandom);

    expect(password).toHaveLength(16);
  });

  it("supports the minimum length", () => {
    const password = generatePassword(
      { ...defaultOptions, length: MIN_PASSWORD_LENGTH },
      predictableRandom,
    );

    expect(password).toHaveLength(MIN_PASSWORD_LENGTH);
  });

  it("supports the maximum length", () => {
    const password = generatePassword(
      { ...defaultOptions, length: MAX_PASSWORD_LENGTH },
      predictableRandom,
    );

    expect(password).toHaveLength(MAX_PASSWORD_LENGTH);
  });

  it("rejects lengths below the minimum", () => {
    expect(() => generatePassword({ ...defaultOptions, length: 7 })).toThrow(
      "Длина пароля должна быть от 8 до 128 символов.",
    );
  });

  it("rejects lengths above the maximum", () => {
    expect(() => generatePassword({ ...defaultOptions, length: 129 })).toThrow(
      "Длина пароля должна быть от 8 до 128 символов.",
    );
  });

  it("rejects fractional lengths", () => {
    expect(() => generatePassword({ ...defaultOptions, length: 12.5 })).toThrow(
      "Длина пароля должна быть целым числом.",
    );
  });

  it("rejects NaN", () => {
    expect(() =>
      generatePassword({ ...defaultOptions, length: Number.NaN }),
    ).toThrow("Длина пароля должна быть целым числом.");
  });

  it("rejects Infinity", () => {
    expect(() =>
      generatePassword({ ...defaultOptions, length: Infinity }),
    ).toThrow("Длина пароля должна быть целым числом.");
  });

  it("rejects when no character set is selected", () => {
    expect(() =>
      generatePassword({
        length: 16,
        lower: false,
        upper: false,
        numbers: false,
        symbols: false,
      }),
    ).toThrow("Выберите хотя бы один набор символов.");
  });

  it("includes lowercase characters when selected", () => {
    const password = generatePassword(
      {
        ...defaultOptions,
        lower: true,
        upper: false,
        numbers: false,
      },
      predictableRandom,
    );

    expect(password).toMatch(/[a-z]/);
  });

  it("includes uppercase characters when selected", () => {
    const password = generatePassword(
      {
        ...defaultOptions,
        lower: false,
        upper: true,
        numbers: false,
      },
      predictableRandom,
    );

    expect(password).toMatch(/[A-Z]/);
  });

  it("includes numbers when selected", () => {
    const password = generatePassword(
      {
        ...defaultOptions,
        lower: false,
        upper: false,
        numbers: true,
      },
      predictableRandom,
    );

    expect(password).toMatch(/[0-9]/);
  });

  it("includes symbols when selected", () => {
    const password = generatePassword(
      {
        ...defaultOptions,
        lower: false,
        upper: false,
        numbers: false,
        symbols: true,
      },
      predictableRandom,
    );

    expect(password).toMatch(/[!@#$%^&*()\-_=+\[\]{}]/);
  });

  it("includes at least one character from every selected set", () => {
    const password = generatePassword(
      {
        length: 20,
        lower: true,
        upper: true,
        numbers: true,
        symbols: true,
      },
      predictableRandom,
    );

    expect(password).toMatch(/[a-z]/);
    expect(password).toMatch(/[A-Z]/);
    expect(password).toMatch(/[0-9]/);
    expect(password).toMatch(/[!@#$%^&*()\-_=+\[\]{}]/);
  });

  it("does not include unselected character sets", () => {
    const password = generatePassword(
      {
        length: 16,
        lower: false,
        upper: true,
        numbers: false,
        symbols: false,
      },
      predictableRandom,
    );

    expect(password).toMatch(/^[A-Z]+$/);
  });

  it("uses rejection sampling for unbiased random selection", () => {
    const values = [255, 9, ...Array(30).fill(0)];

    const randomBytes = vi.fn(() => {
      const value = values.shift() ?? 0;
      return new Uint8Array([value]);
    });

    const password = generatePassword(
      {
        length: 8,
        lower: false,
        upper: false,
        numbers: true,
        symbols: false,
      },
      randomBytes,
    );

    expect(password).toHaveLength(8);
    expect(password).toMatch(/^[0-9]+$/);
    expect(randomBytes).toHaveBeenCalled();
  });
});
