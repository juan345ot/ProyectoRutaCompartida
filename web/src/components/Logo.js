import React from 'react';

/**
 * Logo de Ruta Compartida:
 * 2 puntos unidos por una curva (Diseño idéntico a Route, pero multicolor)
 */
export default function Logo({ className = "h-10 w-10 text-brand-500" }) {
  // Utilizamos stroke="currentColor" en los círculos para que adopten el color azul por defecto (text-brand-500)
  // Utilizamos stroke="url(#orange-gradient)" o naranja puro en el path
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {/* Círculos con color relleno "Azul Marino muy oscuro" (#0f172a o #1e3a8a), uso #1e3a8a y sin borde */}
      <circle cx="6" cy="19" r="3" fill="#1e3a8a" stroke="none" />
      {/* Línea color Naranja (#f97316) */}
      <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" stroke="#f97316" />
      <circle cx="18" cy="5" r="3" fill="#1e3a8a" stroke="none" />
    </svg>
  );
}
