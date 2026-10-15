// ─── Contenido de la página Resume ──────────────────────────
// Edita este archivo para actualizar tu hoja de vida en la web.
// Cada texto tiene su versión en inglés (en) y en español (es).

// Tu CV en PDF: súbelo a Supabase y pega la URL aquí (null = no se muestra el botón)
export const RESUME_PDF_URL = null;

export const INTRO = {
  en: 'Interactive Media Design student at Universidad Icesi, working where design meets strategy. I’ve led UX research for real clients, built websites and AI automations for companies, and explore the future of organizations at InnLab.',
  es: 'Estudiante de Diseño de Medios Interactivos en la Universidad Icesi, trabajando donde el diseño se encuentra con la estrategia. He liderado investigación UX para clientes reales, construido sitios web y automatizaciones con IA para empresas, y exploro el futuro de las organizaciones en InnLab.',
};

// Solo lo esencial, de lo más reciente a lo más antiguo
export const EXPERIENCE = [
  {
    period: { en: '2026 — now', es: '2026 — hoy' },
    role: { en: 'Foresight & Futuros Vivos teams', es: 'Equipos de Foresight y Futuros Vivos' },
    org: { en: 'InnLab, strategic innovation consultancy', es: 'InnLab, consultora de innovación estratégica' },
    detail: {
      en: 'Research, AI automation and future scenarios for organizations, working with real clients like ACH.',
      es: 'Investigación, automatización con IA y escenarios de futuro para organizaciones, con clientes reales como ACH.',
    },
  },
  {
    period: { en: '2026', es: '2026' },
    role: { en: 'UX research lead & project manager', es: 'Líder de investigación UX y gerente de proyecto' },
    org: { en: 'Ruta Solar, Gases de Occidente', es: 'Ruta Solar, Gases de Occidente' },
    detail: {
      en: 'Led research across several sprints (user interviews, chat analysis, personas) and coordinated the team behind a solar pre-sale onboarding with a home energy simulator.',
      es: 'Lideré la investigación durante varios sprints (entrevistas, análisis de chats, personas) y coordiné al equipo detrás de un onboarding de preventa solar con un simulador de energía para el hogar.',
    },
  },
  {
    period: { en: '2026', es: '2026' },
    role: { en: 'Freelance web developer', es: 'Desarrolladora web freelance' },
    org: { en: 'Corrosión y Protección', es: 'Corrosión y Protección' },
    detail: {
      en: 'Built the company website and an automated WhatsApp chatbot.',
      es: 'Construí el sitio web de la empresa y un chatbot automatizado de WhatsApp.',
    },
  },
  {
    period: { en: '2025 — 2026', es: '2025 — 2026' },
    role: { en: 'Continuous Accreditation teaching assistant', es: 'Monitora de Acreditación Continua' },
    org: { en: 'Universidad Icesi', es: 'Universidad Icesi' },
    detail: {
      en: 'Made videos, graphics and an interactive HTML timeline to train professors on the accreditation process.',
      es: 'Hice videos, piezas gráficas y una línea de tiempo interactiva en HTML para capacitar a los profesores en el proceso de acreditación.',
    },
  },
  {
    period: { en: '2024 — 2026', es: '2024 — 2026' },
    role: { en: 'Social media teaching assistant', es: 'Monitora de redes sociales' },
    org: { en: 'Interactive Media Design program, Universidad Icesi', es: 'Programa de Diseño de Medios Interactivos, Universidad Icesi' },
    detail: {
      en: 'Designed digital and print pieces and edited video for the program’s channels.',
      es: 'Diseñé piezas digitales e impresas y edité video para los canales del programa.',
    },
  },
];

export const EDUCATION = [
  {
    period: { en: 'Expected 2027', es: 'Grado esperado en 2027' },
    title: { en: 'Interactive Media Design', es: 'Diseño de Medios Interactivos' },
    place: { en: 'Universidad Icesi, Cali', es: 'Universidad Icesi, Cali' },
    detail: { en: 'Bachelor’s degree, frontend-oriented profile.', es: 'Pregrado, con perfil orientado a front-end.' },
  },
];

export const CERTIFICATIONS = [
  {
    year: '2026',
    title: { en: 'AWS Certified AI Practitioner', es: 'AWS Certified AI Practitioner' },
    place: { en: 'Amazon Web Services', es: 'Amazon Web Services' },
  },
];

export const RECOGNITION = [
  {
    year: '2023 — 2026',
    title: { en: 'Honor roll, four semesters', es: 'Cuadro de honor, cuatro semestres' },
    detail: { en: '2023-2, 2024-1, 2025-1 and 2026-1', es: '2023-2, 2024-1, 2025-1 y 2026-1' },
  },
  {
    year: '',
    title: { en: 'Academic Excellence Scholarship', es: 'Beca de Excelencia Académica' },
    detail: { en: 'ICFES', es: 'ICFES' },
  },
];

export const SKILLS = [
  {
    group: { en: 'Design', es: 'Diseño' },
    items: [
      { en: 'UX research', es: 'Investigación UX' },
      { en: 'UI design', es: 'Diseño UI' },
      { en: 'Prototyping', es: 'Prototipado' },
      { en: 'Motion & video', es: 'Motion y video' },
    ],
  },
  {
    group: { en: 'Code', es: 'Código' },
    items: ['JavaScript', 'TypeScript', 'React', 'Next.js', { en: 'HTML and CSS', es: 'HTML y CSS' }],
  },
  {
    group: { en: 'AI & automation', es: 'IA y automatización' },
    items: [
      'n8n',
      { en: 'WhatsApp chatbots', es: 'Chatbots de WhatsApp' },
      { en: 'AI product design', es: 'Diseño de productos con IA' },
    ],
  },
  {
    group: { en: 'Tools', es: 'Herramientas' },
    items: ['Figma', 'Framer', 'After Effects', 'Supabase', 'Vercel'],
  },
  {
    group: { en: 'How I work', es: 'Cómo trabajo' },
    items: [
      { en: 'Leadership', es: 'Liderazgo' },
      { en: 'Project management', es: 'Gestión de proyectos' },
      { en: 'Clear communication', es: 'Comunicación clara' },
      { en: 'Strategic thinking', es: 'Pensamiento estratégico' },
    ],
  },
];

export const LANGUAGES = {
  en: 'Spanish (native), English (C1)',
  es: 'Español (nativo), inglés (C1)',
};

// Un toque personal al final de la hoja
export const OFF_SCREEN = {
  en: 'Member of the Universidad Icesi Musical Theatre program, training in vocal technique.',
  es: 'Hago parte del programa de Teatro Musical de la Universidad Icesi, formándome en técnica vocal.',
};
