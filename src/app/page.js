import Navbar from "@/components/layout/Navbar";
import SupabaseStatus from "@/components/SupabaseStatus";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero (lo construimos en el siguiente paso) */}
        <section className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="font-title text-5xl font-normal md:text-7xl">
            hi, I’m Laura Betancur
          </h1>
          <p className="font-title text-2xl md:text-4xl">Product designer ✿ front-end dev</p>
          <SupabaseStatus />
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
