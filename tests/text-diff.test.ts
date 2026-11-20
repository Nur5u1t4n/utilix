import { describe, expect, it } from "vitest";
import { compareTexts } from "../src/scripts/tools/text-diff";

describe("compareTexts", () => {
  it("returns equal lines for identical texts", () => {
    expect(compareTexts("Apple\nBanana", "Apple\nBanana")).toEqual([
      { type: "equal", value: "Apple" },
      { type: "equal", value: "Banana" },
    ]);
  });

  it("detects added lines", () => {
    expect(compareTexts("Apple\nOrange", "Apple\nBanana\nOrange")).toEqual([
      { type: "equal", value: "Apple" },
      { type: "add", value: "Banana" },
      { type: "equal", value: "Orange" },
    ]);
  });

  it("detects removed lines", () => {
    expect(compareTexts("Apple\nBanana\nOrange", "Apple\nOrange")).toEqual([
      { type: "equal", value: "Apple" },
      { type: "remove", value: "Banana" },
      { type: "equal", value: "Orange" },
    ]);
  });

  it("detects replaced lines as removal and addition", () => {
    expect(compareTexts("Apple\nBanana", "Apple\nCherry")).toEqual([
      { type: "equal", value: "Apple" },
      { type: "remove", value: "Banana" },
      { type: "add", value: "Cherry" },
    ]);
  });

  it("preserves duplicate lines", () => {
    expect(
      compareTexts(
        "Apple\nBanana\nBanana\nOrange",
        "Apple\nBanana\nOrange\nOrange",
      ),
    ).toEqual([
      { type: "equal", value: "Apple" },
      { type: "equal", value: "Banana" },
      { type: "remove", value: "Banana" },
      { type: "equal", value: "Orange" },
      { type: "add", value: "Orange" },
    ]);
  });

  it("detects reordered lines", () => {
    expect(compareTexts("Apple\nBanana", "Banana\nApple")).toEqual([
      { type: "remove", value: "Apple" },
      { type: "equal", value: "Banana" },
      { type: "add", value: "Apple" },
    ]);
  });

  it("preserves empty lines", () => {
    expect(compareTexts("Apple\n\nOrange", "Apple\nOrange")).toEqual([
      { type: "equal", value: "Apple" },
      { type: "remove", value: "" },
      { type: "equal", value: "Orange" },
    ]);
  });

  it("handles empty first text", () => {
    expect(compareTexts("", "Apple\nBanana")).toEqual([
      { type: "add", value: "Apple" },
      { type: "add", value: "Banana" },
    ]);
  });

  it("handles empty second text", () => {
    expect(compareTexts("Apple\nBanana", "")).toEqual([
      { type: "remove", value: "Apple" },
      { type: "remove", value: "Banana" },
    ]);
  });

  it("handles CRLF line endings", () => {
    expect(compareTexts("Apple\r\nBanana", "Apple\nBanana")).toEqual([
      { type: "equal", value: "Apple" },
      { type: "equal", value: "Banana" },
    ]);
  });

  it("handles lone CR line endings", () => {
    expect(compareTexts("Apple\rBanana", "Apple\nBanana")).toEqual([
      { type: "equal", value: "Apple" },
      { type: "equal", value: "Banana" },
    ]);
  });

  it("preserves whitespace inside lines", () => {
    expect(compareTexts(" Apple\nBanana ", "Apple\nBanana")).toEqual([
      { type: "remove", value: " Apple" },
      { type: "remove", value: "Banana " },
      { type: "add", value: "Apple" },
      { type: "add", value: "Banana" },
    ]);
  });

  it("preserves case sensitivity", () => {
    expect(compareTexts("Apple", "apple")).toEqual([
      { type: "remove", value: "Apple" },
      { type: "add", value: "apple" },
    ]);
  });

  it("rejects texts that exceed the comparison limit", () => {
    const first = Array(1000).fill("First").join("\n");
    const second = Array(1000).fill("Second").join("\n");

    expect(() => compareTexts(first, second)).toThrow(
      "Тексты слишком большие для сравнения. Сократите количество строк.",
    );
  });
});
