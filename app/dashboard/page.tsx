// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SubareaGrid from './SubareaGrid'; // Importa el componente cliente
import Image from 'next/image';
import { Button } from '@/components/ui/button2';
import Link from 'next/link';
import ExpertDashboard from '@/components/ExpertDashboard';


// 1. Define el tipo de dato que esperamos
export type Subarea = {
  id: string;
  name: string;
  image_url: string | null; 
};

// 2. Función para cargar los datos en el servidor
async function loadDashboardData() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Obtener perfil y rol
  const { data: profile } = await supabase
    .from('user_roles')
    .select('role, selected_area_id')
    .eq('user_id', user.id)
    .single();

  const role = profile?.role || 'user';

  // CASO A: Es Experto -> No necesita cargar subáreas
  if (role === 'expert') {
    return { role, subareas: [] };
  }

  // CASO B: Es Usuario -> Validar onboarding
  if (!profile?.selected_area_id) {
    redirect('/cuestionario/areas');
  }

  // Cargar sus subáreas
  // Cargar sus subáreas
const subareaResult = await supabase
  .from('subareas')
  .select('id, name, image_url')
  .eq('area_id', profile.selected_area_id);

if (subareaResult.error) {
  console.error('Error cargando subáreas:', subareaResult.error.message);
  return { role, subareas: [] };
}

return { role, subareas: subareaResult.data as Subarea[] };

}

export default async function DashboardPage() {
  // 3. Obtenemos role Y subareas
  const { role, subareas } = await loadDashboardData();

  // ------------------------------------------------------
  // VISTA DE EXPERTO
  // ------------------------------------------------------
  if (role === 'expert') {
    return <ExpertDashboard/>;
  }
  if (role === 'admin') {
    redirect('/dashboard/admin/solicitudes');
  }

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