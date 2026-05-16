import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../hooks/useExpenses';
import BearIcon from '../components/common/BearIcon';
import styles from './DashboardPage.module.css';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return '夜深了，小熊 🌙';
  if (h < 12) return '早上好呀，小熊 ☀️';
  if (h < 18) return '下午好呀，小熊 🌤️';
  return '晚上好呀，小熊 🌙';
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { expenses, assets, loadInitial } = useExpenses();

  useEffect(() => { loadInitial(); }, [loadInitial]);

  const today = new Date();
  const weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][today.getDay()];
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日 · ${weekDay}`;

  const eurAssets = assets.filter((a) => a.is_active && a.currency === 'EUR');
  const cnyAssets = assets.filter((a) => a.is_active && a.currency === 'CNY');
  const totalEur = eurAssets.reduce((s, a) => s + Number(a.balance), 0);
  const totalCny = cnyAssets.reduce((s, a) => s + Number(a.balance), 0);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.greeting}>{getGreeting()}</h1>
          <p className={styles.date}>{dateStr}</p>
        </div>
        <BearIcon variant="happy" size={44} />
      </div>

      {/* 资产概览 */}
      <div className={`card ${styles.assetCard}`}>
        <div className={styles.assetHeader}>
          <p className={styles.sectionTitle}>资产概览</p>
          <button className={styles.assetAddBtn} onClick={() => navigate('/assets/add')}>+ 添加</button>
        </div>

        {assets.length === 0 ? (
          <p className={styles.assetHint}>还没有添加账户，点击"+ 添加"开始吧</p>
        ) : (
          <>
            {/* 总额 */}
            <div className={styles.totalRow}>
              {eurAssets.length > 0 && (
                <div className={styles.totalItem}>
                  <p className={styles.totalLabel}>€ 欧元</p>
                  <p className={styles.totalValue}>€{totalEur.toFixed(2)}</p>
                </div>
              )}
              {cnyAssets.length > 0 && (
                <div className={styles.totalItem}>
                  <p className={styles.totalLabel}>¥ 人民币</p>
                  <p className={styles.totalValue}>¥{totalCny.toFixed(2)}</p>
                </div>
              )}
            </div>

            {/* EUR 账户列表 */}
            {eurAssets.length > 0 && (
              <div className={styles.assetGroup}>
                <p className={styles.currencyLabel}>欧元账户</p>
                {eurAssets.map((a) => (
                  <div key={a.id} className={styles.accountRow}
                    onClick={() => navigate('/assets')}>
                    <span className={styles.accountIcon}>{a.icon}</span>
                    <span className={styles.accountName}>{a.name}</span>
                    <span className={styles.accountBalance}>€{Number(a.balance).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* CNY 账户列表 */}
            {cnyAssets.length > 0 && (
              <div className={styles.assetGroup}>
                <p className={styles.currencyLabel}>人民币账户</p>
                {cnyAssets.map((a) => (
                  <div key={a.id} className={styles.accountRow}
                    onClick={() => navigate('/assets')}>
                    <span className={styles.accountIcon}>{a.icon}</span>
                    <span className={styles.accountName}>{a.name}</span>
                    <span className={styles.accountBalance}>¥{Number(a.balance).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
