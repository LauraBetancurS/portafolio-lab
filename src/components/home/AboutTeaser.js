import Link from 'next/link';
import MeCard from '@/components/home/MeCard';
import ToolFolder from '@/components/home/ToolFolder';
import Scribble from '@/components/mixed/Scribble';
import Reveal from '@/components/mixed/Reveal';

// Bloque corto "sobre mí" en el inicio, con la tarjeta holográfica y un enlace a /about.
export default function AboutTeaser() {
  return (
    <>
    <div className="grid items-center gap-24 md:gap-20 md:grid-cols-[minmax(0,340px)_1fr]">
      <div className="relative mx-auto w-full max-w-[320px] md:mx-0">
        <MeCard />
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

    {/* Toolbox: lo que sé hacer, en una carpeta que se abre */}
    <div className="mt-32 md:mt-40">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="font-body text-lg text-neutral-500">the things i know how to do.</p>
        <h2 className="font-title mt-2 text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] tracking-tight text-neutral-900">
          my toolbox
        </h2>
      </Reveal>
      <div className="mt-6">
        <ToolFolder />
      </div>
    </div>
    </>
  );
}