import React from 'react';
import { BurnRequest } from '@/lib/types';
import { Flame, Clock, UserPlus, Layers, ShieldCheck, Activity } from 'lucide-react';

interface StatsOverviewProps {
  burns: BurnRequest[];
  onFilterStatus?: (status: string) => void;
  activeFilter?: string;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ burns, onFilterStatus, activeFilter }) => {
  // Filtrar solo quemas vivas/activas
  const activeBurns = burns.filter((b) => b.status !== 'FINALIZADA' && b.status !== 'CANCELADA');

  const total = activeBurns.length;
  const solicitadas = activeBurns.filter((b) => b.status === 'SOLICITADA').length;
  const enRevision = activeBurns.filter((b) => b.status === 'PATRULLA_ASIGNADA' || b.status === 'EN_REVISION' || b.status === 'REVISION_COMPLETADA').length;
  const validadas = activeBurns.filter((b) => b.status === 'VALIDADA').length;
  const enQuema = activeBurns.filter((b) => b.status === 'EN_QUEMA').length;

  const totalHa = activeBurns.reduce((acc, b) => acc + (Number(b.area_hectares) || 0), 0).toFixed(1);
  const totalTons = activeBurns.reduce((acc, b) => acc + (Number(b.estimated_tonnage) || 0), 0);

  const statCards = [
    {
      id: 'ALL',
      title: 'Total en Proceso',
      value: total,
      sub: `${totalHa} ha | ${totalTons.toLocaleString()} TM`,
      icon: Activity,
      color: 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-400',
      activeColor: 'ring-2 ring-slate-800 bg-slate-100 font-bold',
    },
    {
      id: 'SOLICITADA',
      title: '1. Solicitadas',
      value: solicitadas,
      sub: 'Esperando patrulla',
      icon: Clock,
      color: 'bg-blue-50/90 border-blue-200 text-blue-800 hover:border-blue-400',
      activeColor: 'ring-2 ring-blue-600 bg-blue-100 font-bold shadow-sm',
    },
    {
      id: 'EN_REVISION',
      title: '2-4. En Revisión',
      value: enRevision,
      sub: 'Patrulla en campo',
      icon: UserPlus,
      color: 'bg-amber-50/90 border-amber-200 text-amber-800 hover:border-amber-400',
      activeColor: 'ring-2 ring-amber-600 bg-amber-100 font-bold shadow-sm',
    },
    {
      id: 'VALIDADA',
      title: '5. Validadas',
      value: validadas,
      sub: 'Luz verde digitador',
      icon: ShieldCheck,
      color: 'bg-cyan-50/90 border-cyan-200 text-cyan-800 hover:border-cyan-400',
      activeColor: 'ring-2 ring-cyan-600 bg-cyan-100 font-bold shadow-sm',
    },
    {
      id: 'EN_QUEMA',
      title: '6. Quema Activa',
      value: enQuema,
      sub: 'Fuego en desarrollo',
      icon: Flame,
      color: 'bg-red-50/90 border-red-200 text-red-800 hover:border-red-400',
      activeColor: 'ring-2 ring-red-600 bg-red-100 font-bold animate-pulse shadow-sm',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {statCards.map((c) => {
        const Icon = c.icon;
        const isSelected = activeFilter === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onFilterStatus && onFilterStatus(c.id)}
            className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] shadow-sm flex flex-col justify-between cursor-pointer ${
              c.color
            } ${isSelected ? c.activeColor : ''}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-90 truncate">
                {c.title}
              </span>
              <Icon className="w-4 h-4 opacity-80" />
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-black tracking-tight">{c.value}</div>
              <div className="text-[10px] opacity-80 font-medium truncate mt-0.5">{c.sub}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
