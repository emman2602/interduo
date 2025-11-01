import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { evaluateEntireInterviewAction } from './actions'; // Importa la NUEVA acción (Paso 5)
import { Button } from '@/components/ui/button2';
import { Home, UserCheck, Users } from 'lucide-react'; 
import Link from 'next/link';


type Props = {
  params: { interviewId: string }
};

export default async function ResultsPage({ params }: Props) {
  
  // 1. Llama a la acción que hace todo el trabajo pesado
  const { averageScore, evaluations, error } = await evaluateEntireInterviewAction(params.interviewId);

  if (error) {
    return (
      <div className="text-red-500">
        <h1>Error al evaluar tu entrevista: {error}</h1>
      </div>
    );
  }

  // 2. Muestra los resultados
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-4">¡Entrevista Completada!</h1>
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <p className="text-lg text-gray-600">Tu puntaje promedio:</p>
        <p className="text-8xl font-bold text-blue-600 my-4">{averageScore} / 100</p>
      </div>

      <h2 className="text-4xl font-bold mt-6 mb-6">Retroalimentación Detallada</h2>
      <div className="space-y-6">
        {evaluations.map((evaluation, index) => (
          <div key={evaluation.answerId} className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800">Pregunta {index + 1}</h3>
            <p className="text-gray-600 italic my-3">"{evaluation.questionText}"</p>
            <div className="p-4 bg-gray-50 rounded-md my-4">
              <p className="text-sm font-semibold text-gray-600">Tu respuesta:</p>
              <p className="text-gray-800">{evaluation.answerText}</p>
            </div>
            <p className="text-2xl font-bold text-blue-600 my-3">{evaluation.score} / 100</p>
            <p className="text-gray-700">{evaluation.feedback}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-4 mb-8 mt-8">

        {/* Fila 1: Botones de Evaluación */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          
          {/* Botón 2: Evaluar por experto (Deshabilitado) */}
          <Button
            className="flex-1" // flex-1 para que compartan espacio
            disabled
            title="Próximamente"
          >
           
            Evaluar por experto
          </Button>
          
          {/* Botón 3: Evaluar por comunidad (Deshabilitado) */}
          <Button
            className="flex-1" // flex-1 para que compartan espacio
            disabled
            title="Próximamente"
          >
            
            Evaluar por comunidad
          </Button>
        </div>

        {/* Fila 2: Botón de Volver al inicio */}
        <div className="w-full sm:w-1/2">
          <Link href="/dashboard" className="w-full">
            <Button className="w-full">
              Volver al inicio
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}