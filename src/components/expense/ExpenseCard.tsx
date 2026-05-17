import { useState, useRef, useCallback } from 'react';
import type { Expense } from '../../types/expense';
import { getCurrencySymbol } from '../../utils/currencies';
import styles from './ExpenseCard.module.css';

interface Props {
  expense: Expense;
  onClick?: () => void;
  onDelete?: () => void;
}

export default function ExpenseCard({ expense, onClick, onDelete }: Props) {
  const isExpense = expense.type === 'expense';
  const sign = isExpense ? '-' : '+';
  const symbol = getCurrencySymbol(expense.currency);

  // 左滑删除
  const [swiped, setSwiped] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - startX.current;
    const dy = e.changedTouches[0].clientY - startY.current;
    // 左滑超过40px 且 横向大于纵向
    if (dx < -40 && Math.abs(dx) > Math.abs(dy)) {
      setSwiped(true);
    } else if (dx > 40) {
      setSwiped(false);
    }
  }, []);

  const handleDelete = () => {
    if (onDelete) { onDelete(); setSwiped(false); }
  };

  return (
    <div className={styles.wrapper}>
      {/* 底层删除按钮 */}
      <button className={`${styles.deleteBtn} ${swiped ? styles.deleteVisible : ''}`}
        onClick={handleDelete}>删除</button>

      {/* 卡片主体 */}
      <div
        className={`${styles.card} ${swiped ? styles.swiped : ''}`}
        onClick={() => { if (swiped) { setSwiped(false); } else { onClick?.(); } }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="button"
        tabIndex={0}
      >
        <span className={styles.icon}>{expense.category?.icon || '📦'}</span>
        <div className={styles.info}>
          <p className={styles.name}>{expense.category?.name || expense.description || '未分类'}</p>
          {expense.merchant && <p className={styles.merchant}>{expense.merchant}</p>}
          <p className={styles.date}>
            {expense.expense_date}
            {expense.asset && <span className={styles.asset}> · {expense.asset.icon} {expense.asset.name}</span>}
          </p>
        </div>
        <p className={`${styles.amount} ${isExpense ? styles.expense : styles.income}`}>
          {sign}{symbol}{Number(expense.amount).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
