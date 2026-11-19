export type TextStats = {
  characters: number;
  words: number;
  lines: number;
  charactersWithoutWhitespace: number;
};

export function countText(input: string): TextStats {
  const characters = Array.from(input).length;

  const words = input.trim() ? input.trim().split(/\s+/u).length : 0;

  const lines = input.length ? input.split(/\r\n|\r|\n/).length : 0;

  const charactersWithoutWhitespace = Array.from(
    input.replace(/\s/gu, ""),
  ).length;

  return {
    characters,
    words,
    lines,
    charactersWithoutWhitespace,
  };
}
