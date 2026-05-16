// 像素风图标 — 16x16 网格，每个格子 1.5px

const PX = 1.5;
const GRID = 16; // viewBox 0-15

interface Props {
  name: 'home' | 'stats' | 'add' | 'history' | 'settings';
  size?: number;
  color?: string;
}

export default function NavIcon({ name, size = 24, color = 'currentColor' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill={color} xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
      {name === 'home' && (
        <>
          <rect x="3" y="2" width="1" height="1"/><rect x="4" y="2" width="1" height="1"/><rect x="5" y="2" width="1" height="1"/><rect x="6" y="2" width="1" height="1"/><rect x="7" y="2" width="1" height="1"/><rect x="8" y="2" width="1" height="1"/><rect x="9" y="2" width="1" height="1"/><rect x="10" y="2" width="1" height="1"/><rect x="11" y="2" width="1" height="1"/>
          <rect x="2" y="3" width="1" height="1"/><rect x="12" y="3" width="1" height="1"/>
          <rect x="1" y="4" width="1" height="1"/><rect x="2" y="4" width="1" height="1"/><rect x="3" y="4" width="1" height="1"/><rect x="4" y="4" width="1" height="1"/><rect x="5" y="4" width="1" height="1"/><rect x="6" y="4" width="1" height="1"/><rect x="7" y="4" width="1" height="1"/><rect x="8" y="4" width="1" height="1"/><rect x="9" y="4" width="1" height="1"/><rect x="10" y="4" width="1" height="1"/><rect x="11" y="4" width="1" height="1"/><rect x="12" y="4" width="1" height="1"/><rect x="13" y="4" width="1" height="1"/>
          <rect x="1" y="5" width="1" height="1"/><rect x="3" y="5" width="1" height="1"/><rect x="4" y="5" width="1" height="1"/><rect x="5" y="5" width="1" height="1"/><rect x="6" y="5" width="1" height="1"/><rect x="7" y="5" width="1" height="1"/><rect x="8" y="5" width="1" height="1"/><rect x="9" y="5" width="1" height="1"/><rect x="10" y="5" width="1" height="1"/><rect x="11" y="5" width="1" height="1"/><rect x="13" y="5" width="1" height="1"/>
          <rect x="1" y="6" width="1" height="1"/><rect x="3" y="6" width="1" height="1"/><rect x="11" y="6" width="1" height="1"/><rect x="13" y="6" width="1" height="1"/>
          <rect x="1" y="7" width="1" height="1"/><rect x="3" y="7" width="1" height="1"/><rect x="4" y="7" width="1" height="1"/><rect x="5" y="7" width="1" height="1"/><rect x="6" y="7" width="1" height="1"/><rect x="7" y="7" width="1" height="1"/><rect x="8" y="7" width="1" height="1"/><rect x="9" y="7" width="1" height="1"/><rect x="10" y="7" width="1" height="1"/><rect x="11" y="7" width="1" height="1"/><rect x="13" y="7" width="1" height="1"/>
          <rect x="1" y="8" width="1" height="1"/><rect x="3" y="8" width="1" height="1"/><rect x="4" y="8" width="1" height="1"/><rect x="5" y="8" width="1" height="1"/><rect x="6" y="8" width="1" height="1"/><rect x="7" y="8" width="1" height="1"/><rect x="8" y="8" width="1" height="1"/><rect x="9" y="8" width="1" height="1"/><rect x="10" y="8" width="1" height="1"/><rect x="11" y="8" width="1" height="1"/><rect x="13" y="8" width="1" height="1"/>
          <rect x="1" y="9" width="1" height="1"/><rect x="3" y="9" width="1" height="1"/><rect x="4" y="9" width="1" height="1"/><rect x="5" y="9" width="1" height="1"/><rect x="6" y="9" width="1" height="1"/><rect x="7" y="9" width="1" height="1"/><rect x="8" y="9" width="1" height="1"/><rect x="9" y="9" width="1" height="1"/><rect x="10" y="9" width="1" height="1"/><rect x="11" y="9" width="1" height="1"/><rect x="13" y="9" width="1" height="1"/>
          <rect x="1" y="10" width="1" height="1"/><rect x="3" y="10" width="1" height="1"/><rect x="4" y="10" width="1" height="1"/><rect x="11" y="10" width="1" height="1"/><rect x="13" y="10" width="1" height="1"/>
          <rect x="1" y="11" width="1" height="1"/><rect x="3" y="11" width="1" height="1"/><rect x="4" y="11" width="1" height="1"/><rect x="11" y="11" width="1" height="1"/><rect x="13" y="11" width="1" height="1"/>
          <rect x="1" y="12" width="1" height="1"/><rect x="3" y="12" width="1" height="1"/><rect x="13" y="12" width="1" height="1"/>
          <rect x="2" y="13" width="1" height="1"/><rect x="3" y="13" width="1" height="1"/><rect x="4" y="13" width="1" height="1"/><rect x="5" y="13" width="1" height="1"/><rect x="6" y="13" width="1" height="1"/><rect x="7" y="13" width="1" height="1"/><rect x="8" y="13" width="1" height="1"/><rect x="9" y="13" width="1" height="1"/><rect x="10" y="13" width="1" height="1"/><rect x="11" y="13" width="1" height="1"/><rect x="12" y="13" width="1" height="1"/>
        </>
      )}

      {name === 'stats' && (
        <>
          <rect x="6" y="11" width="3" height="3"/>
          <rect x="3" y="7" width="3" height="8"/>
          <rect x="9" y="4" width="3" height="11"/>
        </>
      )}

      {name === 'add' && (
        <>
          <rect x="7" y="3" width="1" height="9"/>
          <rect x="3" y="7" width="9" height="1"/>
        </>
      )}

      {name === 'history' && (
        <>
          <rect x="2" y="2" width="1" height="1"/><rect x="3" y="2" width="9" height="1"/><rect x="12" y="2" width="1" height="1"/>
          <rect x="2" y="3" width="1" height="1"/><rect x="12" y="3" width="1" height="1"/>
          <rect x="2" y="4" width="1" height="1"/><rect x="3" y="4" width="9" height="1"/><rect x="12" y="4" width="1" height="1"/>
          <rect x="2" y="6" width="1" height="1"/><rect x="3" y="6" width="9" height="1"/><rect x="12" y="6" width="1" height="1"/>
          <rect x="2" y="7" width="1" height="1"/><rect x="12" y="7" width="1" height="1"/>
          <rect x="2" y="8" width="1" height="1"/><rect x="3" y="8" width="9" height="1"/><rect x="12" y="8" width="1" height="1"/>
          <rect x="2" y="10" width="1" height="1"/><rect x="3" y="10" width="9" height="1"/><rect x="12" y="10" width="1" height="1"/>
          <rect x="2" y="11" width="1" height="1"/><rect x="12" y="11" width="1" height="1"/>
          <rect x="2" y="12" width="1" height="1"/><rect x="3" y="12" width="9" height="1"/><rect x="12" y="12" width="1" height="1"/>
        </>
      )}

      {name === 'settings' && (
        <>
          <rect x="6" y="1" width="3" height="1"/>
          <rect x="5" y="2" width="2" height="2"/><rect x="8" y="2" width="2" height="2"/>
          <rect x="3" y="3" width="3" height="3"/><rect x="9" y="3" width="3" height="3"/>
          <rect x="1" y="4" width="3" height="2"/><rect x="11" y="4" width="3" height="2"/>
          <rect x="1" y="6" width="2" height="3"/><rect x="12" y="6" width="2" height="3"/>
          <rect x="3" y="7" width="3" height="1"/><rect x="9" y="7" width="3" height="1"/>
          <rect x="5" y="8" width="5" height="3"/>
          <rect x="7" y="7" width="1" height="1"/>
          <rect x="9" y="9" width="3" height="3"/><rect x="3" y="9" width="3" height="3"/>
          <rect x="11" y="10" width="3" height="2"/><rect x="1" y="10" width="3" height="2"/>
          <rect x="12" y="11" width="2" height="2"/><rect x="1" y="11" width="2" height="2"/>
          <rect x="3" y="12" width="3" height="1"/><rect x="9" y="12" width="3" height="1"/>
          <rect x="6" y="13" width="3" height="1"/>
        </>
      )}
    </svg>
  );
}
