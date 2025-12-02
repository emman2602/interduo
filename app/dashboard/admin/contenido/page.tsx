import { createClient } from '@/lib/supabase/server';
import CreateAreaForm from './CreateAreaForm';
import CreateQuestionForm from './CreateQuestionForm';

export default async function ContentPage() {
  const supabase = await createClient();

  const { data: areas } = await supabase
    .from('areas')
    .select('*')
    .order('name');

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Gestión de Contenido</h1>

      {/* Formulario para agregar */}
      <CreateAreaForm />


      {/* Lista de Áreas */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Áreas Activas ({areas?.length || 0})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(areas || []).map((area) => (
            <div key={area.id} className="p-4 bg-white rounded-lg border border-gray-200 flex justify-between items-center shadow-sm">
              <span className="font-medium text-gray-700">{area.name}</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Activa</span>
            </div>
          ))}
        </div>
      </div>
      <CreateQuestionForm/>
    </div>
  );
}