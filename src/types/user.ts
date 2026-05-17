import type { Currency } from './expense';

/** 用户资料 */
export interface Profile {
  id: string;
  display_name: string;
  base_currency: Currency;
  custom_currencies: string[] | null;
  avatar_url: string | null;
  monthly_budget: number | null;
  created_at: string;
  updated_at: string;
}
