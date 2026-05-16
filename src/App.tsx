import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ExpenseProvider } from './contexts/ExpenseContext';
import AppShell from './components/layout/AppShell';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddExpensePage from './pages/AddExpensePage';
import AssetsPage from './pages/AssetsPage';
import AddAssetPage from './pages/AddAssetPage';
import StatisticsPage from './pages/StatisticsPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import FontPreview from './pages/FontPreview';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#faf7f2',
      }}>
        <LoadingSpinner text="正在连接..." />
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <ExpenseProvider>
      <AppShell>
        <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/add" element={<AddExpensePage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/assets/add" element={<AddAssetPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/font-preview" element={<FontPreview />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </ExpenseProvider>
  );
}

export default App;
