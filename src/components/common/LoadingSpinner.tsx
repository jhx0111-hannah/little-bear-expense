import BearIcon from './BearIcon';

interface Props {
  text?: string;
}

export default function LoadingSpinner({ text = '加载中...' }: Props) {
  return (
    <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
      <div className="anim-bear-breathe">
        <BearIcon variant="thinking" size={72} />
      </div>
      <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-md)' }}>
        {text}
      </p>
    </div>
  );
}
