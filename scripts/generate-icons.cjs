// 生成 PWA 图标 — 简约小熊脸
const { writeFileSync, mkdirSync } = require('fs');

function createSvg(size, bgColor) {
  const s = size;
  const cx = s / 2;
  const earR = s * 0.16;
  const headRx = s * 0.32;
  const headRy = s * 0.29;
  const faceRx = s * 0.18;
  const faceRy = s * 0.14;
  const eyeR = s * 0.035;
  const noseRx = s * 0.05;
  const noseRy = s * 0.035;
  const blushR = s * 0.05;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" rx="22%" fill="${bgColor}"/>
  <circle cx="${cx - s * 0.28}" cy="${s * 0.27}" r="${earR}" fill="#b5a08a"/>
  <circle cx="${cx + s * 0.28}" cy="${s * 0.27}" r="${earR}" fill="#b5a08a"/>
  <ellipse cx="${cx}" cy="${s * 0.56}" rx="${headRx}" ry="${headRy}" fill="#b5a08a"/>
  <ellipse cx="${cx}" cy="${s * 0.64}" rx="${faceRx}" ry="${faceRy}" fill="#d4ccc4"/>
  <circle cx="${cx - s * 0.1}" cy="${s * 0.52}" r="${eyeR}" fill="#4a4444"/>
  <circle cx="${cx + s * 0.1}" cy="${s * 0.52}" r="${eyeR}" fill="#4a4444"/>
  <ellipse cx="${cx}" cy="${s * 0.6}" rx="${noseRx}" ry="${noseRy}" fill="#8c7a6a"/>
  <path d="M${cx - s * 0.08} ${s * 0.68} Q${cx} ${s * 0.72} ${cx + s * 0.08} ${s * 0.68}"
    stroke="#4a4444" stroke-width="${s * 0.015}" fill="none" stroke-linecap="round"/>
  <circle cx="${cx - s * 0.18}" cy="${s * 0.62}" r="${blushR}" fill="#d4b8b8" opacity="0.5"/>
  <circle cx="${cx + s * 0.18}" cy="${s * 0.62}" r="${blushR}" fill="#d4b8b8" opacity="0.5"/>
</svg>`;
}

const sizes = [
  { name: 'pwa-192x192.png', size: 192, bg: '#faf7f2' },
  { name: 'pwa-512x512.png', size: 512, bg: '#faf7f2' },
  { name: 'apple-touch-icon.png', size: 180, bg: '#faf7f2' },
];

mkdirSync('public', { recursive: true });

sizes.forEach(({ name, size, bg }) => {
  const svg = createSvg(size, bg);
  writeFileSync(`public/${name.replace('.png', '.svg')}`, svg);
  console.log(`Generated: public/${name.replace('.png', '.svg')}`);
});

console.log('Done! SVG icons created.');
