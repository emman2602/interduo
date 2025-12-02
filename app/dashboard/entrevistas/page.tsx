
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import InterviewsSection from './InterviewsSection';

export default async function Entrevistas() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si no está logueado, redirigimos al login
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Mis Entrevistas</h1>
      <InterviewsSection userId={user.id} />
    </main>
  );
}