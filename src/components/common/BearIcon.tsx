interface Props {
  variant?: 'waving' | 'happy' | 'thinking' | 'sleeping' | 'default';
  size?: number;
  className?: string;
}

export default function BearIcon({ variant = 'default', size = 80, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 耳朵 */}
      <circle cx="30" cy="28" r="18" fill="#b5a08a" />
      <circle cx="90" cy="28" r="18" fill="#b5a08a" />
      <circle cx="30" cy="28" r="11" fill="#d4b8b8" />
      <circle cx="90" cy="28" r="11" fill="#d4b8b8" />

      {/* 头 */}
      <ellipse cx="60" cy="62" rx="38" ry="35" fill="#b5a08a" />

      {/* 脸部浅色区域 */}
      <ellipse cx="60" cy="72" rx="24" ry="20" fill="#d4ccc4" />

      {/* 眼睛 */}
      {variant === 'sleeping' ? (
        <>
          <path d="M45 58 Q49 54 53 58" stroke="#4a4444" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M67 58 Q71 54 75 58" stroke="#4a4444" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="48" cy="58" r="4" fill="#4a4444" />
          <circle cx="72" cy="58" r="4" fill="#4a4444" />
          {variant === 'happy' && (
            <>
              <circle cx="46" cy="56" r="1.5" fill="white" />
              <circle cx="70" cy="56" r="1.5" fill="white" />
            </>
          )}
        </>
      )}

      {/* 鼻子 */}
      <ellipse cx="60" cy="68" rx="6" ry="4.5" fill="#8c7a6a" />

      {/* 嘴巴 */}
      {variant === 'happy' ? (
        <path d="M52 76 Q60 84 68 76" stroke="#4a4444" strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : variant === 'thinking' ? (
        <ellipse cx="60" cy="78" rx="4" ry="3" fill="#4a4444" />
      ) : (
        <path d="M54 78 Q60 82 66 78" stroke="#4a4444" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      )}

      {/* 腮红 */}
      <circle cx="40" cy="72" r="6" fill="#d4b8b8" opacity="0.5" />
      <circle cx="80" cy="72" r="6" fill="#d4b8b8" opacity="0.5" />

      {/* 手（招手） */}
      {variant === 'waving' && (
        <g className="anim-bear-waving">
          <ellipse cx="98" cy="48" rx="10" ry="7" fill="#b5a08a" transform="rotate(-20 98 48)" />
        </g>
      )}
    </svg>
  );
}
