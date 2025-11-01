// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SubareaGrid from './SubareaGrid'; // Importa el componente cliente
import Image from 'next/image';
import { Button } from '@/components/ui/button2';
import Link from 'next/link';
// (Importa tu mascota si la tienes)
// import { Mascota } from '@/components/Mascota';

// 1. Define el tipo de dato que esperamos
// (Lo exportamos para que SubareaGrid.tsx lo pueda usar)
export type Subarea = {
  id: string;
  name: string;
  image_url: string | null; 
};

// 2. Función para cargar los datos en el servidor
async function loadDashboardData() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // 3. Busca el perfil del usuario (igual que en el layout)
  const { data: profile } = await supabase
    .from('user_roles')
    .select('selected_area_id')
    .eq('user_id', user.id)
    .single();

  if (!profile?.selected_area_id) {
    // Si no tiene área, lo mandamos al cuestionario
    redirect('/cuestionario/areas');
  }

  // 4. Carga las subáreas que coinciden con el área del usuario
  // ¡Asegúrate de pedir 'icon_name'!
  const { data: subareas, error } = await supabase
    .from('subareas')
    .select('id, name, image_url')
    .eq('area_id', profile.selected_area_id);

  if (error) {
    console.error('Error cargando subáreas:', error.message);
    return [];
  }

  return subareas || [];
}


// 5. La Página (Server Component)
export default async function DashboardPage() {
  // 6. Llama a la función de carga de datos
  const subareas = await loadDashboardData();

  return (
    <div className="min-h-screen w-full">
      {/* Encabezado con la mascota */}
      <div className="flex justify-between items-center mb-8 -mt-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Selecciona la entrevista con la que quieres comenzar
        </h1>
        {/* <Mascota className="w-24 h-24" /> */}
        <Image src={'/loopyMotivador.png'} alt="Personaje loopy" width={300} height={300} className='w-48 h-48' />
      </div>

      {/* 7. Renderiza el Componente Cliente y le pasa los datos */}
      <SubareaGrid subareas={subareas} />

      <div className="flex flex-col items-center justify-center mt-10">
        <p className="text-xl font-bold text-gray-800 mb-4">
            ¿Te gustaría cambiar de área?
        </p>
        <Button>
        <Link href="/cuestionario/areas">Cambiar de área</Link>
        </Button>
      </div>

    </div>
  );
}