import { Github, Linkedin, Twitter } from 'lucide-react';
// ¡Ya no necesitas 'next/link' aquí!

export default function Footer() {
  return (
    <footer className="w-full flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto text-center md:text-left text-sm text-gray-600 gap-8 py-16 px-4">
      
      {/* 1. Lado Izquierdo: Créditos */}
      <p>
        Developed by{" AleDul <3"} <br />
        © {new Date().getFullYear()} InterDuo. Todos los derechos reservados.
      </p>

      {/* 2. Lado Derecho: Iconos de Redes Sociales (con <a>) */}
      <div className="flex items-center gap-6">
        
        <a 
          href="https://twitter.com" // 1. URL Completa
          target="_blank"             // 2. Nueva pestaña
          rel="noopener noreferrer"   // 3. Seguridad
          className="text-gray-500 hover:text-gray-900 transition-colors"
        >
          <Twitter className="w-5 h-5" />
        </a>

        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-500 hover:text-gray-900 transition-colors"
        >
          <Github className="w-5 h-5" />
        </a>

        <a 
          href="https://linkedin.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-500 hover:text-gray-900 transition-colors"
        >
          <Linkedin className="w-5 h-5" />
        </a>

      </div>
      
    </footer>
  );
}