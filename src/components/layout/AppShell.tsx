import type { ReactNode } from 'react';
import BottomNav from './BottomNav';

interface Props {
  children: ReactNode;
}

export default function AppShell({ children }: Props) {
  return (
    <div style={{ minHeight: '100dvh', position: 'relative' }}>
      <main className="page-content">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
