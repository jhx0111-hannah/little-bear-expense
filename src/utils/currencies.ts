// 世界主要货币列表（代码 + 符号 + 中文名）
export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
}

export const ALL_CURRENCIES: CurrencyInfo[] = [
  { code: 'CNY', symbol: '¥', name: '人民币' },
  { code: 'EUR', symbol: '€', name: '欧元' },
  { code: 'USD', symbol: '$', name: '美元' },
  { code: 'GBP', symbol: '£', name: '英镑' },
  { code: 'JPY', symbol: '¥', name: '日元' },
  { code: 'KRW', symbol: '₩', name: '韩元' },
  { code: 'HKD', symbol: 'HK$', name: '港币' },
  { code: 'TWD', symbol: 'NT$', name: '新台币' },
  { code: 'AUD', symbol: 'A$', name: '澳元' },
  { code: 'CAD', symbol: 'C$', name: '加元' },
  { code: 'CHF', symbol: 'CHF', name: '瑞士法郎' },
  { code: 'SGD', symbol: 'S$', name: '新加坡元' },
  { code: 'SEK', symbol: 'kr', name: '瑞典克朗' },
  { code: 'NOK', symbol: 'kr', name: '挪威克朗' },
  { code: 'DKK', symbol: 'kr', name: '丹麦克朗' },
  { code: 'THB', symbol: '฿', name: '泰铢' },
  { code: 'MYR', symbol: 'RM', name: '马来西亚令吉' },
  { code: 'PHP', symbol: '₱', name: '菲律宾比索' },
  { code: 'IDR', symbol: 'Rp', name: '印尼盾' },
  { code: 'INR', symbol: '₹', name: '印度卢比' },
  { code: 'RUB', symbol: '₽', name: '俄罗斯卢布' },
  { code: 'TRY', symbol: '₺', name: '土耳其里拉' },
  { code: 'BRL', symbol: 'R$', name: '巴西雷亚尔' },
  { code: 'MXN', symbol: 'MX$', name: '墨西哥比索' },
  { code: 'AED', symbol: 'د.إ', name: '阿联酋迪拉姆' },
  { code: 'SAR', symbol: '﷼', name: '沙特里亚尔' },
  { code: 'PLN', symbol: 'zł', name: '波兰兹罗提' },
  { code: 'CZK', symbol: 'Kč', name: '捷克克朗' },
  { code: 'HUF', symbol: 'Ft', name: '匈牙利福林' },
  { code: 'NZD', symbol: 'NZ$', name: '新西兰元' },
];

export function getCurrencySymbol(code: string): string {
  const info = ALL_CURRENCIES.find((c) => c.code === code);
  return info?.symbol || code;
}

export function getCurrencyName(code: string): string {
  const info = ALL_CURRENCIES.find((c) => c.code === code);
  return info?.name || code;
}
