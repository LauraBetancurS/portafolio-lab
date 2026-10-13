'use client';

import HeroSticker from './HeroSticker';
import { AIRDROP_URL, MICROPHONE_URL, CTRL_Z_URL } from '@/lib/assets';
import { playAirdropSound } from '@/lib/airdropSound';
import { playTypingSound } from '@/lib/typingSound';

// Grupo izquierdo del hero: tarjeta de AirDrop, micrófono y teclas ctrl + Z.
//
// La caja contenedora es un cuadrado del mismo ancho que la sticky note y está en espejo con ella
// (su borde derecho a 400px del centro). En laptops pequeñas se corre un poco
// a la derecha para que el AirDrop no se salga de la pantalla. Las posiciones de cada sticker son %
// del ancho de esa caja, medidas sobre el mockup:
//   left = horizontal (más alto → más a la derecha)
//   top  = vertical   (más alto → más abajo)
//   w    = ancho      (más alto → más grande)
export default function LeftStickers() {
  return (
    <div className="relative z-10 mx-auto mb-12 mt-10 aspect-square w-48 xl:absolute xl:right-[min(calc(50%+400px),calc(100%-1.5*clamp(190px,15vw,300px)))] xl:top-[30%] xl:mb-0 xl:mt-0 xl:w-[clamp(190px,15vw,300px)]">
      {/* AirDrop (atrás) */}
      <div data-star-avoid className="absolute left-[-48%] top-[14%] z-10 w-[106%]">
        <HeroSticker
          src={AIRDROP_URL}
          alt="Notificación de AirDrop: Am I testing my code or is it testing me"
          effect="lift"
          onActivate={playAirdropSound}
        />
      </div>

      {/* ctrl + Z (encima del AirDrop) */}
      <div data-star-avoid className="absolute left-[36%] top-[69%] z-20 w-[64%]">
        <HeroSticker
          src={CTRL_Z_URL}
          alt="Teclas ctrl + Z"
          effect="tilt"
          onActivate={playTypingSound}
        />
      </div>

      {/* Micrófono (al frente) */}
      <div data-star-avoid className="absolute left-[-40%] top-[76%] z-30 w-[35%]">
        <HeroSticker src={MICROPHONE_URL} alt="Micrófono" effect="wiggle" />
      </div>
    </div>
  );
}
