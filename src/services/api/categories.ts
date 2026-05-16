import { supabase } from '../../config/supabase';
import type { Category } from '../../types/expense';

const DEFAULT_EXPENSE_CATEGORIES = [
  { name: '餐饮', icon: '🍜', color: '#c4a8a8', sort_order: 1 },
  { name: '交通', icon: '🚌', color: '#b5a9b0', sort_order: 2 },
  { name: '购物', icon: '🛒', color: '#a8b5c4', sort_order: 3 },
  { name: '娱乐', icon: '🎮', color: '#b5c4b1', sort_order: 4 },
  { name: '学习', icon: '📚', color: '#d4c9b8', sort_order: 5 },
  { name: '医疗', icon: '🏥', color: '#c4a8a8', sort_order: 6 },
  { name: '住房', icon: '🏠', color: '#b5a9b0', sort_order: 7 },
  { name: '其他支出', icon: '📦', color: '#a3b5a6', sort_order: 8 },
];

const DEFAULT_INCOME_CATEGORIES = [
  { name: '工资', icon: '💰', color: '#a3b5a6', sort_order: 1 },
  { name: '兼职', icon: '💵', color: '#b5c4b1', sort_order: 2 },
  { name: '红包', icon: '🧧', color: '#c4a8a8', sort_order: 3 },
  { name: '其他收入', icon: '📥', color: '#b5a9b0', sort_order: 4 },
];

export async function fetchCategories(userId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('sort_order');

  if (error) throw error;
  return data;
}

export async function seedDefaultCategories(userId: string): Promise<void> {
  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('user_id', userId)
    .limit(1);

  if (existing && existing.length > 0) return;

  const allCategories = [
    ...DEFAULT_EXPENSE_CATEGORIES.map((c) => ({ ...c, user_id: userId, type: 'expense' })),
    ...DEFAULT_INCOME_CATEGORIES.map((c) => ({ ...c, user_id: userId, type: 'income' })),
  ];

  const { error } = await supabase.from('categories').insert(allCategories);
  if (error) throw error;
}

export async function addCategory(userId: string, cat: {
  name: string; icon: string; color: string; type: string;
}): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert({ ...cat, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
}
