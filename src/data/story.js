// ─── Historia horizontal de la página About ─────────────────
// Va de lo personal a lo profesional. Edita aquí los textos.

// Imágenes: pega la URL (Supabase) cuando las tengas.
// Mientras sean null, se muestra un recuadro punteado con la descripción.
export const STORY_IMAGES = {
  // personal
  games: null,        // control / algo de indie games
  books: null,        // libros (Camus, Pessoa)
  cinema: null,       // cine latinoamericano
  dinosaur: null,     // un dinosaurio, obvio
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
  { year: '2023', title: 'said yes to interactive media.', text: 'started at Icesi with an ICFES excellence scholarship. honor roll four times since.' },
  { year: '2024', title: 'started making things for real.', text: 'social media TA for my program: graphics, print pieces and video.' },
  { year: '2025', title: 'taught the teachers.', text: 'videos, graphics and an interactive timeline about accreditation.' },
  { year: '2026', title: 'led my first research team.', text: 'UX research lead & PM for Ruta Solar, with Gases de Occidente.' },
  { year: '2026', title: 'went freelance.', text: 'a website and a WhatsApp chatbot for Corrosión y Protección.' },
  { year: '2026 — now', title: 'joined InnLab.', text: 'foresight & future scenarios with real clients like ACH.' },
];

// "computer → human": lo que hago, en broma (sale en "turns out, i like people too")
export const STORY_TRANSLATIONS = [
  { computer: 'Error: user_flow.step3 is undefined', human: 'people get lost on step three.' },
  { computer: 'Bounce rate: 78% on /checkout', human: 'the checkout feels scary.' },
];
