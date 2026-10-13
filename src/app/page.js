import Navbar from "@/components/layout/Navbar";
import SupabaseStatus from "@/components/SupabaseStatus";
import HeroTitle from "@/components/home/HeroTitle";
import StarField from "@/components/home/StarField";
import NoteDrawing from "@/components/home/NoteDrawing";

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

          {/* Sticky note: a la derecha en pantallas anchas, debajo del título en las demás */}
          <div data-star-avoid className="relative z-10 mt-8 w-48 xl:absolute xl:right-[3%] xl:top-[30%] xl:mt-0 xl:w-[clamp(190px,15vw,300px)]">
            <NoteDrawing className="w-full" />
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
