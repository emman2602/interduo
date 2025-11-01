import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { InterviewQuestionClient } from './InterviewQuestionClient';

type PageProps = {
  params: Promise<{
    interviewId: string;
    position: string;
  }>;
};

// Definimos los tipos esperados desde Supabase
interface QuestionType {
  name: string;
}

interface Question {
  id: string;
  question_text: string;
  question_types: QuestionType | null;
}

interface InterviewQuestionRow {
  id: string;
  position: number;
  questions: Question | null;
}

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
    .single<InterviewQuestionRow>(); // 👈 tipa el resultado directamente

  const { count: totalQuestions, error: countError } = await supabase
    .from('interview_questions')
    .select('*', { count: 'exact', head: true })
    .eq('interview_id', interviewId);

  if (error || countError || !questionData) {
    console.error('Error cargando la pregunta o el conteo:', error?.message);
    redirect('/dashboard');
  }

  const question = questionData.questions;
  const questionType = question?.question_types?.name ?? null;

  return {
    interviewQuestionId: questionData.id,
    questionText: question?.question_text ?? '',
    questionType,
    totalQuestions: totalQuestions ?? 0,
  };
}

export default async function InterviewPage({ params }: PageProps) {
  const { interviewId, position } = await params;
  const positionNumber = parseInt(position, 10);

  const {
    questionText,
    questionType,
    interviewQuestionId,
    totalQuestions,
  } = await loadQuestionData(interviewId, positionNumber);

  if (!questionText || !questionType) {
    redirect('/dashboard');
  }

  return (
    <InterviewQuestionClient
      questionText={questionText}
      questionType={questionType}
      interviewQuestionId={interviewQuestionId}
      interviewId={interviewId}
      currentPosition={positionNumber}
      totalQuestions={totalQuestions}
    />
  );
}
