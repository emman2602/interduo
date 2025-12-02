'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button2';

import { submitExpertReviewAction } from './actions';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

type Props = {
  interviewId: string;
  currentUserId: string;
};

export default function EvaluationForm({ interviewId, }: Props) {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      alert("Por favor escribe un comentario.");
      return;
    }

    if (!confirm("¿Estás seguro de enviar esta evaluación? Esta acción completará la revisión.")) {
      return;
    }

    setIsSubmitting(true);
    
    // Llamamos a la Server Action (Paso 4)
    const res = await submitExpertReviewAction(interviewId, feedback);

    if (res.success) {
      alert("¡Evaluación enviada con éxito!");
      router.push('/dashboard'); // Redirige al dashboard de experto
    } else {
      alert("Error al enviar: " + res.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Feedback General y Recomendaciones
        </label>
        <textarea
          className="w-full min-h-[150px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y text-gray-700"
          placeholder="Escribe aquí tus observaciones sobre las respuestas técnicas, claridad y áreas de mejora..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button 
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button 
          className="min-w-[150px]"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            'Enviando...'
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Finalizar Revisión
            </>
          )}
        </Button>
      </div>
    </div>
  );
}