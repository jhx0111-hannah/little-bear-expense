import { createContext, useState, useCallback, type ReactNode } from 'react';
import type { Expense, Category } from '../types/expense';
import type { Asset } from '../types/asset';
import { useAuth } from '../hooks/useAuth';
import * as expensesApi from '../services/api/expenses';
import * as categoriesApi from '../services/api/categories';
import * as assetsApi from '../services/api/assets';

interface ExpenseState {
  expenses: Expense[];
  categories: Category[];
  assets: Asset[];
  loading: boolean;
  loadMonthData: (year: number, month: number) => Promise<void>;
  loadInitial: () => Promise<void>;
  addExpense: (input: expensesApi.AddExpenseInput) => Promise<Expense>;
  refreshAssets: () => Promise<void>;
}

export const ExpenseContext = createContext<ExpenseState | null>(null);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  const loadInitial = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    await categoriesApi.seedDefaultCategories(user.id);
    const [cats, assetList, recent] = await Promise.all([
      categoriesApi.fetchCategories(user.id),
      assetsApi.fetchAssets(user.id),
      expensesApi.fetchRecentExpenses(user.id, 5),
    ]);

    setCategories(cats);
    setAssets(assetList);
    setExpenses(recent);
    setLoading(false);
  }, [user]);

  const loadMonthData = useCallback(async (year: number, month: number) => {
    if (!user) return;
    const data = await expensesApi.fetchMonthExpenses(user.id, year, month);
    setExpenses(data);
  }, [user]);

  const addExpense = useCallback(async (input: expensesApi.AddExpenseInput): Promise<Expense> => {
    if (!user) throw new Error('未登录');

    const expense = await expensesApi.addExpense(user.id, input);

    // 自动扣减账户余额
    if (input.asset_id && input.type === 'expense') {
      await assetsApi.deductBalance(input.asset_id, user.id, input.amount);
    }
    if (input.asset_id && input.type === 'income') {
      await assetsApi.deductBalance(input.asset_id, user.id, -input.amount); // 负扣减 = 增加
    }

    // 更新本地列表
    setExpenses((prev) => [expense, ...prev]);
    setAssets((prev) =>
      prev.map((a) =>
        a.id === input.asset_id
          ? { ...a, balance: input.type === 'expense' ? a.balance - input.amount : a.balance + input.amount }
          : a
      )
    );

    return expense;
  }, [user]);

  const refreshAssets = useCallback(async () => {
    if (!user) return;
    const list = await assetsApi.fetchAssets(user.id);
    setAssets(list);
  }, [user]);

  return (
    <ExpenseContext.Provider value={{
      expenses, categories, assets, loading,
      loadMonthData, loadInitial, addExpense, refreshAssets,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}
