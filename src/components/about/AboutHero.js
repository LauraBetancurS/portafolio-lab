'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Note from '@/components/mixed/Note';
import { CONTACTS } from '@/data/contact';
import { ABOUT_PHOTO_URL, LOGO_URL, MICROPHONE_URL } from '@/lib/assets';
import { makeBadge } from '@/lib/makeBadge';
import { useLang } from '@/i18n/lang';

gsap.registerPlugin(useGSAP);

// El lanyard usa WebGL (three.js): solo existe en el navegador
const Lanyard = dynamic(() => import('@/components/ui/Lanyard/Lanyard'), { ssr: false });

// Datos impresos en la credencial
const BADGE = {
  name: 'Laura Betancur',
  role: { en: 'Product designer & front-end dev', es: 'Diseñadora de producto y dev front-end' },
  place: 'Cali, Colombia ✦',
  website: 'github.com/LauraBetancurS',
};

// ¿Pantalla de celular? (la credencial se ve un poco más pequeña)
const PHONE = '(max-width: 639px)';
const subscribePhone = cb => {
  const q = window.matchMedia(PHONE);
  q.addEventListener('change', cb);
  return () => q.removeEventListener('change', cb);
};
const usePhone = () =>
  useSyncExternalStore(subscribePhone, () => window.matchMedia(PHONE).matches, () => false);

export default function AboutHero() {
  const rootRef = useRef(null);
  const [badge, setBadge] = useState(null);
  const phone = usePhone();
  const { lang, t, tr } = useLang();

  // Arma las imágenes de la credencial (frente, reverso y cinta), en el idioma actual
  useEffect(() => {
    let active = true;
    makeBadge({ photoUrl: ABOUT_PHOTO_URL, logoUrl: LOGO_URL, ...BADGE, role: BADGE.role[lang] }).then(images => {
      if (active) setBadge(images);
    });
    return () => {
      active = false;
    };
  }, [lang]);

  // Las notas a mano aparecen después de que cae la credencial
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from('.hero-note', { opacity: 0, y: 10, stagger: 0.15, duration: 0.6, delay: 1.1 });
    },
    { scope: rootRef }
  );

  const email = CONTACTS.find(c => c.label === 'Email');
  const others = CONTACTS.filter(c => c.label !== 'Email');

  return (
    <section ref={rootRef} className="relative mx-auto max-w-7xl lg:min-h-[86vh]">
      <div className="relative grid gap-6 lg:grid-cols-[1fr_minmax(0,480px)]">
        {/* Texto */}
        <div className="relative pt-10">
          <Note arrow="down-left" arrowFirst rotate={-8} className="hero-note absolute -left-2 -top-2 md:-left-10">
            {t('who made this?', '¿quién hizo esto?')}
          </Note>

          <h1 className="font-title w-fit text-[clamp(4rem,11vw,9.5rem)] leading-[0.88] tracking-tight text-neutral-900">
            {t('oh, hi.', 'ah, hola.')}
            <br />
            {t('i’m', 'soy')} <em className="font-title italic">Lau.</em>
          </h1>

          <p className="font-body mt-8 text-xl leading-snug text-neutral-500">
            {t('still curious.', 'todavía curiosa.')}
            <br />
            {t('still designing.', 'todavía diseñando.')}
            <br />
            {t('still opening Figma tabs.', 'todavía abriendo pestañas de Figma.')}
          </p>

          <p className="font-title mt-8 max-w-[18ch] text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] text-neutral-900">
            {t('let’s build something that feels', 'construyamos algo que se sienta')} <em className="italic">{t('human', 'humano')}</em>.
          </p>

          <div className="mt-10 flex max-w-xl flex-col gap-3">
            {email && (
              <a
                href={tr(email.href)}
                className="press font-body group flex items-center justify-between rounded-lg bg-black px-6 py-4 text-lg text-white hover:-translate-y-0.5 sm:w-fit sm:gap-16"
              >
                {email.value}
                <span className="transition-transform duration-200 group-hover:rotate-45">↗</span>
              </a>
            )}
            <div className="flex flex-wrap gap-3">
              {others.map(c => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press font-body group flex items-center gap-10 rounded-lg px-6 py-3.5 text-lg text-neutral-900 ring-1 ring-black/25 hover:bg-white"
                >
                  {c.label.toLowerCase()}
                  <span className="transition-transform duration-200 group-hover:rotate-45">↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* Sticker con dato curioso */}
          <div className="relative mt-14 flex items-end gap-2 lg:absolute lg:-right-10 lg:bottom-4 lg:mt-0">
            <Note arrow="down-right" rotate={-6} className="hero-note mb-16">
              {t('fun fact:\nI sing in musical theater.', 'dato curioso:\ncanto en teatro musical.')}
            </Note>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MICROPHONE_URL}
              alt=""
              className="h-28 w-auto -rotate-12 drop-shadow-xl transition-transform duration-300 hover:animate-sticker-wiggle"
            />
          </div>
        </div>

        {/* Credencial colgante (lanyard 3D) */}
        <div className="relative -mx-6 mt-4 h-[500px] sm:mx-0 sm:h-[560px] lg:-mt-32 lg:h-[88vh]">
          <div className="absolute inset-0" aria-label={t('Laura’s ID badge. Drag it around, or click it to flip it.', 'Credencial de Laura. Arrástrala o haz clic para voltearla.')} role="img">
            {badge && (
              <Lanyard
                frontImage={badge.front}
                backImage={badge.back}
                strapImage={badge.strap}
                strapColor="#F2A2DC"
                cardColor="#ffffff"
                finish="glossy"
                metal="silver"
                size={phone ? 0.42 : 0.5}
                strapLength={0.42}
                breeze={0.4}
              />
            )}
          </div>

          <Note arrow="up-left" arrowFirst rotate={-5} className="hero-note pointer-events-none absolute bottom-[3%] left-1/2 w-max -translate-x-1/2 lg:bottom-[6%]">
            {t('drag me, throw me,\nclick to flip me!', '¡arrástrame, lánzame,\nhaz clic para voltearme!')}
          </Note>
        </div>
      </div>
    </section>
  );
}
