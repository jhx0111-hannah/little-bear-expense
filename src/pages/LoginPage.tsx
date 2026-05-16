import { useState, type FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import BearIcon from '../components/common/BearIcon';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setError('请输入邮箱和密码 📝');
      triggerShake();
      return;
    }

    if (password.length < 6) {
      setError('密码至少需要 6 位 🔐');
      triggerShake();
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      triggerShake();
      return;
    }

    if (result.isNewUser) {
      setSuccessMsg('🎉 首次使用！已自动创建账户并登录~');
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.bear}>
          <BearIcon variant="waving" size={120} />
        </div>
        <h1 className={styles.title}>小熊记账</h1>
        <p className={styles.subtitle}>记录你的每一笔开销</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className="input"
            type="email"
            placeholder="邮箱地址"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            autoComplete="email"
          />
          <input
            className="input"
            type="password"
            placeholder="密码（至少6位）"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            autoComplete="current-password"
          />

          {error && (
            <p className={`${styles.error} ${shake ? styles.shake : ''}`}>{error}</p>
          )}
          {successMsg && (
            <p className={styles.success}>{successMsg}</p>
          )}

          <button
            className={`btn-primary ${styles.submitBtn}`}
            type="submit"
            disabled={loading}
          >
            {loading ? '🐻 登录中...' : '🐻 登录 / 注册'}
          </button>
        </form>

        <p className={styles.hint}>
          首次使用？输入邮箱密码后自动创建账户
        </p>
      </div>
    </div>
  );
}
