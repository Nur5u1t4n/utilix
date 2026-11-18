import { describe, expect, it } from "vitest";
import {
  convertTemperature,
  convertUnit,
} from "../src/scripts/tools/converters";

describe("convertUnit", () => {
  it("converts kilometers to meters", () => {
    expect(convertUnit(2, "length", "km", "m")).toBe(2000);
  });

  it("converts centimeters to inches", () => {
    expect(convertUnit(2.54, "length", "cm", "inch")).toBeCloseTo(1, 10);
  });

  it("converts kilograms to pounds", () => {
    expect(convertUnit(1, "mass", "kg", "lb")).toBeCloseTo(2.20462262, 7);
  });

  it("converts liters to milliliters", () => {
    expect(convertUnit(1.5, "volume", "l", "ml")).toBe(1500);
  });

  it("converts square meters to square centimeters", () => {
    expect(convertUnit(1, "area", "m2", "cm2")).toBe(10000);
  });

  it("supports negative values", () => {
    expect(convertUnit(-5, "length", "m", "cm")).toBe(-500);
  });

  it("returns the same value for identical units", () => {
    expect(convertUnit(42, "mass", "kg", "kg")).toBe(42);
  });

  it("rejects unknown units", () => {
    expect(() => convertUnit(1, "length", "kg", "m")).toThrow(
      "Неизвестная или несовместимая единица измерения.",
    );
  });

  it("rejects non-finite values", () => {
    expect(() => convertUnit(Number.NaN, "length", "m", "cm")).toThrow();
    expect(() =>
      convertUnit(Number.POSITIVE_INFINITY, "length", "m", "cm"),
    ).toThrow();
  });

  it("rejects overflow", () => {
    expect(() => convertUnit(Number.MAX_VALUE, "length", "km", "mm")).toThrow(
      "Результат выходит за пределы допустимого диапазона.",
    );
  });
});

describe("convertTemperature", () => {
  it("converts Celsius to Fahrenheit", () => {
    expect(convertTemperature(0, "c", "f")).toBe(32);
  });

  it("converts Fahrenheit to Celsius", () => {
    expect(convertTemperature(212, "f", "c")).toBeCloseTo(100, 10);
  });

  it("converts Celsius to Kelvin", () => {
    expect(convertTemperature(0, "c", "k")).toBe(273.15);
  });

  it("converts Kelvin to Celsius", () => {
    expect(convertTemperature(273.15, "k", "c")).toBe(0);
  });

  it("converts Fahrenheit to Kelvin", () => {
    expect(convertTemperature(32, "f", "k")).toBeCloseTo(273.15, 10);
  });

  it("accepts absolute zero", () => {
    expect(convertTemperature(-273.15, "c", "k")).toBe(0);
  });

  it("rejects temperatures below absolute zero", () => {
    expect(() => convertTemperature(-273.16, "c", "k")).toThrow(
      "Температура не может быть ниже абсолютного нуля.",
    );
  });

  it("rejects negative Kelvin", () => {
    expect(() => convertTemperature(-1, "k", "c")).toThrow();
  });

  it("rejects non-finite values", () => {
    expect(() => convertTemperature(Number.NaN, "c", "f")).toThrow();
    expect(() =>
      convertTemperature(Number.POSITIVE_INFINITY, "c", "f"),
    ).toThrow();
  });

  it("rejects unknown temperature units", () => {
    expect(() => convertTemperature(10, "x" as "c", "f")).toThrow(
      "Неизвестная единица температуры.",
    );
  });

  it("normalizes negative zero", () => {
    expect(Object.is(convertTemperature(0, "c", "c"), -0)).toBe(false);
  });
});
