import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { LOGO_URL } from "@/lib/assets";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${bootzy.variable} ${neulis.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
