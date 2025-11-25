'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button2';
import { postInterviewCommentAction } from './actions';
import { MessageSquare, UserCircle, ChevronDown, ChevronUp } from 'lucide-react';

export type QAPair = {
  question: string;
  answer: string;
  score: number;
};

export type InterviewFeedItem = {
  interview_id: string;
  author_email?: string;
  subarea_name: string;
  created_at: string;
  qa_pairs: QAPair[];
  // Comentarios ya cargados (opcional si los traes en la consulta inicial)
  community_comments?: { comment_text: string, created_at: string }[];
};

type Props = {
  data: InterviewFeedItem;
  isMyInterview?: boolean; // Para saber si es la sección "Mis Comentarios"
};

export default function CommunityCard({ data, isMyInterview = false }: Props) {
  const [comment, setComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(false); // Para no ocupar tanto espacio al inicio
  const [localComments, setLocalComments] = useState(data.community_comments || []);

  const handleComment = async () => {
    if (!comment.trim()) return;
    const res = await postInterviewCommentAction(data.interview_id, comment);
    if (res.success) {
      // Optimistic update simple
      setLocalComments([...localComments, { comment_text: comment, created_at: new Date().toISOString() }]);
      setComment('');
    } else {
      alert("Error al comentar");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      
      {/* ENCABEZADO */}
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <UserCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">
              {isMyInterview ? 'Tú' : (data.author_email || 'Usuario')}
            </p>
            <p className="text-xs text-gray-500">
              Entrevista de <span className="font-semibold text-blue-600">{data.subarea_name}</span>
            </p>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          {new Date(data.created_at).toLocaleDateString()}
        </div>
      </div>

      {/* CONTENIDO (PREGUNTAS Y RESPUESTAS) */}
      <div className="p-6">
        {/* Mostramos solo la primera pregunta o todas si está expandido */}
        <div className="space-y-6">
          {data.qa_pairs.slice(0, isExpanded ? undefined : 1).map((qa, idx) => (
            <div key={idx} className="group">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                P{idx + 1}: {qa.question}
              </h4>
              <div className="bg-gray-50 p-3 rounded-lg text-gray-700 text-sm border-l-4 border-indigo-300 italic">
                &quot;{qa.answer}&quot;
              </div>
            </div>
          ))}
        </div>

        {data.qa_pairs.length > 1 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline"
          >
            {isExpanded ? (
              <><ChevronUp className="w-4 h-4" /> Ver menos</>
            ) : (
              <><ChevronDown className="w-4 h-4" /> Ver {data.qa_pairs.length - 1} preguntas más</>
            )}
          </button>
        )}
      </div>

      {/* SECCIÓN DE COMENTARIOS */}
      <div className="bg-gray-50 p-6 border-t border-gray-200">
        <h5 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Comentarios ({localComments.length})
        </h5>

        {/* Lista de comentarios */}
        <div className="space-y-3 mb-4">
          {localComments.length === 0 && (
            <p className="text-sm text-gray-400 italic">Sé el primero en opinar.</p>
          )}
          {localComments.map((c, i) => (
            <div key={i} className="bg-white p-3 rounded border border-gray-200 text-sm text-gray-700 shadow-sm">
              {c.comment_text}
            </div>
          ))}
        </div>

        {/* Input para comentar (Solo si NO es mi entrevista, o si quieres permitir auto-comentarios) */}
        {!isMyInterview && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Escribe una retroalimentación general..."
              className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button onClick={handleComment}>
              Enviar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}