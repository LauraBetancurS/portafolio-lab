import { createClient } from "@supabase/supabase-js";

// Valores públicos del proyecto. La publishable key está hecha para usarse
// en el navegador, así que es seguro tenerla aquí (la seguridad real la dan
// las políticas RLS de Supabase). NUNCA pongas aquí la "secret" key.
const DEFAULT_URL = "https://mjwtcqrzadpsluakzfjg.supabase.co";
const DEFAULT_KEY = "sb_publishable_I26kPr932K_qalbmYjCfSA_a_HzfPtT";

// Si existe .env.local, sus valores tienen prioridad.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || DEFAULT_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
