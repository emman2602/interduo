'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button2';
import { Plus, Loader2 } from 'lucide-react';
import { createQuestionAction } from '../actions'; 
import { createClient } from '@/lib/supabase/client';

type Option = {
  id: string;
  name: string;
};

export default function CreateQuestionForm() {
  const [loading, setLoading] = useState(false);
  const [areas, setAreas] = useState<Option[]>([]);
  const [subareas, setSubareas] = useState<Option[]>([]);
  const [types, setTypes] = useState<Option[]>([]);
  
  // Estados del formulario
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedSubarea, setSelectedSubarea] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [difficulty, setDifficulty] = useState('1');
  const [metadata, setMetadata] = useState(''); // JSON string

  const supabase = createClient();

  // 1. Cargar datos iniciales (Áreas y Tipos)
  useEffect(() => {
    const fetchData = async () => {
      const { data: areasData } = await supabase.from('areas').select('id, name');
      const { data: typesData } = await supabase.from('question_types').select('id, name');
      
      if (areasData) setAreas(areasData);
      if (typesData) setTypes(typesData);
    };
    fetchData();
  }, [supabase]);

  // 2. Cargar Subáreas cuando cambia el Área
  useEffect(() => {
    const fetchSubareas = async () => {
      if (!selectedArea) {
        setSubareas([]);
        return;
      }
      const { data } = await supabase
        .from('subareas')
        .select('id, name')
        .eq('area_id', selectedArea);
        
      if (data) setSubareas(data);
    };
    fetchSubareas();
  }, [selectedArea, supabase]);

  const handleSubmit = async () => {
    if (!selectedSubarea || !selectedType || !questionText) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    setLoading(true);
    
    // Validar JSON de metadatos (opcional)
    let parsedMetadata = {};
    try {
      if (metadata) parsedMetadata = JSON.parse(metadata);
    } catch {
      alert('El formato de metadatos JSON no es válido');
      setLoading(false);
      return;
    }

    const res = await createQuestionAction({
      subarea_id: selectedSubarea,
      type_id: selectedType,
      question_text: questionText,
      difficulty_level: parseInt(difficulty),
      metadata: parsedMetadata
    });

    setLoading(false);

    if (res.success) {
      alert('Pregunta creada exitosamente');
      setQuestionText('');
      setMetadata('');
    } else {
      alert('Error: ' + res.error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Agregar Nueva Pregunta</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selección de Área */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
          <select 
            className="w-full border rounded-md px-3 py-2 bg-white"
            value={selectedArea}
            onChange={(e) => {
              setSelectedArea(e.target.value);
              setSelectedSubarea(''); // Reset subarea
            }}
          >
            <option value="">Selecciona un área...</option>
            {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>

        {/* Selección de Subárea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subárea</label>
          <select 
            className="w-full border rounded-md px-3 py-2 bg-white"
            value={selectedSubarea}
            onChange={(e) => setSelectedSubarea(e.target.value)}
            disabled={!selectedArea}
          >
            <option value="">Selecciona una subárea...</option>
            {subareas.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tipo de Pregunta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select 
            className="w-full border rounded-md px-3 py-2 bg-white"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Selecciona tipo...</option>
            {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        {/* Dificultad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dificultad (1-3)</label>
          <select 
            className="w-full border rounded-md px-3 py-2 bg-white"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="1">1 - Principiante</option>
            <option value="2">2 - Intermedio</option>
            <option value="3">3 - Avanzado</option>
          </select>
        </div>
      </div>

      {/* Texto de la Pregunta */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pregunta</label>
        <textarea 
          className="w-full border rounded-md px-3 py-2 h-24"
          placeholder="Escribe el texto de la pregunta aquí..."
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
      </div>

      {/* Metadatos (JSON) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Metadatos (JSON Opcional)
          <span className="text-xs text-gray-400 ml-2 font-normal">Ej: {'{"topic": "React Hooks"}'}</span>
        </label>
        <textarea 
          className="w-full border rounded-md px-3 py-2 h-20 font-mono text-sm"
          placeholder="{}"
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
        />
      </div>

      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
        Crear Pregunta
      </Button>
    </div>
  );
}
