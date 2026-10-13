// Cinta negra con texto que se desplaza sin parar (se pausa con el mouse encima).
const ITEMS = ['UX research', 'UI design', 'Front-end', 'AI products', 'Prototyping', 'Design systems', 'Motion'];
const STAR_COLORS = ['#F2A2DC', '#C9DB4B', '#A9D6F5', '#E8603C'];

function Star({ color }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.2l7.1-.6z" fill={color} />
    </svg>
  );
}

function Row({ hidden }) {
  return (
    <div className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={hidden || undefined}>
      {ITEMS.map((item, i) => (
        <span key={item} className="flex items-center gap-8">
          <span className="font-title whitespace-nowrap text-2xl text-white md:text-3xl">{item}</span>
          <Star color={STAR_COLORS[i % STAR_COLORS.length]} />
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="relative z-10 -mx-2 -rotate-[1.5deg] overflow-hidden bg-black py-4 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.6)]">
      <p className="sr-only">{ITEMS.join(', ')}</p>
      <div className="marquee-track flex w-max">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
