// Ícono de una herramienta: logo de Simple Icons, imagen propia o uno genérico
export default function ToolIcon({ tool, className = 'h-9 w-9' }) {
  if (tool.icon) {
    return (
      <svg viewBox="0 0 24 24" className={className} role="img" aria-hidden="true">
        <path d={tool.icon.path} fill={`#${tool.icon.hex}`} />
      </svg>
    );
  }
  if (tool.iconUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={tool.iconUrl} alt="" draggable={false} className={`${className} object-contain`} />;
  }
  // Ícono genérico de app mientras no haya imagen
  return (
    <svg viewBox="0 0 24 24" className={`${className} text-neutral-400`} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="2" />
      <rect x="13" y="4" width="7" height="7" rx="2" />
      <rect x="4" y="13" width="7" height="7" rx="2" />
      <rect x="13" y="13" width="7" height="7" rx="2" />
    </svg>
  );
}
