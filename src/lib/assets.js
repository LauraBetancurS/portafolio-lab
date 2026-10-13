// URLs de archivos guardados en Supabase Storage.
// Formato: https://<proyecto>.supabase.co/storage/v1/object/public/<bucket>/<archivo>
const STORAGE = "https://mjwtcqrzadpsluakzfjg.supabase.co/storage/v1/object/public";
const BUCKET = "HOMEPAGE";

export const LOGO_URL = `${STORAGE}/${BUCKET}/icon.svg`;
export const FLOWER_DIVIDER_URL = `${STORAGE}/${BUCKET}/flor_separador%20titulo.svg`;
export const NOTE_DRAWING_1_URL = `${STORAGE}/${BUCKET}/notedrawing/Note_drawing_1.svg`;
export const NOTE_DRAWING_2_URL = `${STORAGE}/${BUCKET}/notedrawing/Note_drawing_2.svg`;
export const PENCIL_1_URL = `${STORAGE}/${BUCKET}/pencil/pencil_1.svg`;
export const PENCIL_2_URL = `${STORAGE}/${BUCKET}/pencil/pencil_2.svg`;
export const MICROPHONE_URL = `${STORAGE}/${BUCKET}/microfone.svg`;
export const AIRDROP_URL = `${STORAGE}/${BUCKET}/airdrop.svg`;
export const CTRL_Z_URL = `${STORAGE}/${BUCKET}/ctrlZ.svg`;

// Foto de la página About. Cuando la subas a Supabase, cambia null por la URL:
// export const ABOUT_PHOTO_URL = `${STORAGE}/${BUCKET}/about/foto.jpg`;
export const ABOUT_PHOTO_URL = `${STORAGE}/${BUCKET}/PFP_%20BIG_BLUE.svg`;

// Íconos de herramientas que no vienen en la librería (súbelos a Supabase y pega la URL).
// Mientras sean null, se muestra un ícono genérico con el nombre.
export const TOOL_ICON_AWS_URL = null;
export const TOOL_ICON_PHOTOSHOP_URL = null;
export const TOOL_ICON_AFTER_EFFECTS_URL = null;
