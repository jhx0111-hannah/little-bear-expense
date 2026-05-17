import { useState, useEffect, useMemo } from 'react';
import { fetchRangeExpenses, deleteExpense } from '../services/api/expenses';
import { useAuth } from '../hooks/useAuth';
import type { Expense } from '../types/expense';
import { getCurrencySymbol } from '../utils/currencies';
import ExpenseCard from '../components/expense/ExpenseCard';
import ExpenseEditModal from '../components/expense/ExpenseEditModal';
import styles from './HistoryPage.module.css';

export default function HistoryPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [search, setSearch] = useState('');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const fetchData = () => {
    if (!user) return;
    setLoading(true);
    const lastDay = new Date(year, month, 0).getDate();
    const from = `${year}-${String(month).padStart(2, '0')}-01`;
    const to = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    fetchRangeExpenses(user.id, from, to)
      .then(setExpenses)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [user, year, month]);

  const filtered = useMemo(() => {
    if (!search.trim()) return expenses;
    const q = search.toLowerCase();
    return expenses.filter((e) =>
      (e.category?.name || '').includes(q) ||
      (e.merchant || '').toLowerCase().includes(q) ||
      (e.description || '').toLowerCase().includes(q)
    );
  }, [expenses, search]);

  const totalsByCurrency = useMemo(() => {
    const map = new Map<string, { expense: number; income: number }>();
    filtered.forEach((e) => {
      const cur = map.get(e.currency) || { expense: 0, income: 0 };
      if (e.type === 'expense') cur.expense += Number(e.amount);
      else cur.income += Number(e.amount);
      map.set(e.currency, cur);
    });
    return map;
  }, [filtered]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>流水明细</h1>

      <div className={styles.monthBar}>
        <button className={styles.navBtn} onClick={() => {
          if (month === 1) { setYear(y => y - 1); setMonth(12); } else setMonth(m => m - 1);
        }}>‹</button>
        <span className={styles.monthLabel}>{year}年{month}月</span>
        <button className={styles.navBtn} onClick={() => {
          if (month === 12) { setYear(y => y + 1); setMonth(1); } else setMonth(m => m + 1);
        }}>›</button>
      </div>

      <input className="input" type="text" placeholder="搜索描述或商户..."
        value={search} onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 'var(--space-md)', width: '100%' }} />

      <div className={styles.summary}>
        {Array.from(totalsByCurrency.entries()).map(([cur, v]) => (
          <span key={cur}>
            <span className={styles.sumIncome}>{getCurrencySymbol(cur)}{v.income.toFixed(2)}</span>{' '}
            <span className={styles.sumExpense}>{getCurrencySymbol(cur)}{v.expense.toFixed(2)}</span>{' '}
            <span>({cur})</span>
          </span>
        ))}
      </div>

      {loading ? (
        <p className={styles.empty}>加载中...</p>
      ) : filtered.length === 0 ? (
        <p className={styles.empty}>{search ? '无匹配结果' : '本月暂无记录'}</p>
      ) : (
        <div className={styles.list}>
          {filtered.map((e) => (
            <ExpenseCard key={e.id} expense={e}
              onClick={() => setEditingExpense(e)}
              onDelete={() => {
                if (!user || !confirm('确定删除？')) return;
                deleteExpense(e.id, user.id).then(fetchData);
              }} />
          ))}
        </div>
      )}

      {editingExpense && (
        <ExpenseEditModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onUpdate={fetchData}
          onDelete={fetchData}
        />
      )}
    </div>
  );
}
