'use client';

import ProfileCard from '@/components/ui/ProfileCard/ProfileCard';
import { scrollToContact } from '@/components/layout/ContactLink';
import { ABOUT_PHOTO_URL, LOGO_URL } from '@/lib/assets';

// Tu foto como tarjeta holográfica (React Bits ProfileCard): se inclina hacia
// el cursor y el brillo tornasol aparece a través del patrón del logo.
// "Contact" baja hasta el footer.
export default function MeCard() {
  return (
    <ProfileCard
      avatarUrl={ABOUT_PHOTO_URL}
      iconUrl={LOGO_URL}
      name="Laura Betancur"
      title="Product designer & front-end dev"
      handle="LauraBetancurS"
      status="Open to new projects"
      statusColor="#C9DB4B"
      contactText="Contact"
      theme="dark"
      frameColor="#0b0b0b"
      backdropColor="#111111"
      radius={16}
      holo={0.8}
      glare={0.5}
      tiltStrength={12}
      parallax={8}
      enableTilt
      intro
      showUserInfo
      onContactClick={scrollToContact}
      className="font-body w-full"
    />
  );
}
