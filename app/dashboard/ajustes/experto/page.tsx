'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button2';

import { submitExpertApplicationAction } from './actions';
import { Briefcase, GraduationCap, Link as LinkIcon, Clock } from 'lucide-react';

export default function ExpertApplicationPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const data = {
      area: formData.get('area') as string,
      experience: Number(formData.get('experience')),
      academic: formData.get('academic') as string,
      portfolio: formData.get('portfolio') as string,
      linkedin: formData.get('linkedin') as string,
      motivation: formData.get('motivation') as string,
      availability: Number(formData.get('availability')),
    };

    const res = await submitExpertApplicationAction(data);
    
    if (res?.error) {
      alert(res.error);
      setIsLoading(false);
    }
    // Si es exitoso, la server action redirige automáticamente
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Aplica como Experto Evaluador</h1>
        <p className="text-gray-500 mt-2">
          Únete a nuestra red de profesionales y ayuda a otros a mejorar sus habilidades de entrevista.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        
        {/* Área y Experiencia */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Área de Expertis
            </label>
            <select 
              name="area" 
              required 
              className="w-full p-2 border rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona un área</option>
              <option value="frontend">Desarrollo de software</option>
              <option value="backend">TIC´s</option>
              <option value="mobile">Ciberseguridad</option>
              <option value="datascience">Ciencia de Datos</option>
              <option value="devops">DevOps / Cloud</option>
              <option value="qa">QA / Testing</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Años de Experiencia
            </label>
            <input 
              type="number" 
              name="experience" 
              min="1" 
              required 
              className="w-full p-2 border rounded-md" 
              placeholder="Ej. 5"
            />
          </div>
        </div>

        {/* Nivel Académico */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" /> Nivel Académico
          </label>
          <select 
            name="academic" 
            required 
            className="w-full p-2 border rounded-md bg-white"
          >
            <option value="universitario">Universitario / Grado</option>
            <option value="master">Maestría / Posgrado</option>
            <option value="doctorado">Doctorado</option>
            <option value="autodidacta">Autodidacta / Bootcamps</option>
          </select>
        </div>

        {/* Enlaces */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" /> LinkedIn (URL)
            </label>
            <input 
              type="url" 
              name="linkedin" 
              required 
              className="w-full p-2 border rounded-md" 
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" /> Portafolio / GitHub (URL)
            </label>
            <input 
              type="url" 
              name="portfolio" 
              className="w-full p-2 border rounded-md" 
              placeholder="https://github.com/..."
            />
          </div>
        </div>

        {/* Disponibilidad */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Disponibilidad semanal (Horas aprox. para revisar)
          </label>
          <input 
            type="number" 
            name="availability" 
            min="1" 
            max="40" 
            required 
            className="w-full p-2 border rounded-md" 
            placeholder="Ej. 5"
          />
        </div>

        {/* Motivación */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            ¿Por qué te gustaría ser evaluador experto?
          </label>
          <textarea 
            name="motivation" 
            required 
            className="w-full p-2 border rounded-md h-32" 
            placeholder="Cuéntanos tu motivación y qué puedes aportar a la comunidad..."
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Enviando solicitud...' : 'Enviar Solicitud'}
        </Button>

      </form>
    </div>
  );
}