'use client';

import React from 'react';

interface FlameLogoProps {
  size?: number | string;
  className?: string;
  showContainer?: boolean;
}

export default function FlameLogo({ size = 56, className = '', showContainer = true }: FlameLogoProps) {
  const content = (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full drop-shadow-md"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradiente Rojo Intenso para el cuerpo exterior del fuego */}
        <linearGradient id="fireRedGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="60%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>

        {/* Gradiente Amarillo Dorado Cálido para el núcleo interior */}
        <linearGradient id="fireYellowGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* 1. Llama Exterior: Borde Dorado / Ámbar + Relleno Rojo */}
      <path
        d="M38 56 C38 50, 46 46, 46 34 C46 23, 40 16, 50 10 C53 22, 64 27, 72 38 C80 50, 78 66, 70 75 C61 84, 39 84, 30 75 C23 68, 24 55, 31 49 C35 45, 38 51, 38 56 Z"
        fill="url(#fireRedGrad)"
        stroke="#FBBF24"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* 2. Núcleo Interior: Llama Amarilla Brillante */}
      <path
        d="M49 36 C49 36, 54 46, 60 52 C64 57, 64 65, 59 71 C54 77, 44 77, 40 71 C35 65, 38 57, 44 52 C48 48, 49 43, 49 36 Z"
        fill="url(#fireYellowGrad)"
      />
    </svg>
  );

  if (!showContainer) {
    return (
      <div style={{ width: size, height: size }} className={`relative flex items-center justify-center ${className}`}>
        {content}
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0F764D] via-[#108A58] to-[#16A34A] border border-emerald-400/40 shadow-xl shadow-emerald-950/60 p-2 overflow-hidden ${className}`}
    >
      <div className="w-full h-full flex items-center justify-center animate-pulse">
        {content}
      </div>
    </div>
  );
}
