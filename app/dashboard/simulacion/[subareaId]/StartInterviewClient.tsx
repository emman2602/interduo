'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { createInterviewAction } from './actions'; // La Server Action
import { Button } from '@/components/ui/button2';
import Image from 'next/image';
// import { Mascota } from '@/components/Mascota'; // Importa tu mascota

type Props = {
  subareaId: string;
  subareaName: string;
};

export function StartInterviewClient({ subareaId, subareaName }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async (interviewType: 'tecnica' | 'competencias') => {
    setIsLoading(true);

    // 1. Llama a la Server Action para crear la entrevista en la DB
    const { data: interviewId, error } = await createInterviewAction(subareaId, interviewType);

    if (error) {
      console.error(error);
      alert("Hubo un error al crear tu entrevista. Intenta de nuevo.");
      setIsLoading(false);
      return;
    }

    // 2. ¡Éxito! Navega a la página de la entrevista
    // (Crearemos esta ruta en el Paso 4)
    router.push(`/entrevista/${interviewId}/1`);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-16 max-w-4xl">
      
      {/* Columna de Texto y Botones */}
      <div className="flex flex-col gap-6 items-center md:items-start text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-800 leading-tight">
          ¡Vamos con todo! 🚀 <br />
          El <span className="text-blue-600">{subareaName}</span> es tu oportunidad de mostrar tus habilidades.
        </h1>
        <p className="text-lg text-gray-600">¡Tú puedes con esto!</p>
        
        <div className="flex flex-col gap-4 mt-4 w-full max-w-xs">
          <Button
            onClick={() => handleStart('tecnica')}
            disabled={isLoading}
            className="w-full justify-center" // Asegura que el botón se expanda
          >
            {isLoading ? 'Creando...' : 'Comenzar entrevista técnica'}
          </Button>
          
          <Button 
            onClick={() => handleStart('competencias')}
            disabled={isLoading}
            className="w-full justify-center "
          >
            {isLoading ? 'Creando...' : 'Comenzar entrevista de competencias'}
          </Button>
        </div>
      </div>

      {/* Columna de la Mascota */}
      <div className="w-120 h-80">
        {/* <Mascota /> */}
        <Image
        src={"/loopyManosAtras.png"}
        alt='loopy con las manos atras'
        width={1056}
        height={992}
        />
              </div>

    </div>
  );
}