'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button2';
import { CheckCircle, XCircle } from 'lucide-react';
import { approveExpertAction, rejectExpertAction } from '../actions';

type Application = {
  id: string;
  user_id: string;
  area_of_expertise: string;
  years_of_experience: number;
  linkedin_url: string | null;
  portfolio_url:string | null;
  motivation: string;
};

export default function ApplicationCard({ app }: { app: Application }) {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!confirm('¿Aprobar a este usuario?')) return;
    setLoading(true);
    const res = await approveExpertAction(app.id, app.user_id);
    if (res.error) alert(res.error);
    setLoading(false);
  };

  const handleReject = async () => {
    if (!confirm('¿Rechazar solicitud?')) return;
    setLoading(true);
    const res = await rejectExpertAction(app.id);
    if (res.error) alert(res.error);
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold uppercase">
            {app.area_of_expertise}
          </span>
          <span className="text-sm text-gray-500">
            {app.years_of_experience} años de experiencia.
          </span>
        </div>
        <p className="text-gray-800 font-medium">Motivación:</p>
        <p className="text-gray-600 text-sm italic">"{app.motivation}"</p>
        {app.linkedin_url && (
          <a href={app.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline block mt-1">
            Ver LinkedIn
          </a>
        )}
        {app.portfolio_url && (
          <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline block mt-1">
            Ver GitHub
          </a>
        )}
      </div>

      <div className="flex flex-col gap-2 min-w-[140px]">
        <Button 
          className="bg-green-600 hover:bg-green-100 w-full"
          onClick={handleApprove}
          disabled={loading}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Aprobar
        </Button>
        <Button 
          
          className="text-red-600 border-red-200 hover:bg-red-50 w-full"
          onClick={handleReject}
          disabled={loading}
        >
          <XCircle className="w-4 h-4 mr-2" />
          Rechazar
        </Button>
      </div>
    </div>
  );
}