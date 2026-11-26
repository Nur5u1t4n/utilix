import {
  calculatePercentage,
  calculateDiscount,
  calculateMarkupMargin,
} from "./tools/calculations";

import {
  convertUnit,
  convertTemperature,
  type UnitKind,
  type TemperatureUnit,
} from "./tools/converters";

import { convertBase } from "./tools/number-base";
import { formatJson } from "./tools/json-formatter";
import { parseCsv, type CsvDelimiter } from "./tools/csv-parser";
import { removeDuplicates } from "./tools/remove-duplicates";
import { convertBase64 } from "./tools/base64";
import { compareTexts } from "./tools/text-diff";
import { generateUuids } from "./tools/uuid";
import { generatePassword } from "./tools/password";
import { convertUrl } from "./tools/url-encoder";
import { countText } from "./tools/text-counter";

type Field = {
  name: string;
  label: string;
  type?: string;
  value?: string;
  placeholder?: string;
  min?: string;
  max?: string;
};
const $ = (selector: string, root: ParentNode = document) =>
  root.querySelector<HTMLElement>(selector);
const field = (f: Field) =>
  `<label class="field"><span>${f.label}</span><input name="${f.name}" type="${f.type || "text"}" step="${f.type === "number" ? "any" : "1"}" value="${f.value ?? ""}" placeholder="${f.placeholder ?? ""}" ${f.min ? `min="${f.min}"` : ""} ${f.max ? `max="${f.max}"` : ""}></label>`;
const select = (
  name: string,
  label: string,
  opts: [string, string][],
  value?: string,
) =>
  `<label class="field"><span>${label}</span><select name="${name}">${opts.map(([v, t]) => `<option value="${v}" ${v === value ? "selected" : ""}>${t}</option>`).join("")}</select></label>`;
const area = (
  name: string,
  label: string,
  placeholder = "Вставьте текст сюда...",
) =>
  `<label class="field field-full"><span>${label}</span><textarea name="${name}" rows="7" placeholder="${placeholder}"></textarea></label>`;
const button = (label = "Выполнить") =>
  `<button class="primary-button" type="submit">${label} →</button>`;
