// Fondo de puntos estilo FigJam. Queda fijo detrás de todo el contenido.
// Ajusta tamaño, color y separación en las variables --dot-* de globals.css.
export default function DotBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        backgroundColor: "var(--background)",
        backgroundImage:
          "radial-gradient(circle, var(--dot-color) var(--dot-size), transparent var(--dot-size))",
        backgroundSize: "var(--dot-gap) var(--dot-gap)",
      }}
    />
  );
}
