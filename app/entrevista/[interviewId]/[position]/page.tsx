import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { InterviewQuestionClient } from './InterviewQuestionClient';

type PageProps = {
  params: Promise<{ // 👈 hazlo explícitamente una Promise
    interviewId: string;
    position: string;
  }>
};

// Función para cargar la pregunta actual
async function loadQuestionData(interviewId: string, position: number) {
  const supabase = await createClient();
  
  const { data: questionData, error } = await supabase
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

  const { count: totalQuestions, error: countError } = await supabase
    .from('interview_questions')
    .select('*', { count: 'exact', head: true })
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
    questionType,
    totalQuestions: totalQuestions || 0,
  };
}

export default async function InterviewPage({ params }: PageProps) {
  // ✅ Espera los params una sola vez
  const { interviewId, position } = await params;
  const positionNumber = parseInt(position, 10);

  const { 
    questionText, 
    questionType, 
    interviewQuestionId,
    totalQuestions 
  } = await loadQuestionData(interviewId, positionNumber);

  if (!questionText || !questionType) {
    redirect('/dashboard');
  }

  // ✅ Usa las variables ya resueltas (no vuelvas a usar params)
  return (
    <InterviewQuestionClient
      questionText={questionText}
      questionType={questionType}
      interviewQuestionId={interviewQuestionId}
      interviewId={interviewId}     // ← sin error
      currentPosition={positionNumber}
      totalQuestions={totalQuestions}
    />
  );
}
