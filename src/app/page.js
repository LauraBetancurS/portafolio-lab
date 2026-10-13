import SupabaseStatus from "@/components/SupabaseStatus";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold">Laura Andrea Betancur</h1>
      <p className="text-lg opacity-80">Portafolio — en construcción 🚧</p>
      <SupabaseStatus />
    </main>
  );
}
