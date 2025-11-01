import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { InterviewQuestionClient } from './InterviewQuestionClient'; // (Paso 2.C)

type PageProps = {
  params: {
    interviewId: string;
    position: string;
  }
};

// Carga los datos de la pregunta actual
async function loadQuestionData(interviewId: string, position: number) {
  const supabase = await createClient();
  
  const { data:questionData, error } = await supabase
    .from('interview_questions')
    .select(`
      id,
      position,
      questions (
        id,
        question_text,
        question_types ( name ) 
      )
    `)
    .eq('interview_id', interviewId)
    .eq('position', position)
    .single();

  // 2. SEGUNDA CONSULTA: Obtiene el total de preguntas
  const { count: totalQuestions, error: countError } = await supabase
    .from('interview_questions')
    .select('*', { count: 'exact', head: true }) // 'head: true' no devuelve datos, solo el conteo
    .eq('interview_id', interviewId);

  if (error || countError || !questionData) {
    console.error('Error cargando la pregunta o el conteo:', error?.message);
    redirect('/dashboard');
  }
  
  const question = questionData.questions as any;
  const questionType = question?.question_types?.name;

  return {
    interviewQuestionId: questionData.id,
    questionText: question?.question_text,
    questionType: questionType,
    totalQuestions: totalQuestions || 0, // Devuelve el conteo
  };
}

export default async function InterviewPage({ params }: PageProps) {
  const position = parseInt(params.position, 10);
  
  const { 
    questionText, 
    questionType, 
    interviewQuestionId,
    totalQuestions 
  } = await loadQuestionData(params.interviewId, position);

  if (!questionText || !questionType) {
    redirect('/dashboard');
  }

  // Pasa los datos al componente cliente
  return (
    <InterviewQuestionClient
      questionText={questionText}
      questionType={questionType}
      interviewQuestionId={interviewQuestionId}
      // Pasa los params para la navegación (siguiente pregunta)
      interviewId={params.interviewId}
      currentPosition={position}
      totalQuestions={totalQuestions}
    />
  );
}