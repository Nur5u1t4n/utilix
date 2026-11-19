import { describe, expect, it } from "vitest";
import {
  encodeUrl,
  decodeUrl,
  convertUrl,
} from "../src/scripts/tools/url-encoder";

describe("encodeUrl", () => {
  it("encodes spaces", () => {
    expect(encodeUrl("Hello World")).toBe("Hello%20World");
  });

  it("encodes Russian text", () => {
    expect(encodeUrl("Привет")).toBe("%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82");
  });

  it("encodes Kazakh text", () => {
    expect(encodeUrl("Сәлем әлем")).toBe(
      "%D0%A1%D3%99%D0%BB%D0%B5%D0%BC%20%D3%99%D0%BB%D0%B5%D0%BC",
    );
  });

  it("encodes reserved URI component characters", () => {
    expect(encodeUrl("a&b=c?d/e#f")).toBe("a%26b%3Dc%3Fd%2Fe%23f");
  });

  it("encodes emoji", () => {
    expect(encodeUrl("Hello 👋")).toBe("Hello%20%F0%9F%91%8B");
  });

  it("returns an empty string for empty input", () => {
    expect(encodeUrl("")).toBe("");
  });
});

describe("decodeUrl", () => {
  it("decodes spaces", () => {
    expect(decodeUrl("Hello%20World")).toBe("Hello World");
  });

  it("decodes Russian text", () => {
    expect(decodeUrl("%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82")).toBe("Привет");
  });

  it("decodes Kazakh text", () => {
    expect(
      decodeUrl("%D0%A1%D3%99%D0%BB%D0%B5%D0%BC%20%D3%99%D0%BB%D0%B5%D0%BC"),
    ).toBe("Сәлем әлем");
  });

  it("decodes reserved URI component characters", () => {
    expect(decodeUrl("a%26b%3Dc%3Fd%2Fe%23f")).toBe("a&b=c?d/e#f");
  });

  it("decodes emoji", () => {
    expect(decodeUrl("Hello%20%F0%9F%91%8B")).toBe("Hello 👋");
  });

  it("shows a user-friendly error for malformed percent sequences", () => {
    const message =
      "Не удалось декодировать текст. Проверьте правильность URL-кодирования: обнаружена некорректная последовательность символов.";

    expect(() => decodeUrl("%")).toThrow(message);
    expect(() => decodeUrl("%2")).toThrow(message);
    expect(() => decodeUrl("%GG")).toThrow(message);
  });

  it("shows a user-friendly error for invalid UTF-8 sequences", () => {
    const message =
      "Не удалось декодировать текст. Проверьте правильность URL-кодирования: обнаружена некорректная последовательность символов.";

    expect(() => decodeUrl("%FF")).toThrow(message);
    expect(() => decodeUrl("%E0%A4%A")).toThrow(message);
  });

  it("returns an empty string for empty input", () => {
    expect(decodeUrl("")).toBe("");
  });
});

describe("convertUrl", () => {
  it("encodes when mode is encode", () => {
    expect(convertUrl("Hello World", "encode")).toBe("Hello%20World");
  });

  it("decodes when mode is decode", () => {
    expect(convertUrl("Hello%20World", "decode")).toBe("Hello World");
  });

  it("rejects an unknown mode", () => {
    expect(() => convertUrl("test", "unknown" as "encode")).toThrow(
      "Неизвестный режим URL-кодирования.",
    );
  });
});
