import { useContext } from 'react';
import { ExpenseContext } from '../contexts/ExpenseContext';

export function useExpenses() {
  const ctx = useContext(ExpenseContext);
  if (!ctx) {
    throw new Error('useExpenses 必须在 ExpenseProvider 内部使用');
  }
  return ctx;
}
