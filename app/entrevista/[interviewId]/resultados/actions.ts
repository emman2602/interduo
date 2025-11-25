'use server';

import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

const openai = new OpenAI();

// --- DEFINICIÓN DE TIPOS ---

interface AIEvaluation {
  score: number;
  feedback: string;
}

interface Answer {
  id: string;
  answer_text: string;
  ai_evaluations?: AIEvaluation | AIEvaluation[];
  community_comments?: { comment_text: string }[];
}

interface Question {
  question_text: string;
}

// Usamos 'unknown' para procesar relaciones de forma segura
interface InterviewQuestionRaw {
  questions: unknown;
  answers: unknown;
}

interface EvaluationResult {
  answerId: string | null;
  score: number;
  feedback: string;
  questionText: string;
  answerText: string;
  communityComments: { comment_text: string }[];
}

interface EvaluationSummary {
  averageScore: number;
  evaluations: EvaluationResult[];
  error?: string | null;
}

// --- HELPER MÁGICO: Normaliza datos de Supabase ---
// Detecta si Supabase envió un Objeto o un Array y devuelve siempre el objeto o null
function normalizeOne<T>(data: unknown): T | null {
  if (!data) return null;
  if (Array.isArray(data)) {
    return data.length > 0 ? (data[0] as T) : null;
  }
  return data as T;
}

// --- ACCIÓN DE COMPARTIR ---
export async function shareInterviewAction(interviewId: string) {
  const supabase = await createClient();
  try {
    const { error } = await supabase
      .from('interviews')
      .update({ is_shared: true })
      .eq('id', interviewId);

    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    return { error: 'Error al compartir' };
  }
}

// --- ACCIÓN DE EVALUAR ---
export async function evaluateEntireInterviewAction(
  interviewId: string
): Promise<EvaluationSummary> {
  const supabase = await createClient();

  try {
    // 1. Revisa el estado de la entrevista
    const { data: interview, error: fetchInterviewError } = await supabase
      .from('interviews')
      .select('status')
      .eq('id', interviewId)
      .single();

    if (fetchInterviewError || !interview) throw new Error('Entrevista no encontrada');

    // --- HELPER: Procesa los datos crudos usando normalizeOne ---
    // Se usa tanto para leer resultados existentes como para preparar la IA
    const processData = (rows: unknown[]): EvaluationResult[] => {
      return rows.map((row) => {
        const item = row as InterviewQuestionRaw;
        
        // CORRECCIÓN PRINCIPAL: Usamos normalizeOne
        const question = normalizeOne<Question>(item.questions);
        const answer = normalizeOne<Answer>(item.answers);
        
        // Normalizar evaluaciones
        const evalData = answer ? (answer as any).ai_evaluations : null;
        const evaluation = normalizeOne<AIEvaluation>(evalData);

        // Normalizar comentarios
        const commentsRaw = answer ? (answer as any).community_comments : [];
        const comments = Array.isArray(commentsRaw) ? commentsRaw : [];

        return {
          answerId: answer?.id ?? null,
          score: evaluation?.score ?? 0,
          feedback: evaluation?.feedback ?? 'No se encontró evaluación.',
          questionText: question?.question_text ?? 'Pregunta no encontrada.',
          answerText: answer?.answer_text ?? 'No se proporcionó respuesta.',
          communityComments: comments
        };
      });
    };

    // =======================================================
    // 2. SI YA ESTÁ COMPLETADA (Intentar leer)
    // =======================================================
    if (interview.status === 'completed') {
      const { data: existingData } = await supabase
        .from('interview_questions')
        .select(`
          questions ( question_text ),
          answers (
            id,
            answer_text,
            ai_evaluations ( score, feedback ),
            community_comments ( comment_text )
          )
        `)
        .eq('interview_id', interviewId)
        .order('position', { ascending: true });

      const evaluations = processData(existingData || []);
      
      // AUTO-CORRECCIÓN: Si vemos que está "completed" pero no tiene evaluaciones (score 0),
      // significa que falló antes. Forzamos que continúe a la sección de IA.
      const hasEvaluations = evaluations.some(e => e.score > 0);
      
      if (hasEvaluations) {
        const totalScore = evaluations.reduce((acc, e) => acc + e.score, 0);
        const avg = Math.round(totalScore / (evaluations.length || 1));
        return { averageScore: avg, evaluations, error: null };
      }
      // Si no tiene evaluaciones, ignoramos el estado 'completed' y dejamos que corra la IA abajo...
    }

    // =======================================================
    // 3. EJECUTAR IA (Si está in_progress o estaba rota)
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
    if (!interviewData || interviewData.length === 0) throw new Error('Sin preguntas.');

    const interviewRows = interviewData as unknown[];

    const evaluationPromises = interviewRows.map(async (row): Promise<EvaluationResult> => {
      const item = row as InterviewQuestionRaw;
      
      // USAMOS normalizeOne
      const question = normalizeOne<Question>(item.questions);
      const answer = normalizeOne<Answer>(item.answers);

      if (!answer) {
        return {
          answerId: null,
          score: 0,
          feedback: 'No se proporcionó respuesta.',
          questionText: question?.question_text || '',
          answerText: 'No se proporcionó respuesta.',
          communityComments: []
        };
      }

      // Llamada a OpenAI
      const systemPrompt = `
        Eres un evaluador de entrevistas laborales demasiado amable, motivador y comprensivo. Pregunta: "${question?.question_text}".
        Respuesta: "${answer.answer_text}".
        Devuelve JSON: { "score": number (0-100), "feedback": string (max 50 words) }
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-5-nano',
        messages: [{ role: 'system', content: systemPrompt }],
        response_format: { type: 'json_object' },
      });
      
      const content = completion.choices[0].message.content || '{}';
      const aiRes = JSON.parse(content);

      return {
        answerId: answer.id,
        score: aiRes.score || 0,
        feedback: aiRes.feedback || 'Sin feedback.',
        questionText: question?.question_text || '',
        answerText: answer.answer_text,
        communityComments: []
      };
    });

    const evaluations = await Promise.all(evaluationPromises);

    // Guardar en DB con UPSERT para evitar duplicados
    const evalsToSave = evaluations
      .filter(e => e.answerId)
      .map(e => ({
        answer_id: e.answerId!,
        score: e.score,
        feedback: e.feedback
      }));

    if (evalsToSave.length > 0) {
      await supabase.from('ai_evaluations').upsert(
        evalsToSave, 
        { onConflict: 'answer_id' }
      );
    }

    // Asegurar estado 'completed'
    await supabase.from('interviews')
      .update({ 
        status: 'completed', 
        completed_at: new Date().toISOString() 
      })
      .eq('id', interviewId);

    const totalScore = evaluations.reduce((acc, e) => acc + e.score, 0);
    const avg = Math.round(totalScore / (evaluations.length || 1));

    return { averageScore: avg, evaluations, error: null };

  } catch (error: unknown) {
    let msg = 'Error desconocido';
    if (error instanceof Error) msg = error.message;
    return { averageScore: 0, evaluations: [], error: msg };
  }
}