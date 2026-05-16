import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../hooks/useExpenses';
import { fetchExchangeRate } from '../services/exchangeRate';
import { useState, useEffect, useMemo } from 'react';
import AssetCard from '../components/asset/AssetCard';
import BearIcon from '../components/common/BearIcon';
import styles from './AssetsPage.module.css';

export default function AssetsPage() {
  const navigate = useNavigate();
  const { assets, refreshAssets } = useExpenses();
  const [rateEurToCny, setRateEurToCny] = useState(7.85);

  useEffect(() => {
    refreshAssets();
  }, [refreshAssets]);

  useEffect(() => {
    fetchExchangeRate('EUR', 'CNY').then(setRateEurToCny).catch(() => {});
  }, []);

  const totalCny = useMemo(() => {
    return assets.reduce((sum, a) => {
      if (a.currency === 'CNY') return sum + Number(a.balance);
      return sum + Number(a.balance) * rateEurToCny;
    }, 0);
  }, [assets, rateEurToCny]);

  const cnyAssets = assets.filter((a) => a.currency === 'CNY');
  const eurAssets = assets.filter((a) => a.currency === 'EUR');
  const cnyTotal = cnyAssets.reduce((s, a) => s + Number(a.balance), 0);
  const eurTotal = eurAssets.reduce((s, a) => s + Number(a.balance), 0);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>资产管理</h1>
        <button className={styles.addBtn} onClick={() => navigate('/assets/add')}>+ 添加</button>
      </div>

      {/* 总资产卡片 */}
      <div className={`card ${styles.totalCard}`}>
        <p className={styles.totalLabel}>总资产</p>
        <p className={styles.totalAmount}>¥ {totalCny.toFixed(2)}</p>
        <div className={styles.totalDetail}>
          <span>CNY ¥{cnyTotal.toFixed(2)}</span>
          <span>EUR €{eurTotal.toFixed(2)} ≈ ¥{(eurTotal * rateEurToCny).toFixed(2)}</span>
        </div>
      </div>

      {/* 账户列表 */}
      {assets.length === 0 ? (
        <div className={styles.empty}>
          <BearIcon variant="happy" size={72} />
          <p>还没有添加账户</p>
          <p className={styles.emptyHint}>点击右上角"+ 添加"添加你的第一个账户吧</p>
        </div>
      ) : (
        <div className={styles.list}>
          {assets.map((a) => (
            <AssetCard key={a.id} asset={a} />
          ))}
        </div>
      )}
    </div>
  );
}
