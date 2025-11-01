// app/cuestionario/layout.tsx
import React from 'react';
import { createClient } from '@/lib/supabase/server'; // 1. Importa el cliente de SERVIDOR
import { redirect } from 'next/navigation'; // 2. Importa redirect
import { BackButton } from '@/components/ui/back-button';
 // 3. Importa tu botón

export default async function CuestionarioLayout({ // 4. Conviértelo en 'async'
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 5. Verifica si hay un usuario logueado
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // Si no hay usuario, lo mandamos al login
    redirect('/login');
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      
      {/* 6. Añade el botón de regreso aquí */}
      {/* Se mostrará en /areas y /experiencia.
        'absolute' lo saca del flujo normal y lo posiciona en la esquina.
      */}
      <BackButton/>

      {/* Tu mascota (si la quieres) */}
      {/* <MascotaAzul className="absolute bottom-0 left-0" /> */}
      
      <main className="w-full max-w-5xl">
        {children}
      </main>
    </div>
  );
}