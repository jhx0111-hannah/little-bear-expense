import { useState } from 'react';
import type { Asset } from '../../types/asset';
import { useExpenses } from '../../hooks/useExpenses';
import { updateAsset, deleteAsset } from '../../services/api/assets';
import { useAuth } from '../../hooks/useAuth';
import styles from './AssetEditModal.module.css';

interface Props {
  asset: Asset;
  onClose: () => void;
}

export default function AssetEditModal({ asset, onClose }: Props) {
  const { user } = useAuth();
  const { refreshAssets } = useExpenses();
  const [balance, setBalance] = useState(String(asset.balance));
  const [name, setName] = useState(asset.name);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!user) return;
    const num = parseFloat(balance);
    if (!balance || isNaN(num) || num < 0) { setError('请输入有效余额'); return; }
    setSaving(true);
    try {
      await updateAsset(asset.id, user.id, { name: name.trim(), balance: num });
      await refreshAssets();
      onClose();
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!user || !confirm(`确定删除「${asset.name}」吗？`)) return;
    try {
      await deleteAsset(asset.id, user.id);
      await refreshAssets();
      onClose();
    } catch (err: any) { setError(err.message); }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{asset.icon} {asset.name}</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>
          <div className={styles.field}>
            <label>名称</label>
            <input className="input" value={name}
              onChange={(e) => setName(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div className={styles.field}>
            <label>余额 ({asset.currency})</label>
            <div className={styles.balanceRow}>
              <span className={styles.symbol}>{asset.currency === 'CNY' ? '¥' : '€'}</span>
              <input className={styles.balanceInput} type="number" inputMode="decimal"
                value={balance} onChange={(e) => setBalance(e.target.value)}
                step="0.01" min="0" />
            </div>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button className={styles.deleteBtn} onClick={handleDelete}>删除账户</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}
            style={{ flex: 1 }}>{saving ? '保存中...' : '保存'}</button>
        </div>
      </div>
    </div>
  );
}
