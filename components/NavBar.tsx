

'use client'; // Necesario para 'useState'

import { useState } from 'react';
import { Menu, X } from 'lucide-react'; // Iconos para el menú (npm install lucide-react)

 // (Asegúrate que la ruta a tu botón sea correcta)

// 1. Define tus enlaces en un array para no repetirlos
const navLinks = [
  { href: "#", name: "Contacto" },
  { href: "#", name: "Beneficios" },
  { href: "#", name: "¿Cómo funciona?" },
  { href: "#", name: "Sobre Interduo" },
  { href: "/auth/login", name: "Iniciar Sesión" },
  { href: "/auth/sign-up", name: "Registrarse" },
];

export default function NavBar() {
  // 2. Estado para controlar si el menú móvil está abierto o cerrado
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* --- 1. NAVEGACIÓN DE ESCRITORIO --- */}
      {/* Tu código original: Oculto en móvil (hidden), visible en escritorio (md:block) */}
      <nav className="hidden md:block fixed top-4 left-1/2 -translate-x-1/2 rounded-full p-2 shadow-lg backdrop-blur-md z-50">
        <ul className="flex items-center gap-x-10 px-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a href={link.href} className="text-base font-medium text-gray-800 hover:text-blue-600 transition-colors whitespace-nowrap">
                {link.name}
              </a>
            </li>
          ))}
          
        </ul>
      </nav>

      {/* --- 2. NAVEGACIÓN MÓVIL --- */}
      {/* Visible en móvil (md:hidden), oculta en escritorio */}
      <div className="md:hidden">
        
        {/* Botón de Hamburguesa */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="fixed top-4 right-4 z-50 p-2 rounded-lg shadow-lg bg-white/70 backdrop-blur-sm"
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6 text-gray-800" />
        </button>

        {/* Overlay del Menú (pantalla completa) */}
        <div
          className={`
            fixed inset-0 z-40 bg-white
            flex flex-col items-center justify-center
            transition-transform duration-300 ease-in-out
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} 
          `}
        >
          {/* Botón de Cerrar (dentro del overlay) */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-4 right-4 p-2"
            aria-label="Cerrar menú"
          >
            <X className="w-8 h-8 text-gray-800" />
          </button>

          {/* Lista de enlaces móviles */}
          <ul className="flex flex-col items-center gap-y-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)} // Cierra el menú al hacer clic
                  className="text-2xl font-medium text-gray-800 hover:text-blue-600 transition-colors"
                >
                  {link.name}
                </a>
              </li>
            ))}
            
          </ul>
        </div>
      </div>
    </>
  );
}