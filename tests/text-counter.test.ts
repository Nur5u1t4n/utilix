import { describe, expect, it } from "vitest";
import { countText } from "../src/scripts/tools/text-counter";

describe("countText", () => {
  it("returns zero statistics for empty input", () => {
    expect(countText("")).toEqual({
      characters: 0,
      words: 0,
      lines: 0,
      charactersWithoutWhitespace: 0,
    });
  });

  it("counts ordinary characters", () => {
    expect(countText("Hello")).toEqual({
      characters: 5,
      words: 1,
      lines: 1,
      charactersWithoutWhitespace: 5,
    });
  });

  it("counts words separated by spaces", () => {
    expect(countText("Hello World Test").words).toBe(3);
  });

  it("counts words separated by different whitespace", () => {
    expect(countText("Hello\tWorld\nTest").words).toBe(3);
  });

  it("counts Russian and Kazakh text", () => {
    expect(countText("Привет Сәлем").characters).toBe(12);
    expect(countText("Привет Сәлем").words).toBe(2);
  });

  it("counts emoji as one Unicode code point", () => {
    expect(countText("Hello 👋")).toEqual({
      characters: 7,
      words: 2,
      lines: 1,
      charactersWithoutWhitespace: 6,
    });
  });

  it("counts multiple emoji", () => {
    expect(countText("👋🌍😊").characters).toBe(3);
    expect(countText("👋🌍😊").charactersWithoutWhitespace).toBe(3);
  });

  it("counts characters without whitespace", () => {
    expect(countText("A B\tC\nD")).toEqual({
      characters: 7,
      words: 4,
      lines: 2,
      charactersWithoutWhitespace: 4,
    });
  });

  it("counts LF line breaks", () => {
    expect(countText("One\nTwo\nThree").lines).toBe(3);
  });

  it("counts CRLF line breaks", () => {
    expect(countText("One\r\nTwo\r\nThree").lines).toBe(3);
  });

  it("counts standalone CR line breaks", () => {
    expect(countText("One\rTwo\rThree").lines).toBe(3);
  });

  it("counts a trailing newline as an additional line", () => {
    expect(countText("One\nTwo\n").lines).toBe(3);
  });

  it("counts whitespace-only input", () => {
    expect(countText("   \n\t")).toEqual({
      characters: 5,
      words: 0,
      lines: 2,
      charactersWithoutWhitespace: 0,
    });
  });

  it("preserves punctuation as part of words", () => {
    expect(countText("Hello, world! How are you?").words).toBe(5);
  });
});
