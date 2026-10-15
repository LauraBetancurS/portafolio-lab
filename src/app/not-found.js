import Link from "next/link";
import Scribble from "@/components/mixed/Scribble";
import { T } from "@/i18n/lang";

// Página 404 (por ejemplo, un proyecto que no existe o no está publicado)
export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 pt-24 text-center">
      <div className="relative">
        <p className="font-title text-[clamp(6rem,20vw,14rem)] leading-none text-neutral-900">404</p>
        <Scribble variant="circle" color="#E8603C" strokeWidth={4} className="absolute -inset-x-8 -inset-y-4 h-[calc(100%+2rem)] w-[calc(100%+4rem)]" />
      </div>
      <p className="font-body mt-8 max-w-[40ch] text-lg text-neutral-600">
        <T
          en="This page got lost between the sticky notes. It may have moved or never existed."
          es="Esta página se perdió entre los sticky notes. Puede que se haya movido o que nunca haya existido."
        />
      </p>
      <Link href="/" className="press font-nav mt-10 rounded-full bg-black px-7 py-3 text-lg text-white hover:bg-neutral-800">
        <T en="Back to home" es="Volver al inicio" />
      </Link>
    </main>
  );
}
