'use client';

import dynamic from 'next/dynamic';
import { useSyncExternalStore } from 'react';

// El Folder calcula sus colores con <canvas>, que solo existe en el navegador.
// Por eso se carga solo del lado del cliente (evita diferencias servidor/navegador).
// Mientras carga, se reserva el mismo espacio para que nada salte.
const Folder = dynamic(() => import('@/components/ui/Folder/Folder'), {
  ssr: false,
  loading: () => <div style={{ width: 224 * 0.48, height: 196 * 0.48 }} />,
});

// Archivos que salen de la carpeta al hacer hover
const FILES = [
  { title: 'UX Research' },
  { title: 'UI Design' },
  { title: 'AI Product' },
];

// Carpeta azul estilo macOS con el nombre "Final_Final_Final" debajo.
// Cerrada por defecto; se abre al pasar el mouse.
// Ancho de la ventana (se actualiza al redimensionar)
const subscribe = cb => {
  window.addEventListener('resize', cb);
  return () => window.removeEventListener('resize', cb);
};
const getWidth = () => window.innerWidth;
const getServerWidth = () => 1440;

// En pantallas anchas la carpeta mide la mitad de la sticky note (15.6vw),
// igual que en el mockup. En las demás, un tamaño fijo.
function folderSizeFor(viewportWidth) {
  if (viewportWidth < 1280) return 0.48;
  const folderPx = viewportWidth * 0.156 * 0.5;
  return Math.min(0.75, Math.max(0.4, folderPx / 224));
}

export default function FinalFolder({ className = '' }) {
  const viewportWidth = useSyncExternalStore(subscribe, getWidth, getServerWidth);
  const size = folderSizeFor(viewportWidth);
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
        intro={false}
      />
      <span className="mt-0.5 text-[10px] tracking-wide text-neutral-800 select-none">
        Final_Final_Final
      </span>
    </div>
  );
}
