import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../hooks/useExpenses';
import { BANK_PRESETS } from '../types/asset';
import type { Currency } from '../types/expense';
import { addAsset } from '../services/api/assets';
import { useAuth } from '../hooks/useAuth';
import styles from './AddAssetPage.module.css';

export default function AddAssetPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { currencies, refreshAssets } = useExpenses();

  const [name, setName] = useState('');
  const [currency, setCurrency] = useState<Currency>('CNY');
  const [balance, setBalance] = useState('');
  const [icon, setIcon] = useState('🏦');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handlePreset = (preset: typeof BANK_PRESETS[0]) => {
    setName(preset.name);
    setIcon(preset.icon);
    setCurrency(preset.recommendedCurrency);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('请输入账户名称'); return; }
    const numBalance = parseFloat(balance);
    if (!balance || isNaN(numBalance) || numBalance < 0) { setError('请输入有效的余额'); return; }
    if (!user) return;
    setSaving(true);
    try {
      await addAsset(user.id, {
        name: name.trim(),
        type: 'bank',
        currency,
        balance: numBalance,
        icon,
        color: '#b5a9b0',
      });
      await refreshAssets();
      navigate('/assets');
    } catch (err: any) {
      setError(err.message || '添加失败');
    } finally { setSaving(false); }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>添加账户</h1>

      <p className={styles.sectionLabel}>快速选择</p>
      <div className={styles.presets}>
        {BANK_PRESETS.map((p) => (
          <button key={p.name} type="button" className={styles.presetBtn}
            onClick={() => handlePreset(p)}>{p.icon} {p.name}</button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>账户名称</label>
          <input className="input" value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            placeholder="如：ING、支付宝" style={{ width: '100%' }} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>币种</label>
          <div className={styles.typeRow}>
            {currencies.map((c) => (
              <button key={c} type="button"
                className={`${styles.typeBtn} ${currency === c ? styles.typeBtnActive : ''}`}
                onClick={() => setCurrency(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>当前余额</label>
          <div className={styles.balanceRow}>
            <span className={styles.balanceSymbol}>{currency === 'CNY' ? '¥' : '€'}</span>
            <input className={styles.balanceInput} type="number" inputMode="decimal"
              placeholder="0.00" value={balance}
              onChange={(e) => { setBalance(e.target.value); setError(''); }}
              step="0.01" min="0" />
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button className={`btn-primary ${styles.saveBtn}`} type="submit" disabled={saving}>
          {saving ? '保存中...' : '添加账户'}
        </button>
      </form>
    </div>
  );
}
