import { describe, expect, it } from "vitest";
import {
  encodeBase64,
  decodeBase64,
  convertBase64,
} from "../src/scripts/tools/base64";

describe("encodeBase64", () => {
  it("encodes English text", () => {
    expect(encodeBase64("Hello")).toBe("SGVsbG8=");
  });

  it("encodes Russian text", () => {
    expect(encodeBase64("Привет")).toBe("0J/RgNC40LLQtdGC");
  });

  it("encodes Kazakh text", () => {
    expect(encodeBase64("Сәлем әлем")).toBe("0KHTmdC70LXQvCDTmdC70LXQvA==");
  });

  it("encodes emoji", () => {
    expect(encodeBase64("Привет 👋 🌍")).toBe(
      "0J/RgNC40LLQtdGCIPCfkYsg8J+MjQ==",
    );
  });

  it("encodes special characters", () => {
    expect(encodeBase64("!@#$%^&*()")).toBe("IUAjJCVeJiooKQ==");
  });

  it("rejects empty input", () => {
    expect(() => encodeBase64("")).toThrow("Введите текст для кодирования.");
  });
});

describe("decodeBase64", () => {
  it("decodes English text", () => {
    expect(decodeBase64("SGVsbG8=")).toBe("Hello");
  });

  it("decodes Russian text", () => {
    expect(decodeBase64("0J/RgNC40LLQtdGC")).toBe("Привет");
  });

  it("decodes Kazakh text", () => {
    expect(decodeBase64("0KHTmdC70LXQvCDTmdC70LXQvA==")).toBe("Сәлем әлем");
  });

  it("decodes emoji", () => {
    expect(decodeBase64("0J/RgNC40LLQtdGCIPCfkYsg8J+MjQ==")).toBe(
      "Привет 👋 🌍",
    );
  });

  it("allows whitespace and line breaks", () => {
    expect(decodeBase64("SGVs\n bG8=")).toBe("Hello");
  });

  it("rejects empty input", () => {
    expect(() => decodeBase64("")).toThrow("Введите Base64 для декодирования.");
  });

  it("rejects whitespace-only input", () => {
    expect(() => decodeBase64("   \n  ")).toThrow(
      "Введите Base64 для декодирования.",
    );
  });

  it("rejects invalid characters", () => {
    expect(() => decodeBase64("SGVsbG8!")).toThrow(
      "Некорректная строка Base64.",
    );
  });

  it("rejects incorrect padding", () => {
    expect(() => decodeBase64("SGVsbG8")).toThrow(
      "Некорректная строка Base64.",
    );
  });

  it("rejects excessive padding", () => {
    expect(() => decodeBase64("SGVsbG8===")).toThrow(
      "Некорректная строка Base64.",
    );
  });

  it("rejects non-canonical padding bits", () => {
    expect(() => decodeBase64("AB==")).toThrow("Некорректная строка Base64.");
  });

  it("rejects non-canonical single padding bits", () => {
    expect(() => decodeBase64("AAB=")).toThrow("Некорректная строка Base64.");
  });

  it("rejects invalid UTF-8 data", () => {
    expect(() => decodeBase64("/w==")).toThrow(
      "Некорректные данные Base64 или UTF-8.",
    );
  });
});

describe("convertBase64", () => {
  it("encodes when mode is encode", () => {
    expect(convertBase64("Hello", "encode")).toBe("SGVsbG8=");
  });

  it("decodes when mode is decode", () => {
    expect(convertBase64("SGVsbG8=", "decode")).toBe("Hello");
  });

  it("rejects unknown mode", () => {
    expect(() => convertBase64("Hello", "invalid" as "encode")).toThrow(
      "Неизвестный режим Base64.",
    );
  });
});
