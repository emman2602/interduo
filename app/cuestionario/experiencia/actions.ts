// app/cuestionario/experiencia/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Esta action recibe el string de la experiencia (ej. "beginner")
export async function saveUserExperience(experience: string) {
  const supabase = await createClient();

  // 1. Obtener el usuario
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: { message: 'No autenticado' } };
  }

  // 2. Actualizar la columna 'selected_experience' en 'user_roles'
  const { data, error } = await supabase
    .from('user_roles')
    .update({ selected_experience: experience }) // Aquí guardamos el string
    .eq('user_id', user.id);

  if (error) {
    console.error('Error al guardar experiencia:', error.message);
    return { error };
  }

  // 3. Limpia el caché del dashboard para que cargue los datos nuevos
  revalidatePath('/protected');
  return { data };
}