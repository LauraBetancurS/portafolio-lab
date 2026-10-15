'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Note from '@/components/mixed/Note';

// Carpeta (React Bits FolderFloat): se abre sola al llegar con el scroll y
// salen flotando tarjetas de los proyectos. Se pueden arrastrar y lanzar;
// al hacer clic en una, te lleva al proyecto. Clic en la carpeta: cerrar/abrir.
const FolderFloat = dynamic(() => import('@/components/ui/FolderFloat/FolderFloat'), {
  ssr: false,
  loading: () => <div style={{ width: 260, height: 206 }} aria-hidden="true" />,
});

const PALETTE = ['#F6C6E6', '#CDE8F8', '#E4EDB0', '#F9CDBF', '#F8D98C'];

// Tamaño según la pantalla (en celular las tarjetas se juntan más)
function useCompact() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return compact;
}

export default function ProjectFolder({ projects }) {
  const router = useRouter();
  const compact = useCompact();

  // Pre-carga las páginas de los proyectos para que abran al instante
  useEffect(() => {
    projects.forEach(p => router.prefetch(`/work/${p.slug}`));
  }, [projects, router]);

  const items = projects.map((p, i) => ({
    label: p.title,
    value: p.slug,
    image: p.cover || null,
    color: p.card_color || PALETTE[i % PALETTE.length],
    sub: p.tags?.slice(0, 2).join(' · '),
  }));

  return (
    <div className="relative flex flex-col items-center" style={{ '--ff-card-w': compact ? '128px' : '160px' }}>
      {/* Espacio arriba para que las tarjetas floten sobre la carpeta */}
      <div aria-hidden="true" style={{ height: compact ? 600 : 420 }} />
      <Note arrow="down-right" rotate={-6} className="absolute bottom-20 left-0 hidden md:flex lg:left-[10%]">
        drag them around,
        <br />
        click one to open it
      </Note>
      <FolderFloat
        items={items}
        label="Selected_work_FINAL"
        sublabel={`${items.length} projects`}
        trigger="click"
        openOnView
        closeOnSelect
        physics
        drift={0.5}
        onSelect={slug => router.push(`/work/${slug}`)}
        folderColor="#DB6A8C"
        frontColor="#F2A2DC"
        paperColor="#ffffff"
        itemColor="#ffffff"
        itemTextColor="#1e1e1e"
        labelColor="#1e1e1e"
        width={compact ? 220 : 260}
        height={compact ? 170 : 190}
        radius={16}
        spread={compact ? 170 : 330}
        lift={30}
        tilt={6}
        flapAngle={34}
        restAngle={14}
        openDuration={560}
        stagger={60}
        bounce={0.3}
        className="font-body"
      />
    </div>
  );
}
