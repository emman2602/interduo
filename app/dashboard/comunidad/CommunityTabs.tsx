'use client';

import { useState } from 'react';
import CommunityCard, { InterviewFeedItem } from './CommunityCard';
import { Globe, Inbox } from 'lucide-react';

type Props = {
  publicFeed: InterviewFeedItem[];
  myFeed: InterviewFeedItem[];
};

export default function CommunityTabs({ publicFeed, myFeed }: Props) {
  const [activeTab, setActiveTab] = useState<'explorar' | 'recibidos'>('explorar');

  return (
    <div>
      {/* --- BARRA DE PESTAÑAS --- */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('explorar')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'explorar'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Globe className="w-4 h-4" />
          Explorar
        </button>
        
        <button
          onClick={() => setActiveTab('recibidos')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'recibidos'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Inbox className="w-4 h-4" />
          Feedback Recibido
        </button>
      </div>

      {/* --- CONTENIDO DE LAS PESTAÑAS --- */}
      
      {/* CONTENIDO: EXPLORAR */}
      {activeTab === 'explorar' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800">Entrevistas Recientes</h2>
            <p className="text-sm text-gray-500">Descubre cómo responden otros candidatos.</p>
          </div>

          {publicFeed.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">No hay entrevistas públicas aún.</p>
            </div>
          ) : (
            publicFeed.map((item) => (
              <CommunityCard key={item.interview_id} data={item} />
            ))
          )}
        </div>
      )}

      {/* CONTENIDO: RECIBIDOS */}
      {activeTab === 'recibidos' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800">Mis Entrevistas</h2>
            <p className="text-sm text-gray-500">Revisa los comentarios que te han dejado.</p>
          </div>

          {myFeed.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">Aún no tienes comentarios en tus entrevistas públicas.</p>
            </div>
          ) : (
            myFeed.map((item) => (
              <CommunityCard key={item.interview_id} data={item} isMyInterview={true} />
            ))
          )}
        </div>
      )}

    </div>
  );
}