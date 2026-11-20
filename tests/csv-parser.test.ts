import { describe, it, expect } from "vitest";
import { parseCsv } from "../src/scripts/tools/csv-parser";

describe("CSV Parser", () => {
  describe("Базовый разбор", () => {
    it("разбирает строки с запятыми", () => {
      expect(parseCsv("name,age\nAlex,36\nIvan,25", ",")).toEqual([
        ["name", "age"],
        ["Alex", "36"],
        ["Ivan", "25"],
      ]);
    });

    it("поддерживает точку с запятой", () => {
      expect(parseCsv("name;age\nAlex;36", ";")).toEqual([
        ["name", "age"],
        ["Alex", "36"],
      ]);
    });

    it("поддерживает табуляцию", () => {
      expect(parseCsv("name\tage\nAlex\t36", "\t")).toEqual([
        ["name", "age"],
        ["Alex", "36"],
      ]);
    });

    it("поддерживает CRLF", () => {
      expect(parseCsv("name,age\r\nAlex,36\r\nIvan,25", ",")).toEqual([
        ["name", "age"],
        ["Alex", "36"],
        ["Ivan", "25"],
      ]);
    });

    it("поддерживает LF", () => {
      expect(parseCsv("name,age\nAlex,36", ",")).toEqual([
        ["name", "age"],
        ["Alex", "36"],
      ]);
    });
  });

  describe("Кавычки и специальные символы", () => {
    it("сохраняет разделитель внутри кавычек", () => {
      expect(parseCsv('name,comment\nAlex,"Excel, SQL, Python"', ",")).toEqual([
        ["name", "comment"],
        ["Alex", "Excel, SQL, Python"],
      ]);
    });

    it("обрабатывает экранированные кавычки", () => {
      expect(parseCsv('name,comment\nIvan,"Сказал: ""Привет"""', ",")).toEqual([
        ["name", "comment"],
        ["Ivan", 'Сказал: "Привет"'],
      ]);
    });

    it("сохраняет перенос строки внутри кавычек", () => {
      expect(
        parseCsv('name,comment\nMaria,"Первая строка\nВторая строка"', ","),
      ).toEqual([
        ["name", "comment"],
        ["Maria", "Первая строка\nВторая строка"],
      ]);
    });

    it("сохраняет CRLF внутри кавычек", () => {
      expect(parseCsv('name,comment\r\nMaria,"Первая\r\nВторая"', ",")).toEqual(
        [
          ["name", "comment"],
          ["Maria", "Первая\r\nВторая"],
        ],
      );
    });

    it("обрабатывает пустое значение в кавычках", () => {
      expect(parseCsv('name,comment\nAlex,""', ",")).toEqual([
        ["name", "comment"],
        ["Alex", ""],
      ]);
    });

    it("сохраняет Unicode", () => {
      expect(parseCsv("имя,город\nАлекс,Алматы", ",")).toEqual([
        ["имя", "город"],
        ["Алекс", "Алматы"],
      ]);
    });
  });

  describe("Пустые ячейки и строки", () => {
    it("сохраняет пустые ячейки", () => {
      expect(parseCsv("a,,c\n,2,", ",")).toEqual([
        ["a", "", "c"],
        ["", "2", ""],
      ]);
    });

    it("сохраняет пустую последнюю ячейку", () => {
      expect(parseCsv("a,b,\n1,2,", ",")).toEqual([
        ["a", "b", ""],
        ["1", "2", ""],
      ]);
    });

    it("не добавляет лишнюю строку после последнего переноса", () => {
      expect(parseCsv("a,b\n1,2\n", ",")).toEqual([
        ["a", "b"],
        ["1", "2"],
      ]);
    });

    it("сохраняет пустую строку между записями", () => {
      expect(parseCsv("a\n\nb", ",")).toEqual([["a"], [""], ["b"]]);
    });

    it("обрабатывает строку с одним значением", () => {
      expect(parseCsv("hello", ",")).toEqual([["hello"]]);
    });

    it("обрабатывает файл только с заголовком", () => {
      expect(parseCsv("name,age", ",")).toEqual([["name", "age"]]);
    });
  });

  describe("BOM и ошибки", () => {
    it("удаляет UTF-8 BOM в начале файла", () => {
      expect(parseCsv("\uFEFFname,age\nAlex,36", ",")).toEqual([
        ["name", "age"],
        ["Alex", "36"],
      ]);
    });
    it("отклоняет файл, содержащий только BOM", () => {
      expect(() => parseCsv("\uFEFF", ",")).toThrow("Добавьте CSV-текст.");
    });

    it("сохраняет пробелы в значении ячейки", () => {
      expect(parseCsv("   ,value", ",")).toEqual([["   ", "value"]]);
    });

    it("отклоняет пустой ввод", () => {
      expect(() => parseCsv("", ",")).toThrow("Добавьте CSV-текст.");
    });

    it("отклоняет незакрытую кавычку", () => {
      expect(() => parseCsv('name,comment\nAlex,"hello', ",")).toThrow(
        "незакрытая кавычка",
      );
    });

    it("отклоняет текст после закрывающей кавычки", () => {
      expect(() => parseCsv('name,comment\nAlex,"hello"world', ",")).toThrow();
    });

    it("отклоняет кавычку внутри некавыченного значения", () => {
      expect(() => parseCsv('name,comment\nAlex,hel"lo', ",")).toThrow();
    });
  });
});
