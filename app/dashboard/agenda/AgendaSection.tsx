"use client";

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarStyle.css";
import { createClient } from "@/lib/supabase/client";

interface InterviewEvent {
  id: string;
  interview_date: string;
  interview_time: string;
  notes?: string;
}

const HOURS = [
  "07:00","08:00","09:00","10:00","11:00","12:00",
  "13:00","14:00","15:00","16:00","17:00",
  "18:00","19:00","20:00","21:00","22:00"
];

// Funciones para igualar fechas y horas
function formatYMD(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDateLocal(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-MX");
}

function normalizeHour(h: string) {
  return h.slice(0, 5);
}

// Checar las horas pasadas del día de hoy
function isPastHour(selectedDate: Date, hour: string) {
  const now = new Date();

  const isToday =
    selectedDate.getFullYear() === now.getFullYear() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getDate() === now.getDate();

  if (!isToday) return false;

  const [h, m] = hour.split(":").map(Number);
  const selectedTime = new Date();
  selectedTime.setHours(h, m, 0, 0);

  return selectedTime < now;
}

export default function AgendaSection() {
  const supabase = createClient();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState("");

  const [events, setEvents] = useState<InterviewEvent[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const { data } = await supabase.auth.getUser();
    if (data?.user?.id) {
      setUserId(data.user.id);
      loadEvents(data.user.id);
    }
  }

  async function loadEvents(uid: string) {
    const { data } = await supabase
      .from("interview_schedule")
      .select("*")
      .eq("user_id", uid)
      .order("interview_date", { ascending: true });

    if (data) setEvents(data);
  }

  function openModal(hour: string) {
    setSelectedHour(hour);
    setNote("");
    setShowModal(true);
  }

  async function saveSchedule() {
    if (!selectedDate || !userId || !selectedHour) return;

    const date = formatYMD(selectedDate);

    // Validar días pasados
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const chosen = new Date(selectedDate);
    chosen.setHours(0, 0, 0, 0);

    if (chosen < today) {
      alert("⚠ No puedes agendar entrevistas en fechas pasadas.");
      return;
    }

    // Validar las horas pasadas del mismo día
    if (isPastHour(selectedDate, selectedHour)) {
      alert("⚠ Esa hora ya pasó. Selecciona una hora futura.");
      return;
    }

    // Validar la hora duplicada
    const exists = events.some(
      (e) =>
        e.interview_date === date &&
        normalizeHour(e.interview_time) === selectedHour
    );

    if (exists) {
      alert("⚠ Esa hora ya está ocupada.");
      return;
    }

    // Guardar entrevista en la agenda
    const { error } = await supabase.from("interview_schedule").insert({
      user_id: userId,
      interview_date: date,
      interview_time: selectedHour,
      notes: note,
    });

    if (error) {
      alert("Error al guardar el evento");
      return;
    }

    setShowModal(false);
    setSelectedDate(null);
    setSelectedHour(null);
    loadEvents(userId);
  }

  async function deleteEvent(id: string) {
    if (!confirm("¿Eliminar este evento?")) return;

    await supabase.from("interview_schedule").delete().eq("id", id);

    if (userId) loadEvents(userId);
  }

  // Horas ocupadas por otra entrevista
  const busyHours =
    selectedDate
      ? events
          .filter((e) => e.interview_date === formatYMD(selectedDate))
          .map((e) => normalizeHour(e.interview_time))
      : [];

  // Fechas con entrevista
  const datesWithEvents = events.map((ev) => ev.interview_date);

  return (
    <div className="max-w-4xl mx-auto items-center space-y-6">

      <h1 className="text-3xl font-bold text-gray-800 text-center">
        Agenda de Entrevistas
      </h1>

      <div className="bg-white p-4 shadow-lg rounded-xl border">
        <Calendar
          onChange={(d) => setSelectedDate(d as Date)}
          value={selectedDate}
          tileDisabled={({ date }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const d = new Date(date);
            d.setHours(0, 0, 0, 0);

            return d < today;
          }}
          tileClassName={({ date }) => {
            const d = formatYMD(date);
            return datesWithEvents.includes(d) ? "tag-event-day" : "";
          }}
          className="rounded-xl border-none"
        />
      </div>

      {/* Horas que puede seleccionar */}
      {selectedDate && (
        <div className="bg-white p-4 shadow rounded-xl border">
          <p className="font-semibold text-lg mb-2">
            Fecha seleccionada:{" "}
            <span className="text-blue-600">
              {selectedDate.toLocaleDateString("es-MX")}
            </span>
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            {HOURS.map((h) => {
              const busy = busyHours.includes(h);
              const pastHour = isPastHour(selectedDate, h);

              const disabled = busy || pastHour;

              return (
                <button
                  key={h}
                  disabled={disabled}
                  onClick={() => openModal(h)}
                  className={`p-2 rounded-lg text-center text-sm border transition
                    ${
                      disabled
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                >
                  {h}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal para confirmar el horario de la entrevista guardada */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center px-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-3">Confirmar horario</h2>

            <p className="mb-2">
              Fecha:{" "}
              <span className="font-semibold">
                {selectedDate?.toLocaleDateString("es-MX")}
              </span>
            </p>

            <p className="mb-4">
              Hora: <span className="font-semibold">{selectedHour}</span>
            </p>

            <label className="text-sm font-semibold">Notas (opcional)</label>
            <textarea
              className="w-full border p-2 rounded mt-1"
              placeholder="Ej. Preparar materiales..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancelar
              </button>

              <button
                onClick={saveSchedule}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entrevistas agendadas */}
      <div className="bg-white p-4 shadow rounded-xl border mt-8">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Tus entrevistas agendadas
        </h2>

        {events.length === 0 && (
          <p className="text-gray-500 text-sm">
            No tienes entrevistas programadas.
          </p>
        )}

        <div className="space-y-3">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="p-4 bg-gray-50 border rounded-xl flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-gray-800">
                  {formatDateLocal(ev.interview_date)}
                </p>
                <p className="text-gray-600">{ev.interview_time}</p>

                {ev.notes && (
                  <p className="text-xs text-gray-500 mt-1">📝 {ev.notes}</p>
                )}
              </div>

              <button
                onClick={() => deleteEvent(ev.id)}
                className="text-red-600 hover:text-red-800 text-sm font-semibold"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}