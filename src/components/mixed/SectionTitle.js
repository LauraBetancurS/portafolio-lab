import Scribble from './Scribble';

// Título de sección grande (Neulis) con un subrayado a mano que se dibuja al aparecer.
export default function SectionTitle({ children, scribbleColor = '#F2A2DC', className = '', as: Tag = 'h2' }) {
  return (
    <Tag className={`font-title relative inline-block text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.95] tracking-tight text-neutral-900 ${className}`}>
      <span className="relative z-10">{children}</span>
      <Scribble
        variant="underline"
        color={scribbleColor}
        strokeWidth={10}
        className="absolute -bottom-2 left-0 z-0 h-[0.35em] w-full opacity-80"
      />
    </Tag>
  );
}
