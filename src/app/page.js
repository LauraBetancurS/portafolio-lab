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
        <section className="relative flex min-h-screen flex-col items-center justify-center gap-4 overflow-hidden px-6 text-center">
          <StarField />
          <div data-star-avoid className="relative z-10 flex flex-col items-center gap-4">
            <HeroTitle />
          </div>

          {/* AirDrop + micrófono + ctrl Z: a la izquierda del título en pantallas anchas
              (en espejo con la sticky note), debajo del título en las demás */}
          <LeftStickers />

          {/* Sticky note + carpeta: a la derecha en pantallas anchas, debajo del título en las demás */}
          <div className="relative z-10 mt-8 w-48 xl:absolute xl:left-[calc(50%+400px)] xl:top-[30%] xl:mt-0 xl:w-[clamp(190px,15vw,300px)]">
            <div data-star-avoid>
              <NoteDrawing className="w-full" />
            </div>
            {/* Lápiz arriba a la derecha de la nota, cruzando su borde */}
            <div data-star-avoid className="absolute left-[72%] top-[10%] z-20 w-[52%]">
              <Pencil className="w-full" />
            </div>
            {/* Palabra con selección estilo iOS, sobre el borde inferior de la nota */}
            <div data-star-avoid className="absolute left-[58%] top-[91%] z-30">
              <SelectionWord className="text-base xl:text-lg" />
            </div>
            {/* Carpeta abajo a la izquierda de la nota, montada sobre su esquina.
                left = horizontal (más alto → más a la derecha)
                top  = vertical (más alto → más abajo)
                Los % son relativos al ancho de la sticky note. */}
            <div data-star-avoid className="absolute left-[-26%] top-[82%] z-20">
              <FinalFolder />
            </div>
          </div>
        </section>

        <Marquee />

        {/* Proyectos destacados */}
        <section id="work" className="scroll-mt-24 px-6 pb-12 pt-32 md:px-12">
          <div className="mx-auto max-w-7xl">
            <FeaturedWork />
          </div>
        </section>


        {/* Sobre mí (resumen) */}
        <section className="px-6 pb-32 pt-16 md:px-12">
          <div className="mx-auto max-w-6xl">
            <AboutTeaser />
          </div>
        </section>
      </main>
    </>
  );
}
