'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Middleware de seguridad simple
async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { data: role } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (role?.role !== 'admin') throw new Error("No autorizado");
  return supabase;
}

// 1. APROBAR EXPERTO
export async function approveExpertAction(applicationId: string, targetUserId: string) {
  try {
    const supabase = await checkAdmin();

    // A. Cambiar rol del usuario a 'expert'
    const { error: roleError } = await supabase
      .from('user_roles')
      .update({ role: 'expert', verified_expert: true })
      .eq('user_id', targetUserId);

    if (roleError) throw roleError;

    // B. Marcar solicitud como aprobada
    const { error: appError } = await supabase
      .from('expert_applications')
      .update({ status: 'approved' })
      .eq('id', applicationId);

    if (appError) throw appError;

    revalidatePath('/dashboard/admin');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// 2. RECHAZAR EXPERTO
export async function rejectExpertAction(applicationId: string) {
  try {
    const supabase = await checkAdmin();

    const { error } = await supabase
      .from('expert_applications')
      .update({ status: 'rejected' })
      .eq('id', applicationId);

    if (error) throw error;

    revalidatePath('/dashboard/admin');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// 3. CREAR ÁREA
export async function createAreaAction(name: string) {
  try {
    const supabase = await checkAdmin();

    const { data, error } = await supabase
      .from('areas')
      .insert({ name, description: 'Nueva área agregada por admin' })
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/dashboard/admin');
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createQuestionAction(data: {
  subarea_id: string;
  type_id: string;
  question_text: string;
  difficulty_level: number;
  metadata?: any;
}) {
  try {
    const supabase = await checkAdmin();

    const { error } = await supabase
      .from('questions')
      .insert(data);

    if (error) throw error;

    // No necesitamos revalidatePath aquí porque el formulario se limpia solo
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}