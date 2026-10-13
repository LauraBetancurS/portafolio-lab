'use client';

import dynamic from 'next/dynamic';

// El Folder calcula sus colores con <canvas>, que solo existe en el navegador.
// Por eso se carga solo del lado del cliente (evita diferencias servidor/navegador).
// Mientras carga, se reserva el mismo espacio para que nada salte.
const Folder = dynamic(() => import('@/components/ui/Folder/Folder'), {
  ssr: false,
  loading: () => <div style={{ width: 224 * 0.6, height: 196 * 0.6 }} />,
});

// Archivos de broma que salen de la carpeta al hacer hover
const FILES = [
  { title: 'final.fig' },
  { title: 'final_v2.fig' },
  { title: 'final_REAL.fig' },
];

// Carpeta azul estilo macOS con el nombre "Final_Final_Final" debajo.
// Cerrada por defecto; se abre al pasar el mouse.
export default function FinalFolder({ size = 0.6, className = '' }) {
  return (
    <div className={`flex -rotate-[8deg] flex-col items-center ${className}`}>
      <Folder
        items={FILES}
        color="#5AB4F6"
        paperColor="#ffffff"
        theme="light"
        openOn="hover"
        layout="spread"
        size={size}
        tilt={0.5}
        bounce={0.4}
        draggable={false}
        zoomOnClick={false}
      />
      <span className="mt-1 text-xs tracking-wide text-neutral-800 select-none">
        Final_Final_Final
      </span>
    </div>
  );
}
