
'use server';

import { createClient } from '@/lib/supabase/server'; // Cliente de SERVIDOR
import { revalidatePath } from 'next/cache';

export async function saveUserArea(areaId: string) {
  const supabase = await createClient();

  // 1. Obtener el usuario actual
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: { message: 'No autenticado' } };
  }

  // 2. Actualizar la fila en 'user_roles'
  const { data, error } = await supabase
    .from('user_roles')
    .update({ selected_area_id: areaId })
    .eq('user_id', user.id); // Donde el user_id coincida

  if (error) {
    return { error };
  }

  revalidatePath('/protected'); // Limpia el caché del dashboard
  return { data };
}