// components/SideNav.tsx
// (Tu componente SideNav.tsx, que ahora es un Componente de Cliente)
'use client'; 

import Link from 'next/link';
import NavLinks from './NavLinks'; // Tus enlaces estáticos (Inicio, Agenda, etc.)
import Image from 'next/image';
import { Book, GraduationCap } from 'lucide-react'; // Icono para el logo y subáreas
import type { User } from '@supabase/supabase-js'; // Importa el tipo User
import type { Subarea } from '@/app/dashboard/layout'; // Importa el tipo Subarea
import Logo from './Logo';
import { LogoutButton } from './logout-button';

// 1. Define las props que recibe el componente
type SideNavProps = {
  user: User;
};

export default function SideNav({ user }: SideNavProps) {
  return (
    <div className="hidden md:flex h-screen w-64 flex-col fixed inset-y-0 z-50">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r border-gray-200">
        
        {/* Logo */}
        <Logo className='w-32 mx-auto pt-2'/>
        
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            
            {/* 2. Sección de Enlaces Estáticos */}
            <li>
              <NavLinks />
            </li>

            
            
          </ul>
        </nav>

        {/* 4. Perfil de Usuario Dinámico (al fondo) */}
        <div className="mt-auto -mx-6">
          <a
            href="/dashboard/ajustes" // Enlaza a la página de ajustes
            className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
          >
            <Image
              className="h-8 w-8 rounded-full bg-gray-50"
              // Usa la imagen de perfil del usuario si existe, o un placeholder
              src={user.user_metadata?.avatar_url || '/avatar-placeholder.png'}
              alt="Avatar de usuario"
              width={32}
              height={32}
            />
            <span className="flex flex-col">
              {/* Muestra el nombre si existe, si no, el email */}
              <span>{user.user_metadata?.full_name || 'Usuario'}</span>
              <span className="text-xs font-normal text-gray-500">
                {user.email}
              </span>
            </span>
          </a>
        </div>
        <LogoutButton useBigButton={true} />

      </div>
    </div>
  );
}