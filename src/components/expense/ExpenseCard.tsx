import type { Expense } from '../../types/expense';
import styles from './ExpenseCard.module.css';

interface Props {
  expense: Expense;
  onClick?: () => void;
}

export default function ExpenseCard({ expense, onClick }: Props) {
  const isExpense = expense.type === 'expense';
  const sign = isExpense ? '-' : '+';
  const symbol = expense.currency === 'CNY' ? '¥' : '€';

  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}>
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
  );
}
