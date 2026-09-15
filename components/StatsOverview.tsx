'use client';

import React from 'react';
import { BurnRequest } from '@/lib/types';
import { Activity, Clock, Truck, ShieldCheck, Flame } from 'lucide-react';

export type StatFilterId = 'ALL' | 'SOLICITADA' | 'EN_CAMINO' | 'EN_FRENTE_REVISION' | 'EN_QUEMA';

interface StatsOverviewProps {
  solicitudes: BurnRequest[];
  activeFilter: StatFilterId;
  onFilterChange: (id: StatFilterId) => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ solicitudes, activeFilter, onFilterChange }) => {
  const activas = solicitudes.filter((s) => s.estado !== 'FINALIZADA' && s.estado !== 'CANCELADA');

  const total = activas.length;
  const solicitadas = activas.filter((s) => s.estado === 'SOLICITADA').length;
  const enCamino = activas.filter((s) => s.estado === 'PATRULLA_ASIGNADA').length;
  const enFrenteRevision = activas.filter((s) => s.estado === 'EN_FRENTE' || s.estado === 'EN_REVISION').length;
  const enQuema = activas.filter((s) => s.estado === 'EN_QUEMA').length;

  const totalHa = activas.reduce((acc, s) => acc + (Number(s.area_hectareas) || 0), 0);
  const totalMz = activas.reduce((acc, s) => acc + (Number(s.area_manzanas) || 0), 0);

  const cards: {
    id: StatFilterId;
    title: string;
    value: number;
    sub: string;
    icon: React.ElementType;
    color: string;
    activeColor: string;
  }[] = [
    {
      id: 'ALL',
      title: 'Total en Proceso',
      value: total,
      sub: `${totalHa.toFixed(1)} Ha · ${totalMz.toFixed(1)} Mz`,
      icon: Activity,
      color: 'bg-[#0B121E] border-slate-800 text-slate-300 hover:border-slate-600',
      activeColor: 'ring-2 ring-slate-400 bg-slate-900',
    },
    {
      id: 'SOLICITADA',
      title: '1. Solicitadas',
      value: solicitadas,
      sub: 'Esperando patrulla',
      icon: Clock,
      color: 'bg-blue-950/30 border-blue-900/70 text-blue-300 hover:border-blue-600',
      activeColor: 'ring-2 ring-blue-500 bg-blue-950/70',
    },
    {
      id: 'EN_CAMINO',
      title: '2. En Camino',
      value: enCamino,
      sub: 'Desplazándose al frente',
      icon: Truck,
      color: 'bg-amber-950/30 border-amber-900/70 text-amber-300 hover:border-amber-600',
      activeColor: 'ring-2 ring-amber-500 bg-amber-950/70',
    },
    {
      id: 'EN_FRENTE_REVISION',
      title: '3. En Frente / Revisión',
      value: enFrenteRevision,
      sub: 'Inspección técnica en sitio',
      icon: ShieldCheck,
      color: 'bg-orange-950/30 border-orange-900/70 text-orange-300 hover:border-orange-600',
      activeColor: 'ring-2 ring-orange-500 bg-orange-950/70',
    },
    {
      id: 'EN_QUEMA',
      title: '4. Quema Activa',
      value: enQuema,
      sub: 'Fuego en desarrollo',
      icon: Flame,
      color: 'bg-rose-950/30 border-rose-900/70 text-rose-300 hover:border-rose-600',
      activeColor: `ring-2 ring-rose-500 bg-rose-950/70 ${enQuema > 0 ? 'animate-pulse' : ''}`,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        const isSelected = activeFilter === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onFilterChange(c.id)}
            className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] shadow-sm flex flex-col justify-between cursor-pointer ${c.color} ${
              isSelected ? c.activeColor : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-90 truncate">{c.title}</span>
              <Icon className="w-4 h-4 opacity-80 shrink-0" />
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-black tracking-tight text-white">{c.value}</div>
              <div className="text-[10px] opacity-80 font-medium truncate mt-0.5">{c.sub}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
