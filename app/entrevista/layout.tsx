// app/entrevista/layout.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react';

// Este layout protege todas las rutas de entrevista
// (ej. /entrevista/abc/1, /entrevista/abc/2, etc.)
export default async function InterviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. EL GUARDIA DE SEGURIDAD
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login'); // Si no hay usuario, ¡fuera!
  }

  // 2. EL CONTENEDOR DE "MODO ENFOQUE"
  // Es un layout simple, sin sidebar, solo un fondo
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}