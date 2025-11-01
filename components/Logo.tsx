import Image from 'next/image';
import Link from 'next/link';

// --- Props Opcionales ---
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
  // `className` por defecto es "w-32 h-auto" (un ancho de 128px con Tailwind).
  // Puedes ajustarlo o pasarlo como prop.

  return (
    <Link href="/" aria-label="Interduo - Volver al inicio">
      <Image
        // 1. RUTA: Es la ruta raíz (/) porque está en la carpeta /public
        src="/logoInterduo.png"
        
        // 2. ALT TEXT: Importante para accesibilidad
        alt="Logo de Interduo"
        
        // 3. DIMENSIONES ORIGINALES:
        // Debes poner el ancho y alto *reales* del archivo PNG.
        // La imagen que subiste es de 1080x1080.
        // Esto es VITAL para que Next.js evite saltos de layout (CLS).
        width={1256}
        height={448}
        
        // 4. CLASE PARA ESTILO:
        // Aquí controlamos el *tamaño visual* con CSS (ej. Tailwind).
        // El navegador reducirá la imagen de 1080px para que quepa en w-32.
        className={className}
        
        // 5. PRIORIDAD:
        // Si el logo está en tu header (visible al cargar),
        // `priority` le dice a Next.js que la cargue primero.
        priority
      />
    </Link>
  );
}