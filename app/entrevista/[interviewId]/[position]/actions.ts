'use server';

import { createClient } from '@/lib/supabase/server';


// guarda la respuesta
export async function saveAnswerAction(
  interviewQuestionId: string, 
  answerText: string
) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'No autenticado' };
  }

  try {
    // 1. Guardar la respuesta del usuario en la tabla 'answers'
    const { error } = await supabase
      .from('answers')
      .upsert({
        interview_question_id: interviewQuestionId,
        user_id: user.id,
        answer_text: answerText
      },{
        onConflict: 'interview_question_id'
      }
    );

    if (error) throw error;
    
    return { data: { success: true } };

  } catch (error: unknown) { 
    
    // 2. Comprueba el tipo de error
    if (error instanceof Error) {
      console.error('Error guardando la respuesta:', error.message);
      return { error: error.message };
    }
    
    // 3. Maneja el caso de que no sea un objeto Error
    const errorMessage = 'Un error desconocido ocurrió al guardar la respuesta.';
    console.error(errorMessage, error);
    return { error: errorMessage };
  }

}