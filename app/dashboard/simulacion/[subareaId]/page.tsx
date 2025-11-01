import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { StartInterviewClient } from './StartInterviewClient'; // Componente del Paso 2
import { BackButton } from '@/components/ui/back-button';
 // Tu botón de regreso

// Esta función carga los datos
async function loadSubareaData(subareaId: string) {
  const supabase = await createClient();
  
  const { data: subarea, error } = await supabase
    .from('subareas')
    .select('name')
    .eq('id', subareaId)
    .single();

  if (error || !subarea) {
    // Si no se encuentra, redirige al dashboard
    redirect('/dashboard');
  }
  
  return subarea.name;
}

// La página recibe 'params' de la URL
export default async function StartInterviewPage({ params }: { params: { subareaId: string } }) {
  
  // 1. Carga el nombre de la subárea (ej. "Frontend")
  const subareaName = await loadSubareaData(params.subareaId);

  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      {/* Usamos el BackButton de tu layout del cuestionario */}
      <BackButton />
      
      {/* 2. Renderiza el componente cliente y le pasa los datos */}
      <StartInterviewClient 
        subareaId={params.subareaId} 
        subareaName={subareaName} 
      />
    </div>
  );
}