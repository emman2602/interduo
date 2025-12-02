'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitExpertReviewAction(interviewId: string, feedbackText: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'No autenticado' };

  try {
    // 1. Guardar el feedback en la tabla 'expert_feedback'
    const { error: insertError } = await supabase
      .from('expert_feedback')
      .insert({
        interview_id: interviewId,
        expert_id: user.id,
        feedback: feedbackText
      });

    if (insertError) throw insertError;

    // 2. Actualizar el estado de la entrevista a 'completed' y asignar al experto
    const { error: updateError } = await supabase
      .from('interviews')
      .update({ 
        expert_status: 'completed',
        assigned_expert_id: user.id 
      })
      .eq('id', interviewId);

    if (updateError) throw updateError;

    revalidatePath('/dashboard'); 
    return { success: true };

  } catch (error: unknown) {
    let message = 'Error desconocido';
    
 
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      // Aquí caen los errores de Supabase
      message = (error as { message: string }).message;
    }
    
    console.error("Error al enviar evaluación:", error);
    return { error: message };
  }
}