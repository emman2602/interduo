// app/dashboard/SubareaGrid.tsx
'use client';

import { useRouter } from 'next/navigation';


import type { Subarea } from './page'; 
import { SelectionCard } from '@/components/ui/selection-card';

type SubareaGridProps = {
  subareas: Subarea[];
};

export default function SubareaGrid({ subareas }: SubareaGridProps) {
  const router = useRouter();

  const handleSelectSubarea = (subareaId: string) => {
    // 1. Navega a la página de simulación de esa subárea
    router.push(`/dashboard/simulacion/${subareaId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
      {/* 2. Mapea sobre las subáreas */}
      {subareas.map((subarea) => (
        <SelectionCard
          key={subarea.id}
          title={subarea.name}
          // 3. Pasa el componente de icono
          imageSrc={subarea.image_url|| '/images/default.png'}
          // 4. Llama a la función de navegación al hacer clic
          onClick={() => handleSelectSubarea(subarea.id)}
        />
      ))}
    </div>
  );
}