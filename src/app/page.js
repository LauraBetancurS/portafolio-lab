import HeroTitle from "@/components/home/HeroTitle";
import Marquee from "@/components/home/Marquee";
import FeaturedWork from "@/components/home/FeaturedWork";
import AboutTeaser from "@/components/home/AboutTeaser";
import StarField from "@/components/home/StarField";
import NoteDrawing from "@/components/home/NoteDrawing";
import FinalFolder from "@/components/home/FinalFolder";
import Pencil from "@/components/home/Pencil";
import SelectionWord from "@/components/home/SelectionWord";
import LeftStickers from "@/components/home/LeftStickers";

export default function Home() {
  return (
    <>

      <main className="overflow-x-clip">
        {/* Hero */}
        <section className="relative flex min-h-[100svh] flex-col items-center justify-center gap-4 overflow-hidden px-6 pb-16 pt-28 text-center xl:py-0">
          <StarField />
          <div data-star-avoid className="relative z-10 flex flex-col items-center gap-4">
            <HeroTitle />
          </div>

          {/* Stickers: en pantallas anchas van a los lados del título (posición absoluta).
              En celular y iPad van debajo del título, los dos grupos lado a lado
              (xl:contents hace que esta fila "desaparezca" en pantallas anchas). */}
          <div className="relative z-10 mb-16 mt-12 flex w-full items-start justify-center gap-[9vw] sm:gap-20 xl:contents">
          {/* AirDrop + micrófono + ctrl Z: a la izquierda del título en pantallas anchas
              (en espejo con la sticky note) */}
          <LeftStickers />

          {/* Sticky note + carpeta: a la derecha en pantallas anchas */}
          <div className="relative z-10 w-[30vw] max-w-[220px] shrink-0 xl:absolute xl:left-[calc(50%+400px)] xl:top-[30%] xl:w-[clamp(190px,15vw,300px)] xl:max-w-none">
            <div data-star-avoid>
              <NoteDrawing className="w-full" />
            </div>
            {/* Lápiz arriba a la derecha de la nota, cruzando su borde */}
            <div data-star-avoid className="absolute left-[72%] top-[10%] z-20 w-[52%]">
              <Pencil className="w-full" />
            </div>
            {/* Palabra con selección estilo iOS, sobre el borde inferior de la nota */}
            <div data-star-avoid className="absolute left-[58%] top-[91%] z-30">
              <SelectionWord className="text-xs sm:text-base xl:text-lg" />
            </div>
            {/* Carpeta abajo a la izquierda de la nota, montada sobre su esquina.
                left = horizontal (más alto → más a la derecha)
                top  = vertical (más alto → más abajo)
                Los % son relativos al ancho de la sticky note. */}
            <div data-star-avoid className="absolute left-[-26%] top-[82%] z-20 origin-top-left max-sm:scale-[0.7]">
              <FinalFolder />
            </div>
          </div>
          </div>
        </section>

        <Marquee />

        {/* Proyectos destacados */}
        <section id="work" className="scroll-mt-24 px-6 pb-20 pt-36 md:px-12 md:pb-36 md:pt-48">
          <div className="mx-auto max-w-7xl">
            <FeaturedWork />
          </div>
        </section>


        {/* Sobre mí (resumen) */}
        <section className="px-6 pb-36 pt-20 md:px-12 md:pb-48 md:pt-36">
          <div className="mx-auto max-w-6xl">
            <AboutTeaser />
          </div>
        </section>
      </main>
    </>
  );
}
