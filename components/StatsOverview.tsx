'use client';

import React from 'react';
import { BurnRequest } from '@/lib/types';
import { Flame, Clock, Truck, ShieldCheck, CheckCircle2, Ban, Layers } from 'lucide-react';

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
  const validadas = solicitudes.filter((s) => s.estado === 'EN_REVISION' && s.checklist_revision).length;
  const enQuema = solicitudes.filter((s) => s.estado === 'EN_QUEMA').length;
  const finalizadas = solicitudes.filter((s) => s.estado === 'FINALIZADA').length;
  const canceladas = solicitudes.filter((s) => s.estado === 'CANCELADA').length;

  const cards = [
    {
      id: 'ALL',
      titulo: 'TOTAL QUEMAS',
      valor: totalQuemas,
      subtitulo: `${totalHa} ha | ${totalMz} mz`,
      icon: Layers,
      bgNormal: 'bg-white border-slate-200 text-slate-900',
      bgActive: 'ring-2 ring-emerald-600 bg-emerald-50/50 border-emerald-400 shadow-sm',
      iconColor: 'text-slate-600',
      badgeValor: 'text-slate-900',
    },
    {
      id: 'SOLICITADA',
      titulo: '1. SOLICITADAS',
      valor: solicitadas,
      subtitulo: 'Esperando patrulla',
      icon: Clock,
      bgNormal: 'bg-blue-50/80 border-blue-200 text-blue-950',
      bgActive: 'ring-2 ring-blue-600 bg-blue-100/90 border-blue-400 shadow-sm',
      iconColor: 'text-blue-600',
      badgeValor: 'text-blue-900',
    },
    {
      id: 'EN_PROCESO',
      titulo: '2-4. EN PROCESO',
      valor: enProceso,
      subtitulo: 'Patrullas en campo',
      icon: Truck,
      bgNormal: 'bg-amber-50/80 border-amber-200 text-amber-950',
      bgActive: 'ring-2 ring-amber-600 bg-amber-100/90 border-amber-400 shadow-sm',
      iconColor: 'text-amber-600',
      badgeValor: 'text-amber-900',
    },
    {
      id: 'VALIDADAS',
      titulo: '5. VALIDADAS',
      valor: validadas,
      subtitulo: 'Luz verde de revisión',
      icon: ShieldCheck,
      bgNormal: 'bg-cyan-50/80 border-cyan-200 text-cyan-950',
      bgActive: 'ring-2 ring-cyan-600 bg-cyan-100/90 border-cyan-400 shadow-sm',
      iconColor: 'text-cyan-600',
      badgeValor: 'text-cyan-900',
    },
    {
      id: 'EN_QUEMA',
      titulo: '6. QUEMA ACTIVA',
      valor: enQuema,
      subtitulo: 'Fuego en desarrollo',
      icon: Flame,
      bgNormal: 'bg-rose-50/80 border-rose-200 text-rose-950',
      bgActive: 'ring-2 ring-rose-600 bg-rose-100/90 border-rose-400 animate-pulse shadow-sm',
      iconColor: 'text-rose-600',
      badgeValor: 'text-rose-900',
    },
    {
      id: 'FINALIZADA',
      titulo: '7. FINALIZADAS',
      valor: finalizadas,
      subtitulo: 'Liquidadas con éxito',
      icon: CheckCircle2,
      bgNormal: 'bg-emerald-50/80 border-emerald-200 text-emerald-950',
      bgActive: 'ring-2 ring-emerald-600 bg-emerald-100/90 border-emerald-400 shadow-sm',
      iconColor: 'text-emerald-600',
      badgeValor: 'text-emerald-900',
    },
    {
      id: 'CANCELADA',
      titulo: 'CANCELADAS',
      valor: canceladas,
      subtitulo: 'Por clima o riesgo',
      icon: Ban,
      bgNormal: 'bg-slate-100/80 border-slate-200 text-slate-800',
      bgActive: 'ring-2 ring-slate-600 bg-slate-200/90 border-slate-400 shadow-sm',
      iconColor: 'text-slate-500',
      badgeValor: 'text-slate-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
      {cards.map((card) => {
        const isSelected = filtroActivo === card.id;
        const Icon = card.icon;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectFiltro(card.id)}
            className={`p-3 rounded-2xl border text-left transition-all duration-150 shadow-sm hover:shadow hover:scale-[1.02] flex flex-col justify-between cursor-pointer ${
              card.bgNormal
            } ${isSelected ? card.bgActive : ''}`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-black tracking-wider uppercase opacity-85 truncate">
                {card.titulo}
              </span>
              <Icon className={`w-3.5 h-3.5 shrink-0 ${card.iconColor}`} />
            </div>

            <div className="mt-2">
              <span className={`text-2xl font-black tracking-tight leading-none ${card.badgeValor}`}>
                {card.valor}
              </span>
              <p className="text-[10px] font-medium opacity-80 truncate mt-1">
                {card.subtitulo}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
