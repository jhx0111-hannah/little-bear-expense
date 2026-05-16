import { useLocation, useNavigate } from 'react-router-dom';
import NavIcon from '../common/NavIcon';
import styles from './BottomNav.module.css';

interface TabItem {
  path: string;
  label: string;
  icon: 'home' | 'stats' | 'add' | 'history' | 'settings';
  isPrimary?: boolean;
}

const tabs: TabItem[] = [
  { path: '/', label: '首页', icon: 'home' },
  { path: '/statistics', label: '统计', icon: 'stats' },
  { path: '/add', label: '记账', icon: 'add', isPrimary: true },
  { path: '/history', label: '流水', icon: 'history' },
  { path: '/settings', label: '设置', icon: 'settings' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const getColor = (tab: TabItem) => {
    const isActive = tab.path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(tab.path);
    return isActive ? '#b5c4b1' : '#b8b0b0';
  };

  return (
    <nav className={styles.nav}>
      {tabs.map((tab) => {
        const isActive = tab.path === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(tab.path);

        if (tab.isPrimary) {
          return (
            <button
              key={tab.path}
              className={`${styles.primaryBtn} ${isActive ? styles.primaryActive : ''}`}
              onClick={() => navigate(tab.path)}
              aria-label={tab.label}
            >
              <NavIcon name="add" size={22} color="#ffffff" />
            </button>
          );
        }

        return (
          <button
            key={tab.path}
            className={`${styles.tab} ${isActive ? styles.active : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <NavIcon name={tab.icon} size={22} color={getColor(tab)} />
            <span className={styles.label}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
