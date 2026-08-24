import React from 'react';
import { BurnRequest } from '@/lib/types';
import { Flame, Clock, UserPlus, CheckCircle2, XCircle, Layers, Weight, ShieldCheck } from 'lucide-react';

interface StatsOverviewProps {
  burns: BurnRequest[];
  onFilterStatus?: (status: string) => void;
  activeFilter?: string;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ burns, onFilterStatus, activeFilter }) => {
  const total = burns.length;
  const solicitadas = burns.filter((b) => b.status === 'SOLICITADA').length;
  const enRevision = burns.filter((b) => b.status === 'PATRULLA_ASIGNADA' || b.status === 'EN_REVISION' || b.status === 'REVISION_COMPLETADA').length;
  const validadas = burns.filter((b) => b.status === 'VALIDADA').length;
  const enQuema = burns.filter((b) => b.status === 'EN_QUEMA').length;
  const finalizadas = burns.filter((b) => b.status === 'FINALIZADA').length;
  const canceladas = burns.filter((b) => b.status === 'CANCELADA').length;

  const totalHa = burns.reduce((acc, b) => acc + (Number(b.area_hectares) || 0), 0).toFixed(1);
  const totalTons = burns.reduce((acc, b) => acc + (Number(b.estimated_tonnage) || 0), 0);

  const statCards = [
    {
      id: 'ALL',
      title: 'Total Quemas',
      value: total,
      sub: `${totalHa} ha | ${totalTons.toLocaleString()} TM`,
      icon: Layers,
      color: 'bg-slate-50 border-slate-200 text-slate-700',
      activeColor: 'ring-2 ring-slate-600 bg-slate-100',
    },
    {
      id: 'SOLICITADA',
      title: '1. Solicitadas',
      value: solicitadas,
      sub: 'Esperando patrulla',
      icon: Clock,
      color: 'bg-blue-50/80 border-blue-200 text-blue-800',
      activeColor: 'ring-2 ring-blue-600 bg-blue-100',
    },
    {
      id: 'EN_REVISION',
      title: '2-4. En Proceso/Revisión',
      value: enRevision,
      sub: 'Patrullas en campo',
      icon: UserPlus,
      color: 'bg-amber-50/80 border-amber-200 text-amber-800',
      activeColor: 'ring-2 ring-amber-600 bg-amber-100',
    },
    {
      id: 'VALIDADA',
      title: '5. Validadas',
      value: validadas,
      sub: 'Luz verde de digitador',
      icon: ShieldCheck,
      color: 'bg-cyan-50/80 border-cyan-200 text-cyan-800',
      activeColor: 'ring-2 ring-cyan-600 bg-cyan-100',
    },
    {
      id: 'EN_QUEMA',
      title: '6. Quema Activa',
      value: enQuema,
      sub: 'Fuego en desarrollo',
      icon: Flame,
      color: 'bg-red-50/80 border-red-200 text-red-800',
      activeColor: 'ring-2 ring-red-600 bg-red-100 animate-pulse',
    },
    {
      id: 'FINALIZADA',
      title: '7. Finalizadas',
      value: finalizadas,
      sub: 'Liquidadas con éxito',
      icon: CheckCircle2,
      color: 'bg-emerald-50/80 border-emerald-200 text-emerald-800',
      activeColor: 'ring-2 ring-emerald-600 bg-emerald-100',
    },
    {
      id: 'CANCELADA',
      title: 'Canceladas',
      value: canceladas,
      sub: 'Por clima o riesgo',
      icon: XCircle,
      color: 'bg-rose-50/80 border-rose-200 text-rose-800',
      activeColor: 'ring-2 ring-rose-600 bg-rose-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
      {statCards.map((c) => {
        const Icon = c.icon;
        const isSelected = activeFilter === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onFilterStatus && onFilterStatus(c.id)}
            className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.02] shadow-sm flex flex-col justify-between ${
              c.color
            } ${isSelected ? c.activeColor : ''}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-80 truncate">
                {c.title}
              </span>
              <Icon className="w-4 h-4 opacity-70" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black tracking-tight">{c.value}</div>
              <div className="text-[10px] opacity-75 font-medium truncate mt-0.5">{c.sub}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
