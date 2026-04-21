export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function percent(value: number, total: number): number {
  if (!total || total <= 0) {
    return 0;
  }
  return Math.min(100, Math.round((value / total) * 100));
}
