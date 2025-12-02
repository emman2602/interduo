import { createClient } from '@/lib/supabase/server';
import ApplicationCard from './ApplicationCard';

export default async function RequestsPage() {
  const supabase = await createClient();

  const { data: applications } = await supabase
    .from('expert_applications')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });
  

  const list = applications || [];

  return (
    <div className="min-h-screen max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Solicitudes Pendientes</h1>
      
      {list.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">No hay solicitudes pendientes por revisar.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((app: any) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}