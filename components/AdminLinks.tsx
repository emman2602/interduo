
'use client';


import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {  Users, Database } from 'lucide-react';

import clsx from 'clsx';

const links = [
  {
    name: 'Solicitudes', 
    href: '/dashboard/admin/solicitudes',
    icon: Users,
  },
  {
    name: 'Contenido',
    href: '/dashboard/admin/contenido',
    icon: Database,
  }
  
];

export default function NavLinks() {
  const pathName = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            // 3. Clases de Tailwind para estilo y estado activo
            className={clsx(
              `
              flex h-11 items-center justify-center rounded-lg
              text-gray-600 transition-colors
              hover:bg-gray-100 hover:text-blue-600
              md:h-auto md:flex-none md:justify-start md:p-2 md:px-3
            `,
              {
                'bg-blue-50 text-blue-600': pathName === link.href, // Estilo activo
              },
            )}
          >
            <LinkIcon className="w-8 h-5" />
           
            <p className="hidden md:block ml-2">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}