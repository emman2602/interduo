// components/ui/SelectionCard.tsx
import Image from 'next/image';
import React from 'react';

type SelectionCardProps = {
  title: string;
  description?: string;
  imageSrc?: string; // Para la pantalla 1
  icon?: React.ReactNode; // Para la pantalla 2
  isSelected?: boolean;
  onClick: () => void;
};

export function SelectionCard({
  title,
  description,
  imageSrc,
  icon,
  isSelected = false,
  onClick,
}: SelectionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        bg-white rounded-2xl shadow-lg p-6
        flex flex-col text-center items-center justify-start
        transition-all duration-300 ease-in-out
        border-2
        ${
          isSelected
            ? 'border-blue-500 shadow-blue-200' // Estilo cuando está seleccionada
            : 'border-transparent' // Estilo normal
        }
        hover:-translate-y-1 hover:shadow-xl
      `}
    >
      {/* Muestra la imagen si existe (Pantalla 1) */}
      {imageSrc && (
        <div className="w-full h-32 relative mb-4">
          <Image
            src={imageSrc}
            alt={title}
            layout="fill"
            objectFit="contain" 
            className="rounded-lg"
          />
        </div>
      )}

      {/* Muestra el icono si existe (Pantalla 2) */}
      {icon && (
        <div className="text-blue-600 w-16 h-16 mb-4">
          {/* El icono (SVG) se pasa como children */}
          {icon}
        </div>
      )}

      {/* Contenido de texto */}
      <h3 className="font-semibold text-gray-800 text-lg mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 text-sm">{description}</p>
      )}
    </button>
  );
}