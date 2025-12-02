'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button2';
import { UserCheck, Loader2, CheckCircle } from 'lucide-react';
import { requestExpertReviewAction } from './actions';

type Props = {
  interviewId: string;
  currentStatus: string; // 'none', 'pending', 'assigned', 'completed'
};

export default function RequestExpertButton({ interviewId, currentStatus }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  const handleRequest = async () => {
    if (!confirm("¿Quieres solicitar una revisión profesional? Un experto en el área analizará tus respuestas.")) return;
    
    setIsLoading(true);
    const res = await requestExpertReviewAction(interviewId);
    setIsLoading(false);

    if (res.error) {
      alert(res.error);
    } else {
      setStatus('pending');
      alert("¡Solicitud enviada! Te notificaremos cuando un experto revise tu entrevista.");
    }
  };

  if (status === 'pending') {
    return (
      <Button className="flex-1 bg-yellow-100 text-yellow-700 border border-yellow-200 hover:bg-yellow-200 cursor-default">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Esperando a un experto...
      </Button>
    );
  }

  if (status === 'assigned' || status === 'completed') {
    return (
      <Button className="flex-1 bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 cursor-default">
        <CheckCircle className="w-4 h-4 mr-2" />
        {status === 'assigned' ? 'En revisión' : 'Revisión completada'}
      </Button>
    );
  }

  return (
    <Button 
      className="flex-1 "
      onClick={handleRequest}
      disabled={isLoading}
    >
      <UserCheck className="w-4 h-4 mr-2" />
      {isLoading ? 'Solicitando...' : 'Evaluar por experto'}
    </Button>
  );
}