import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { StartInterviewClient } from './StartInterviewClient';
import { BackButton } from '@/components/ui/back-button';

// Función para cargar datos de la subárea
async function loadSubareaData(subareaId: string) {
  const supabase = await createClient();

  const { data: subarea, error } = await supabase
    .from('subareas')
    .select('name')
    .eq('id', subareaId)
    .single();

  if (error || !subarea) {
    redirect('/dashboard');
  }

  return subarea.name;
}

// Página del inicio de entrevista
export default async function StartInterviewPage({
  params,
}: {
  params: Promise<{ subareaId: string }>; // 👈 ahora es una promesa
}) {
  // 👇 Primero resolvemos los params
  const resolvedParams = await params;

  // 1Cargar el nombre de la subárea
  const subareaName = await loadSubareaData(resolvedParams.subareaId);

  // Renderizar el componente cliente
  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <BackButton />

      <StartInterviewClient
        subareaId={resolvedParams.subareaId}
        subareaName={subareaName}
      />
    </div>
  );
}
