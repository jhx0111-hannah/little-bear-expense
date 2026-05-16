import type { Currency } from './expense';

/** 账户类型 */
export type AssetType = 'bank' | 'cash' | 'alipay' | 'wechat' | 'other';

/** 账户 */
export interface Asset {
  id: string;
  user_id: string;
  name: string;
  type: AssetType;
  currency: Currency;
  balance: number;
  icon: string;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** 银行预设 */
export interface BankPreset {
  name: string;
  type: AssetType;
  icon: string;
  recommendedCurrency: Currency;
}

export const BANK_PRESETS: BankPreset[] = [
  { name: 'ING', type: 'bank', icon: '🏦', recommendedCurrency: 'EUR' },
  { name: 'Revolut', type: 'bank', icon: '💳', recommendedCurrency: 'EUR' },
  { name: 'Deutsche Bank', type: 'bank', icon: '🏦', recommendedCurrency: 'EUR' },
  { name: '支付宝', type: 'alipay', icon: '📱', recommendedCurrency: 'CNY' },
  { name: '微信支付', type: 'wechat', icon: '💬', recommendedCurrency: 'CNY' },
  { name: '招商银行', type: 'bank', icon: '🏛️', recommendedCurrency: 'CNY' },
  { name: '工商银行', type: 'bank', icon: '🏛️', recommendedCurrency: 'CNY' },
  { name: '中国银行', type: 'bank', icon: '🏛️', recommendedCurrency: 'CNY' },
  { name: '现金', type: 'cash', icon: '💵', recommendedCurrency: 'EUR' },
];
