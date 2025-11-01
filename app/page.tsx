
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";

import AboutSection from "@/components/home/AboutSection";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";



export default async function Home() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  // Si el usuario existe (está logueado), redirige al dashboard
  if (user) {
    redirect('/dashboard');
  }
  // -
  
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="w-full flex flex-col items-center">
        <NavBar/>
        <HeroSection/>
        <AboutSection/>
        <Footer/>
      </div>
    </main>
  );
}
