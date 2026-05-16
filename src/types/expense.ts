/** 分类类型 */
export type CategoryType = 'expense' | 'income';

/** 货币类型 */
export type Currency = 'CNY' | 'EUR';

/** 交易类型 */
export type TransactionType = 'expense' | 'income';

/** 分类 */
export interface Category {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
  sort_order: number;
  created_at: string;
}

/** 流水记录 */
export interface Expense {
  id: string;
  user_id: string;
  category_id: string | null;
  asset_id: string | null;
  amount: number;
  currency: Currency;
  type: TransactionType;
  description: string | null;
  merchant: string | null;
  expense_date: string;
  screenshot_url: string | null;
  ai_recognized: boolean;
  created_at: string;
  updated_at: string;
  // 关联数据（JOIN后填充）
  category?: Category;
  asset?: Asset;
}

/** AI识别结果 */
export interface AIRecognitionResult {
  amount: number | null;
  currency: Currency | null;
  merchant: string | null;
  category: string | null;
  date: string | null;
  description: string | null;
  confidence: number;
}
