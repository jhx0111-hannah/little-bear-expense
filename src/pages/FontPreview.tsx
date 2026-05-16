import { useEffect } from 'react';

const CN_FONTS = [
  { name: '① Noto Serif SC', family: 'Noto Serif SC', desc: '思源宋体·优雅经典' },
  { name: '② cwTeXFangSong', family: 'cwTeXFangSong', desc: '仿宋体·清瘦秀美' },
  { name: '③ LXGW WenKai', family: 'LXGW WenKai', desc: '霞鹜文楷·文艺温暖' },
  { name: '④ Noto Serif TC', family: 'Noto Serif TC', desc: '宋体繁中·古典精致' },
  { name: '⑤ STSong', family: 'STSong, Songti SC, serif', desc: '系统宋体·经典耐看' },
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
    // Google Fonts
    const link1 = document.createElement('link');
    link1.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Noto+Serif+TC:wght@400;700&family=cwTeXFangSong&family=Nunito:wght@400;600;700&family=Quicksand:wght@400;600;700&family=Fredoka:wght@400;600;700&family=Baloo+2:wght@400;600;700&family=Patrick+Hand&display=swap';
    link1.rel = 'stylesheet';
    // 霞鹜文楷 CDN
    const link2 = document.createElement('link');
    link2.href = 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css';
    link2.rel = 'stylesheet';
    document.head.appendChild(link1);
    document.head.appendChild(link2);
    return () => {
      document.head.removeChild(link1);
      document.head.removeChild(link2);
    };
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
