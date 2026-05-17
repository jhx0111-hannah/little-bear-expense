import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../hooks/useExpenses';
import BearIcon from '../components/common/BearIcon';
import AssetEditModal from '../components/asset/AssetEditModal';
import type { Asset } from '../types/asset';
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
  const { assets, loadInitial } = useExpenses();
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  useEffect(() => { loadInitial(); }, [loadInitial]);

  const today = new Date();
  const weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][today.getDay()];
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日 · ${weekDay}`;

  // 按币种分组（先 EUR 再 CNY 再其他）
  const groupedAssets = useMemo(() => {
    const active = assets.filter((a) => a.is_active);
    const order = ['EUR', 'CNY'];
    const groups: { currency: string; list: Asset[]; total: number }[] = [];
    const seen = new Set<string>();
    order.forEach((c) => {
      const list = active.filter((a) => a.currency === c);
      if (list.length > 0) {
        groups.push({ currency: c, list, total: list.reduce((s, a) => s + Number(a.balance), 0) });
        list.forEach((a) => seen.add(a.id));
      }
    });
    // 其他币种
    const rest = active.filter((a) => !seen.has(a.id));
    const restByCur = new Map<string, Asset[]>();
    rest.forEach((a) => {
      const list = restByCur.get(a.currency) || [];
      list.push(a);
      restByCur.set(a.currency, list);
    });
    restByCur.forEach((list, currency) => {
      groups.push({ currency, list, total: list.reduce((s, a) => s + Number(a.balance), 0) });
    });
    return groups;
  }, [assets]);

  const currencySymbol = (c: string) => c === 'CNY' ? '¥' : c === 'EUR' ? '€' : c;

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
              {groupedAssets.map((g) => (
                <div key={g.currency} className={styles.totalItem}>
                  <p className={styles.totalLabel}>{currencySymbol(g.currency)} {g.currency}</p>
                  <p className={styles.totalValue}>{currencySymbol(g.currency)}{g.total.toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* 各币种账户列表 */}
            {groupedAssets.map((g) => (
              <div key={g.currency} className={styles.assetGroup}>
                <p className={styles.currencyLabel}>{g.currency} 账户</p>
                {g.list.map((a) => (
                  <div key={a.id} className={styles.accountRow}
                    onClick={() => setEditingAsset(a)}>
                    <span className={styles.accountIcon}>{a.icon}</span>
                    <span className={styles.accountName}>{a.name}</span>
                    <span className={styles.accountBalance}>{currencySymbol(a.currency)}{Number(a.balance).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>

      {editingAsset && (
        <AssetEditModal asset={editingAsset} onClose={() => setEditingAsset(null)} />
      )}
    </div>
  );
}
