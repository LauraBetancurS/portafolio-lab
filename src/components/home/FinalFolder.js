'use client';

import dynamic from 'next/dynamic';
import { useLang } from '@/i18n/lang';

// El Folder calcula sus colores con <canvas>, que solo existe en el navegador.
// Por eso se carga solo del lado del cliente (evita diferencias servidor/navegador).
// Mientras carga, se reserva el mismo espacio para que nada salte.
const Folder = dynamic(() => import('@/components/ui/Folder/Folder'), {
  ssr: false,
  loading: () => <div style={{ width: 224 * 0.48, height: 196 * 0.48 }} />,
});

// Archivos que salen de la carpeta al hacer hover
const FILES = {
  en: [{ title: 'UX Research' }, { title: 'UI Design' }, { title: 'AI Product' }],
  es: [{ title: 'Investigación UX' }, { title: 'Diseño UI' }, { title: 'Producto IA' }],
};

// Carpeta azul estilo macOS con el nombre "Final_Final_Final" debajo.
// Cerrada por defecto; se abre al pasar el mouse.
export default function FinalFolder({ size = 0.48, className = '' }) {
  const { lang } = useLang();
  return (
    <div className={`flex -rotate-[8deg] flex-col items-center ${className}`}>
      <Folder
        items={FILES[lang]}
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
