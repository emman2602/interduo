"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/** Obtener notificaciones del usuario */
export async function getUserNotifications() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data || [];
}

/** Marcar una notificación como leída */
export async function markNotificationAsRead(id: string) {
  const supabase = await createClient();

  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/dashboard/notificaciones");
  return { success: true };
}

/** Marcar TODAS como leídas */
export async function markAllNotificationsAsRead(userId: string) {
  const supabase = await createClient();

  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("read_at", null);

  revalidatePath("/dashboard/notificaciones");
  return { success: true };
}

/** Crear notificación */
export async function createNotification({
  userId,
  type,
  title,
  message,
  link_url = null,
  metadata = null,
}: {
  userId: string;
  type: string;
  title: string;
  message: string;
  link_url?: string | null;
  metadata?: any;
}) {
  const supabase = await createClient();

  await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title,
    message,
    link_url,
    metadata,
  });

  revalidatePath("/dashboard/notificaciones");
  return { success: true };
}