import { useState } from 'react';
import type { Expense } from '../../types/expense';
import { useExpenses } from '../../hooks/useExpenses';
import { updateExpense, deleteExpense } from '../../services/api/expenses';
import { useAuth } from '../../hooks/useAuth';
import CategoryPicker from './CategoryPicker';
import styles from './ExpenseEditModal.module.css';

interface Props {
  expense: Expense;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}

export default function ExpenseEditModal({ expense, onClose, onUpdate, onDelete }: Props) {
  const { user } = useAuth();
  const { categories, assets } = useExpenses();
  const [amount, setAmount] = useState(String(expense.amount));
  const [categoryId, setCategoryId] = useState<string | null>(expense.category_id);
  const [assetId, setAssetId] = useState<string | null>(expense.asset_id);
  const [date, setDate] = useState(expense.expense_date);
  const [note, setNote] = useState(expense.description || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const filteredCategories = categories.filter((c) => c.type === expense.type);
  const filteredAssets = assets.filter((a) => a.currency === expense.currency);

  const handleSave = async () => {
    if (!user) return;
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) { setError('请输入有效金额'); return; }
    setSaving(true);
    try {
      await updateExpense(expense.id, user.id, {
        amount: num,
        category_id: categoryId || undefined,
        expense_date: date,
        description: note || undefined,
        currency: expense.currency,
        type: expense.type,
        asset_id: assetId || undefined,
      });
      onUpdate();
      onClose();
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!user || !confirm('确定删除这条记录吗？')) return;
    try {
      await deleteExpense(expense.id, user.id);
      onDelete();
      onClose();
    } catch (err: any) { setError(err.message); }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>编辑记录</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>
          <div className={styles.field}>
            <label>金额 ({expense.currency})</label>
            <input className="input" type="number" value={amount}
              onChange={(e) => setAmount(e.target.value)} step="0.01" />
          </div>
          <div className={styles.field}>
            <label>分类</label>
            <CategoryPicker categories={filteredCategories} selectedId={categoryId}
              onSelect={(id) => setCategoryId(id)} />
          </div>
          <div className={styles.field}>
            <label>日期</label>
            <input className="input" type="date" value={date}
              onChange={(e) => setDate(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div className={styles.field}>
            <label>账户 ({expense.type === 'expense' ? '扣款' : '入账'})</label>
            {filteredAssets.length > 0 ? (
              <select className="input" value={assetId || ''}
                onChange={(e) => setAssetId(e.target.value || null)} style={{ width: '100%' }}>
                <option value="">不指定账户</option>
                {filteredAssets.map((a) => (
                  <option key={a.id} value={a.id}>{a.icon} {a.name} · {a.currency} {Number(a.balance).toFixed(2)}</option>
                ))}
              </select>
            ) : <p style={{ fontSize: 12, color: 'var(--text-hint)' }}>暂无可用账户</p>}
          </div>
          <div className={styles.field}>
            <label>备注</label>
            <input className="input" type="text" value={note}
              onChange={(e) => setNote(e.target.value)} style={{ width: '100%' }} />
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button className={styles.deleteBtn} onClick={handleDelete}>删除</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}
