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
    accent: string;
    tinte: string;
  }[] = [
    {
      id: 'ALL',
      title: 'Total en Proceso',
      value: total,
      sub: `${totalHa.toFixed(1)} Ha · ${totalMz.toFixed(1)} Mz`,
      icon: Activity,
      accent: 'text-slate-200',
      tinte: 'bg-gradient-to-b from-[#121B2A] to-[#0A0F18]',
    },
    {
      id: 'SOLICITADA',
      title: '1. Solicitadas',
      value: solicitadas,
      sub: 'Esperando patrulla',
      icon: Clock,
      accent: 'text-blue-400',
      tinte: 'bg-blue-500/[0.05]',
    },
    {
      id: 'EN_CAMINO',
      title: '2. En Camino',
      value: enCamino,
      sub: 'Desplazándose al frente',
      icon: Truck,
      accent: 'text-amber-400',
      tinte: 'bg-amber-500/[0.05]',
    },
    {
      id: 'EN_FRENTE_REVISION',
      title: '3. En Frente / Revisión',
      value: enFrenteRevision,
      sub: 'Inspección técnica en sitio',
      icon: ShieldCheck,
      accent: 'text-orange-400',
      tinte: 'bg-orange-500/[0.05]',
    },
    {
      id: 'EN_QUEMA',
      title: '4. Quema Activa',
      value: enQuema,
      sub: 'Fuego en desarrollo',
      icon: Flame,
      accent: 'text-rose-500',
      tinte: 'bg-rose-500/[0.07]',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
      {cards.map((c) => {
        const Icon = c.icon;
        const isSelected = activeFilter === c.id;
        const isAlert = c.id === 'EN_QUEMA' && c.value > 0;
        return (
          <button
            key={c.id}
            onClick={() => onFilterChange(c.id)}
            className={`p-3.5 rounded-lg border text-left transition-colors flex flex-col justify-between cursor-pointer ${c.tinte} ${
              isSelected
                ? 'border-amber-600/70 ring-1 ring-amber-600/60'
                : 'border-slate-800/80 hover:border-slate-700'
            } ${isAlert ? 'border-rose-800/50' : ''}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 truncate">{c.title}</span>
              <Icon className={`w-3.5 h-3.5 shrink-0 ${c.accent} ${isAlert ? 'animate-pulse' : ''}`} />
            </div>
            <div className="mt-2">
              <div className={`text-2xl font-bold tracking-tight ${c.accent}`}>{c.value}</div>
              <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{c.sub}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
