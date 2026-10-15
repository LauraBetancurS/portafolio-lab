import {
  siReact, siNextdotjs, siJavascript, siTypescript, siTailwindcss, siGithub,
  siSupabase, siPython, siFlask, siN8n, siFigma, siFramer,
} from 'simple-icons';
import {
  TOOL_ICON_AWS_URL, TOOL_ICON_PHOTOSHOP_URL, TOOL_ICON_AFTER_EFFECTS_URL,
} from '@/lib/assets';

// Herramientas que usa Laura (se usan en About y en la carpeta del inicio).
// - icon: logo de la librería Simple Icons
// - iconUrl: imagen propia (para las que no están en la librería)
// Para agregar una herramienta, añade una línea a esta lista.
export const TOOLS = [
  { name: 'Figma', group: 'Design', icon: siFigma },
  { name: 'Photoshop', group: 'Design', iconUrl: TOOL_ICON_PHOTOSHOP_URL },
  { name: 'After Effects', group: 'Design', iconUrl: TOOL_ICON_AFTER_EFFECTS_URL },
  { name: 'Framer', group: 'Design', icon: siFramer },
  { name: 'React', group: 'Code', icon: siReact },
  { name: 'Next.js', group: 'Code', icon: siNextdotjs },
  { name: 'JavaScript', group: 'Code', icon: siJavascript },
  { name: 'TypeScript', group: 'Code', icon: siTypescript },
  { name: 'Tailwind CSS', group: 'Code', icon: siTailwindcss },
  { name: 'GitHub', group: 'Code', icon: siGithub },
  { name: 'Python', group: 'Code', icon: siPython },
  { name: 'Flask', group: 'Code', icon: siFlask },
  { name: 'Supabase', group: 'Cloud and AI', icon: siSupabase },
  { name: 'AWS', group: 'Cloud and AI', iconUrl: TOOL_ICON_AWS_URL },
  { name: 'n8n', group: 'Cloud and AI', icon: siN8n },
];

// Cosas que sé hacer (salen como sticky notes de la carpeta del inicio)
export const SKILLS = [
  { text: 'UX research', color: '#F6C6E6' },
  { text: 'UI design', color: '#CDE8F8' },
  { text: 'prototyping', color: '#E4EDB0' },
  { text: 'front-end dev', color: '#F8D98C' },
  { text: 'AI automations', color: '#F9CDBF' },
  { text: 'motion & video', color: '#CDE8F8' },
  { text: 'project management', color: '#F6C6E6' },
];
