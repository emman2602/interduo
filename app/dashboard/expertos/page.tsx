import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ExpertHistoryCard from './ExpertHistoryCard';
import { ShieldCheck } from 'lucide-react';

export default async function ExpertHistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Obtener rol
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  const role = userRole?.role || 'user';
  let historyData = [];

  // ============================================================
  //  USAMOS LA VISTA 'vw_interviews_history'
  // ============================================================
  
  // CONSULTA COMÚN (La filtramos según el rol abajo)
  let query = supabase
    .from('vw_interviews_history')
    .select('*')
    .eq('expert_status', 'completed')
    .order('created_at', { ascending: false });

  // A) MODO EXPERTO: Ver lo que YO evalué
  if (role === 'expert') {
    query = query.eq('assigned_expert_id', user.id);
  } 
  // B) MODO USUARIO: Ver mis propias entrevistas
  else {
    query = query.eq('candidate_id', user.id);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching history:", error);
  }

  // Mapeamos los datos planos de la vista
  historyData = (data || []).map((item: any) => ({
    interview_id: item.interview_id,
    subarea_name: item.subarea_name || 'Desconocido',
    created_at: item.created_at,
    feedback_text: item.feedback_text || 'Sin comentarios registrados.',
    // Si soy experto, muestro el email del candidato. Si soy usuario, el del experto.
    other_party_email: role === 'expert' 
      ? (item.candidate_email || 'Candidato Anónimo')
      : (item.expert_email || 'Experto Verificado')
  }));

  return (
    <div className="max-w-4xl mx-auto p-8 pb-20">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {role === 'expert' ? 'Mis Evaluaciones Realizadas' : 'Mis Evaluaciones de Expertos'}
          </h1>
          <p className="text-gray-500">
            {role === 'expert'
              ? 'Historial de retroalimentación que has proporcionado a la comunidad.'
              : 'Revisa el feedback profesional que has recibido en tus entrevistas.'}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {historyData.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">Aún no hay historial disponible.</p>
            {role === 'user' && (
              <p className="text-sm text-gray-400 mt-2">
                Solicita una revisión de experto al finalizar tu próxima entrevista.
              </p>
            )}
          </div>
        ) : (
          historyData.map((item: any) => (
            <ExpertHistoryCard
              key={item.interview_id}
              data={item}
              role={role === 'expert' ? 'expert' : 'user'}
            />
          ))
        )}
      </div>
    </div>
  );
}