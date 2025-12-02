import { User, Calendar, CheckCircle, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button2';

type HistoryItem = {
  interview_id: string;
  subarea_name: string;
  created_at: string;
  feedback_text: string;
  other_party_email: string; // Si soy experto -> email del candidato. Si soy usuario -> email del experto.
};

type Props = {
  data: HistoryItem;
  role: 'expert' | 'user';
};

export default function ExpertHistoryCard({ data, role }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        
        {/* Encabezado */}
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${role === 'expert' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
            {role === 'expert' ? <FileText className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{data.subarea_name}</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(data.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {role === 'expert' ? `Candidato: ${data.other_party_email}` : `Evaluado por: ${data.other_party_email}`}
              </span>
            </div>
          </div>
        </div>

        {/* Botón de ver detalles */}
        <div className="flex-shrink-0">
          <Link href={`/entrevista/${data.interview_id}/resultados`}>
            <Button >Ver Detalles Completos</Button>
          </Link>
        </div>
      </div>

      {/* Resumen del Feedback */}
      <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Feedback del Experto</p>
        <p className="text-gray-700 text-sm line-clamp-3 italic">
          &quot;{data.feedback_text}&quot;
        </p>
      </div>
    </div>
  );
}