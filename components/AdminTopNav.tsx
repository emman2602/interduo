// components/TopNav.tsx
'use client';


import Image from 'next/image';
import type { User } from '@supabase/supabase-js';
import NavLinks from './AdminLinks';
import Logo from './Logo';

// 1. Importa Headless UI y tu LogoutButton
import { Menu } from '@headlessui/react';
import { LogoutButton } from '@/components/logout-button'; 

type TopNavProps = {
  user: User;
};

export default function AdminTopNav({ user }: TopNavProps) {
  return (
    <div className="md:hidden flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200 fixed top-0 left-0 z-50">
      
      {/* 3. Logo (Queda igual) */}
      <Logo/>
      
      {/* Tus NavLinks (Quedan igual) */}
      <nav className=" flex flex-row sm:gap-x-4 space-x-4">
        <NavLinks/> 
      </nav>

      {/* 4. REEMPLAZO: El Link del Avatar se convierte en un Menú */}
      <Menu as="div" className="relative z-50">
        
        {/* El botón que abre el menú sigue siendo el avatar */}
        <Menu.Button className="rounded-full ring-1 ring-gray-300 hover:ring-blue-500 transition-all">
          <Image
            className="h-8 w-8 rounded-full"
            src={user.user_metadata?.avatar_url || '/avatar-placeholder.png'}
            alt="Avatar de usuario"
            width={32}
            height={32}
          />
        </Menu.Button>
        
        {/* El panel del menú (solo con la opción de logout) */}
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          
          <Menu.Item>
            {({ active }) => (
              <LogoutButton
                // Pasa las clases de hover
                className={`px-4 py-2 ${active ? 'bg-gray-100' : ''}`}
                // No pasamos 'useBigButton', así que es un enlace de texto
              />
            )}
          </Menu.Item>
          
          
              
        </Menu.Items>
      </Menu>
      {/* FIN DEL REEMPLAZO */}
      
    </div>
  );
}