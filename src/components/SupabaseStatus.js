"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SupabaseStatus() {
  const [status, setStatus] = useState("Comprobando conexión…");

  useEffect(() => {
    async function check() {
      const { error } = await supabase.auth.getSession();
      setStatus(error ? `❌ Error: ${error.message}` : "✅ Supabase conectado");
    }
    check();
  }, []);

  return <p className="text-sm opacity-70">{status}</p>;
}
