import Link from "next/link";
import Polaroid from "@/components/about/Polaroid";
import GetInfoWindow from "@/components/about/GetInfoWindow";
import Translator from "@/components/about/Translator";
import StickyNotes from "@/components/about/StickyNotes";
import Dock from "@/components/about/Dock";
import Toolbox from "@/components/about/Toolbox";
import Reveal from "@/components/mixed/Reveal";
import Scribble from "@/components/mixed/Scribble";

export const metadata = {
  title: "About — Lau Betancur",
  description: "Laura Betancur: product designer and front-end developer in Cali, Colombia.",
};

// Página About. Todo el texto es de ejemplo: cámbialo con tus propias palabras.
export default function AboutPage() {
  return (
    <main className="overflow-x-clip px-6 pb-32 pt-32 md:px-12">
      {/* Presentación: foto + intro */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[minmax(0,300px)_1fr] md:gap-20">
        <div className="relative flex justify-center md:justify-start">
          <Scribble variant="sparkle" color="#E8603C" strokeWidth={3} className="absolute -top-8 right-6 h-14 w-14 md:-right-6" />
          <Polaroid />
        </div>
        <div>
          <h1 className="font-title relative inline-block text-5xl leading-[1.05] text-neutral-900 md:text-7xl">
            hi again, I’m Lau
          </h1>
          <div className="font-body mt-8 max-w-[60ch] space-y-5 text-lg leading-[1.7] text-neutral-700">
            <p>
              I’m an Interactive Media Design student at Universidad Icesi, in Cali. I design
              and build digital products, mostly in the space where UX, front-end code and
              AI meet.
            </p>
            <p>
              I like to think of myself as a computer-to-human translator. Systems are
              complicated; using them shouldn’t be. My job is to listen to people, find
              where things get confusing, and turn that into something clear, warm and a
              little bit fun.
            </p>
          </div>
        </div>
      </section>

      {/* Ventana Get Info (pieza central) */}
      <Reveal as="section" className="mx-auto mt-32 flex max-w-6xl flex-col items-center gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm md:pt-10">
          <h2 className="font-title text-4xl leading-tight text-neutral-900">The specs</h2>
          <p className="font-body mt-4 text-lg leading-[1.7] text-neutral-700">
            If I were an app, this is what you’d see when you right-click and choose Get Info.
            Open the sections to read more.
          </p>
        </div>
        <GetInfoWindow />
      </Reveal>

      {/* Traductor */}
      <Reveal as="section" className="mx-auto mt-32 flex max-w-6xl flex-col items-center text-center">
        <h2 className="font-title text-4xl leading-tight text-neutral-900">What I actually do</h2>
        <p className="font-body mt-4 max-w-[52ch] text-lg leading-[1.7] text-neutral-700">
          Teams hand me something written for computers. I hand back something written for people.
        </p>
        <div className="mt-10 w-full flex justify-center">
          <Translator />
        </div>
      </Reveal>

      {/* Herramientas */}
      <Reveal as="section" className="mx-auto mt-32 flex max-w-6xl flex-col items-center text-center">
        <h2 className="font-title text-4xl leading-tight text-neutral-900">My toolbox</h2>
        <p className="font-body mt-4 max-w-[52ch] text-lg leading-[1.7] text-neutral-700">
          The apps I open every day, from the first sketch to the deployed product.
        </p>
        <div className="mt-10 flex w-full justify-center">
          <Toolbox />
        </div>
      </Reveal>

      {/* Dónde ha trabajado */}
      <Reveal as="section" className="mx-auto mt-32 max-w-6xl">
        <h2 className="font-title text-center text-4xl leading-tight text-neutral-900">
          Where I’ve been building
        </h2>
        <div className="mt-12">
          <StickyNotes />
        </div>
      </Reveal>

      {/* Fuera del diseño */}
      <Reveal as="section" className="mx-auto mt-32 max-w-6xl text-center">
        <h2 className="font-title text-4xl leading-tight text-neutral-900">When I’m offline</h2>
        <p className="font-body mx-auto mt-4 max-w-[52ch] text-lg leading-[1.7] text-neutral-700">
          I sing, I’m part of the musical theater program, and fiction has shaped me since I
          was a kid. Hover the dock to see what else is open.
        </p>
        <div className="mt-20">
          <Dock />
        </div>
      </Reveal>

      {/* Cierre */}
      <Reveal as="section" className="mx-auto mt-36 flex max-w-3xl flex-col items-center text-center">
        <h2 className="font-title text-4xl leading-tight text-neutral-900 md:text-5xl">
          Let’s make something that feels human
        </h2>
        <div className="font-nav mt-10 flex flex-wrap justify-center gap-4 text-lg">
          <Link
            href="/#contact"
            className="rounded-full bg-black px-7 py-3 text-white transition-colors hover:bg-neutral-800"
          >
            Contact me
          </Link>
          <Link
            href="/#work"
            className="rounded-full border-2 border-black px-7 py-3 text-black transition-colors hover:bg-black hover:text-white"
          >
            See my work
          </Link>
        </div>
      </Reveal>
    </main>
  );
}
