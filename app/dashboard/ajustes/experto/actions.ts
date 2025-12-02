'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Definimos el tipo de datos del formulario
type ApplicationFormData = {
  area: string;
  experience: number;
  academic: string;
  portfolio: string;
  linkedin: string;
  motivation: string;
  availability: number;
};

export async function submitExpertApplicationAction(formData: ApplicationFormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Usuario no autenticado' };

  try {
    // 1. Verificar si ya tiene una solicitud pendiente
    const { data: existing } = await supabase
      .from('expert_applications')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single();

    if (existing) {
      return { error: 'Ya tienes una solicitud en revisión.' };
    }

    // 2. Insertar la solicitud
    const { error } = await supabase.from('expert_applications').insert({
      user_id: user.id,
      area_of_expertise: formData.area,
      years_of_experience: formData.experience,
      academic_level: formData.academic,
      portfolio_url: formData.portfolio,
      linkedin_url: formData.linkedin,
      motivation: formData.motivation,
      availability_hours_per_week: formData.availability,
      status: 'pending'
    });

    if (error) throw error;

    // 3. Revalidar y redirigir
    revalidatePath('/dashboard/ajustes');
    
  } catch (error: unknown) {
    let message = 'Error al enviar la solicitud';
    if (error instanceof Error) message = error.message;
    else if (typeof error === 'object' && error !== null && 'message' in error) {
       message = String((error as { message: unknown }).message);
    }
    return { error: message };
  }

  // Redirección fuera del try/catch
  redirect('/dashboard/ajustes?success=true');
}