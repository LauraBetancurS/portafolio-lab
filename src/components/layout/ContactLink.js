'use client';

// Link "Contact me": baja suavemente hasta el footer (donde están el email,
// LinkedIn y GitHub) en la misma página donde estés, sin ir al inicio.
// Al llegar, las tarjetas de contacto hacen un pequeño destello para que se vean.
export default function ContactLink({ className = '', onClick, children }) {
  const handleClick = event => {
    const footer = document.getElementById('contact');
    if (!footer) return; // si no hay footer, el link funciona normal
    event.preventDefault();
    onClick?.();

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    footer.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });

    // Destello cuando termina el scroll (con un respaldo por si el navegador no avisa)
    const flash = () => {
      footer.removeAttribute('data-flash');
      void footer.offsetWidth; // reinicia la animación si se hace clic dos veces
      footer.setAttribute('data-flash', '');
      setTimeout(() => footer.removeAttribute('data-flash'), 1400);
    };
    let done = false;
    const once = () => {
      if (done) return;
      done = true;
      window.removeEventListener('scrollend', once);
      flash();
    };
    window.addEventListener('scrollend', once);
    setTimeout(once, reduce ? 0 : 900);

    // Para teclado: el foco pasa al footer sin volver a mover la página
    footer.focus({ preventScroll: true });
  };

  return (
    <a href="#contact" onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
