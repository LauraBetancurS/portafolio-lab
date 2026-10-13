// Pedazo de cinta adhesiva (washi tape) con bordes rasgados.
// Úsalo dentro de un elemento con position: relative.
const COLORS = {
  pink: 'rgba(242, 162, 220, 0.6)',
  lime: 'rgba(201, 219, 75, 0.55)',
  sky: 'rgba(169, 214, 245, 0.65)',
  yellow: 'rgba(248, 217, 140, 0.7)',
  white: 'rgba(255, 255, 255, 0.7)',
};

// Bordes izquierdo y derecho en zigzag, como cinta cortada con la mano
const TORN =
  'polygon(0% 8%, 3% 0%, 97% 4%, 100% 0%, 98% 22%, 100% 45%, 97% 70%, 100% 100%, 4% 96%, 0% 100%, 2% 75%, 0% 50%, 3% 28%)';

export default function Tape({ color = 'pink', rotate = -4, className = '', style }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-10 block h-7 w-24 ${className}`}
      style={{
        backgroundColor: COLORS[color] ?? color,
        clipPath: TORN,
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    />
  );
}
