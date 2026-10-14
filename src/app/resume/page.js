import Reveal from "@/components/mixed/Reveal";
import Tape from "@/components/mixed/Tape";
import Scribble from "@/components/mixed/Scribble";
import FigjamComment from "@/components/mixed/FigjamComment";
import Timeline from "@/components/resume/Timeline";
import {
  RESUME_PDF_URL, INTRO, EXPERIENCE, EDUCATION, CERTIFICATIONS, RECOGNITION, SKILLS, LANGUAGES, OFF_SCREEN,
} from "@/data/resume";

export const metadata = {
  title: "Resume — Lau Betancur",
  description: "Experience, education and skills of Laura Betancur, product designer and front-end developer.",
};

// Una sección de la hoja: título a la izquierda (se queda fijo al hacer scroll), contenido a la derecha
function Block({ title, children }) {
  return (
    <section className="grid gap-6 border-t border-neutral-200 py-12 first:border-t-0 first:pt-0 md:grid-cols-[200px_1fr] md:gap-10">
      <h2 className="font-title text-2xl text-neutral-900 md:sticky md:top-28 md:self-start">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

function SimpleList({ items }) {
  return (
    <ul className="space-y-6">
      {items.map(item => (
        <li key={item.title} className="grid gap-1 md:grid-cols-[150px_1fr] md:gap-8">
          <p className="font-body pt-0.5 text-sm text-neutral-500">{item.period || item.year}</p>
          <div>
            <p className="font-title text-xl text-neutral-900">{item.title}</p>
            {(item.place || item.detail) && (
              <p className="font-body mt-0.5 text-neutral-600">{[item.place, item.detail].filter(Boolean).join(". ")}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function ResumePage() {
  return (
    <main className="overflow-x-clip px-4 pb-28 pt-32 md:px-12">
      <div className="mx-auto max-w-5xl">
        {/* Encabezado */}
        <header className="mb-14 flex flex-col gap-8 px-2 md:flex-row md:items-end md:justify-between">
          <div className="relative">
            <h1 className="font-title text-[clamp(3.5rem,11vw,9rem)] leading-[0.9] tracking-tight text-neutral-900">
              Resume
            </h1>
            <Scribble variant="sparkle" color="#C9DB4B" strokeWidth={3} className="absolute -right-12 -top-4 h-12 w-12" />
          </div>
          {RESUME_PDF_URL && (
            <a
              href={RESUME_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="press font-nav group inline-flex items-center gap-3 self-start rounded-full bg-black px-7 py-3 text-lg text-white hover:-translate-y-0.5 md:self-auto"
            >
              Download CV
              <span className="transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
            </a>
          )}
        </header>

        {/* La hoja de vida como una hoja de papel pegada al canvas */}
        <Reveal className="relative rounded-[4px] bg-white px-6 py-12 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)] ring-1 ring-black/5 md:px-14 md:py-16">
          <Tape color="sky" rotate={-8} className="-top-3 left-8" />
          <Tape color="pink" rotate={6} className="-top-3 right-8" />
          <FigjamComment
            className="-right-3 top-24 hidden md:block"
            side="left"
            color="#C9DB4B"
            text="Looking for an intern or a junior designer who codes? Let’s talk!"
          />

          <p className="font-body mb-12 max-w-[60ch] text-xl leading-relaxed text-neutral-700">{INTRO}</p>

          <Block title="Experience">
            <Timeline items={EXPERIENCE} />
          </Block>

          <Block title="Education">
            <SimpleList items={EDUCATION} />
          </Block>

          <Block title="Certifications">
            <SimpleList items={CERTIFICATIONS} />
          </Block>

          <Block title="Recognition">
            <SimpleList items={RECOGNITION} />
          </Block>

          <Block title="Skills">
            <div className="grid gap-8 sm:grid-cols-2">
              {SKILLS.map(group => (
                <div key={group.group}>
                  <p className="font-body text-sm text-neutral-500">{group.group}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {group.items.map(skill => (
                      <li
                        key={skill}
                        className="font-body rounded-full bg-neutral-100 px-3 py-1.5 text-[15px] text-neutral-800 transition-colors duration-200 hover:bg-[#F6C6E6]"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Languages">
            <p className="font-body text-lg text-neutral-800">{LANGUAGES.join(", ")}</p>
          </Block>

          <Block title="Off screen">
            <p className="font-body text-lg text-neutral-800">
              {OFF_SCREEN} <span aria-hidden="true">🎭</span>
            </p>
          </Block>
        </Reveal>
      </div>
    </main>
  );
}
