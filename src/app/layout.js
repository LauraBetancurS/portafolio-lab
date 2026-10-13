import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

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

export const metadata = {
  title: "Lau Betancur — Portafolio",
  description: "Diseño de Medios Interactivos · UX/UI · Front-end",
};

export default function RootLayout({ children }) {
  return (
    <html style={{ scrollBehavior: "smooth" }}
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${bootzy.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
