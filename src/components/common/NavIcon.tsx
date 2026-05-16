interface Props {
  name: 'home' | 'stats' | 'add' | 'history' | 'settings';
  size?: number;
  color?: string;
}

export default function NavIcon({ name, size = 24, color = 'currentColor' }: Props) {
  const stroke = color;
  const sw = 1.8;

  if (name === 'home') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5"/><path d="M5 8.5v11h14v-11"/><path d="M10 19.5v-6h4v6"/>
    </svg>);
  if (name === 'stats') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="14" width="4" height="6" rx="1"/><rect x="10" y="9" width="4" height="11" rx="1"/><rect x="17" y="5" width="4" height="15" rx="1"/>
    </svg>);
  if (name === 'add') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={2.2} strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>);
  if (name === 'history') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="8" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill={stroke} stroke="none"/><circle cx="4" cy="12" r="1.5" fill={stroke} stroke="none"/><circle cx="4" cy="18" r="1.5" fill={stroke} stroke="none"/>
    </svg>);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M12 1.5v3M12 19.5v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1.5 12h3M19.5 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
    </svg>);
}
