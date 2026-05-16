import BearIcon from './BearIcon';

interface Props {
  message?: string;
  hint?: string;
}

export default function EmptyState({
  message = '还没有记录哦',
  hint = '点击下方按钮开始吧~',
}: Props) {
  return (
    <div style={{ textAlign: 'center', padding: 'var(--space-xl) var(--space-md)' }}>
      <div className="anim-bear-breathe">
        <BearIcon variant="happy" size={80} />
      </div>
      <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-md)' }}>
        {message}
      </p>
      {hint && (
        <p style={{ color: 'var(--text-hint)', fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-xs)' }}>
          {hint}
        </p>
      )}
    </div>
  );
}
