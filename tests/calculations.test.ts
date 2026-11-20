import { describe, it, expect } from "vitest";

import {
  calculatePercentage,
  calculateDiscount,
  calculateMarkupMargin,
} from "../src/scripts/tools/calculations";

// ==========================================
// КАЛЬКУЛЯТОР ПРОЦЕНТОВ
// ==========================================

describe("Калькулятор процентов", () => {
  it("вычисляет процент от числа", () => {
    expect(calculatePercentage(200, 15).value).toBe(30);
  });

  it("работает с отрицательными числами", () => {
    expect(calculatePercentage(-200, 10).value).toBe(-20);
  });

  it("отклоняет некорректные значения", () => {
    expect(() => calculatePercentage(NaN, 10)).toThrow();
    expect(() => calculatePercentage(Infinity, 10)).toThrow();
  });
});

// ==========================================
// КАЛЬКУЛЯТОР СКИДОК
// ==========================================

describe("Калькулятор скидок", () => {
  it("правильно рассчитывает скидку", () => {
    expect(calculateDiscount(1000, 20)).toEqual({
      discountAmount: 200,
      finalPrice: 800,
    });
  });

  it("обрабатывает скидку 100%", () => {
    expect(calculateDiscount(500, 100).finalPrice).toBe(0);
  });

  it("отклоняет скидку больше 100%", () => {
    expect(() => calculateDiscount(1000, 101)).toThrow();
  });

  it("отклоняет отрицательную цену", () => {
    expect(() => calculateDiscount(-100, 10)).toThrow();
  });
});

// ==========================================
// КАЛЬКУЛЯТОР НАЦЕНКИ И МАРЖИ
// ==========================================

describe("Калькулятор наценки и маржи", () => {
  it("правильно рассчитывает прибыль, наценку и маржу", () => {
    const result = calculateMarkupMargin(100, 150);

    expect(result.profit).toBe(50);
    expect(result.markup).toBe(50);
    expect(result.margin).toBeCloseTo(100 / 3, 10);
  });

  it("правильно рассчитывает убыток", () => {
    expect(calculateMarkupMargin(100, 80)).toEqual({
      profit: -20,
      markup: -20,
      margin: -25,
    });
  });

  it("не определяет маржу при нулевой цене продажи", () => {
    expect(calculateMarkupMargin(100, 0)).toEqual({
      profit: -100,
      markup: -100,
      margin: null,
    });
  });

  it("отклоняет нулевую себестоимость", () => {
    expect(() => calculateMarkupMargin(0, 100)).toThrow();
  });
});
