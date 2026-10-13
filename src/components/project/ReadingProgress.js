'use client';

import { useEffect, useRef } from 'react';

// Barra fina arriba de la pantalla que se llena mientras lees el proyecto.
export default function ReadingProgress({ color = '#F2A2DC' }) {
  const ref = useRef(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-1">
      <div ref={ref} className="h-full origin-left" style={{ backgroundColor: color, transform: 'scaleX(0)' }} />
    </div>
  );
}
