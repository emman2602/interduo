'use server';

import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

const openai = new OpenAI();

// Tipos auxiliares
interface AIEvaluation {
  score: number;
  feedback: string;
}

interface Answer {
  id: string;
  answer_text: string;
  ai_evaluations?: AIEvaluation[];
}

interface Question {
  question_text: string;
}

interface InterviewQuestionRow {
  questions: Question;
  answers: Answer[];
}

interface EvaluationResult {
  answerId: string | null;
  score: number;
  feedback: string;
  questionText: string;
  answerText: string;
}

interface EvaluationSummary {
  averageScore: number;
  evaluations: EvaluationResult[];
  error?: string | null;
}

export async function evaluateEntireInterviewAction(
  interviewId: string
): Promise<EvaluationSummary> {
  const supabase = await createClient();

  try {
    // =======================================================
    // 1. Revisa el estado de la entrevista
    // =======================================================
    const { data: interview, error: fetchInterviewError } = await supabase
      .from('interviews')
      .select('status')
      .eq('id', interviewId)
      .single<{ status: string }>();

    if (fetchInterviewError) throw fetchInterviewError;
    if (!interview) throw new Error('Entrevista no encontrada');

    // =======================================================
    // Helper: Calcula promedio
    // =======================================================
    const calculateResults = (
      data: InterviewQuestionRow[]
    ): { averageScore: number; evaluations: EvaluationResult[] } => {
      let totalScore = 0;

      const evaluations = data.map((item) => {
        const question = item.questions;
        const answer = item.answers?.[0];
        const evaluation = answer?.ai_evaluations?.[0];

        totalScore += evaluation?.score || 0;

        return {
          answerId: answer?.id ?? null,
          score: evaluation?.score ?? 0,
          feedback: evaluation?.feedback ?? 'No se encontró evaluación.',
          questionText: question?.question_text ?? 'Pregunta no encontrada.',
          answerText: answer?.answer_text ?? '',
        };
      });

      const averageScore = Math.round(totalScore / (evaluations.length || 1));
      return { averageScore, evaluations };
    };

    // =======================================================
    // 2. Si ya está completada solo se leen los resultados
    // =======================================================
    if (interview.status === 'completed') {
      const { data: existingData, error: fetchError } = await supabase
        .from('interview_questions')
        .select(
          `
          questions ( question_text ),
          answers (
            id,
            answer_text,
            ai_evaluations ( score, feedback )
          )
        `
        )
        .eq('interview_id', interviewId)
        .order('position', { ascending: true });

      if (fetchError) throw fetchError;

      const { averageScore, evaluations } = calculateResults(
        (existingData ?? []) as unknown as InterviewQuestionRow[]
      );

      return { averageScore, evaluations, error: null };
    }

    // =======================================================
    // 3. Si está "in_progress" ejecutar evaluación IA 
    // =======================================================
    const { data: interviewData, error: fetchError } = await supabase
      .from('interview_questions')
      .select(`
        answers ( id, answer_text ),
        questions ( question_text )
      `)
      .eq('interview_id', interviewId)
      .order('position', { ascending: true });

    if (fetchError) throw fetchError;
    if (!interviewData || interviewData.length === 0)
      throw new Error('No se encontraron preguntas.');

    const interviewRows = (interviewData ?? []) as unknown as InterviewQuestionRow[];


    const evaluationPromises = interviewRows.map(async (item): Promise<EvaluationResult> => {
      const question = item.questions;
      const answer = item.answers?.[0];

      if (!answer) {
        return {
          answerId: null,
          score: 0,
          feedback: 'No se proporcionó respuesta.',
          questionText: question.question_text,
          answerText: 'No se proporcionó respuesta.',
        };
      }

      const systemPrompt = `
        Eres un evaluador experto en entrevistas laborales que se caracteriza por ser muy amable y motivador.
        La pregunta fue: "${question.question_text}"
        La respuesta fue: "${answer.answer_text}"
        Devuelve un objeto JSON con "score" (0-100) y "feedback" (máx. 50 palabras).
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-5-nano',
        messages: [{ role: 'system', content: systemPrompt }],
        response_format: { type: 'json_object' },
      });

      const aiResponse = JSON.parse(
        completion.choices[0].message.content || '{}'
      ) as Partial<AIEvaluation>;

      return {
        answerId: answer.id,
        score: aiResponse.score ?? 0,
        feedback: aiResponse.feedback ?? 'No se pudo generar feedback.',
        questionText: question.question_text,
        answerText: answer.answer_text,
      };
    });

    const evaluations = await Promise.all(evaluationPromises);

    // =======================================================
    // Guardar en la DB de supabase
    // =======================================================
    const aiEvalsToInsert = evaluations
      .filter((e) => e.answerId !== null)
      .map((e) => ({
        answer_id: e.answerId!,
        score: e.score,
        feedback: e.feedback,
      }));

    if (aiEvalsToInsert.length > 0) {
      await supabase.from('ai_evaluations').insert(aiEvalsToInsert);
    }

    await supabase
      .from('interviews')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', interviewId);

    const totalScore = evaluations.reduce((acc, e) => acc + e.score, 0);
    const averageScore = Math.round(totalScore / (evaluations.length || 1));

    return { averageScore, evaluations, error: null };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Error desconocido en la evaluación.';
    console.error('Error en la evaluación final:', message);
    return { averageScore: 0, evaluations: [], error: message };
  }
}
