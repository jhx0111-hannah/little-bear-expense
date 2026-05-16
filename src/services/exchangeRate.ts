const API_URL = 'https://open.er-api.com/v6/latest/';

const STORAGE_KEY = 'bear_exchange_rates';
const TTL = 24 * 60 * 60 * 1000; // 24小时

interface CachedRates {
  rates: Record<string, number>;
  fetchedAt: number;
}

export async function fetchExchangeRate(from: string, to: string): Promise<number> {
  // 同币种
  if (from === to) return 1;

  // 先读缓存
  const cached = readCache();
  const cachedRate = cached?.rates?.[`${from}_${to}`];
  if (cachedRate && Date.now() - (cached?.fetchedAt || 0) < TTL) {
    return cachedRate;
  }

  // 请求 API
  try {
    const res = await fetch(`${API_URL}${from}`);
    const json = await res.json();
    const rate = json.rates?.[to];
    if (!rate) throw new Error('汇率数据不可用');

    // 更新缓存
    const rates = { ...(cached?.rates || {}) };
    rates[`${from}_${to}`] = rate;
    rates[`${to}_${from}`] = 1 / rate;
    writeCache({ rates, fetchedAt: Date.now() });

    return rate;
  } catch {
    // 降级：用近似汇率
    const fallback = getFallbackRate(from, to);
    return fallback;
  }
}

function readCache(): CachedRates | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(data: CachedRates) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

function getFallbackRate(from: string, to: string): number {
  // 默认近似汇率（2026年参考值）
  if (from === 'CNY' && to === 'EUR') return 0.125;
  if (from === 'EUR' && to === 'CNY') return 8.0;
  return 1;
}
