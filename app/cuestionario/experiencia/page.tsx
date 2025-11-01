// app/cuestionario/experiencia/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';



// 1. Importa la nueva Server Action
import { saveUserExperience } from './actions';
import { SelectionCard } from '@/components/ui/selection-card';
import { Button } from '@/components/ui/button2';
import Image from 'next/image';

// datos de experiencia
const experiences = [
  {
    id: 'beginner',
    title: 'Primeras entrevistas',
    description: 'Quiero prepararme para mis primeras entrevistas...',
    image_url: "/iconJunior.png"
  },
  {
    id: 'intermediate',
    title: 'Siguiente paso',
    description: 'Busco practicar entrevistas más retadoras...',
    image_url: "/iconMid.png"
  },
  {
    id: 'advanced',
    title: 'Liderazgo y experiencia',
    description: 'Quiero enfrentar entrevistas avanzadas...',
    image_url: "/iconSenior.png"
  },
];

export default function SelectExperiencePage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // 2. Estado de carga para el botón
  const [isLoading, setIsLoading] = useState(false);

  // 3. Modifica la función 'handleNext'
  const handleNext = async () => {
    if (!selectedId) return; // No hacer nada si no hay selección

    setIsLoading(true); // Bloquea el botón

    // 4. Llama a la Server Action
    const { error } = await saveUserExperience(selectedId);

    if (error) {
      console.error('Error al guardar la experiencia:', error.message);
      alert('Hubo un error al guardar tu selección. Intenta de nuevo.');
      setIsLoading(false);
    } else {
      // 5. ¡ÉXITO! Redirige al dashboard
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex flex-col items-center w-full"> 
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Cuéntame sobre tu experiencia
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-12">
        {experiences.map((exp) => (
          <SelectionCard
            key={exp.id}
            title={exp.title}
            description={exp.description}
            imageSrc={exp.image_url}
            isSelected={selectedId === exp.id}
            onClick={() => setSelectedId(exp.id)}
          />
        ))}
      </div>

      <Button 
        onClick={handleNext} 
        // 6. deshabilita el botón si no hay selección O si está cargando
        disabled={!selectedId || isLoading}
      >
        {isLoading ? 'Guardando...' : 'Siguiente'}
      </Button>
    </div>
  );
  
}

