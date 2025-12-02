import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button2';
import { CheckCircle2, Clock, Search, ArrowRight } from 'lucide-react';


type InterviewRow = {
  id: string;
  created_at: string;
  expert_status: string;
  subareas: {
    name: string | null;
  }[]; 
};

export default async function ExpertDashboard() {
  const supabase = await createClient();

  const { data: pendingInterviews, error } = await supabase
    .from('interviews')
    .select(
      `
        id,
        created_at,
        expert_status,
        subareas ( name )
      `
    )
    .eq('expert_status', 'pending')
    .order('created_at', { ascending: true })
    .limit(20);

  if (error) {
    console.error("Error cargando dashboard experto:", error);
  }

  // Datos tipados sin usar any
  const interviews: InterviewRow[] = pendingInterviews ?? [];

  return (
    <div className="w-full p-8">
      {/* Header del Experto */}
      <div className="bg-blue-600 text-white rounded-2xl p-8 mb-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Panel de Evaluador Experto</h1>
          <p className="text-indigo-200 max-w-2xl">
            Gracias por ayudar a la comunidad. Aquí tienes las entrevistas más recientes que necesitan tu retroalimentación profesional.
          </p>
        </div>
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10">
          <CheckCircle2 className="w-64 h-64" />
        </div>
      </div>

      {/* Lista de Trabajo */}
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Search className="w-5 h-5 text-gray-400" />
        Cola de Evaluación ({interviews.length})
      </h2>

      <div className="space-y-4">
        {interviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">¡Todo al día! No hay entrevistas pendientes de revisión.</p>
          </div>
        ) : (
          interviews.map((interview) => (
            <div
              key={interview.id}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    {interview.subareas?.[0]?.name ?? 'Entrevista Técnica'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Solicitado el: {new Date(interview.created_at).toLocaleDateString()}
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
                    Pendiente de Revisión
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <Link href={`/dashboard/evaluar/${interview.id}`}>
                  <Button className="w-full md:w-auto">
                    Revisar <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
