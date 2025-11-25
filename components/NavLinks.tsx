
'use client';


import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CiSaveUp2 } from 'react-icons/ci';
import { GoBell, GoQuestion } from 'react-icons/go';
import {
  IoCalendarOutline,
  IoHomeOutline,
  IoSettingsOutline,
  IoPeopleOutline
} from 'react-icons/io5';

import clsx from 'clsx';

const links = [
  {
    name: 'Dashboard', 
    href: '/dashboard',
    icon: IoHomeOutline,
  },
  {
    name: 'Entrevistas',
    href: '/dashboard/entrevistas',
    icon: CiSaveUp2,
  },
  {
    name: 'Agenda',
    href: '/dashboard/agenda',
    icon: IoCalendarOutline,
  },
  {
    name: 'Notificaciones',
    href: '/dashboard/notificaciones',
    icon: GoBell,
  },
  {
    name: 'Comunidad',
    href: '/dashboard/comunidad',
    icon: IoPeopleOutline,
  },
  {
    name: 'Ajustes',
    href: '/dashboard/ajustes',
    icon: IoSettingsOutline,
  },
  {
    name: 'Ayuda',
    href: '/dashboard/ayuda',
    icon: GoQuestion,
  },
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
            {/* 4. Tu lógica 'hidden md:block' es correcta */}
            <p className="hidden md:block ml-2">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}