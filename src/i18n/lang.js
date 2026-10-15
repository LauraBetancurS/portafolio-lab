'use client';

import { useEffect, useSyncExternalStore } from 'react';

// ─── Idioma de la página (inglés por defecto) ───────────────
// El botón EN / ES del navbar cambia el idioma de todo el sitio.
// Se guarda en el navegador, así que la próxima visita abre en el mismo idioma.
//
// Cómo traducir algo:
//   - En cualquier componente:  <T en="Hello" es="Hola" />
//   - Textos con dos idiomas guardados en un objeto { en, es }:  <T v={texto} />
//   - En componentes de cliente:  const { t, lang } = useLang();  t('Hello', 'Hola')
//     o tr(texto) para un objeto { en, es }
// Si falta el español (vacío, null o una lista vacía), se muestra el inglés.
// ────────────────────────────────────────────────────────────

const KEY = 'lang';
const listeners = new Set();
let memory = null; // por si el navegador no deja guardar (modo privado, etc.)

function read() {
  if (memory) return memory;
  try {
    return localStorage.getItem(KEY) === 'es' ? 'es' : 'en';
  } catch {
    return 'en';
  }
}

function subscribe(callback) {
  listeners.add(callback);
  const onStorage = e => e.key === KEY && callback(); // otra pestaña cambió el idioma
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', onStorage);
  };
}

export function setLang(lang) {
  memory = lang;
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    /* no se pudo guardar: queda solo en esta visita */
  }
  document.documentElement.lang = lang;
  listeners.forEach(fn => fn());
}

// Elige el texto del idioma actual
const empty = v => v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0);
export function pick(lang, en, es) {
  return lang === 'es' && !empty(es) ? es : en;
}

export function useLang() {
  // En el servidor (y al hidratar) siempre es inglés; luego toma el guardado
  const lang = useSyncExternalStore(subscribe, read, () => 'en');
  const t = (en, es) => pick(lang, en, es);
  const tr = value => (value && typeof value === 'object' && 'en' in value ? pick(lang, value.en, value.es) : value);
  return { lang, setLang, t, tr };
}

// Texto traducido. <T en="Work" es="Proyectos" />  o  <T v={{ en, es }} />
export function T({ en, es, v }) {
  const { lang } = useLang();
  if (v !== undefined) {
    return v && typeof v === 'object' && 'en' in v ? pick(lang, v.en, v.es) : v ?? null;
  }
  return pick(lang, en, es) ?? null;
}

// Mantiene <html lang="…"> al día (para lectores de pantalla y el navegador)
export function LangSync() {
  const { lang } = useLang();
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
