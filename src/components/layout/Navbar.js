"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOGO_URL } from "@/lib/assets";
import ContactLink from "./ContactLink";

// "/#..." lleva a la sección del inicio desde cualquier página
const LINKS = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const logoRef = useRef(null);

  // Si la imagen falló antes de que React cargara, onError no se dispara:
  // lo revisamos al montar.
  useEffect(() => {
    const img = logoRef.current;
    if (img && img.complete && img.naturalWidth === 0) setLogoFailed(true);
  }, []);

  // Cambia de transparente a negro cuando bajas más de 20px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = scrolled || menuOpen;
  const pathname = usePathname();
  // ¿Este link es la página actual? (/work también cuenta en /work/un-proyecto)
  const isCurrent = (href) => !href.includes("#") && (pathname === href || pathname.startsWith(href + "/"));

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        dark ? "bg-black text-white shadow-lg" : "bg-transparent text-black"
      }`}
    >
      <nav className="font-nav flex items-center justify-between px-6 py-4 md:px-12">
        {/* Logo */}
        <Link href="/" aria-label="Home" className="flex items-center">
          {logoFailed ? (
            <span className="text-xl font-bold tracking-tight">LAB</span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={logoRef}
              src={LOGO_URL}
              alt="Laura Betancur logo"
              className={`h-10 w-auto transition duration-300 ${dark ? "invert" : ""}`}
              onError={() => setLogoFailed(true)}
            />
          )}
        </Link>

        {/* Links (escritorio) */}
        <div className="hidden items-center gap-10 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              aria-current={isCurrent(link.href) ? "page" : undefined}
              className={`text-2xl lg:text-3xl tracking-tight transition-opacity hover:opacity-60 ${isCurrent(link.href) ? "nav-current" : ""}`}
            >
              {link.label}
            </Link>
          ))}
          <ContactButton dark={dark} />
        </div>

        {/* Botón menú (móvil) */}
        <button
          type="button"
          className="md:hidden p-2"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={`block h-0.5 w-6 bg-current transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`my-1.5 block h-0.5 w-6 bg-current transition ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-current transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* Menú desplegable (móvil) */}
      {menuOpen && (
        <div className="font-nav flex flex-col gap-6 px-6 pb-8 md:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              aria-current={isCurrent(link.href) ? "page" : undefined}
              className={`text-3xl tracking-tight ${isCurrent(link.href) ? "nav-current" : ""}`}
            >
              {link.label}
            </Link>
          ))}
          <ContactButton dark onClick={() => setMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}

function ContactButton({ dark, onClick }) {
  return (
    <ContactLink
      onClick={onClick}
      className={`press rounded-full px-6 py-2.5 text-lg self-start ${
        dark ? "bg-white text-black hover:bg-neutral-200" : "bg-black text-white hover:bg-neutral-800"
      }`}
    >
      Contact me
    </ContactLink>
  );
}
