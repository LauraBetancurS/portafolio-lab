'use client';

import ProfileCard from '@/components/ui/ProfileCard/ProfileCard';
import Tape from '@/components/mixed/Tape';
import { scrollToContact } from '@/components/layout/ContactLink';
import { ABOUT_PHOTO_URL, LOGO_URL } from '@/lib/assets';
import { useLang } from '@/i18n/lang';

// Tu foto como tarjeta holográfica (React Bits ProfileCard), vestida con el
// estilo de la página: papel blanco pegado con cinta, fuente Neulis, fondo
// celeste de la paleta y botón negro como los demás. Se inclina hacia el
// cursor y el brillo tornasol aparece a través del patrón del logo.
// "Say hi" baja hasta el footer.
export default function MeCard() {
  const { t } = useLang();
  return (
    <div className="me-card relative -rotate-2 transition-transform duration-500 ease-[var(--ease-out)] hover:rotate-0">
      <Tape color="pink" rotate={-6} className="-top-3 left-8 z-10" />
      <Tape color="lime" rotate={5} className="-top-3 right-8 z-10" />
      <ProfileCard
        avatarUrl={ABOUT_PHOTO_URL}
        iconUrl={LOGO_URL}
        name="Laura Betancur"
        title={t('Product designer & front-end dev', 'Diseñadora UX/UI y dev front-end')}
        handle="LauraBetancurS"
        status={t('Open to new projects', 'Disponible para proyectos')}
        statusColor="#C9DB4B"
        contactText={t('Say hi', 'Saluda')}
        theme="light"
        frameColor="#ffffff"
        backdropColor="#A9D6F5"
        radius={6}
        holo={0.7}
        glare={0.45}
        tiltStrength={10}
        parallax={8}
        enableTilt
        intro
        showUserInfo
        onContactClick={scrollToContact}
        className="font-body w-full"
      />
    </div>
  );
}
