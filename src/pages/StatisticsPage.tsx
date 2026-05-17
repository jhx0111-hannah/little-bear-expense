import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { fetchRangeExpenses } from '../services/api/expenses';
import type { Expense } from '../types/expense';
import { formatCurrency } from '../utils/formatCurrency';
import { getCurrencySymbol } from '../utils/currencies';
import styles from './StatisticsPage.module.css';

type RangeType = 'month' | 'year';
const EUR_TO_CNY = 8; // 固定汇率

const PIE_COLORS = ['#c4a8a8', '#b5a9b0', '#a8b5c4', '#b5c4b1', '#d4c9b8', '#a3b5a6', '#b5a08a', '#d4b8b8'];
const INCOME_COLORS = ['#a3b5a6', '#b5c4b1', '#a8b5c4', '#d4c9b8', '#b5a9b0', '#b5a08a', '#c4a8a8', '#d4b8b8'];

function getDateRange(type: RangeType, offset: number): { from: string; to: string } {
  const now = new Date();
  if (type === 'month') {
    const y = now.getFullYear(); const m = now.getMonth() - offset;
    const d = new Date(y, m, 1);
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return { from: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01`, to: `${lastDay.getFullYear()}-${String(lastDay.getMonth()+1).padStart(2,'0')}-${String(lastDay.getDate()).padStart(2,'0')}` };
  }
  const y = now.getFullYear() - offset;
  return { from: `${y}-01-01`, to: `${y}-12-31` };
}

function getMonthLabel(o: number) { const d = new Date(); d.setMonth(d.getMonth()-o); return `${d.getFullYear()}年${d.getMonth()+1}月`; }

export default function StatisticsPage() {
  const { user } = useAuth();
  const [rangeType, setRangeType] = useState<RangeType>('month');
  const [monthOffset, setMonthOffset] = useState(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  const range = useMemo(() => getDateRange(rangeType, monthOffset), [rangeType, monthOffset]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchRangeExpenses(user.id, range.from, range.to).then(setExpenses).finally(() => setLoading(false));
  }, [user, range.from, range.to]);

  // 支出饼图（合并所有币种）
  const expensePieData = useMemo(() => {
    const map = new Map<string, { name: string; value: number; icon: string; currency: string }>();
    expenses.filter((e) => e.type === 'expense').forEach((e) => {
      const key = e.category?.name || '未分类';
      const ex = map.get(key);
      if (ex) ex.value += Number(e.amount);
      else map.set(key, { name: key, value: Number(e.amount), icon: e.category?.icon || '📦', currency: e.currency });
    });
    return Array.from(map.values()).sort((a, b) => b.value - a.value);
  }, [expenses]);

  // 收入饼图
  const incomePieData = useMemo(() => {
    const map = new Map<string, { name: string; value: number; icon: string; currency: string }>();
    expenses.filter((e) => e.type === 'income').forEach((e) => {
      const key = e.category?.name || '未分类';
      const ex = map.get(key);
      if (ex) ex.value += Number(e.amount);
      else map.set(key, { name: key, value: Number(e.amount), icon: e.category?.icon || '💰', currency: e.currency });
    });
    return Array.from(map.values()).sort((a, b) => b.value - a.value);
  }, [expenses]);

  // 按币种汇总（用于标题）
  const expenseByCurrency = useMemo(() => {
    const map = new Map<string, number>();
    expenses.filter((e) => e.type === 'expense').forEach((e) => map.set(e.currency, (map.get(e.currency)||0) + Number(e.amount)));
    return map;
  }, [expenses]);
  const incomeByCurrency = useMemo(() => {
    const map = new Map<string, number>();
    expenses.filter((e) => e.type === 'income').forEach((e) => map.set(e.currency, (map.get(e.currency)||0) + Number(e.amount)));
    return map;
  }, [expenses]);

  // 每日明细（统一换算人民币，EUR→CNY 按固定汇率8）
  const dailyDetail = useMemo(() => {
    const map = new Map<string, { income: number; expense: number; items: Expense[] }>();
    expenses.forEach((e) => {
      const cnyAmount = e.currency === 'CNY' ? Number(e.amount) : Number(e.amount) * EUR_TO_CNY;
      const d = e.expense_date;
      const ex = map.get(d) || { income: 0, expense: 0, items: [] };
      if (e.type === 'income') ex.income += cnyAmount; else ex.expense += cnyAmount;
      ex.items.push(e); map.set(d, ex);
    });
    const daysInMonth = new Date(parseInt(range.from.slice(0,4)), parseInt(range.from.slice(5,7)), 0).getDate();
    const prefix = range.from.slice(0, 7);
    const result = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${prefix}-${String(day).padStart(2,'0')}`;
      const d = map.get(dateStr);
      result.push({ date: dateStr, day, income: d?.income||0, expense: d?.expense||0, net: (d?.income||0)-(d?.expense||0), items: d?.items||[] });
    }
    return result;
  }, [expenses, range.from]);

  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const monthlyTotalCny = useMemo(() => ({
    income: dailyDetail.reduce((s,d) => s+d.income, 0),
    expense: dailyDetail.reduce((s,d) => s+d.expense, 0),
  }), [dailyDetail]);

  const rangeLabel = rangeType === 'month' ? getMonthLabel(monthOffset) : `${range.from.slice(0,4)}年`;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>统计分析</h1>
      <div className={styles.rangeBar}>
        <div className={styles.rangeToggle}>
          {(['month','year'] as RangeType[]).map((t) => (
            <button key={t} className={`${styles.rangeBtn} ${rangeType===t?styles.rangeBtnActive:''}`}
              onClick={()=>{setRangeType(t);setMonthOffset(0);}}>{t==='month'?'月':'年'}</button>
          ))}
        </div>
        {rangeType==='month' && (
          <div className={styles.monthNav}>
            <button className={styles.navBtn} onClick={()=>setMonthOffset(o=>o+1)}>‹</button>
            <span className={styles.rangeLabel}>{rangeLabel}</span>
            <button className={styles.navBtn} onClick={()=>setMonthOffset(o=>Math.max(0,o-1))} disabled={monthOffset===0}>›</button>
          </div>
        )}
      </div>

      {/* 每日明细（人民币） */}
      {rangeType==='month' && (
        <div className={`card ${styles.chartCard}`}>
          <p className={styles.chartTitle}>{rangeLabel} 每日明细（已换算人民币，€1=¥{EUR_TO_CNY}）</p>
          <div className={styles.dailyGrid}>
            {dailyDetail.map((d) => (
              <div key={d.date}>
                <button className={`${styles.dayCell} ${(d.expense>0||d.income>0)?styles.hasData:''}`}
                  onClick={()=>setExpandedDay(expandedDay===d.date?null:d.date)}>
                  <span className={styles.dayNum}>{d.day}</span>
                  {d.expense>0 && <span className={styles.dayExpense}>-{d.expense.toFixed(0)}</span>}
                  {d.income>0 && <span className={styles.dayIncome}>+{d.income.toFixed(0)}</span>}
                </button>
                {expandedDay===d.date && d.items.length>0 && (
                  <div className={styles.dayDetail}>
                    {d.items.map((item) => (
                      <div key={item.id} className={styles.dayItem}>
                        <span>{item.category?.icon||'📦'} {item.category?.name||'未知'}</span>
                        <span className={item.type==='expense'?styles.expenseColor:styles.incomeColor}>
                          {item.type==='expense'?'-':'+'}{formatCurrency(Number(item.amount), item.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className={styles.monthSummary}>
            <span>本月累计（人民币）：</span>
            <span className={styles.incomeColor}>收入 ¥{monthlyTotalCny.income.toFixed(2)}</span>
            <span className={styles.expenseColor}>支出 ¥{monthlyTotalCny.expense.toFixed(2)}</span>
            <span>结余 ¥{(monthlyTotalCny.income-monthlyTotalCny.expense).toFixed(2)}</span>
          </div>
        </div>
      )}

      {loading ? <p className={styles.loading}>加载中...</p>
      : expenses.length===0 ? <p className={styles.empty}>该时间段暂无记录</p>
      : <>
        {/* 支出饼图 */}
        <div className={`card ${styles.chartCard}`}>
          <p className={styles.chartTitle}>支出分类</p>
          {expensePieData.length>0 ? <>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={expensePieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value">
                  {expensePieData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
                </Pie>
                <Tooltip formatter={(val:any, _:any, entry:any)=>`${getCurrencySymbol(entry.payload.currency)}${Number(val).toFixed(2)}`}/>
                {Array.from(expenseByCurrency.entries()).map(([cur,v],i) => (
                  <text key={cur} x="50%" y={`${46+i*7}%`} textAnchor="middle" dominantBaseline="middle"
                    style={{fontSize:14,fill:'var(--text-primary)',fontWeight:700}}>
                    {getCurrencySymbol(cur)}{v.toFixed(0)}
                  </text>
                ))}
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.legend}>
              {expensePieData.map((d,i)=>(
                <span key={d.name} className={styles.legendItem}>
                  <span className={styles.dot} style={{background:PIE_COLORS[i%PIE_COLORS.length]}}/>
                  {d.icon} {d.name} {getCurrencySymbol(d.currency)}{d.value.toFixed(0)}
                </span>
              ))}
            </div>
          </> : <p className={styles.noData}>暂无支出数据</p>}
        </div>

        {/* 收入饼图 */}
        <div className={`card ${styles.chartCard}`}>
          <p className={styles.chartTitle}>收入分类</p>
          {incomePieData.length>0 ? <>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={incomePieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value">
                  {incomePieData.map((_,i)=><Cell key={i} fill={INCOME_COLORS[i%INCOME_COLORS.length]}/>)}
                </Pie>
                <Tooltip formatter={(val:any, _:any, entry:any)=>`${getCurrencySymbol(entry.payload.currency)}${Number(val).toFixed(2)}`}/>
                <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" style={{fontSize:12,fill:'var(--text-hint)',fontWeight:500}}>收入</text>
                {Array.from(incomeByCurrency.entries()).map(([cur,v],i) => (
                  <text key={cur} x="50%" y={`${46+i*7}%`} textAnchor="middle" dominantBaseline="middle"
                    style={{fontSize:14,fill:'var(--text-primary)',fontWeight:700}}>
                    {getCurrencySymbol(cur)}{v.toFixed(0)}
                  </text>
                ))}
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.legend}>
              {incomePieData.map((d,i)=>(
                <span key={d.name} className={styles.legendItem}>
                  <span className={styles.dot} style={{background:INCOME_COLORS[i%INCOME_COLORS.length]}}/>
                  {d.icon} {d.name} {getCurrencySymbol(d.currency)}{d.value.toFixed(0)}
                </span>
              ))}
            </div>
          </> : <p className={styles.noData}>暂无收入数据</p>}
        </div>
      </>}
    </div>
  );
}
