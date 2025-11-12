import Image from 'next/image';
import Link from 'next/link';


// Hacemos el componente flexible para que acepte un `className`
// y así poder cambiar el tamaño desde donde lo llames.
type LogoProps = {
  className?: string;
};

/**
 * Componente reutilizable para el logo de Interduo.
 * Por defecto, linkea a la página de inicio.
 */
export default function Logo({ className = 'w-32 h-auto' }: LogoProps) {
  

  return (
    <Link href="/" aria-label="Interduo - Volver al inicio">
      <Image
        // 1. RUTA: Es la ruta raíz (/) porque está en la carpeta /public
        src="/logoInterduo.png"
        
        // 2. ALT TEXT: para accesibilidad
        alt="Logo de Interduo"
        
        // 3. DIMENSIONES ORIGINALES:
        
        width={1256}
        height={448}
        
        // 4. CLASE PARA ESTILO:
        
        className={className}
        
        // 5. PRIORIDAD:
        // `priority` le dice a Next.js que la cargue primero.
        priority
      />
    </Link>
  );
}