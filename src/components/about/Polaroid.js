import { ABOUT_PHOTO_URL } from '@/lib/assets';

// Foto tipo polaroid con un pedazo de cinta encima.
// Mientras no haya foto (ABOUT_PHOTO_URL = null) muestra un espacio de ejemplo.
export default function Polaroid({ caption = 'me, mid-prototype' }) {
  return (
    <figure className="relative w-full max-w-[300px] rotate-[-4deg] bg-white p-3 pb-12 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:rotate-[-1deg]">
      {/* Cinta */}
      <span
        aria-hidden="true"
        className="absolute -top-4 left-1/2 h-8 w-28 -translate-x-1/2 rotate-[3deg] bg-[#F2A2DC]/60"
      />
      <div className="aspect-[4/5] w-full overflow-hidden bg-[#e9e9e9]">
        {ABOUT_PHOTO_URL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ABOUT_PHOTO_URL} alt="Laura Betancur" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-neutral-400">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" strokeLinecap="round" />
            </svg>
            <span className="font-body text-sm">Your photo here</span>
          </div>
        )}
      </div>
      <figcaption className="font-nav absolute bottom-3 left-0 right-0 text-center text-xl text-neutral-800">
        {caption}
      </figcaption>
    </figure>
  );
}
