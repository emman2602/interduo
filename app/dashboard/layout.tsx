
import SideNav from '@/components/SideNav';
import TopNav from '@/components/TopNav';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';


export type Subarea = {
  id: string;
  name: string;
};


// Esta función AHORA ES MÁS SIMPLE
async function getUserData() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // 1. Sigue buscando el perfil...
  const { data: profile } = await supabase
    .from('user_roles')
    .select('selected_area_id, selected_experience')
    .eq('user_id', user.id)
    .single();

  // 2. ...para poder redirigir si no ha completado el cuestionario
  if (!profile?.selected_area_id || !profile?.selected_experience) {
    redirect('/cuestionario/areas');
  }

  
  // 4. Devuelve solo el usuario
  return { user };
}


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 5. Llama a la función (ahora solo devuelve 'user')
  const { user } = await getUserData();

  return (
    <div>
      {/* 6. Pasa solo 'user' a los componentes */}
      <SideNav user={user} />
      <TopNav user={user} />

      {/* 3. Contenido principal (sigue igual) */}
      <main className="py-10 mt-16 md:mt-0 md:pl-64">
        <div className="px-4 sm:px-6 lg:px-8">
          {children} {/* Aquí se renderiza tu app/dashboard/page.tsx */}
        </div>
      </main>
    </div>
  );
}