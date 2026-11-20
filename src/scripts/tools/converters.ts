export type UnitKind = "length" | "mass" | "volume" | "area";

const UNIT_FACTORS: Record<UnitKind, Record<string, number>> = {
  length: {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    inch: 0.0254,
    ft: 0.3048,
    yard: 0.9144,
    mile: 1609.344,
  },
  mass: {
    mg: 0.000001,
    g: 0.001,
    kg: 1,
    t: 1000,
    oz: 0.028349523125,
    lb: 0.45359237,
  },
  volume: {
    ml: 0.001,
    l: 1,
    m3: 1000,
    tsp: 0.00492892159375,
    tbsp: 0.01478676478125,
    cup: 0.2365882365,
    gallon: 3.785411784,
  },
  area: {
    mm2: 0.000001,
    cm2: 0.0001,
    m2: 1,
    km2: 1_000_000,
    ha: 10_000,
    acre: 4046.8564224,
  },
};

function validateFinite(value: number): void {
  if (!Number.isFinite(value)) {
    throw new Error("Введите корректное конечное число.");
  }
}

function validateResult(value: number): void {
  if (!Number.isFinite(value)) {
    throw new Error("Результат выходит за пределы допустимого диапазона.");
  }
}

export function convertUnit(
  value: number,
  kind: UnitKind,
  from: string,
  to: string,
): number {
  validateFinite(value);

  const units = UNIT_FACTORS[kind];

  if (!units) {
    throw new Error("Неизвестная категория единиц.");
  }

  const fromFactor = units[from];
  const toFactor = units[to];

  if (fromFactor === undefined || toFactor === undefined) {
    throw new Error("Неизвестная или несовместимая единица измерения.");
  }

  const result = (value * fromFactor) / toFactor;
  validateResult(result);

  return result;
}

export type TemperatureUnit = "c" | "f" | "k";

export function convertTemperature(
  value: number,
  from: TemperatureUnit,
  to: TemperatureUnit,
): number {
  validateFinite(value);

  const validUnits = ["c", "f", "k"];

  if (!validUnits.includes(from) || !validUnits.includes(to)) {
    throw new Error("Неизвестная единица температуры.");
  }

  let celsius: number;

  switch (from) {
    case "c":
      celsius = value;
      break;
    case "f":
      celsius = (value - 32) * (5 / 9);
      break;
    case "k":
      celsius = value - 273.15;
      break;
  }

  if (celsius < -273.15 - 1e-10) {
    throw new Error("Температура не может быть ниже абсолютного нуля.");
  }

  if (Math.abs(celsius + 273.15) < 1e-10) {
    celsius = -273.15;
  }

  let result: number;

  switch (to) {
    case "c":
      result = celsius;
      break;
    case "f":
      result = (celsius * 9) / 5 + 32;
      break;
    case "k":
      result = celsius + 273.15;
      break;
  }

  validateResult(result);

  return Object.is(result, -0) ? 0 : result;
}
