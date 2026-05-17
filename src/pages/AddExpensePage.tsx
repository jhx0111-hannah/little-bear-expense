import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../hooks/useExpenses';
import { useScreenshotAI } from '../hooks/useScreenshotAI';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { supabase } from '../config/supabase';
import type { Currency, TransactionType, AIRecognitionResult } from '../types/expense';
import CategoryPicker from '../components/expense/CategoryPicker';
import styles from './AddExpensePage.module.css';

export default function AddExpensePage() {
  const navigate = useNavigate();
  const { categories, assets, currencies, addExpense, loadInitial } = useExpenses();
  const screenshotAI = useScreenshotAI();
  const voice = useVoiceInput();
  const fileRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('CNY');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [assetId, setAssetId] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [aiFilled, setAiFilled] = useState(false);

  useEffect(() => {
    if (categories.length === 0) loadInitial();
  }, [categories.length, loadInitial]);

  useEffect(() => {
    if (screenshotAI.stage === 'done' && screenshotAI.result) {
      applyAIResult(screenshotAI.result);
    }
  }, [screenshotAI.stage, screenshotAI.result]);

  useEffect(() => {
    if (voice.transcript && !voice.isListening) {
      parseVoiceText(voice.transcript);
    }
  }, [voice.transcript, voice.isListening]);

  const applyAIResult = (r: AIRecognitionResult) => {
    if (r.amount) setAmount(String(r.amount));
    if (r.currency) setCurrency(r.currency);
    if (r.date) setDate(r.date);
    if (r.description) setNote(r.description);
    if (r.category || r.merchant) {
      const match = categories.find((c) =>
        c.type === type && (
          c.name === r.category ||
          (r.merchant && c.name.includes(r.merchant))
        )
      );
      if (match) setCategoryId(match.id);
    }
    setAiFilled(true);
    setTimeout(() => setAiFilled(false), 2000);
  };

  const parseVoiceText = async (text: string) => {
    try {
      const { data, error: fnErr } = await supabase.functions.invoke('ai-recognize', {
        body: { text, mode: 'voice' },
      });
      if (fnErr) {
        if (fnErr.message?.includes('non-2xx') || fnErr.message?.includes('status code')) {
          setError('AI服务未部署，语音解析暂不可用。你说的文字：「' + text + '」');
        } else {
          setError(fnErr.message);
        }
        return;
      }
      if (data?.error) throw new Error(data.error);
      applyAIResult(data as AIRecognitionResult);
      if (data?.type === 'income') setType('income');
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('fetch')) {
        setError('语音解析功能需要部署AI服务。你说的文字：「' + text + '」');
      } else {
        setError(err.message);
      }
    }
  };

  const handleScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    screenshotAI.reset();
    screenshotAI.recognize(file);
  };

  const filteredCategories = categories.filter((c) => c.type === type);
  const filteredAssets = assets.filter((a) => a.currency === currency);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) { setError('请输入有效的金额'); return; }
    if (!categoryId) { setError('请选择一个分类'); return; }

    setSaving(true);
    try {
      await addExpense({
        type, amount: numAmount, currency,
        category_id: categoryId, asset_id: assetId || null,
        expense_date: date, description: note || undefined,
        screenshot_url: previewUrl || undefined,
        ai_recognized: aiFilled,
      });
      navigate('/');
    } catch (err: any) {
      setError(err.message || '保存失败');
    } finally { setSaving(false); }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>记一笔</h1>

      {/* AI 智能输入 */}
      <div className={styles.aiBar}>
        <input ref={fileRef} type="file" accept="image/*"
          onChange={handleScreenshot} style={{ display: 'none' }} />

        <button type="button"
          className={`${styles.aiBtn} ${screenshotAI.stage === 'recognizing' || screenshotAI.stage === 'uploading' ? styles.aiBtnActive : ''}`}
          onClick={() => fileRef.current?.click()}
          disabled={screenshotAI.stage !== 'idle' && screenshotAI.stage !== 'error'}>
          {screenshotAI.stage === 'recognizing' ? '🔍 识别中...'
            : screenshotAI.stage === 'uploading' ? '📤 上传中...'
            : '🖼️ 图片识别'}
        </button>

        {voice.isSupported && (
          <button type="button"
            className={`${styles.aiBtn} ${voice.isListening ? styles.voiceActive : ''}`}
            onClick={voice.isListening ? voice.stop : voice.start}>
            {voice.isListening ? '🎤 停止' : '🎤 语音识别'}
          </button>
        )}
      </div>

      {(screenshotAI.stage === 'recognizing' || voice.isListening) && (
        <div className={styles.aiStatus}>
          {screenshotAI.stage === 'recognizing' && '小熊正在识别截图中...'}
          {voice.isListening && '小熊竖起耳朵在听...请说话'}
        </div>
      )}
      {screenshotAI.error && <p className={styles.error}>{screenshotAI.error}</p>}
      {aiFilled && <p className={styles.aiSuccess}>AI已自动填写，请确认后保存</p>}

      {previewUrl && (
        <div className={styles.preview}>
          <img src={previewUrl} alt="支付截图" />
          <button type="button" className={styles.previewClose} onClick={() => setPreviewUrl(null)}>✕</button>
        </div>
      )}

      {voice.transcript && (
        <div className={styles.voiceText}>你说的是："{voice.transcript}"</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.typeToggle}>
          <button type="button"
            className={`${styles.typeBtn} ${type === 'expense' ? styles.typeActive : ''}`}
            onClick={() => { setType('expense'); setCategoryId(null); }}>支出</button>
          <button type="button"
            className={`${styles.typeBtn} ${type === 'income' ? styles.typeIncomeActive : ''}`}
            onClick={() => { setType('income'); setCategoryId(null); }}>收入</button>
        </div>

        <div className={styles.amountRow}>
          <div className={styles.amountInputWrap}>
            <span className={styles.currencySymbol}>{currency === 'CNY' ? '¥' : '€'}</span>
            <input
              className={`${styles.amountInput} ${aiFilled ? styles.aiHighlight : ''}`}
              type="number" inputMode="decimal" placeholder="0.00"
              value={amount} onChange={(e) => { setAmount(e.target.value); setError(''); }}
              step="0.01" min="0"
            />
          </div>
          <select className={styles.currencySelect} value={currency}
            onChange={(e) => setCurrency(e.target.value)}>
            {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>分类</p>
          <CategoryPicker categories={filteredCategories} selectedId={categoryId}
            onSelect={(id) => { setCategoryId(id); setError(''); }} />
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>日期</p>
          <input className={styles.dateInput} type="date" value={date}
            onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>账户{filteredAssets.length === 0 ? '（暂无可选账户）' : ''}</p>
          {filteredAssets.length > 0 ? (
            <select className="input" value={assetId || ''}
              onChange={(e) => setAssetId(e.target.value || null)} style={{ width: '100%' }}>
              <option value="">不指定账户</option>
              {filteredAssets.map((a) => (
                <option key={a.id} value={a.id}>{a.icon} {a.name} · {a.currency} {Number(a.balance).toFixed(2)}</option>
              ))}
            </select>
          ) : (
            <p className={styles.hint}>请先在"资产"页面添加账户</p>
          )}
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>备注</p>
          <input className="input" type="text" placeholder="如：麦当劳午餐"
            value={note} onChange={(e) => setNote(e.target.value)} style={{ width: '100%' }} />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button className={`btn-primary ${styles.saveBtn}`} type="submit" disabled={saving}>
          {saving ? '保存中...' : '保存'}
        </button>
      </form>
    </div>
  );
}
