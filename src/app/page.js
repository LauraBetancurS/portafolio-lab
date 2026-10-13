import Navbar from "@/components/layout/Navbar";
import SupabaseStatus from "@/components/SupabaseStatus";
import HeroTitle from "@/components/home/HeroTitle";
import StarField from "@/components/home/StarField";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero (lo construimos en el siguiente paso) */}
        <section className="relative flex min-h-screen flex-col items-center justify-center gap-4 overflow-hidden px-6 text-center">
          <StarField />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <HeroTitle />
            <SupabaseStatus />
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
