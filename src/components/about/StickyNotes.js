// Proyectos y lugares donde ha trabajado, como notas adhesivas sobre el canvas.
const NOTES = [
  {
    title: 'GdO Solar for Promigas',
    text: 'Designed a pre-sale onboarding experience for people curious about solar energy.',
    color: '#F8D98C',
    rotate: '-rotate-3',
  },
  {
    title: 'Gases de Occidente',
    text: 'Worked with a real client through coursework, from research to interface.',
    color: '#F6C6E6',
    rotate: 'rotate-2',
  },
  {
    title: 'InnLab',
    text: 'Part of the foresight team at a strategic innovation consultancy, mapping what comes next.',
    color: '#CDE8F8',
    rotate: '-rotate-1',
  },
];

export default function StickyNotes() {
  return (
    <ul className="grid gap-8 sm:grid-cols-3">
      {NOTES.map(note => (
        <li
          key={note.title}
          className={`${note.rotate} p-6 pb-10 shadow-[0_14px_30px_-14px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:rotate-0 hover:-translate-y-1`}
          style={{ backgroundColor: note.color }}
        >
          <h3 className="font-title mb-3 text-xl text-neutral-900">{note.title}</h3>
          <p className="font-body text-[15px] leading-relaxed text-neutral-800">{note.text}</p>
        </li>
      ))}
    </ul>
  );
}
