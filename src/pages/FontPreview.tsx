import { useEffect } from 'react';

const CN_FONTS = [
  { name: '① ZCOOL KuaiLe', family: 'ZCOOL KuaiLe', desc: '圆润可爱·活泼手写' },
  { name: '② ZCOOL XiaoWei', family: 'ZCOOL XiaoWei', desc: '清新文艺·圆角柔和' },
  { name: '③ Ma Shan Zheng', family: 'Ma Shan Zheng', desc: '楷书手写·温暖人情' },
  { name: '④ Noto Serif SC', family: 'Noto Serif SC', desc: '优雅文艺·书卷气' },
  { name: '⑤ ZCOOL QingKe HuangYou', family: 'ZCOOL QingKe HuangYou', desc: '端正楷书·清晰秀气' },
];

const EN_FONTS = [
  { name: 'A. Nunito', family: 'Nunito', desc: '圆润友好·现代干净' },
  { name: 'B. Quicksand', family: 'Quicksand', desc: '几何圆角·ins风' },
  { name: 'C. Fredoka', family: 'Fredoka', desc: '超圆润·软萌可爱' },
  { name: 'D. Baloo 2', family: 'Baloo 2', desc: '俏皮活泼·多字重' },
  { name: 'E. Patrick Hand', family: 'Patrick Hand', desc: '手写体·笔记本笔记' },
];

export default function FontPreview() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&family=ZCOOL+XiaoWei&family=ZCOOL+QingKe+HuangYou&family=Ma+Shan+Zheng&family=Noto+Serif+SC&family=Nunito:wght@400;600;700&family=Quicksand:wght@400;600;700&family=Fredoka:wght@400;600;700&family=Baloo+2:wght@400;600;700&family=Patrick+Hand&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <div style={{
      padding: 16,
      paddingBottom: 100,
      background: '#faf7f2',
      minHeight: '100dvh',
      maxWidth: 480,
      margin: '0 auto',
    }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>字体预览</h1>

      <h2 style={{ fontSize: 14, color: '#8c8484', marginBottom: 12 }}>中文字体</h2>
      {CN_FONTS.map((f) => (
        <div key={f.family} style={{
          background: '#fff', borderRadius: 12, padding: 16, marginBottom: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <p style={{ fontSize: 13, color: '#8c8484', marginBottom: 8 }}>
            {f.name} — {f.desc}
          </p>
          <p style={{ fontFamily: f.family, fontSize: 28, fontWeight: 700, margin: '4px 0', color: '#4a4444' }}>
            小熊记账
          </p>
          <p style={{ fontFamily: f.family, fontSize: 16, margin: 0, color: '#4a4444' }}>
            早上好呀 · 记一笔 · 今天午餐花了 €12.50
          </p>
        </div>
      ))}

      <h2 style={{ fontSize: 14, color: '#8c8484', marginTop: 24, marginBottom: 12 }}>英文字体</h2>
      {EN_FONTS.map((f) => (
        <div key={f.family} style={{
          background: '#fff', borderRadius: 12, padding: 16, marginBottom: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <p style={{ fontSize: 13, color: '#8c8484', marginBottom: 8 }}>
            {f.name} — {f.desc}
          </p>
          <p style={{ fontFamily: f.family, fontSize: 28, fontWeight: 700, margin: '4px 0', color: '#4a4444' }}>
            Little Bear ¥12,350.00
          </p>
          <p style={{ fontFamily: f.family, fontSize: 16, margin: 0, color: '#4a4444' }}>
            Good morning · €35.50 · Lunch at ING · Revenue ¥2,000
          </p>
        </div>
      ))}
    </div>
  );
}
