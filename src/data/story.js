// ─── Historia horizontal de la página About ─────────────────
// Va de lo personal a lo profesional. Edita aquí los textos (en = inglés, es = español).

// Imágenes: pega la URL (Supabase) cuando las tengas.
// Mientras sean null, se muestra un recuadro punteado con la descripción.
export const STORY_IMAGES = {
  // personal
  games: null,        // control / algo de indie games
  books: null,        // libros (Camus, Pessoa)
  cinema: null,       // cine latinoamericano
  dinosaur: null,     // un dinosaurio, obvio
  keyboard: 'https://mjwtcqrzadpsluakzfjg.supabase.co/storage/v1/object/public/about/keyboard.svg', // teclado / keycaps
  sketchbook: null,   // cuaderno de dibujo / diseño gráfico
  stage: 'https://mjwtcqrzadpsluakzfjg.supabase.co/storage/v1/object/public/about/SING.webp', // tú cantando
  fiction: null,      // anime / fanfics / novelas visuales
  // profesional
  honorRoll: 'https://mjwtcqrzadpsluakzfjg.supabase.co/storage/v1/object/public/about/honor_roll.PNG', // cuadro de honor
  research: null,     // sticky notes, entrevistas, investigación
  ai: 'https://mjwtcqrzadpsluakzfjg.supabase.co/storage/v1/object/public/about/546ff57f-6e85-4d91-b158-b69ec8aa88b1.png', // cerebro IA
  aws: null,          // insignia AWS AI Practitioner
};

// Hitos de la línea (de lo más antiguo a lo más reciente)
export const STORY_MILESTONES = [
  {
    year: { en: '2023', es: '2023' },
    title: { en: 'said yes to interactive media.', es: 'le dije que sí a medios interactivos.' },
    text: {
      en: 'started at Icesi with an ICFES excellence scholarship. honor roll four times since.',
      es: 'entré a Icesi con la beca de excelencia del ICFES. cuadro de honor cuatro veces desde entonces.',
    },
  },
  {
    year: { en: '2024', es: '2024' },
    title: { en: 'started making things for real.', es: 'empecé a hacer cosas de verdad.' },
    text: {
      en: 'social media TA for my program: graphics, print pieces and video.',
      es: 'monitora de redes de mi programa: piezas gráficas, impresos y video.',
    },
  },
  {
    year: { en: '2025', es: '2025' },
    title: { en: 'taught the teachers.', es: 'les enseñé a los profes.' },
    text: {
      en: 'videos, graphics and an interactive timeline about accreditation.',
      es: 'videos, piezas gráficas y una línea de tiempo interactiva sobre acreditación.',
    },
  },
  {
    year: { en: '2026', es: '2026' },
    title: { en: 'led my first research team.', es: 'lideré mi primer equipo de investigación.' },
    text: {
      en: 'UX research lead & PM for Ruta Solar, with Gases de Occidente.',
      es: 'líder de investigación UX y PM de Ruta Solar, con Gases de Occidente.',
    },
  },
  {
    year: { en: '2026', es: '2026' },
    title: { en: 'went freelance.', es: 'me lancé como freelance.' },
    text: {
      en: 'a website and a WhatsApp chatbot for Corrosión y Protección.',
      es: 'un sitio web y un chatbot de WhatsApp para Corrosión y Protección.',
    },
  },
  {
    year: { en: '2026 — now', es: '2026 — hoy' },
    title: { en: 'joined InnLab.', es: 'llegué a InnLab.' },
    text: {
      en: 'foresight & future scenarios with real clients like ACH.',
      es: 'foresight y escenarios de futuro con clientes reales como ACH.',
    },
  },
];

// "computer → human": lo que hago, en broma (sale en "turns out, i like people too")
export const STORY_TRANSLATIONS = [
  {
    computer: 'Error: user_flow.step3 is undefined',
    human: { en: 'people get lost on step three.', es: 'la gente se pierde en el paso tres.' },
  },
  {
    computer: 'Bounce rate: 78% on /checkout',
    human: { en: 'the checkout feels scary.', es: 'el pago da miedo.' },
  },
];
