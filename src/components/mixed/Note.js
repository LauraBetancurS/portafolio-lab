// Nota escrita a mano con una flechita, como las anotaciones de un cuaderno.
// arrow: 'down-left' | 'down-right' | 'left' | 'right' | 'up-left' | 'none'
const ARROWS = {
  'down-left': { d: 'M34 4 C 30 18, 20 26, 6 30 M6 30 L 14 22 M6 30 L 16 33', className: 'h-9 w-10' },
  'down-right': { d: 'M6 4 C 10 18, 20 26, 34 30 M34 30 L 26 22 M34 30 L 24 33', className: 'h-9 w-10' },
  left: { d: 'M38 14 C 28 6, 16 10, 4 16 M4 16 L 12 8 M4 16 L 13 21', className: 'h-6 w-11' },
  right: { d: 'M4 14 C 14 6, 26 10, 38 16 M38 16 L 30 8 M38 16 L 29 21', className: 'h-6 w-11' },
  'up-left': { d: 'M34 32 C 30 18, 20 10, 6 6 M6 6 L 15 4 M6 6 L 10 14', className: 'h-9 w-10' },
  none: null,
};

export default function Note({ children, arrow = 'none', arrowFirst = false, rotate = -4, color = '#2b2b2b', className = '' }) {
  const a = ARROWS[arrow];
  const arrowSvg = a && (
    <svg viewBox="0 0 40 36" className={`shrink-0 ${a.className}`} fill="none" aria-hidden="true">
      <path d={a.d} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div
      className={`font-hand pointer-events-none flex items-center gap-1 text-xl leading-tight select-none ${className}`}
      style={{ color, transform: `rotate(${rotate}deg)` }}
    >
      {arrowFirst && arrowSvg}
      <p className="whitespace-pre-line">{children}</p>
      {!arrowFirst && arrowSvg}
    </div>
  );
}
