const SIZES = {
  sm: { symbol: 16, text: '16px', gap: '8px' },
  md: { symbol: 22, text: '22px', gap: '10px' },
  lg: { symbol: 30, text: '30px', gap: '12px' },
}

function LogoSymbol({ size = 22 }) {
  return (
    <svg width={size} height={Math.round(size * 1.56)} viewBox="0 0 36 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="0,52 18,32 36,52" stroke="#1D9E75" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.35" />
      <polyline points="0,38 18,18 36,38" stroke="#1D9E75" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
      <polyline points="0,24 18,4 36,24" stroke="#5DCAA5" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Logo({ size = 'md', dark = false }) {
  const { symbol, text, gap } = SIZES[size] ?? SIZES.md
  const base = dark ? '#111A14' : '#FFFFFF'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, lineHeight: 1 }}>
      <LogoSymbol size={symbol} />
      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: text, letterSpacing: '-0.3px', lineHeight: 1 }}>
        <span style={{ fontWeight: 700, color: base }}>Yo</span>
        <span style={{ fontWeight: 400, color: '#5DCAA5' }}>Pido</span>
        <span style={{ fontWeight: 700, color: base }}>Dieta</span>
      </span>
    </div>
  )
}
