import Link from 'next/link';
import Polaroid from '@/components/about/Polaroid';
import Scribble from '@/components/mixed/Scribble';
import Reveal from '@/components/mixed/Reveal';
import Note from '@/components/mixed/Note';

// Bloque corto "sobre mí" en el inicio, con la polaroid y un enlace a /about.
export default function AboutTeaser() {
  return (
    <div className="grid items-center gap-14 md:grid-cols-[minmax(0,320px)_1fr] md:gap-20">
      <div className="relative mx-auto w-full max-w-[300px] md:mx-0">
        <Polaroid caption="that’s me!" />
        <Note arrow="up-left" arrowFirst rotate={-6} className="absolute -bottom-14 left-6">
          probably thinking about fonts
        </Note>
        <Scribble variant="sparkle" color="#E8603C" strokeWidth={3} className="absolute -right-8 -top-8 h-14 w-14" />
      </div>

      <Reveal>
        <h2 className="font-title text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] tracking-tight text-neutral-900">
          A computer-to-human translator
        </h2>
        <p className="font-body mt-6 max-w-[56ch] text-lg leading-[1.7] text-neutral-700">
          I’m Lau, an Interactive Media Design student in Cali, Colombia. I sit between design and
          strategy: I research what people need, design the experience, and build it with code.
          Lately, a lot of that involves AI.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link
            href="/about"
            className="press font-nav rounded-full bg-black px-7 py-3 text-lg text-white hover:-translate-y-0.5 hover:bg-neutral-800"
          >
            More about me
          </Link>
          <Scribble variant="arrow" color="#1e1e1e" strokeWidth={2.5} className="hidden h-10 w-24 -rotate-12 sm:block" delay={0.3} />
        </div>
      </Reveal>
    </div>
  );
}
