import { createNotification } from "@/app/dashboard/notificaciones/actions";

/* 1. Cuando un experto evalúa una entrevista */
export async function notifyExpertFeedback(userId: string, interviewId: string) {
  await createNotification({
    userId,
    type: "expert_feedback",
    title: "Tu entrevista fue evaluada",
    message: "Un experto ha evaluado tu entrevista. ¡Puedes ver tu retroalimentación!",
    link_url: `/dashboard/entrevistas/${interviewId}`,
    metadata: { interviewId }
  });
}

/* 2. Cuando alguien comenta en una respuesta */
export async function notifyCommunityComment(ownerId: string, commentId: string, interviewId: string) {
  await createNotification({
    userId: ownerId,
    type: "community_comment",
    title: "Nuevo comentario en tu respuesta",
    message: "Alguien ha comentado en tu participación en la comunidad.",
    link_url: `/dashboard/comunidad?open=${interviewId}`,
    metadata: { commentId, interviewId }
  });
}

/* 3. Cuando al usuario se le acerca el día de su entrevista */
export async function notifyInterviewReminder(userId: string, interviewId: string, date: string) {
  await createNotification({
    userId,
    type: "interview_reminder",
    title: "Recordatorio de entrevista",
    message: `Tienes una entrevista programada para hoy (${date}). ¡Mucho éxito!`,
    link_url: `/dashboard/agenda`,
    metadata: { interviewId }
  });
}

/* 4. Usuario quiere ser experto (aprobado/rechazado) */
export async function notifyExpertApplicationStatus(userId: string, approved: boolean) {
  await createNotification({
    userId,
    type: "expert_application_status",
    title: approved ? "Solicitud aprobada" : "Solicitud rechazada",
    message: approved
      ? "¡Felicidades! Ahora eres experto en InterDuo."
      : "Tu solicitud para ser experto ha sido rechazada. Puedes intentarlo nuevamente.",
    link_url: `/dashboard/ajustes?tab=expert`,
    metadata: { approved }
  });
}

/* 5. Cuando se asigna una entrevista a un experto */
export async function notifyExpertNewAssignment(expertId: string, interviewId: string) {
  await createNotification({
    userId: expertId,
    type: "expert_new_assignment",
    title: "Nueva entrevista asignada",
    message: "Tienes una nueva entrevista pendiente por evaluar.",
    link_url: `/dashboard/expertos/evaluar/${interviewId}`,
    metadata: { interviewId }
  });
}