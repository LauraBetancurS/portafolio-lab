'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitText from '@/components/ui/SplitText';
import { FLOWER_DIVIDER_URL } from '@/lib/assets';
import { useLang } from '@/i18n/lang';

// Tiempos de la animación (en segundos)
const LETTER_STAGGER = 40;   // ms entre letra y letra
const LETTER_DURATION = 0.8;
const SUBTITLE_START = 0.7;  // cuándo empieza el subtítulo
const FLOWER_START = 1.1;    // cuándo aparece la flor
const FLOWER_SPIN_TIME = 40; // segundos que gira antes de detenerse
const TAGLINE_START = 2.0;   // cuándo aparece la frase de abajo

// Frase corta debajo del subtítulo. Cámbiala aquí.
const TAGLINE = {
  en: 'I turn complex problems into digital products people actually enjoy using.',
  es: 'Convierto problemas complejos en productos digitales que la gente de verdad disfruta usar.',
};

export default function HeroTitle() {
  const flowerRef = useRef(null);
  const taglineRef = useRef(null);
  const { lang, t, tr } = useLang();

  // La flor aparece girando y crece con un pequeño rebote,
  // gira despacio y al final frena suavemente hasta quedar quieta.
  useGSAP(() => {
    const flower = flowerRef.current;
    if (!flower) return;
    // Con 'reducir movimiento' activado, todo aparece quieto de una vez
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set([flower, taglineRef.current], { opacity: 1 });
      return;
    }
    gsap.timeline({ delay: FLOWER_START })
      .fromTo(
        flower,
        { opacity: 0, scale: 0, rotate: -180 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1, ease: 'back.out(1.8)' }
      )
      // Giro constante (30°/s)...
      .to(flower, { rotate: 816, duration: FLOWER_SPIN_TIME - 12.8, ease: 'none' })
      // ...y frenado suave en los últimos 12.8 s. Termina en 1008°,
      // múltiplo de 72°, así la flor (5 pétalos) queda en su posición original.
      .to(flower, { rotate: 1008, duration: 12.8, ease: 'power1.out' });

    // La frase aparece suave cuando termina el subtítulo
    if (taglineRef.current) {
      gsap.fromTo(
        taglineRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: TAGLINE_START }
      );
    }
  });

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {/* key={lang}: al cambiar de idioma la frase se vuelve a escribir letra por letra */}
      <SplitText
        key={`title-${lang}`}
        tag="h1"
        text={t('hi, I’m Laura Betancur', 'hola, soy Laura Betancur')}
        // en español la frase es más larga: un poquito más pequeña para que no choque con los stickers
        className={`font-title text-5xl font-normal ${lang === 'es' ? 'md:text-[4.1rem]' : 'md:text-7xl'}`}
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
          key={`role-${lang}`}
          tag="span"
          text={t('Product designer', 'Diseñadora de producto')}
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
          key={`dev-${lang}`}
          tag="span"
          text={t('front-end dev', 'dev front-end')}
          delay={LETTER_STAGGER}
          duration={LETTER_DURATION}
          startDelay={SUBTITLE_START + 0.6}
          from={{ opacity: 0, y: 30 }}
          to={{ opacity: 1, y: 0 }}
          rootMargin="0px"
        />
      </div>

      <p
        ref={taglineRef}
        className="font-body mt-4 max-w-[66ch] text-balance text-base leading-relaxed text-neutral-600 opacity-0 md:text-lg"
      >
        {tr(TAGLINE)}
      </p>
    </div>
  );
}
