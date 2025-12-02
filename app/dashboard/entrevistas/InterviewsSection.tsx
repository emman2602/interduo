import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// Tipo de una fila de la vista
type InterviewResultRow = {
  interview_id: string;
  user_id: string;
  status: string;
  interview_created_at: string;
  question_id: string;
  question: string;
  answer: string;
  score: number | null;
};

export default async function InterviewsSection({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vw_interview_results")
    .select("*")
    .eq("user_id", userId)
    .order("interview_created_at", { ascending: true })
    .returns<InterviewResultRow[]>(); 

  if (error) {
    console.error("Error al obtener entrevistas:", error.message);
    return <p className="text-red-500">Error al cargar tus entrevistas</p>;
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-gray-600 text-center">
        Aún no has realizado ninguna entrevista.
      </p>
    );
  }

  // Agrupar sin usar "any"
  const grouped = data.reduce(
    (acc: Record<string, InterviewResultRow[]>, item) => {
      if (!acc[item.interview_id]) acc[item.interview_id] = [];
      acc[item.interview_id].push(item);
      return acc;
    },
    {}
  );

  // Convertir agrupaciones a "entrevistas"
  const interviews = Object.entries(grouped).map(([id, items]) => {
    const first = items[0]; 
    return {
      id,
      status: first.status,
      date: first.interview_created_at,
      questions: items.length,
    };
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {interviews.map((interview, index) => (
        <Link
          key={interview.id}
          href={`/entrevista/${interview.id}/resultados`}
          className="group block bg-white rounded-2xl p-6 shadow transition hover:shadow-lg hover:-translate-y-1"
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-bold text-slate-800">
              Entrevista {index + 1}
            </h2>

            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
              {interview.status === "completed"
                ? "Completada"
                : "En progreso"}
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-2">
            {new Date(interview.date).toLocaleDateString("es-MX", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>

          <p className="text-sm text-gray-700">
            Preguntas respondidas:{" "}
            <span className="font-semibold">{interview.questions}</span>
          </p>

          <div className="mt-4 text-blue-600 font-medium group-hover:underline">
            Ver entrevista →
          </div>
        </Link>
      ))}
    </div>
  );
}
