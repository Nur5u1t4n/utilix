function validateNumber(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`Поле «${label}» должно содержать корректное число.`);
  }
}

function validateResult(...values: number[]): void {
  if (!values.every(Number.isFinite)) {
    throw new Error("Результат выходит за пределы допустимого диапазона.");
  }
}

export function calculatePercentage(number: number, percent: number) {
  validateNumber(number, "Число");
  validateNumber(percent, "Процент");

  const value = (number * percent) / 100;
  validateResult(value);

  return { value };
}

export function calculateDiscount(price: number, discount: number) {
  validateNumber(price, "Исходная цена");
  validateNumber(discount, "Скидка");

  if (price < 0) {
    throw new Error("Цена не может быть отрицательной.");
  }

  if (discount < 0 || discount > 100) {
    throw new Error("Скидка должна быть от 0 до 100%.");
  }

  const discountAmount = (price * discount) / 100;
  const finalPrice = price - discountAmount;

  validateResult(discountAmount, finalPrice);

  return { discountAmount, finalPrice };
}

export function calculateMarkupMargin(cost: number, sale: number) {
  validateNumber(cost, "Себестоимость");
  validateNumber(sale, "Цена продажи");

  if (cost <= 0) {
    throw new Error("Себестоимость должна быть больше нуля.");
  }

  if (sale < 0) {
    throw new Error("Цена продажи не может быть отрицательной.");
  }

  const profit = sale - cost;
  const markup = (profit / cost) * 100;
  const margin = sale === 0 ? null : (profit / sale) * 100;

  validateResult(profit, markup);

  if (margin !== null) {
    validateResult(margin);
  }

  return { profit, markup, margin };
}
