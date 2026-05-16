import type { Asset } from '../../types/asset';
import { formatCurrency } from '../../utils/formatCurrency';
import styles from './AssetCard.module.css';

interface Props {
  asset: Asset;
  onClick?: () => void;
}

export default function AssetCard({ asset, onClick }: Props) {
  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}>
      <span className={styles.icon}>{asset.icon}</span>
      <div className={styles.info}>
        <p className={styles.name}>{asset.name}</p>
        <p className={styles.type}>
          <span className={styles.currencyBadge}>{asset.currency}</span>
          {asset.type === 'bank' && ' · 银行'}
          {asset.type === 'alipay' && ' · 支付宝'}
          {asset.type === 'wechat' && ' · 微信'}
          {asset.type === 'cash' && ' · 现金'}
          {asset.type === 'other' && ' · 其他'}
        </p>
      </div>
      <p className={styles.balance}>{formatCurrency(Number(asset.balance), asset.currency)}</p>
    </div>
  );
}
