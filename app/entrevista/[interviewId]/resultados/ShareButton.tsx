'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button2';
import { Users, Check } from 'lucide-react';
import { shareInterviewAction } from './actions';
import { useRouter } from 'next/navigation';

type Props = {
  interviewId: string;
};

export default function ShareButton({ interviewId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const router = useRouter();

  const handleShare = async () => {
    setIsLoading(true);
    try {
      const response = await shareInterviewAction(interviewId);
      
      if (response?.error) {
        alert("Error al compartir: " + response.error);
      } else {
        setIsShared(true);
        if(confirm("¡Entrevista compartida! ¿Quieres verla en la comunidad?")) {
          router.push('/dashboard/comunidad');
        }
      }
    } catch (error: unknown) {
      console.error(error);
      alert("Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className={`flex-1 ${isShared ? 'hover:bg-green-700' : ''}`}
      onClick={handleShare}
      disabled={isLoading || isShared}
    >
      {isShared ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          ¡Compartido!
        </>
      ) : (
        <>
          <Users className="w-4 h-4 mr-2" />
          {isLoading ? '...' : 'Evaluar por comunidad'}
        </>
      )}
    </Button>
  );
}