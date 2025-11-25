'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function postInterviewCommentAction(interviewId: string, commentText: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Debes iniciar sesión' };

  try {
    const { error } = await supabase
      .from('community_comments')
      .insert({
        interview_id: interviewId, // Ahora usamos interview_id
        user_id: user.id,
        comment_text: commentText
      });

    if (error) throw error;

    revalidatePath('/dashboard/comunidad');
    return { success: true };

  } catch (error: unknown) {
    let msg = "Error";
    if (error instanceof Error) msg = error.message;
    return { error: msg };
  }
}