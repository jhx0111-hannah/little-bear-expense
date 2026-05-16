import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../hooks/useExpenses';
import { fetchExchangeRate } from '../services/exchangeRate';
import BearIcon from '../components/common/BearIcon';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { expenses, assets, loadInitial } = useExpenses();
  const [rateEurToCny, setRateEurToCny] = useState(7.85);

  useEffect(() => { loadInitial(); }, [loadInitial]);
  useEffect(() => { fetchExchangeRate('EUR', 'CNY').then(setRateEurToCny).catch(() => {}); }, []);

  // 本月总支出（CNY）
  const totalExpense = useMemo(() => {
    return expenses
      .filter((e) => e.type === 'expense' && e.currency === 'CNY')
      .reduce((sum, e) => sum + Number(e.amount), 0);
  }, [expenses]);

  // 总资产
  const totalCny = useMemo(() => {
    return assets.reduce((sum, a) =>
      a.currency === 'CNY' ? sum + Number(a.balance) : sum + Number(a.balance) * rateEurToCny, 0);
  }, [assets, rateEurToCny]);

  const today = new Date();
  const weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][today.getDay()];
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日 · ${weekDay}`;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.greeting}>早上好呀，小熊</h1>
          <p className={styles.date}>{dateStr}</p>
        </div>
        <BearIcon variant="happy" size={44} />
      </div>

      {/* 月度支出 */}
      <div className={`card ${styles.summaryCard}`}>
        <p className={styles.summaryLabel}>本月总支出</p>
        <p className={styles.summaryAmount}>¥ {totalExpense.toFixed(2)}</p>
        <div className={styles.budgetBar}>
          <div className={styles.budgetFill} style={{ width: `${Math.min((totalExpense / 5000) * 100, 100)}%` }} />
        </div>
        <p className={styles.budgetText}>
          {totalExpense > 0 ? `预算 ¥5,000 · 剩余 ¥${(5000 - totalExpense).toFixed(2)}` : '预算未设置'}
        </p>
      </div>

      {/* 资产概览（从原资产页移过来） */}
      <div className={`card ${styles.assetCard}`}>
        <div className={styles.assetHeader}>
          <p className={styles.sectionTitle}>资产概览</p>
          <button className={styles.assetAddBtn} onClick={() => navigate('/assets/add')}>+ 添加</button>
        </div>
        <p className={styles.totalAsset}>¥ {totalCny.toFixed(2)}</p>
        {assets.length === 0 ? (
          <p className={styles.assetHint}>还没有添加账户，点击"+ 添加"开始吧</p>
        ) : (
          <div className={styles.assetList}>
            {assets.map((a) => (
              <span key={a.id} className={styles.assetItem}>
                {a.icon} {a.name} {a.currency} {Number(a.balance).toFixed(2)}
              </span>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
