'use server';

import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

const openai = new OpenAI(); 

export async function evaluateEntireInterviewAction(interviewId: string) {
  const supabase = await createClient();

  try {
    // =======================================================
    // 1. "EL GUARDIA": Revisa el estado de la entrevista
    // =======================================================
    const { data: interview, error: fetchInterviewError } = await supabase
      .from('interviews')
      .select('status')
      .eq('id', interviewId)
      .single();

    if (fetchInterviewError) throw fetchInterviewError;
    if (!interview) throw new Error("Entrevista no encontrada");

    // =CALCULADORA DE PROMEDIO (Función helper)
    const calculateResults = (data: any[]) => {
      let totalScore = 0;
      const evaluations = data.map((item: any) => {
        const question = item.questions;
        const answer = (item.answers as any[])[0];
        const evaluation = answer?.ai_evaluations?.[0]; // El '?' es clave
        
        
        totalScore += evaluation?.score || 0;
        return {
          answerId: answer?.id || null,
          score: evaluation?.score || 0,
          feedback: evaluation?.feedback || "No se encontró evaluación.",
          questionText: question?.question_text || "Pregunta no encontrada.",
          answerText: answer?.answer_text
        };
      });
      const averageScore = Math.round(totalScore / (evaluations.length || 1));
      return { averageScore, evaluations };
    };


    // =======================================================
    // 2. SI YA ESTÁ COMPLETA: Solo lee los datos (Rápido y Gratis)
    // =======================================================
    if (interview.status === 'completed') {
      
      const { data: existingData, error: fetchError } = await supabase
        .from('interview_questions')
        .select(`
          questions ( question_text ),
          answers (
            id,
            answer_text,
            ai_evaluations ( score, feedback )
          )
        `)
        .eq('interview_id', interviewId)
        .order('position', { ascending: true });

      if (fetchError) throw fetchError;

      const { averageScore, evaluations } = calculateResults(existingData || []);
      return { averageScore, evaluations, error: null };
    }

    // =======================================================
    // 3. SI ESTÁ "IN_PROGRESS": Ejecuta la evaluación (Lento y Costoso)
    // =======================================================
    
    // 3A. Obtiene TODAS las preguntas y respuestas
    const { data: interviewData, error: fetchError } = await supabase
      .from('interview_questions')
      .select(`
        answers ( id, answer_text ),
        questions ( question_text )
      `)
      .eq('interview_id', interviewId)
      .order('position', { ascending: true });

    if (fetchError) throw fetchError;
    if (!interviewData || interviewData.length === 0) throw new Error("No se encontraron preguntas.");

    // 3B. Prepara las llamadas a la IA (en paralelo)
    const evaluationPromises = interviewData.map(async (item) => {
      const question = item.questions as any;
      const answer = (item.answers as any[])[0]; 

      if (!answer) {
        return { 
          answerId: null, 
          score: 0, 
          feedback: "No se proporcionó respuesta.", 
          questionText: question.question_text,
          answerText: "No se proporciono respuesta"
        };
      }

      const systemPrompt = `
        Eres un evaluador experto en entrevistas laborales. La pregunta fue: "${question.question_text}"
        La respuesta fue: "${answer.answer_text}"
        Devuelve un objeto JSON con "score" (0-100) y "feedback" (50 palabras).
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-5-nano",
        messages: [{ role: "system", content: systemPrompt }],
        response_format: { type: "json_object" }
      });

      const aiResponse = JSON.parse(completion.choices[0].message.content || '{}');
      
      return {
        answerId: answer.id,
        score: aiResponse.score || 0,
        feedback: aiResponse.feedback || "No se pudo generar feedback.",
        questionText: question.question_text,
        answerText: answer.answer_text
      };
    });

    // 3C. Ejecuta todas las evaluaciones en paralelo
    const evaluations = await Promise.all(evaluationPromises);

    // 3D. Prepara los datos para guardar en la DB 'ai_evaluations'
    const aiEvalsToInsert = evaluations
      .filter(e => e.answerId !== null)
      .map(e => ({
        answer_id: e.answerId,
        score: e.score,
        feedback: e.feedback
      }));
    
    if (aiEvalsToInsert.length > 0) {
      await supabase.from('ai_evaluations').insert(aiEvalsToInsert);
    }

    // 3E.Marca la entrevista como 'completada'
    await supabase
      .from('interviews')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', interviewId);
    
    // 3F. Calcula el puntaje promedio
    const totalScore = evaluations.reduce((acc, e) => acc + e.score, 0);
    const averageScore = Math.round(totalScore / (evaluations.length || 1));

    // 3G. Devuelve los datos a la página
    return { averageScore, evaluations, error: null };

  } catch (error: any) {
    console.error("Error en la evaluación final:", error.message);
    return { averageScore: 0, evaluations: [], error: error.message };
  }
}