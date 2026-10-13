import Navbar from "@/components/layout/Navbar";
import SupabaseStatus from "@/components/SupabaseStatus";
import HeroTitle from "@/components/home/HeroTitle";
import StarField from "@/components/home/StarField";
import NoteDrawing from "@/components/home/NoteDrawing";
import FinalFolder from "@/components/home/FinalFolder";
import Pencil from "@/components/home/Pencil";
import SelectionWord from "@/components/home/SelectionWord";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero (lo construimos en el siguiente paso) */}
        <section className="relative flex min-h-screen flex-col items-center justify-center gap-4 overflow-hidden px-6 text-center">
          <StarField />
          <div data-star-avoid className="relative z-10 flex flex-col items-center gap-4">
            <HeroTitle />
            <SupabaseStatus />
          </div>

          {/* Sticky note + lápiz + carpeta + Create. En pantallas anchas todo se mide en vw
              (como un frame de Figma) para mantener las proporciones del mockup. */}
          <div className="relative z-10 mt-8 w-48 xl:absolute xl:left-[calc(50%+27vw)] xl:top-1/2 xl:mt-0 xl:w-[15.6vw] xl:-translate-y-[55%]">
            <div data-star-avoid>
              <NoteDrawing className="w-full" />
            </div>
            {/* Lápiz arriba a la derecha de la nota, cruzando su borde */}
            <div data-star-avoid className="absolute left-[75%] top-[15%] z-20 w-[56%]">
              <Pencil className="w-full" />
            </div>
            {/* Palabra con selección estilo iOS, sobre el borde inferior de la nota */}
            <div data-star-avoid className="absolute left-[58%] top-[99%] z-30">
              <SelectionWord className="text-base xl:text-lg" />
            </div>
            {/* Carpeta abajo a la izquierda de la nota, montada sobre su esquina */}
            <div data-star-avoid className="absolute left-[-36%] top-[82%] z-20">
              <FinalFolder />
            </div>
          </div>
        </section>

        {/* Secciones temporales para probar el scroll del navbar */}
        <section id="work" className="flex min-h-screen items-center justify-center text-3xl font-bold">Work</section>
        <section id="about" className="flex min-h-screen items-center justify-center text-3xl font-bold">About</section>
        <section id="resume" className="flex min-h-[50vh] items-center justify-center text-3xl font-bold">Resume</section>
        <section id="contact" className="flex min-h-[50vh] items-center justify-center text-3xl font-bold">Contact</section>
      </main>
    </>
  );
}
