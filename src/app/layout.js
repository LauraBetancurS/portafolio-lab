import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FigmaCursor from "@/components/layout/FigmaCursor";
import { LOGO_URL } from "@/lib/assets";

// Letra a mano Minoel: notas y anotaciones (font-hand), fuente por defecto y etiquetas
const minoel = localFont({
  src: "./fonts/SL_Minoel.woff2",
  variable: "--font-minoel",
  display: "swap",
});

// Fuente del navbar (archivo local en src/app/fonts)
const bootzy = localFont({
  src: "./fonts/BootzyTM.woff2",
  variable: "--font-bootzy",
  display: "swap",
});

// Fuente de títulos (Neulis Alt, archivos locales en src/app/fonts)
const neulis = localFont({
  src: [
    { path: "./fonts/NeulisAlt-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/NeulisAlt-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/NeulisAlt-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/NeulisAlt-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/NeulisAlt-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/NeulisAlt-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-neulis",
  display: "swap",
});


export const metadata = {
  title: "Lau Betancur — Portafolio",
  description: "Diseño de Medios Interactivos · UX/UI · Front-end",
  // Ícono de la pestaña del navegador: el mismo conejo del navbar
  icons: {
    icon: [{ url: LOGO_URL, type: "image/svg+xml" }],
    apple: [{ url: LOGO_URL }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html style={{ scrollBehavior: "smooth" }} data-scroll-behavior="smooth"
      lang="en"
      className={`${minoel.variable} ${bootzy.variable} ${neulis.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#content"
          className="font-body sr-only z-[100] rounded-full bg-black px-5 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Navbar />
        <div id="content" tabIndex={-1} className="flex-1 outline-none">{children}</div>
        <Footer />
        <FigmaCursor />
      </body>
    </html>
  );
}
