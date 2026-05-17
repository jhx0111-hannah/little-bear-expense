import { supabase } from '../../config/supabase';
import type { Expense } from '../../types/expense';

export interface AddExpenseInput {
  category_id: string;
  asset_id: string | null;
  amount: number;
  currency: string;
  type: 'expense' | 'income';
  description?: string;
  merchant?: string;
  expense_date: string;
  screenshot_url?: string;
  ai_recognized?: boolean;
}

export async function fetchMonthExpenses(userId: string, year: number, month: number): Promise<Expense[]> {
  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  const end = `${year}-${String(month).padStart(2, '0')}-31`;

  const { data, error } = await supabase
    .from('expenses')
    .select('*, category:categories(*), asset:assets(*)')
    .eq('user_id', userId)
    .gte('expense_date', start)
    .lte('expense_date', end)
    .order('expense_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchRecentExpenses(userId: string, limit = 5): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*, category:categories(*), asset:assets(*)')
    .eq('user_id', userId)
    .order('expense_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function addExpense(userId: string, input: AddExpenseInput): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .insert({ ...input, user_id: userId })
    .select('*, category:categories(*), asset:assets(*)')
    .single();

  if (error) throw error;
  return data;
}

export async function updateExpense(expenseId: string, userId: string, input: Partial<AddExpenseInput>): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .update(input)
    .eq('id', expenseId)
    .eq('user_id', userId)
    .select('*, category:categories(*), asset:assets(*)')
    .single();

  if (error) throw error;
  return data;
}

export async function deleteExpense(expenseId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', expenseId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function fetchRangeExpenses(userId: string, fromDate: string, toDate: string): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*, category:categories(*), asset:assets(*)')
    .eq('user_id', userId)
    .gte('expense_date', fromDate)
    .lte('expense_date', toDate)
    .order('expense_date', { ascending: true });

  if (error) throw error;
  return data;
}
