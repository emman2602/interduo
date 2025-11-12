'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Editor from '@monaco-editor/react'; // 1. Importa el editor
import { Button } from '@/components/ui/button2';
import { saveAnswerAction } from './actions';

 

type Props = {
  questionText: string;
  questionType: string;
  interviewQuestionId: string;
  interviewId: string;
  currentPosition: number;
  totalQuestions: number;
};

export function InterviewQuestionClient({ 
  questionText, 
  questionType,
  interviewQuestionId,
  interviewId,
  currentPosition,
  totalQuestions
}: Props) {
  
  const router = useRouter();
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2. Lógica condicional
  const isCodingQuestion = questionType === 'coding_exercise';

  // comprobar si es la ultima preguntas
  const isLastQuestion = currentPosition === totalQuestions;

  const handleSubmit = async () => {
    setIsLoading(true);
    
    //guarda la pregunta llamando a la acccion saveAnswerQuestion
    const {error} = await saveAnswerAction(interviewQuestionId, answer)
    
    if(error){
      alert("Error al guardar tu respuesta");
      setIsLoading(false);
      return;
    }

    if(isLastQuestion){
      router.push(`/entrevista/${interviewId}/resultados`);
    } else {
      // Si no, navega a la siguiente pregunta
      const nextPosition = currentPosition + 1;
      router.push(`/entrevista/${interviewId}/${nextPosition}`);
    }
      
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-3xl">
        
        {/* Muestra el progreso */}
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Pregunta {currentPosition} de {totalQuestions}
        </h1>
        
        <p className="text-lg mb-8 p-4 bg-white rounded-lg shadow">
          {questionText}
        </p>

        {/* Editor */}
        {isCodingQuestion ? (
          <div className="border rounded-lg overflow-hidden shadow">
            <Editor
              height="40vh"
              defaultLanguage="javascript"
              defaultValue="// Escribe tu código aquí"
              onChange={(value) => setAnswer(value || '')}
              theme="vs-dark"
            />
          </div>
        ) : (
          <textarea
            className="w-full h-64 p-4 border rounded-lg shadow text-gray-800"
            placeholder="Escribe tu respuesta aquí..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        )}

        <div className="mt-8 text-right">
          <Button onClick={handleSubmit} disabled={isLoading || answer.length === 0}>
            {isLoading 
              ? 'Guardando...' 
              : isLastQuestion // 6. Cambia el texto del botón
              ? 'Finalizar y Evaluar' 
              : 'Siguiente Pregunta'
            }
          </Button>
        </div>

      </div>
    </div>
  );
}