import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";

export const metadata = {
  title: "About — Lau Betancur",
  description: "Laura Betancur: product designer and front-end developer in Cali, Colombia.",
};

// Página About: la presentación (con el lanyard) y la historia de lado a lado,
// que va de lo personal a lo profesional. Los textos están en src/data/story.js.
export default function AboutPage() {
  return (
    <main className="overflow-x-clip px-6 pt-28 md:px-12">
      {/* Presentación */}
      <AboutHero />

      {/* La historia (ocupa todo el ancho) */}
      <div className="-mx-6 mt-24 md:-mx-12 md:mt-32">
        <AboutStory />
      </div>
    </main>
  );
}
