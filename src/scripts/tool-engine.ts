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
  const form = $("#tool-form", root)!;
  const output = $("#tool-output", root)!;
  const actions = $("#tool-actions", root)!;
  const set = (html: string) => {
    output.innerHTML = html;
  };
  const result = (value: string) => {
    set(`<pre class="result-text"></pre>`);
    output.querySelector("pre")!.textContent = value;
    actions.innerHTML = `<button class="secondary-button" id="copy-result" type="button">Копировать результат</button>`;
    $("#copy-result", actions)?.addEventListener("click", async () => {
      await navigator.clipboard.writeText(value);
      const b = $("#copy-result", actions);
      if (b) b.textContent = "Скопировано ✓";
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
  form.innerHTML = configs[id] || "<p>Инструмент пока не настроен.</p>";
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
          .map(([v, t]) => `<option value="${v}">${t}</option>`)
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
    new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 8 }).format(n);
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

          result(`${fmt(p)}% от ${fmt(n)} = ${fmt(value)}`);
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

        case "url-encoder":
          result(
            get("mode") === "encode"
              ? encodeURIComponent(get("text"))
              : decodeURIComponent(get("text")),
          );
          break;
      }
    } catch (e) {
      set(`<p class="error-message"></p>`);
      output.querySelector(".error-message")!.textContent =
        e instanceof Error ? e.message : "Не удалось выполнить операцию.";
      actions.innerHTML = "";
    }
  };
  if (id === "text-counter") {
    const ta = f.querySelector("textarea")!;
    const update = () => {
      const t = ta.value;
      set(
        `<div class="stats-grid"><div><strong>${t.length}</strong><span>Символов</span></div><div><strong>${t.trim() ? t.trim().split(/\s+/).length : 0}</strong><span>Слов</span></div><div><strong>${t ? t.split(/\r?\n/).length : 0}</strong><span>Строк</span></div><div><strong>${t.split(/\s/).filter(Boolean).length}</strong><span>Без пробелов</span></div></div>`,
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
