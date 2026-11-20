import { describe, expect, it, vi } from "vitest";
import {
  generateUuids,
  MIN_UUID_COUNT,
  MAX_UUID_COUNT,
} from "../src/scripts/tools/uuid";

describe("generateUuids", () => {
  it("generates one UUID", () => {
    const createUuid = vi.fn(() => "uuid-1");

    expect(generateUuids(1, createUuid)).toEqual(["uuid-1"]);
    expect(createUuid).toHaveBeenCalledTimes(1);
  });

  it("generates the requested number of UUIDs", () => {
    let counter = 0;
    const createUuid = () => `uuid-${++counter}`;

    expect(generateUuids(5, createUuid)).toEqual([
      "uuid-1",
      "uuid-2",
      "uuid-3",
      "uuid-4",
      "uuid-5",
    ]);
  });

  it("supports the minimum count", () => {
    expect(generateUuids(MIN_UUID_COUNT, () => "uuid")).toHaveLength(1);
  });

  it("supports the maximum count", () => {
    expect(generateUuids(MAX_UUID_COUNT, () => "uuid")).toHaveLength(100);
  });

  it("rejects zero", () => {
    expect(() => generateUuids(0)).toThrow(
      "Количество UUID должно быть от 1 до 100.",
    );
  });

  it("rejects negative numbers", () => {
    expect(() => generateUuids(-1)).toThrow(
      "Количество UUID должно быть от 1 до 100.",
    );
  });

  it("rejects numbers above the maximum", () => {
    expect(() => generateUuids(101)).toThrow(
      "Количество UUID должно быть от 1 до 100.",
    );
  });

  it("rejects fractional numbers", () => {
    expect(() => generateUuids(2.5)).toThrow(
      "Количество UUID должно быть целым числом.",
    );
  });

  it("rejects NaN", () => {
    expect(() => generateUuids(Number.NaN)).toThrow(
      "Количество UUID должно быть целым числом.",
    );
  });

  it("rejects Infinity", () => {
    expect(() => generateUuids(Infinity)).toThrow(
      "Количество UUID должно быть целым числом.",
    );
  });

  it("does not generate UUIDs when count is invalid", () => {
    const createUuid = vi.fn(() => "uuid");

    expect(() => generateUuids(0, createUuid)).toThrow();
    expect(createUuid).not.toHaveBeenCalled();
  });
});
