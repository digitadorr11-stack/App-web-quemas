'use client';

import React from 'react';
import { BurnRequest } from '@/lib/types';

interface StatsOverviewProps {
  solicitudes: BurnRequest[];
  filtroActivo: string;
  onSelectFiltro: (filtro: string) => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  solicitudes,
  filtroActivo,
  onSelectFiltro,
}) => {
  const totalHa = solicitudes
    .filter((s) => s.estado !== 'CANCELADA')
    .reduce((acc, s) => acc + (Number(s.area_hectareas) || 0), 0)
    .toFixed(1);

  const totalMz = solicitudes
    .filter((s) => s.estado !== 'CANCELADA')
    .reduce((acc, s) => acc + (Number(s.area_manzanas) || 0), 0)
    .toFixed(1);

  const totalQuemas = solicitudes.length;
  const solicitadas = solicitudes.filter((s) => s.estado === 'SOLICITADA').length;
  const enProceso = solicitudes.filter(
    (s) => s.estado === 'PATRULLA_ASIGNADA' || s.estado === 'EN_FRENTE' || s.estado === 'EN_REVISION'
  ).length;
  // "Validadas" no tiene un paso de aprobación real en el flujo operativo — se deja siempre en 0.
  const validadas = 0;
  const enQuema = solicitudes.filter((s) => s.estado === 'EN_QUEMA').length;
  const finalizadas = solicitudes.filter((s) => s.estado === 'FINALIZADA').length;
  const canceladas = solicitudes.filter((s) => s.estado === 'CANCELADA').length;

  const cards = [
    {
      id: 'ALL',
      titulo: 'TOTAL QUEMAS',
      valor: totalQuemas,
      subtitulo: `${totalHa} ha | ${totalMz} mz`,
      dot: 'bg-[#1B5E3F]',
      ringActive: 'ring-2 ring-[#1B5E3F]',
    },
    {
      id: 'SOLICITADA',
      titulo: '1. SOLICITADAS',
      valor: solicitadas,
      subtitulo: 'Esperando patrulla',
      dot: 'bg-blue-500',
      ringActive: 'ring-2 ring-blue-500',
    },
    {
      id: 'EN_PROCESO',
      titulo: '2-4. EN PROCESO',
      valor: enProceso,
      subtitulo: 'Patrullas en campo',
      dot: 'bg-amber-500',
      ringActive: 'ring-2 ring-amber-500',
    },
    {
      id: 'VALIDADAS',
      titulo: '5. VALIDADAS',
      valor: validadas,
      subtitulo: 'No funcional — sin aprobación',
      dot: 'bg-slate-300',
      ringActive: '',
      disabled: true,
    },
    {
      id: 'EN_QUEMA',
      titulo: '6. QUEMA ACTIVA',
      valor: enQuema,
      subtitulo: 'Fuego en desarrollo',
      dot: 'bg-rose-600',
      ringActive: 'ring-2 ring-rose-500',
    },
    {
      id: 'FINALIZADA',
      titulo: '7. FINALIZADAS',
      valor: finalizadas,
      subtitulo: 'Liquidadas con éxito',
      dot: 'bg-emerald-500',
      ringActive: 'ring-2 ring-emerald-500',
    },
    {
      id: 'CANCELADA',
      titulo: 'CANCELADAS',
      valor: canceladas,
      subtitulo: 'Por clima o riesgo',
      dot: 'bg-slate-400',
      ringActive: 'ring-2 ring-slate-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
      {cards.map((card) => {
        const isSelected = filtroActivo === card.id;
        const isDisabled = Boolean(card.disabled);

        return (
          <button
            key={card.id}
            type="button"
            disabled={isDisabled}
            onClick={() => !isDisabled && onSelectFiltro(card.id)}
            title={isDisabled ? 'Etapa sin lógica de aprobación activa en el flujo operativo' : undefined}
            className={`p-3.5 rounded-xl border border-slate-200 bg-white text-left transition-all duration-150 shadow-card flex flex-col justify-between ${
              isDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer'
            } ${isSelected ? card.ringActive : ''}`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 truncate">
                {card.titulo}
              </span>
              <span className={`w-2 h-2 rounded-full shrink-0 ${card.dot}`} />
            </div>

            <div className="mt-2">
              <span className="text-2xl font-bold tracking-tight leading-none text-slate-900 font-mono">
                {card.valor}
              </span>
              <p className="text-[10px] font-medium text-slate-500 truncate mt-1">
                {card.subtitulo}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
