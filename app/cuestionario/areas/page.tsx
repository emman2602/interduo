'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Importa tu cliente de Supabase
import { createClient } from '@/lib/supabase/client';
import { SelectionCard } from '@/components/ui/selection-card';
import { saveUserArea } from './actions'
// 1. Define un 'type' para tus áreas

type Area = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
};

export default function SelectAreaPage() {
  const router = useRouter();
  // 2. Crea un cliente de Supabase
  const supabase = createClient();

  // 3. Crea un estado para guardar las áreas
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);

  // 4. Usa useEffect para cargar los datos al montar el componente
  useEffect(() => {
    const getAreas = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('areas') // El nombre de tu tabla
        .select('*'); // Pide todas las columnas

      if (error) {
        console.error('Error cargando áreas:', error.message);
      } else if (data) {
        setAreas(data);
      }
      setLoading(false);
    };

    getAreas();
  }, [supabase]); // Depende de 'supabase'

  const handleSelectArea = async(areaId: string) => {
    
    // 1. Llama a la Server Action para guardar
    const { error } = await saveUserArea(areaId);

    if (error) {
      console.error('Error al guardar el área:', error.message);
      // (Aquí podrías mostrar un error al usuario)
    } else {
      // 2. Si todo sale bien, navega al siguiente paso
      router.push('/cuestionario/experiencia');
    }
  
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-8 pt-24">

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Comencemos con un cuestionario
        </h1>
        <p className="text-lg text-gray-500">
          En qué área te gustaría especificar tu entrevista?
        </p>
      </div>

      {/* 5. Muestra un mensaje de carga o las tarjetas */}
      {loading ? (
        <p className="text-gray-500">Cargando áreas...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl w-full">
          {/* 6. Mapea sobre el estado 'areas' para renderizar las tarjetas */}
          {areas.map((area) => (
            <SelectionCard
              key={area.id}
              title={area.name}
              // Usa la URL de la imagen de la base de datos
              imageSrc={area.image_url || '/images/default.png'} 
              onClick={() => handleSelectArea(area.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}