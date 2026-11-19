export const MIN_UUID_COUNT = 1;
export const MAX_UUID_COUNT = 100;

export function generateUuids(
  count: number,
  createUuid: () => string = () => crypto.randomUUID(),
): string[] {
  if (!Number.isInteger(count)) {
    throw new Error("Количество UUID должно быть целым числом.");
  }

  if (count < MIN_UUID_COUNT || count > MAX_UUID_COUNT) {
    throw new Error(
      `Количество UUID должно быть от ${MIN_UUID_COUNT} до ${MAX_UUID_COUNT}.`,
    );
  }

  return Array.from({ length: count }, createUuid);
}
