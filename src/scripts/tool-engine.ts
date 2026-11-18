import {
  calculatePercentage,
  calculateDiscount,
  calculateMarkupMargin,
} from "./tools/calculations";

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
  `<label class="field"><span>${f.label}</span><input name="${f.name}" type="${f.type || "text"}" value="${f.value ?? ""}" placeholder="${f.placeholder ?? ""}" ${f.min ? `min="${f.min}"` : ""} ${f.max ? `max="${f.max}"` : ""}></label>`;
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
      ["m", "Метры"],
      ["km", "Километры"],
      ["cm", "Сантиметры"],
      ["mm", "Миллиметры"],
    ],
    mass: [
      ["kg", "Килограммы"],
      ["g", "Граммы"],
      ["mg", "Миллиграммы"],
      ["t", "Тонны"],
    ],
    volume: [
      ["l", "Литры"],
      ["ml", "Миллилитры"],
      ["m3", "Кубические метры"],
    ],
    area: [
      ["m2", "Квадратные метры"],
      ["km2", "Квадратные километры"],
      ["cm2", "Квадратные сантиметры"],
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

  const num = (name: string) => Number(get(name));

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
          const kind = get("kind"),
            from = get("from"),
            to = get("to"),
            v = num("value");
          const factors: Record<string, Record<string, number>> = {
            length: { m: 1, km: 1000, cm: 0.01, mm: 0.001 },
            mass: { kg: 1, g: 0.001, mg: 0.000001, t: 1000 },
            volume: { l: 1, ml: 0.001, m3: 1000 },
            area: { m2: 1, km2: 1e6, cm2: 0.0001 },
          };
          const map = factors[kind];
          if (!map[from] || !map[to])
            throw Error(
              "Выберите совместимые единицы. Для выбранной величины доступен ограниченный набор единиц.",
            );
          result(`${fmt(v)} ${from} = ${fmt((v * map[from]) / map[to])} ${to}`);
          break;
        }
        case "temperature": {
          const v = num("value"),
            from = get("from"),
            to = get("to");
          let c =
            from === "C" ? v : from === "F" ? ((v - 32) * 5) / 9 : v - 273.15;
          const out =
            to === "C" ? c : to === "F" ? (c * 9) / 5 + 32 : c + 273.15;
          result(`${fmt(v)} °${from} = ${fmt(out)} °${to}`);
          break;
        }
        case "number-base": {
          const v = parseInt(get("value"), Number(get("from"))),
            to = Number(get("to"));
          if (Number.isNaN(v))
            throw Error("Число не соответствует исходной системе счисления.");
          result(v.toString(to).toUpperCase());
          break;
        }
        case "json-formatter": {
          const obj = JSON.parse(get("text"));
          result(
            get("mode") === "pretty"
              ? JSON.stringify(obj, null, 2)
              : JSON.stringify(obj),
          );
          break;
        }

        case "csv-viewer": {
          const sep =
            get("delimiter") === "semicolon"
              ? ";"
              : get("delimiter") === "tab"
                ? "\t"
                : ",";

          const rows = get("text")
            .split(/\r?\n/)
            .filter(Boolean)
            .map((line) => line.split(sep));

          if (!rows.length) throw Error("Добавьте CSV-текст.");

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
          const lines = get("text").split(/\r?\n/),
            unique = [...new Set(lines)];
          result(
            unique.join("\n") +
              `\n\nУдалено повторов: ${lines.length - unique.length}`,
          );
          break;
        }
        case "text-diff": {
          const a = new Set(get("a").split(/\r?\n/)),
            b = new Set(get("b").split(/\r?\n/));
          result(
            `Только в первом тексте:\n${[...a].filter((x) => !b.has(x)).join("\n") || "—"}\n\nТолько во втором тексте:\n${[...b].filter((x) => !a.has(x)).join("\n") || "—"}`,
          );
          break;
        }
        case "base64": {
          const text = get("text");

          if (get("mode") === "encode") {
            const bytes = new TextEncoder().encode(text);
            const binary = Array.from(bytes, (byte) =>
              String.fromCharCode(byte),
            ).join("");

            result(btoa(binary));
          } else {
            const binary = atob(text.trim());

            const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

            result(new TextDecoder().decode(bytes));
          }

          break;
        }
        case "uuid": {
          const n = Math.max(1, Math.min(100, Math.floor(num("count"))));
          result(
            Array.from({ length: n }, () => crypto.randomUUID()).join("\n"),
          );
          break;
        }
        case "password": {
          let chars = "";
          if (f.querySelector<HTMLInputElement>("[name=lower]")?.checked)
            chars += "abcdefghijklmnopqrstuvwxyz";
          if (f.querySelector<HTMLInputElement>("[name=upper]")?.checked)
            chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          if (f.querySelector<HTMLInputElement>("[name=numbers]")?.checked)
            chars += "0123456789";
          if (f.querySelector<HTMLInputElement>("[name=symbols]")?.checked)
            chars += "!@#$%^&*()-_=+[]{}";
          if (!chars) throw Error("Выберите хотя бы один набор символов.");
          const n = Math.max(8, Math.min(128, Math.floor(num("length"))));
          const bytes = crypto.getRandomValues(new Uint8Array(n));
          result([...bytes].map((b) => chars[b % chars.length]).join(""));
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
