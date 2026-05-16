import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useExpenses } from '../hooks/useExpenses';
import { supabase } from '../config/supabase';
import styles from './SettingsPage.module.css';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { categories, assets, expenses, loadInitial } = useExpenses();
  const [nickname, setNickname] = useState('小熊用户');
  const [budget, setBudget] = useState('');
  const [baseCurrency, setBaseCurrency] = useState<'CNY' | 'EUR'>('CNY');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // 自定义分类
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📦');
  const [newCatType, setNewCatType] = useState<'expense' | 'income'>('expense');
  const [catMsg, setCatMsg] = useState('');

  useEffect(() => { loadInitial(); loadProfile(); }, []);

  const loadProfile = async () => {
    if (!user) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (data) {
      setNickname(data.display_name || '小熊用户');
      setBaseCurrency(data.base_currency || 'CNY');
      if (data.monthly_budget) setBudget(String(data.monthly_budget));
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      display_name: nickname, base_currency: baseCurrency,
      monthly_budget: budget ? parseFloat(budget) : null,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id);
    setSaving(false);
    if (error) setMsg('保存失败：' + error.message);
    else { setMsg('✅ 已保存'); setTimeout(() => setMsg(''), 2000); }
  };

  const handleAddCategory = async () => {
    if (!user || !newCatName.trim()) { setCatMsg('请输入分类名称'); return; }
    // 检查是否已存在
    const exists = categories.some((c) => c.name === newCatName.trim() && c.type === newCatType);
    if (exists) { setCatMsg('⚠️ 该分类已存在'); return; }
    const { error } = await supabase.from('categories').insert({
      user_id: user.id, name: newCatName.trim(), icon: newCatIcon,
      color: '#b5a9b0', type: newCatType, sort_order: 99,
    });
    if (error) {
      if (error.message.includes('duplicate')) { setCatMsg('⚠️ 该分类已存在'); }
      else { setCatMsg('添加失败：' + error.message); }
      return;
    }
    setNewCatName('');
    setNewCatIcon('📦');
    setCatMsg('✅ 已添加');
    setTimeout(() => setCatMsg(''), 2000);
    loadInitial();
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!user || !confirm('确定删除这个分类吗？（已有记录不受影响）')) return;
    await supabase.from('categories').delete().eq('id', catId).eq('user_id', user.id);
    loadInitial();
  };

  const exportCSV = () => {
    const header = '日期,类型,分类,金额,币种,商户,备注,账户\n';
    const rows = expenses.map((e) => {
      const cat = categories.find((c) => c.id === e.category_id);
      const a = assets.find((x) => x.id === e.asset_id);
      return [e.expense_date, e.type, cat?.name || '', e.amount, e.currency, e.merchant || '', e.description || '', a?.name || ''].join(',');
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `小熊记账_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const expenseCats = categories.filter((c) => c.type === 'expense');
  const incomeCats = categories.filter((c) => c.type === 'income');

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>设置</h1>

      <div className={`card ${styles.section}`}>
        <p className={styles.sectionTitle}>用户信息</p>
        <div className={styles.field}><label>昵称</label>
          <input className="input" value={nickname} onChange={(e) => setNickname(e.target.value)} /></div>
        <div className={styles.field}><label>邮箱</label>
          <p className={styles.email}>{user?.email || '未知'}</p></div>
        <div className={styles.field}><label>默认货币</label>
          <div className={styles.toggle}>
            <button className={`${styles.toggleBtn} ${baseCurrency === 'CNY' ? styles.toggleActive : ''}`}
              onClick={() => setBaseCurrency('CNY')}>¥ 人民币</button>
            <button className={`${styles.toggleBtn} ${baseCurrency === 'EUR' ? styles.toggleActive : ''}`}
              onClick={() => setBaseCurrency('EUR')}>€ 欧元</button>
          </div></div>
        <div className={styles.field}><label>月预算 ({baseCurrency})</label>
          <input className="input" type="number" placeholder="不限制" value={budget}
            onChange={(e) => setBudget(e.target.value)} /></div>
        {msg && <p className={styles.msg}>{msg}</p>}
        <button className={`btn-primary ${styles.saveBtn}`} onClick={saveProfile} disabled={saving}>
          {saving ? '保存中...' : '保存设置'}</button>
      </div>

      {/* 自定义分类 */}
      <div className={`card ${styles.section}`}>
        <p className={styles.sectionTitle}>分类管理</p>
        <div className={styles.catForm}>
          <select className="input" value={newCatType}
            onChange={(e) => setNewCatType(e.target.value as 'expense'|'income')}
            style={{ width: 80, flexShrink: 0 }}>
            <option value="expense">支出</option>
            <option value="income">收入</option>
          </select>
          <input className="input" placeholder="分类名称" value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)} style={{ flex: 1 }} />
          <input className="input" placeholder="图标" value={newCatIcon}
            onChange={(e) => setNewCatIcon(e.target.value)} style={{ width: 56, textAlign: 'center', flexShrink: 0 }} />
          <button className={styles.catAddBtn} onClick={handleAddCategory}>+</button>
        </div>
        {catMsg && <p className={styles.msg} style={{ marginTop: 8 }}>{catMsg}</p>}

        <div style={{ marginTop: 12 }}>
          <p style={{ fontSize: 12, color: 'var(--text-hint)', marginBottom: 4 }}>支出分类：</p>
          <div className={styles.catList}>
            {expenseCats.map((c) => (
              <span key={c.id} className={styles.catTag}>
                {c.icon} {c.name}
                <button className={styles.catDel} onClick={() => handleDeleteCategory(c.id)}>×</button>
              </span>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          <p style={{ fontSize: 12, color: 'var(--text-hint)', marginBottom: 4 }}>收入分类：</p>
          <div className={styles.catList}>
            {incomeCats.map((c) => (
              <span key={c.id} className={styles.catTag}>
                {c.icon} {c.name}
                <button className={styles.catDel} onClick={() => handleDeleteCategory(c.id)}>×</button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={`card ${styles.section}`}>
        <p className={styles.sectionTitle}>数据管理</p>
        <button className={`btn-secondary ${styles.actionBtn}`} onClick={exportCSV}>📥 导出数据 (CSV)</button>
      </div>

      <div className={`card ${styles.section}`}>
        <p className={styles.sectionTitle}>关于</p>
        <p className={styles.about}>🐻 小熊记账 v1.0</p>
        <p className={styles.aboutSub}>简单可爱的记账小助手 · 支持多币种</p>
      </div>

      <button className={`btn-secondary ${styles.logoutBtn}`} onClick={signOut}>退出登录</button>
    </div>
  );
}
