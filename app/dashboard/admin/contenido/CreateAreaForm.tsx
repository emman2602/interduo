'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button2';
import { Plus } from 'lucide-react';
import { createAreaAction } from '../actions';

export default function CreateAreaForm() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const res = await createAreaAction(name);
    setLoading(false);
    
    if (res.success) {
      setName('');
      alert('Área creada exitosamente.');
    } else {
      alert('Error: ' + res.error);
    }
  };

  return (
    <div className="flex gap-4 items-end bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Nueva Área</label>
        <input 
          type="text" 
          placeholder="Ej. Ciberseguridad" 
          className="w-full border rounded-md px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <Button onClick={handleCreate} disabled={loading || !name.trim()}>
        <Plus className="w-4 h-4 mr-2" /> Crear
      </Button>
    </div>
  );
}