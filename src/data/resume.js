// ─── Contenido de la página Resume ──────────────────────────
// Edita este archivo para actualizar tu hoja de vida en la web.

// Tu CV en PDF: súbelo a Supabase y pega la URL aquí (null = no se muestra el botón)
export const RESUME_PDF_URL = null;

export const INTRO =
  'Interactive Media Design student at Universidad Icesi, working where design meets strategy. I’ve led UX research for real clients, built websites and AI automations for companies, and explore the future of organizations at InnLab.';

// Solo lo esencial, de lo más reciente a lo más antiguo
export const EXPERIENCE = [
  {
    period: '2026 — now',
    role: 'Foresight & Futuros Vivos teams',
    org: 'InnLab, strategic innovation consultancy',
    detail: 'Research, AI automation and future scenarios for organizations, working with real clients like ACH.',
  },
  {
    period: '2026',
    role: 'UX research lead & project manager',
    org: 'Ruta Solar, Gases de Occidente',
    detail: 'Led research across several sprints (user interviews, chat analysis, personas) and coordinated the team behind a solar pre-sale onboarding with a home energy simulator.',
  },
  {
    period: '2026',
    role: 'Freelance web developer',
    org: 'Corrosión y Protección',
    detail: 'Built the company website and an automated WhatsApp chatbot.',
  },
  {
    period: '2025 — 2026',
    role: 'Continuous Accreditation teaching assistant',
    org: 'Universidad Icesi',
    detail: 'Made videos, graphics and an interactive HTML timeline to train professors on the accreditation process.',
  },
  {
    period: '2024 — 2026',
    role: 'Social media teaching assistant',
    org: 'Interactive Media Design program, Universidad Icesi',
    detail: 'Designed digital and print pieces and edited video for the program’s channels.',
  },
];

export const EDUCATION = [
  {
    period: 'Expected 2027',
    title: 'Interactive Media Design',
    place: 'Universidad Icesi, Cali',
    detail: 'Bachelor’s degree, frontend-oriented profile.',
  },
];

export const CERTIFICATIONS = [
  { year: '2026', title: 'AWS Certified AI Practitioner', place: 'Amazon Web Services' },
];

export const RECOGNITION = [
  { year: '2023 — 2026', title: 'Honor roll, four semesters', detail: '2023-2, 2024-1, 2025-1 and 2026-1' },
  { year: '', title: 'Academic Excellence Scholarship', detail: 'ICFES' },
];

export const SKILLS = [
  { group: 'Design', items: ['UX research', 'UI design', 'Prototyping', 'Motion & video'] },
  { group: 'Code', items: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'HTML and CSS'] },
  { group: 'AI & automation', items: ['n8n', 'WhatsApp chatbots', 'AI product design'] },
  { group: 'Tools', items: ['Figma', 'Framer', 'After Effects', 'Supabase', 'Vercel'] },
  { group: 'How I work', items: ['Leadership', 'Project management', 'Clear communication', 'Strategic thinking'] },
];

export const LANGUAGES = ['Spanish (native)', 'English (C1)'];

// Un toque personal al final de la hoja
export const OFF_SCREEN = 'Member of the Universidad Icesi Musical Theatre program, training in vocal technique.';
