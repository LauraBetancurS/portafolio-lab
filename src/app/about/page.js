import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import { getAboutFolder } from "@/lib/storyImages";
import { STORY_KEYCAPS_FOLDER } from "@/data/story";

export const metadata = {
  title: "About — Lau Betancur",
  description: "Laura Betancur: product designer and front-end developer in Cali, Colombia.",
};

// Página About: la presentación (con el lanyard) y la historia de lado a lado,
// que va de lo personal a lo profesional. Los textos están en src/data/story.js.
export default async function AboutPage() {
  // Keycaps: todas las imágenes de la carpeta en Supabase
  const keycaps = await getAboutFolder(STORY_KEYCAPS_FOLDER);

  return (
    <main className="overflow-x-clip px-6 pt-28 md:px-12">
      {/* Presentación */}
      <AboutHero />

      {/* La historia (ocupa todo el ancho) */}
      <div className="-mx-6 mt-24 md:-mx-12 md:mt-32">
        <AboutStory keycaps={keycaps} />
      </div>
    </main>
  );
}
