import { describe, it, expect } from "vitest";
import { removeDuplicates } from "../src/scripts/tools/remove-duplicates";

describe("Remove Duplicates", () => {
  describe("Базовое удаление", () => {
    it("удаляет повторяющиеся строки", () => {
      expect(removeDuplicates("яблоко\nгруша\nяблоко")).toEqual({
        result: "яблоко\nгруша",
        removed: 1,
      });
    });

    it("сохраняет порядок первого появления", () => {
      expect(removeDuplicates("A\nB\nC\nA\nB")).toEqual({
        result: "A\nB\nC",
        removed: 2,
      });
    });

    it("не изменяет уникальные строки", () => {
      expect(removeDuplicates("A\nB\nC")).toEqual({
        result: "A\nB\nC",
        removed: 0,
      });
    });

    it("корректно обрабатывает одну строку", () => {
      expect(removeDuplicates("hello")).toEqual({
        result: "hello",
        removed: 0,
      });
    });
  });

  describe("Регистр и пробелы", () => {
    it("учитывает регистр", () => {
      expect(removeDuplicates("Apple\napple\nAPPLE")).toEqual({
        result: "Apple\napple\nAPPLE",
        removed: 0,
      });
    });

    it("не удаляет пробелы в начале и конце строк", () => {
      expect(removeDuplicates("Apple\n Apple \nApple")).toEqual({
        result: "Apple\n Apple ",
        removed: 1,
      });
    });

    it("считает строки с разным количеством пробелов разными", () => {
      expect(removeDuplicates("A\nA \n A\nA")).toEqual({
        result: "A\nA \n A",
        removed: 1,
      });
    });
  });

  describe("Пустые строки", () => {
    it("сохраняет одну пустую строку вместо повторов", () => {
      expect(removeDuplicates("A\n\nB\n\nC")).toEqual({
        result: "A\n\nB\nC",
        removed: 1,
      });
    });

    it("обрабатывает пустые строки в начале и конце", () => {
      expect(removeDuplicates("\nA\n\n")).toEqual({
        result: "\nA",
        removed: 2,
      });
    });

    it("обрабатывает ввод из одной пустой строки", () => {
      expect(removeDuplicates("\n")).toEqual({
        result: "",
        removed: 1,
      });
    });
  });

  describe("Переносы строк", () => {
    it("поддерживает LF", () => {
      expect(removeDuplicates("A\nB\nA")).toEqual({
        result: "A\nB",
        removed: 1,
      });
    });

    it("поддерживает CRLF", () => {
      expect(removeDuplicates("A\r\nB\r\nA")).toEqual({
        result: "A\nB",
        removed: 1,
      });
    });

    it("поддерживает одиночный CR", () => {
      expect(removeDuplicates("A\rB\rA")).toEqual({
        result: "A\nB",
        removed: 1,
      });
    });

    it("обрабатывает смешанные переносы строк", () => {
      expect(removeDuplicates("A\r\nB\nA\rC")).toEqual({
        result: "A\nB\nC",
        removed: 1,
      });
    });
  });

  describe("Unicode и специальные символы", () => {
    it("поддерживает кириллицу и Unicode", () => {
      expect(removeDuplicates("Алматы\nАстана\nАлматы\n東京")).toEqual({
        result: "Алматы\nАстана\n東京",
        removed: 1,
      });
    });

    it("сохраняет специальные символы", () => {
      expect(removeDuplicates("A, B\nA, B\nA; B")).toEqual({
        result: "A, B\nA; B",
        removed: 1,
      });
    });
  });

  describe("Ошибки", () => {
    it("отклоняет пустой ввод", () => {
      expect(() => removeDuplicates("")).toThrow(
        "Добавьте текст для удаления дубликатов.",
      );
    });
  });
});
