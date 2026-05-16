import type { Currency } from '../types/expense';

export function formatCurrency(amount: number, currency: Currency): string {
  if (currency === 'CNY') return `¥${amount.toFixed(2)}`;
  if (currency === 'EUR') return `€${amount.toFixed(2)}`;
  return `${amount.toFixed(2)}`;
}
