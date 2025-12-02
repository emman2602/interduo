import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

import { ChevronLeft, User, Calendar } from 'lucide-react';
import EvaluationForm from './EvaluationForm';

// ----------- Tipos -----------

type QAPair = {
  question: string;
  answer: string;
  score: number;
};

type ExpertEvaluationDetails = {
  interview_id: string;
  subarea_name: string;
  author_email: string | null;
  created_at: string;
  qa_pairs: QAPair[];
};

type Props = {
  params: {
    interviewId: string;
  };
};

// ----------- Página -----------

export default async function ExpertEvaluationPage({ params }: Props) {
  const { interviewId } = params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // 1. Verificar que el usuario sea EXPERTO
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (userRole?.role !== 'expert') {
    return (
      <div className="p-8 text-center text-red-600">
        No tienes permisos para ver esta página.
      </div>
    );
  }

  // 2. Obtener la entrevista desde tu vista
  const { data: interviewData, error } = await supabase
    .from('vw_expert_evaluation_details')
    .select('*')
    .eq('interview_id', interviewId)
    .single<ExpertEvaluationDetails>();   // ← Tipado seguro aquí

  if (error || !interviewData) {
    notFound();
  }

  const interview = interviewData;

  return (
    <div className="max-w-4xl mx-auto p-8 pb-20">

      {/* Botón de regreso */}
      <Link
        href="/dashboard"
        className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Volver al Panel
      </Link>

      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Evaluación: {interview.subarea_name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {interview.author_email || 'Candidato Anónimo'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(interview.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100">
            Revisión Pendiente
          </div>
        </div>
      </div>

      {/* Preguntas y respuestas */}
      <div className="space-y-8 mb-10">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
          Respuestas del Candidato
        </h2>

        {interview.qa_pairs.map((qa, index) => (
          <div
            key={index}
            className="bg-gray-50 p-6 rounded-xl border border-gray-200"
          >
            <h3 className="font-semibold text-gray-800 mb-3 text-lg">
              <span className="text-gray-400 mr-2">#{index + 1}</span>
              {qa.question}
            </h3>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-gray-700 italic">
              &quot;{qa.answer}&quot;
            </div>

            <div className="mt-3 text-xs text-gray-400 text-right">
              Puntaje IA sugerido: {qa.score}/100
            </div>
          </div>
        ))}
      </div>

      {/* Formulario */}
      <div className="bg-white p-8 rounded-xl border border-blue-600 shadow-lg ring-1 ring-blue-50">
        <h2 className="text-xl font-bold mb-4">Tu Veredicto Profesional</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Por favor, proporciona un feedback constructivo y detallado.
        </p>

        <EvaluationForm
          interviewId={interviewId}
          currentUserId={user.id}
        />
      </div>
    </div>
  );
}
