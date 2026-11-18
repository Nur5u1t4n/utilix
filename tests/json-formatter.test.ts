import { describe, it, expect } from "vitest";
import { formatJson } from "../src/scripts/tools/json-formatter";

describe("JSON Formatter", () => {
  describe("Форматирование", () => {
    it("форматирует простой объект", () => {
      const input = '{"name":"Nursultan","age":36}';

      expect(formatJson(input, "pretty")).toBe(
        '{\n  "name": "Nursultan",\n  "age": 36\n}',
      );
    });

    it("форматирует вложенные объекты", () => {
      const input = '{"user":{"name":"Alex","active":true}}';

      expect(formatJson(input, "pretty")).toBe(
        '{\n  "user": {\n    "name": "Alex",\n    "active": true\n  }\n}',
      );
    });

    it("форматирует массивы", () => {
      const input = '{"numbers":[1,2,3]}';

      expect(formatJson(input, "pretty")).toBe(
        '{\n  "numbers": [\n    1,\n    2,\n    3\n  ]\n}',
      );
    });

    it("обрабатывает пустые объекты и массивы", () => {
      const input = '{"object":{},"array":[]}';

      expect(formatJson(input, "pretty")).toBe(
        '{\n  "object": {},\n  "array": []\n}',
      );
    });

    it("обрабатывает вложенные массивы и объекты", () => {
      const input = '{"items":[{"id":1},{"id":2}]}';

      expect(formatJson(input, "pretty")).toBe(
        '{\n  "items": [\n    {\n      "id": 1\n    },\n    {\n      "id": 2\n    }\n  ]\n}',
      );
    });
  });

  describe("Минификация", () => {
    it("удаляет лишние пробелы", () => {
      const input = '{ "name" : "Alex", "age" : 25 }';

      expect(formatJson(input, "minify")).toBe('{"name":"Alex","age":25}');
    });

    it("минифицирует вложенные структуры", () => {
      const input = '{ "items" : [ { "id" : 1 }, { "id" : 2 } ] }';

      expect(formatJson(input, "minify")).toBe('{"items":[{"id":1},{"id":2}]}');
    });
  });

  describe("Сохранность данных", () => {
    it("не теряет точность больших целых чисел", () => {
      const input = '{"id":9007199254740993}';

      expect(formatJson(input, "minify")).toBe('{"id":9007199254740993}');
    });

    it("сохраняет точность очень больших чисел", () => {
      const input = '{"value":123456789012345678901234567890}';

      expect(formatJson(input, "minify")).toBe(
        '{"value":123456789012345678901234567890}',
      );
    });

    it("сохраняет формат записи десятичных чисел", () => {
      const input = '{"value":1.2300e+10}';

      expect(formatJson(input, "minify")).toBe('{"value":1.2300e+10}');
    });

    it("сохраняет Unicode", () => {
      const input = '{"message":"Привет, мир! 🌍"}';

      expect(formatJson(input, "minify")).toBe('{"message":"Привет, мир! 🌍"}');
    });

    it("сохраняет кавычки и экранированные символы внутри строк", () => {
      const input = '{"text":"Он сказал: \\"Привет\\"\\\\путь"}';

      expect(formatJson(input, "minify")).toBe(input);
    });

    it("сохраняет значения null и boolean", () => {
      const input = '{"a":null,"b":true,"c":false}';

      expect(formatJson(input, "minify")).toBe('{"a":null,"b":true,"c":false}');
    });
  });

  describe("Проверка ошибок", () => {
    it("отклоняет пустой ввод", () => {
      expect(() => formatJson("", "pretty")).toThrow(
        "Вставьте JSON для обработки.",
      );

      expect(() => formatJson("   ", "minify")).toThrow(
        "Вставьте JSON для обработки.",
      );
    });

    it("отклоняет некорректный JSON", () => {
      expect(() => formatJson('{"name":}', "pretty")).toThrow(
        "Некорректный JSON.",
      );
    });

    it("отклоняет лишнюю запятую", () => {
      expect(() => formatJson('{"a":1,}', "pretty")).toThrow();
    });

    it("отклоняет незакрытые структуры", () => {
      expect(() => formatJson('{"a":[1,2}', "pretty")).toThrow();
    });

    it("отклоняет одинарные кавычки", () => {
      expect(() => formatJson("{'name':'Alex'}", "pretty")).toThrow();
    });
  });
  describe("Корневые значения", () => {
    it("обрабатывает отдельное число", () => {
      expect(formatJson("12345", "pretty")).toBe("12345");
    });

    it("обрабатывает boolean", () => {
      expect(formatJson("true", "pretty")).toBe("true");
    });

    it("обрабатывает null", () => {
      expect(formatJson("null", "minify")).toBe("null");
    });

    it("форматирует корневой массив", () => {
      expect(formatJson("[1,2,3]", "pretty")).toBe("[\n  1,\n  2,\n  3\n]");
    });

    it("сохраняет пробелы внутри строк", () => {
      expect(formatJson('{"text":"  hello  world  "}', "minify")).toBe(
        '{"text":"  hello  world  "}',
      );
    });
  });
});
