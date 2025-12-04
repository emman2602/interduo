"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bell, CheckCircle2, MessageCircle, Star, Clock3 } from "lucide-react";

type NotificationType =
  | "expert_feedback"
  | "community_comment"
  | "interview_reminder"
  | "expert_application_status"
  | "expert_new_assignment";

interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link_url?: string | null;
  metadata?: any;
  created_at: string;
  read_at: string | null;
}

type FilterType = "all" | "unread";

// helper para tiempo relativo tipo "hace 2 horas"
function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const diff = (Date.now() - date.getTime()) / 1000;

  if (diff < 60) return "Justo ahora";
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;

  const days = Math.floor(diff / 86400);
  return `Hace ${days} día${days > 1 ? "s" : ""}`;
}

function iconByType(type: NotificationType) {
  switch (type) {
    case "expert_feedback":
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    case "community_comment":
      return <MessageCircle className="w-5 h-5 text-sky-500" />;
    case "interview_reminder":
      return <Clock3 className="w-5 h-5 text-orange-500" />;
    case "expert_application_status":
      return <Star className="w-5 h-5 text-violet-500" />;
    case "expert_new_assignment":
      return <Star className="w-5 h-5 text-blue-500" />;
    default:
      return <Bell className="w-5 h-5 text-blue-500" />;
  }
}

export default function NotificationSection() {
  const supabase = createClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setNotifications(data || []);
    setLoading(false);
  }

  async function markAsRead(id: string) {
    await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
  }

  async function markAllAsRead() {
    const unread = notifications.filter((n) => !n.read_at);

    if (unread.length === 0) return;

    const now = new Date().toISOString();

    await supabase
      .from("notifications")
      .update({ read_at: now })
      .in("id", unread.map((n) => n.id));

    setNotifications((prev) =>
      prev.map((n) => (n.read_at ? n : { ...n, read_at: now }))
    );
  }

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.read_at)
      : notifications;

  return (
    <div className="bg-white rounded-2xl shadow-md border p-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {notifications.filter((n) => !n.read_at).length > 0
                ? `${notifications.filter((n) => !n.read_at).length} sin leer`
                : "Estás al día"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter(filter === "all" ? "unread" : "all")}
            className="px-3 py-1.5 text-sm rounded-full border text-gray-600 hover:bg-gray-50"
          >
            {filter === "all" ? "Ver solo no leídas" : "Ver todas"}
          </button>

          <button
            onClick={markAllAsRead}
            className="px-3 py-1.5 text-sm rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100"
          >
            Marcar todas como leídas
          </button>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <p className="text-gray-500 text-sm">Cargando...</p>
      ) : filteredNotifications.length === 0 ? (
        <p className="text-gray-500 text-sm mt-6 text-center">
          No tienes notificaciones por ahora.
        </p>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((n) => {
            const unread = !n.read_at;

            return (
              <button
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border transition ${
                  unread
                    ? "border-blue-200 bg-blue-50/40 hover:bg-blue-50"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="mt-1">{iconByType(n.type)}</div>

                <div className="flex-1">
                  <p className={`text-sm font-semibold ${unread ? "text-gray-900" : "text-gray-700"}`}>
                    {n.title}
                  </p>

                  <p className="text-gray-600 text-sm mt-1">{n.message}</p>

                  <p className="text-xs text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}