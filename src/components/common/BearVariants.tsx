// ========================================
// 小熊记账 — 5个熊形象备选方案
// ========================================

function BearWrap({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      padding: 24,
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 2px 8px rgba(74,68,68,0.06)',
      minWidth: 140,
    }}>
      <div style={{ width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
      <span style={{ fontSize: 13, color: '#8c8484', fontWeight: 500 }}>{label}</span>
    </div>
  );
}

// ====================================================
// 方案1：圆润团子熊 — 极简软萌，像糯米团子
// ====================================================
export function Bear1({ size = 100 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <circle cx="33" cy="30" r="16" fill="#b5a08a"/>
      <circle cx="87" cy="30" r="16" fill="#b5a08a"/>
      <circle cx="33" cy="30" r="9" fill="#d4b8b8"/>
      <circle cx="87" cy="30" r="9" fill="#d4b8b8"/>
      <ellipse cx="60" cy="68" rx="34" ry="32" fill="#b5a08a"/>
      <ellipse cx="60" cy="76" rx="20" ry="17" fill="#d4ccc4"/>
      <circle cx="49" cy="63" r="3.5" fill="#4a4444"/>
      <circle cx="71" cy="63" r="3.5" fill="#4a4444"/>
      <ellipse cx="60" cy="72" rx="5" ry="4" fill="#8c7a6a"/>
      <path d="M54 81 Q60 86 66 81" stroke="#4a4444" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <circle cx="43" cy="76" r="5" fill="#d4b8b8" opacity="0.4"/>
      <circle cx="77" cy="76" r="5" fill="#d4b8b8" opacity="0.4"/>
    </svg>
  );
}

// ====================================================
// 方案2：极简线条熊 — 只有轮廓线条，ins风
// ====================================================
export function Bear2({ size = 100 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <circle cx="32" cy="30" r="15" stroke="#b5a08a" strokeWidth="2.5"/>
      <circle cx="88" cy="30" r="15" stroke="#b5a08a" strokeWidth="2.5"/>
      <circle cx="60" cy="68" rx="33" ry="31" stroke="#b5a08a" strokeWidth="2.5"/>
      <circle cx="48" cy="62" r="2.8" fill="#4a4444"/>
      <circle cx="72" cy="62" r="2.8" fill="#4a4444"/>
      <ellipse cx="60" cy="72" rx="5.5" ry="4.5" stroke="#b5a08a" strokeWidth="2.5"/>
      <path d="M54 80 Q60 84 66 80" stroke="#b5a08a" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="42" cy="74" r="4" fill="#d4b8b8" opacity="0.5"/>
      <circle cx="78" cy="74" r="4" fill="#d4b8b8" opacity="0.5"/>
    </svg>
  );
}

// ====================================================
// 方案3：豆豆眼小熊 — 超萌日系简笔风
// ====================================================
export function Bear3({ size = 100 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <ellipse cx="33" cy="31" rx="14" ry="12" fill="#c4a8a8"/>
      <ellipse cx="87" cy="31" rx="14" ry="12" fill="#c4a8a8"/>
      <ellipse cx="33" cy="32" rx="9" ry="7.5" fill="#d4b8b8"/>
      <ellipse cx="87" cy="32" rx="9" ry="7.5" fill="#d4b8b8"/>
      <ellipse cx="60" cy="66" rx="32" ry="30" fill="#c4a8a8"/>
      <ellipse cx="60" cy="74" rx="19" ry="15" fill="#f5f0eb"/>
      <circle cx="50" cy="62" r="2.2" fill="#4a4444"/>
      <circle cx="70" cy="62" r="2.2" fill="#4a4444"/>
      <circle cx="50" cy="60.5" r="0.8" fill="white"/>
      <circle cx="70" cy="60.5" r="0.8" fill="white"/>
      <ellipse cx="60" cy="72" rx="4" ry="3.2" fill="#8c7a6a"/>
      <path d="M55 79 Q60 82 65 79" stroke="#4a4444" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <circle cx="43" cy="74" r="4" fill="#d4b8b8" opacity="0.45"/>
      <circle cx="77" cy="74" r="4" fill="#d4b8b8" opacity="0.45"/>
    </svg>
  );
}

// ====================================================
// 方案4：圆脸大耳熊 — 大耳朵更显萌，扁平色块
// ====================================================
export function Bear4({ size = 100 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <g opacity="0.95">
        <circle cx="24" cy="32" r="20" fill="#b5c4b1"/>
        <circle cx="96" cy="32" r="20" fill="#b5c4b1"/>
        <circle cx="24" cy="32" r="12" fill="#d4e0d0"/>
        <circle cx="96" cy="32" r="12" fill="#d4e0d0"/>
        <ellipse cx="60" cy="66" rx="36" ry="33" fill="#b5c4b1"/>
        <ellipse cx="60" cy="76" rx="22" ry="16" fill="#f5f0eb"/>
        <circle cx="48" cy="62" r="3.5" fill="#4a4444"/>
        <circle cx="72" cy="62" r="3.5" fill="#4a4444"/>
        <ellipse cx="60" cy="72" rx="5" ry="3.8" fill="#7a8a75"/>
        <path d="M53 80 Q60 86 67 80" stroke="#4a4444" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <circle cx="42" cy="75" r="5" fill="#d4b8b8" opacity="0.4"/>
        <circle cx="78" cy="75" r="5" fill="#d4b8b8" opacity="0.4"/>
      </g>
    </svg>
  );
}

// ====================================================
// 方案5：趴趴熊 — 慵懒ins风，带身体
// ====================================================
export function Bear5({ size = 100 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* 身体 */}
      <ellipse cx="60" cy="92" rx="28" ry="18" fill="#b5a08a"/>
      <ellipse cx="60" cy="94" rx="18" ry="11" fill="#d4ccc4"/>
      {/* 头 */}
      <ellipse cx="60" cy="55" rx="30" ry="28" fill="#b5a08a"/>
      {/* 耳朵 */}
      <circle cx="35" cy="32" r="14" fill="#b5a08a"/>
      <circle cx="85" cy="32" r="14" fill="#b5a08a"/>
      <circle cx="35" cy="32" r="8" fill="#d4b8b8"/>
      <circle cx="85" cy="32" r="8" fill="#d4b8b8"/>
      {/* 脸 */}
      <ellipse cx="60" cy="63" rx="19" ry="15" fill="#d4ccc4"/>
      <circle cx="50" cy="54" r="3.2" fill="#4a4444"/>
      <circle cx="70" cy="54" r="3.2" fill="#4a4444"/>
      <ellipse cx="60" cy="62" rx="4.5" ry="3.5" fill="#8c7a6a"/>
      <path d="M54 68 Q60 73 66 68" stroke="#4a4444" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <circle cx="44" cy="63" r="4.5" fill="#d4b8b8" opacity="0.4"/>
      <circle cx="76" cy="63" r="4.5" fill="#d4b8b8" opacity="0.4"/>
      {/* 前爪 */}
      <ellipse cx="43" cy="86" rx="10" ry="7" fill="#b5a08a" transform="rotate(-15 43 86)"/>
      <ellipse cx="77" cy="86" rx="10" ry="7" fill="#b5a08a" transform="rotate(15 77 86)"/>
    </svg>
  );
}