const group = (html: string) => `<form class="tool-fields">${html}</form>`;
function init(root: HTMLElement) {
  const id = root.dataset.tool || "";
  const isEnglish = root.dataset.language === "en";
  const translations: Record<string, string> = {
    "Число": "Number", "Процент (%)": "Percentage (%)", "Исходная цена": "Original price", "Скидка (%)": "Discount (%)", "Себестоимость": "Cost", "Цена продажи": "Sale price", "Величина": "Measurement", "Длина": "Length", "Масса": "Mass", "Объём": "Volume", "Площадь": "Area", "Значение": "Value", "Метры": "Metres", "Километры": "Kilometres", "Сантиметры": "Centimetres", "Миллиметры": "Millimetres", "Температура": "Temperature", "Цельсий": "Celsius", "Фаренгейт": "Fahrenheit", "Кельвин": "Kelvin", "Целое число": "Integer", "Исходная система": "Source base", "Целевая система": "Target base", "Действие": "Action", "Форматировать": "Format", "Сжать": "Minify", "JSON": "JSON", "Текст": "Text", "CSV-текст": "CSV text", "Разделитель": "Delimiter", "Запятая": "Comma", "Точка с запятой": "Semicolon", "Табуляция": "Tab", "Список строк": "Lines", "Первый текст": "First text", "Второй текст": "Second text", "Кодировать в Base64": "Encode as Base64", "Декодировать из Base64": "Decode Base64", "Количество UUID": "Number of UUIDs", "Длина пароля": "Password length", "Строчные": "Lowercase", "Заглавные": "Uppercase", "Цифры": "Numbers", "Символы": "Symbols", "Текст или URL": "Text or URL", "Рассчитать": "Calculate", "Рассчитать скидку": "Calculate discount", "Конвертировать": "Convert", "Проверить и преобразовать": "Validate and convert", "Показать таблицу": "Show table", "Удалить дубликаты": "Remove duplicates", "Сравнить": "Compare", "Выполнить": "Run", "Сгенерировать": "Generate", "Создать пароль": "Generate password", "Начните вводить или вставьте текст...": "Type or paste text...", "Вставьте текст сюда...": "Paste text here...", "Каждое значение — с новой строки": "Enter one value per line", "Статистика обновляется автоматически.": "Statistics update automatically.", "Результат появится здесь": "Your result will appear here", "Копировать результат": "Copy result", "Скопировано ✓": "Copied ✓", "Заполните поле": "Please fill in", "должно содержать корректное число.": "must be a valid number.", "Выберите хотя бы один набор символов.": "Select at least one character set.", "Температура не может быть ниже абсолютного нуля.": "Temperature cannot be below absolute zero.", "Введите корректное число.": "Enter a valid number.", "Удалено повторов:": "Duplicates removed:", "Добавлено строк:": "Lines added:", "Удалено строк:": "Lines removed:", "Тексты полностью совпадают.": "The texts are identical.", "Символов": "Characters", "Слов": "Words", "Строк": "Lines", "Без пробелов": "Without spaces", "не определяется (цена продажи равна нулю)": "undefined (sale price is zero)", "Исходная цена:": "Original price:", "Скидка:": "Discount:", "Сумма скидки:": "Discount amount:", "Итоговая цена:": "Final price:", "Валовая прибыль:": "Gross profit:", "Наценка:": "Markup:", "Маржа:": "Margin:", "не удалось выполнить операцию.": "Could not complete the operation.", "Неизвестный режим Base64.": "Unknown Base64 mode.", "Неизвестный режим URL-кодирования.": "Unknown URL encoding mode.", "Выберите корректный разделитель CSV.": "Choose a valid CSV delimiter.", "Выберите режим обработки JSON.": "Choose a JSON processing mode.", "После закрывающей кавычки допускается только разделитель или перенос строки.": "Only a delimiter or line break may follow a closing quote.", "Обнаружена незакрытая кавычка в CSV.": "Unclosed quote found in CSV.", "Кавычка внутри некавыченного значения CSV. Проверьте формат данных.": "A quote appears inside an unquoted CSV value. Check the data format.", "Введите значение для преобразования.": "Enter a value to convert.", "Неизвестная категория единиц.": "Unknown unit category.", "Неизвестная или несовместимая единица измерения.": "Unknown or incompatible unit.", "Результат выходит за пределы допустимого диапазона.": "The result is outside the supported range.", "Введите целое число.": "Enter an integer.", "Основание должно быть от 2 до 36.": "Base must be between 2 and 36.", "Некорректный JSON:": "Invalid JSON:", "Добавьте CSV-текст.": "Add CSV text.", "Введите текст для обработки.": "Enter text to process.", "Некорректный формат Base64.": "Invalid Base64 format.", "Некорректное URL-кодирование.": "Invalid URL encoding.", "не удалось получить случайные данные.": "Could not generate secure random data.", "не удалось создать пароль.": "Could not generate a password.",  "Миллилитры": "Millilitres", "Литры": "Litres", "Граммы": "Grams", "Килограммы": "Kilograms", "Кубические метры": "Cubic metres", "Чайные ложки": "Teaspoons", "Столовые ложки": "Tablespoons", "Чашки": "Cups", "Галлоны": "Gallons", "Гектары": "Hectares", "Акры": "Acres", "Форматирование": "Formatting", "Основание": "Base", "Заполните поле «": "Please fill in “", "». ": "”. ", " — ": " — ", "Генерировать": "Generate", "Преобразование": "Conversion", "миля": "mile", "дюйм": "inch", "фут": "foot", "ярд": "yard", "унция": "ounce", "фунт": "pound", "ч. л.": "tsp", "ст. л.": "tbsp", "чашка": "cup", "галлон": "gallon", "миллиметры": "millimetres", "сантиметры": "centimetres", "метры": "metres", "километры": "kilometres", "миллиграммы": "milligrams", "граммы": "grams", "килограммы": "kilograms", "тонны": "tonnes", "унции": "ounces", "фунты": "pounds", "миллилитры": "millilitres", "литры": "litres", "квадратные миллиметры": "square millimetres", "квадратные сантиметры": "square centimetres", "квадратные метры": "square metres", "квадратные километры": "square kilometres", "процента": "percent of", "от": "of",  "Количество UUID должно быть целым числом.": "The number of UUIDs must be an integer.", "Длина пароля должна быть целым числом.": "Password length must be an integer.", "должна быть от": "must be from", "символов.": "characters.", "Количество UUID должно быть от": "The number of UUIDs must be from", "Длина пароля должна быть от": "Password length must be from", "Укажите": "Enter", "Выберите": "Choose", "Должно содержать": "Must contain", "не может быть отрицательной.": "cannot be negative.", "должна быть от 0 до 100%.": "must be between 0 and 100%.", "должна быть больше нуля.": "must be greater than zero.", "поля": "field", "Неизвестная единица температуры.": "Unknown temperature unit.",  "Невозможно преобразовать число.": "Could not convert the number.", "Введите корректный формат": "Enter a valid format", "основание": "base", "символ": "character", "Скопировать результат": "Copy result", "Вставьте": "Paste", "Нажмите": "Select"
  };
  Object.assign(translations, {
    "Цена не может быть отрицательной.": "Price cannot be negative.",
    "Скидка должна быть от 0 до 100%.": "Discount must be between 0 and 100%.",
    "Себестоимость должна быть больше нуля.": "Cost must be greater than zero.",
    "Цена продажи не может быть отрицательной.": "Sale price cannot be negative.",
    "Введите корректное конечное число.": "Enter a valid finite number.",
    "Введите текст для кодирования.": "Enter text to encode.",
    "Введите Base64 для декодирования.": "Enter Base64 to decode.",
    "Некорректная строка Base64.": "Invalid Base64 string.",
    "Некорректные данные Base64 или UTF-8.": "Invalid Base64 or UTF-8 data.",
    "Длина пароля меньше количества выбранных наборов.": "Password length is less than the number of selected character sets.",
    "Система счисления должна иметь основание от 2 до 36.": "The base must be between 2 and 36.",
    "Введите корректное целое число.": "Enter a valid integer.",
    "Число содержит недопустимые символы.": "The number contains invalid characters.",
    "Вставьте JSON для обработки.": "Paste JSON to process.",
    "Некорректный JSON. Проверьте синтаксис и разделители.": "Invalid JSON. Check the syntax and separators.",
    "Добавьте текст для удаления дубликатов.": "Add text to remove duplicates.",
    "Введите корректное число.": "Enter a valid number.",
    "Поле «": "Field “",
    "» должно содержать корректное число.": "” must contain a valid number.",
  });
  const translate = (value: string) => {
    if (!isEnglish) return value;
    return Object.entries(translations).filter(([ru]) => ru.length > 4).sort(([a], [b]) => b.length - a.length).reduce((text, [ru, en]) => text.replaceAll(ru, en), value).replaceAll("Основание ", "Base ");
  };
  const form = $("#tool-form", root)!;
  const output = $("#tool-output", root)!;
  const actions = $("#tool-actions", root)!;
  const set = (html: string) => {
    output.innerHTML = html;
  };
  const result = (value: string) => {
    set(`<pre class="result-text"></pre>`);
    output.querySelector("pre")!.textContent = translate(value);
    actions.innerHTML = `<button class="secondary-button" id="copy-result" type="button">${translate("Копировать результат")}</button>`;
    $("#copy-result", actions)?.addEventListener("click", async () => {
      await navigator.clipboard.writeText(value);
      const b = $("#copy-result", actions);
      if (b) b.textContent = translate("Скопировано ✓");
    });
  };
  const configs: Record<string, string> = {
    percentage: group(
      field({ name: "number", label: "Число", type: "number", value: "2000" }) +
        field({
          name: "percent",
          label: "Процент (%)",
          type: "number",
          value: "15",
        }) +
        button("Рассчитать"),
    ),
    discount: group(
      field({
        name: "price",
        label: "Исходная цена",
        type: "number",
        value: "10000",
      }) +
        field({
          name: "discount",
          label: "Скидка (%)",
          type: "number",
          value: "15",
        }) +
        button("Рассчитать скидку"),
    ),
    "markup-margin": group(
      field({
        name: "cost",
        label: "Себестоимость",
        type: "number",
        value: "700",
      }) +
        field({
          name: "sale",
          label: "Цена продажи",
          type: "number",
          value: "1000",
        }) +
        button("Рассчитать"),
    ),
    units: group(
      select("kind", "Величина", [
        ["length", "Длина"],
        ["mass", "Масса"],
        ["volume", "Объём"],
        ["area", "Площадь"],
      ]) +
        field({
          name: "value",
          label: "Значение",
          type: "number",
          value: "1",
        }) +
        select("from", "Из", [
          ["m", "Метры"],
          ["km", "Километры"],
          ["cm", "Сантиметры"],
          ["mm", "Миллиметры"],
        ]) +
        select("to", "В", [
          ["km", "Километры"],
          ["m", "Метры"],
          ["cm", "Сантиметры"],
          ["mm", "Миллиметры"],
        ]) +
        button("Конвертировать"),
    ),
    temperature: group(
      field({
        name: "value",
        label: "Температура",
        type: "number",
        value: "0",
      }) +
        select("from", "Из", [
          ["C", "Цельсий"],
          ["F", "Фаренгейт"],
          ["K", "Кельвин"],
        ]) +
        select("to", "В", [
          ["F", "Фаренгейт"],
          ["C", "Цельсий"],
          ["K", "Кельвин"],
        ]) +
        button("Конвертировать"),
    ),
    "number-base": group(
      field({ name: "value", label: "Целое число", value: "255" }) +
        select(
          "from",
          "Исходная система",
          Array.from(
            { length: 35 },
            (_, i) => [String(i + 2), `Основание ${i + 2}`] as [string, string],
          ),
          "10",
        ) +
        select(
          "to",
          "Целевая система",
          Array.from(
            { length: 35 },
            (_, i) => [String(i + 2), `Основание ${i + 2}`] as [string, string],
          ),
          "16",
        ) +
        button("Конвертировать"),
    ),
    "json-formatter": group(
      area("text", "JSON") +
        select("mode", "Действие", [
          ["pretty", "Форматировать"],
          ["minify", "Сжать"],
        ]) +
        button("Проверить и преобразовать"),
    ),
    "csv-viewer": group(
      area("text", "CSV-текст") +
        select("delimiter", "Разделитель", [
          ["comma", "Запятая"],
          ["semicolon", "Точка с запятой"],
          ["tab", "Табуляция"],
        ]) +
        button("Показать таблицу"),
    ),
    "remove-duplicates": group(
      area("text", "Список строк", "Каждое значение — с новой строки") +
        button("Удалить дубликаты"),
    ),
    "text-diff": group(
      area("a", "Первый текст") +
        area("b", "Второй текст") +
        button("Сравнить"),
    ),
    base64: group(
      select("mode", "Действие", [
        ["encode", "Кодировать в Base64"],
        ["decode", "Декодировать из Base64"],
      ]) +
        area("text", "Текст") +
        button("Выполнить"),
    ),
    uuid: group(
      field({
        name: "count",
        label: "Количество UUID",
        type: "number",
        value: "5",
        min: "1",
        max: "100",
      }) + button("Сгенерировать"),
    ),
    password: group(
      field({
        name: "length",
        label: "Длина пароля",
        type: "number",
        value: "16",
        min: "8",
        max: "128",
      }) +
        `<div class="check-row"><label><input type="checkbox" name="lower" checked> Строчные</label><label><input type="checkbox" name="upper" checked> Заглавные</label><label><input type="checkbox" name="numbers" checked> Цифры</label><label><input type="checkbox" name="symbols"> Символы</label></div>` +
        button("Создать пароль"),
    ),
    "url-encoder": group(
      select("mode", "Действие", [
        ["encode", "Кодировать"],
        ["decode", "Декодировать"],
      ]) +
        area("text", "Текст или URL") +
        button("Выполнить"),
    ),
    "text-counter": group(
      area("text", "Текст", "Начните вводить или вставьте текст...") +
        `<p class="live-hint">Статистика обновляется автоматически.</p>`,
    ),
  };
  form.innerHTML = translate(configs[id] || "<p>Инструмент пока не настроен.</p>");
  const f = form.querySelector("form")!;
  const unitSets: Record<string, [string, string][]> = {
    length: [
      ["mm", "Миллиметры"],
      ["cm", "Сантиметры"],
      ["m", "Метры"],
      ["km", "Километры"],
      ["inch", "Дюймы"],
      ["ft", "Футы"],
      ["yard", "Ярды"],
      ["mile", "Мили"],
    ],
    mass: [
      ["mg", "Миллиграммы"],
      ["g", "Граммы"],
      ["kg", "Килограммы"],
      ["t", "Тонны"],
      ["oz", "Унции"],
      ["lb", "Фунты"],
    ],
    volume: [
      ["ml", "Миллилитры"],
      ["l", "Литры"],
      ["m3", "Кубические метры"],
      ["tsp", "Чайные ложки"],
      ["tbsp", "Столовые ложки"],
      ["cup", "Чашки"],
      ["gallon", "Галлоны"],
    ],
    area: [
      ["mm2", "Квадратные миллиметры"],
      ["cm2", "Квадратные сантиметры"],
      ["m2", "Квадратные метры"],
      ["km2", "Квадратные километры"],
      ["ha", "Гектары"],
      ["acre", "Акры"],
    ],
  };
  if (id === "units") {
    const kindSelect = f.querySelector<HTMLSelectElement>("[name=kind]")!;
    const updateUnits = () => {
      const opts = unitSets[kindSelect.value];
      for (const n of ["from", "to"]) {
        const el = f.querySelector<HTMLSelectElement>(`[name=${n}]`)!;
        el.innerHTML = opts
          .map(([v, t]) => `<option value="${v}">${translate(t)}</option>`)
          .join("");
      }
    };
    kindSelect.addEventListener("change", updateUnits);
  }

  const get = (name: string) => (new FormData(f).get(name) || "").toString();

  const requiredNum = (name: string, label: string) => {
    const raw = get(name).trim();

    if (!raw) {
      throw Error(`Заполните поле «${label}».`);
    }

    const value = Number(raw);

    if (!Number.isFinite(value)) {
      throw Error(`Поле «${label}» должно содержать корректное число.`);
    }

    return value;
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat(isEnglish ? "en-US" : "ru-RU", { maximumFractionDigits: 8 }).format(n);
  const unitLabels: Record<string, string> = {
    mm: "мм",
    cm: "см",
    m: "м",
    km: "км",
    inch: "дюйм",
    ft: "фут",
    yard: "ярд",
    mile: "миля",

    mg: "мг",
    g: "г",
    kg: "кг",
    t: "т",
    oz: "унция",
    lb: "фунт",

    ml: "мл",
    l: "л",
    m3: "м³",
    tsp: "ч. л.",
    tbsp: "ст. л.",
    cup: "чашка",
    gallon: "галлон",

    mm2: "мм²",
    cm2: "см²",
    m2: "м²",
    km2: "км²",
    ha: "га",
    acre: "акр",
  };
  if (isEnglish) {
    for (const [key, label] of Object.entries(unitLabels)) unitLabels[key] = translate(label);
  }

  const temperatureLabels: Record<string, string> = {
    c: "°C",
    f: "°F",
    k: "K",
  };

  const run = () => {
    try {
      switch (id) {
        case "percentage": {
          const n = requiredNum("number", "Число");
          const p = requiredNum("percent", "Процент");

          const { value } = calculatePercentage(n, p);

          result(`${fmt(p)}% ${isEnglish ? "of" : "от"} ${fmt(n)} = ${fmt(value)}`);
          break;
        }

        case "discount": {
          const p = requiredNum("price", "Исходная цена");
          const d = requiredNum("discount", "Скидка");

          const { discountAmount, finalPrice } = calculateDiscount(p, d);

          result(
            `Исходная цена: ${fmt(p)}\nСкидка: ${fmt(d)}%\nСумма скидки: ${fmt(discountAmount)}\nИтоговая цена: ${fmt(finalPrice)}`,
          );

          break;
        }

        case "markup-margin": {
          const c = requiredNum("cost", "Себестоимость");
          const s = requiredNum("sale", "Цена продажи");

          const { profit, markup, margin } = calculateMarkupMargin(c, s);

          result(
            `Себестоимость: ${fmt(c)}\nЦена продажи: ${fmt(s)}\nВаловая прибыль: ${fmt(profit)}\nНаценка: ${fmt(markup)}%\nМаржа: ${margin === null ? "не определяется (цена продажи равна нулю)" : `${fmt(margin)}%`}`,
          );

          break;
        }

        case "units": {
          const kind = get("kind") as UnitKind;
          const from = get("from");
          const to = get("to");
          const value = requiredNum("value", "Значение");

          const converted = convertUnit(value, kind, from, to);

          result(
            `${fmt(value)} ${unitLabels[from]} = ${fmt(converted)} ${unitLabels[to]}`,
          );

          break;
        }

        case "temperature": {
          const value = requiredNum("value", "Температура");
          const from = get("from").toLowerCase() as TemperatureUnit;
          const to = get("to").toLowerCase() as TemperatureUnit;

          const converted = convertTemperature(value, from, to);

          result(
            `${fmt(value)} ${temperatureLabels[from]} = ${fmt(converted)} ${temperatureLabels[to]}`,
          );

          break;
        }

        case "number-base": {
          const value = get("value");
          const from = Number(get("from"));
          const to = Number(get("to"));

          result(convertBase(value, from, to));
          break;
        }

        case "json-formatter": {
          const mode = get("mode");

          if (mode !== "pretty" && mode !== "minify") {
            throw new Error("Выберите режим обработки JSON.");
          }

          result(formatJson(get("text"), mode));
          break;
        }

        case "csv-viewer": {
          const delimiterMap: Record<string, CsvDelimiter> = {
            comma: ",",
            semicolon: ";",
            tab: "\t",
          };

          const delimiter = delimiterMap[get("delimiter")];

          if (!delimiter) {
            throw new Error("Выберите корректный разделитель CSV.");
          }

          const rows = parseCsv(get("text"), delimiter);

          set(
            `<div class="table-wrap"><table class="csv-table">${rows
              .map(
                (r, i) =>
                  `<tr>${r
                    .map(
                      () =>
                        `<${i === 0 ? "th" : "td"}></${i === 0 ? "th" : "td"}>`,
                    )
                    .join("")}</tr>`,
              )
              .join("")}</table></div>`,
          );

          [...output.querySelectorAll("tr")].forEach((tr, i) =>
            [...tr.children].forEach(
              (cell, j) => (cell.textContent = rows[i][j]),
            ),
          );

          actions.innerHTML = "";
          break;
        }

        case "remove-duplicates": {
          const { result: text, removed } = removeDuplicates(get("text"));

          result(`${text}\n\nУдалено повторов: ${removed}`);
          break;
        }

        case "text-diff": {
          const operations = compareTexts(get("a"), get("b"));

          const added = operations.filter((item) => item.type === "add").length;
          const removed = operations.filter(
            (item) => item.type === "remove",
          ).length;

          const lines = operations.map((item) => {
            const prefix =
              item.type === "add" ? "+ " : item.type === "remove" ? "- " : "  ";

            return `${prefix}${item.value}`;
          });

          const summary = `Добавлено строк: ${added}\nУдалено строк: ${removed}`;

          result(
            `${summary}\n\n${lines.length > 0 ? lines.join("\n") : "Тексты полностью совпадают."}`,
          );

          break;
        }

        case "base64": {
          const text = get("text");
          const mode = get("mode");

          if (mode !== "encode" && mode !== "decode") {
            throw new Error("Неизвестный режим Base64.");
          }

          result(convertBase64(text, mode));

          break;
        }

        case "uuid": {
          const count = requiredNum("count", "Количество UUID");
          result(generateUuids(count).join("\n"));
          break;
        }

        case "password": {
          const length = requiredNum("length", "Длина пароля");

          const password = generatePassword({
            length,
            lower:
              f.querySelector<HTMLInputElement>("[name=lower]")?.checked ??
              false,
            upper:
              f.querySelector<HTMLInputElement>("[name=upper]")?.checked ??
              false,
            numbers:
              f.querySelector<HTMLInputElement>("[name=numbers]")?.checked ??
              false,
            symbols:
              f.querySelector<HTMLInputElement>("[name=symbols]")?.checked ??
              false,
          });

          result(password);
          break;
        }

        case "url-encoder": {
          const mode = get("mode");

          if (mode !== "encode" && mode !== "decode") {
            throw new Error("Неизвестный режим URL-кодирования.");
          }

          result(convertUrl(get("text"), mode));
          break;
        }
      }
    } catch (e) {
      set(`<p class="error-message"></p>`);
      output.querySelector(".error-message")!.textContent =
        translate(e instanceof Error ? e.message : "Не удалось выполнить операцию.");
      actions.innerHTML = "";
    }
  };
  if (id === "text-counter") {
    const ta = f.querySelector("textarea")!;

    const update = () => {
      const stats = countText(ta.value);

      set(
        `<div class="stats-grid">
        <div><strong>${stats.characters}</strong><span>Символов</span></div>
        <div><strong>${stats.words}</strong><span>Слов</span></div>
        <div><strong>${stats.lines}</strong><span>Строк</span></div>
        <div><strong>${stats.charactersWithoutWhitespace}</strong><span>Без пробелов</span></div>
      </div>`,
      );
    };

    ta.addEventListener("input", update);
    update();
  } else
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      run();
    });
}
document.querySelectorAll<HTMLElement>(".tool-runner").forEach(init);
