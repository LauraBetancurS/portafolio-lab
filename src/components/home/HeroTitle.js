'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitText from '@/components/ui/SplitText';
import { FLOWER_DIVIDER_URL } from '@/lib/assets';

// Tiempos de la animación (en segundos)
const LETTER_STAGGER = 40;   // ms entre letra y letra
const LETTER_DURATION = 0.8;
const SUBTITLE_START = 0.7;  // cuándo empieza el subtítulo
const FLOWER_START = 1.1;    // cuándo aparece la flor

export default function HeroTitle() {
  const flowerRef = useRef(null);

  // La flor aparece girando y crece con un pequeño rebote,
  // luego queda girando muy despacio.
  useGSAP(() => {
    const flower = flowerRef.current;
    if (!flower) return;
    gsap.timeline({ delay: FLOWER_START })
      .fromTo(
        flower,
        { opacity: 0, scale: 0, rotate: -180 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1, ease: 'back.out(1.8)' }
      )
      .to(flower, { rotate: 360, duration: 12, ease: 'none', repeat: -1 });
  });

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <SplitText
        tag="h1"
        text="hi, I’m Laura Betancur"
        className="font-title text-5xl font-normal md:text-7xl"
        delay={LETTER_STAGGER}
        duration={LETTER_DURATION}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 40 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="-100px"
      />

      <div className="font-title flex flex-wrap items-center justify-center gap-x-4 text-2xl md:text-4xl">
        <SplitText
          tag="span"
          text="Product designer"
          delay={LETTER_STAGGER}
          duration={LETTER_DURATION}
          startDelay={SUBTITLE_START}
          from={{ opacity: 0, y: 30 }}
          to={{ opacity: 1, y: 0 }}
          rootMargin="0px"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={flowerRef}
          src={FLOWER_DIVIDER_URL}
          alt=""
          aria-hidden="true"
          className="h-[1.3em] w-auto opacity-0"
        />
        <SplitText
          tag="span"
          text="front-end dev"
          delay={LETTER_STAGGER}
          duration={LETTER_DURATION}
          startDelay={SUBTITLE_START + 0.6}
          from={{ opacity: 0, y: 30 }}
          to={{ opacity: 1, y: 0 }}
          rootMargin="0px"
        />
      </div>
    </div>
  );
}
