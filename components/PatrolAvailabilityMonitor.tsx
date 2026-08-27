'use client';

import React, { useState, useEffect } from 'react';
import { BurnRequest, Patrol, UserProfile } from '@/lib/types';
import { Shield, Clock, Flame, CheckCircle, Navigation, Radio, ShieldAlert } from 'lucide-react';
import { differenceInMinutes, parseISO } from 'date-fns';

interface PatrolAvailabilityMonitorProps {
  patrols: Patrol[];
  burns: BurnRequest[];
  currentUser?: UserProfile | null;
}

export const PatrolAvailabilityMonitor: React.FC<PatrolAvailabilityMonitorProps> = ({
  patrols,
  burns,
  currentUser,
}) => {
  // Live clock tick to recalculate elapsed minutes every 30 seconds
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const isPatrullaRole = currentUser?.role === 'patrulla';

  // Filter patrols: if user is patrulla, ONLY show their own patrol
  const visiblePatrols = isPatrullaRole
    ? patrols.filter(
        (p) =>
          p.id === currentUser?.assigned_patrol_id ||
          p.name === currentUser?.assigned_patrol_name ||
          (currentUser?.assigned_patrol_name && p.name.includes(currentUser.assigned_patrol_name))
      )
    : patrols;

  // Compute live patrol status based on active burns
  const patrolStates = (visiblePatrols.length > 0 ? visiblePatrols : (isPatrullaRole ? [patrols[0]].filter(Boolean) : patrols)).map((patrol) => {
    // Find any non-finished burn assigned to this patrol
    const activeBurn = burns.find(
      (b) =>
        (b.assigned_patrol_id === patrol.id || b.assigned_patrol_name?.includes(patrol.name)) &&
        b.status !== 'FINALIZADA' &&
        b.status !== 'CANCELADA'
    );

    if (!activeBurn) {
      return {
        patrol,
        statusType: 'DISPONIBLE' as const,
        activeBurn: null,
        isCriminal: false,
        elapsedMinutes: 0,
        statusLabel: 'Disponible',
        colorBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        cardBorder: 'border-emerald-200 bg-emerald-50/30 hover:border-emerald-400',
        icon: CheckCircle,
        iconColor: 'text-emerald-600',
      };
    }

    const isCriminal = activeBurn.burn_type === 'CRIMINAL';

    if (isCriminal) {
      const startTime = activeBurn.burn_started_at ? parseISO(activeBurn.burn_started_at) : now;
      const elapsed = Math.max(0, differenceInMinutes(now, startTime));
      return {
        patrol,
        statusType: 'QUEMA_CRIMINAL' as const,
        activeBurn,
        isCriminal: true,
        elapsedMinutes: elapsed,
        statusLabel: '🚨 Quema Criminal',
        colorBadge: 'bg-red-600 text-white border-red-700 font-black animate-pulse shadow-sm',
        cardBorder: 'border-red-500 bg-red-50/90 hover:border-red-600 ring-2 ring-red-500/40 shadow-md',
        icon: ShieldAlert,
        iconColor: 'text-red-600',
      };
    }

    if (activeBurn.status === 'EN_QUEMA') {
      const startTime = activeBurn.burn_started_at ? parseISO(activeBurn.burn_started_at) : now;
      const elapsed = Math.max(0, differenceInMinutes(now, startTime));
      return {
        patrol,
        statusType: 'EN_QUEMA' as const,
        activeBurn,
        isCriminal: false,
        elapsedMinutes: elapsed,
        statusLabel: 'En Quema Activa',
        colorBadge: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
        cardBorder: 'border-rose-300 bg-rose-50/40 hover:border-rose-400 ring-1 ring-rose-300',
        icon: Flame,
        iconColor: 'text-rose-600',
      };
    }

    if (activeBurn.status === 'PATRULLA_ASIGNADA') {
      const assignedTime = activeBurn.patrol_assigned_at ? parseISO(activeBurn.patrol_assigned_at) : now;
      const elapsed = Math.max(0, differenceInMinutes(now, assignedTime));
      return {
        patrol,
        statusType: 'EN_TRASLADO' as const,
        activeBurn,
        isCriminal: false,
        elapsedMinutes: elapsed,
        statusLabel: 'En Traslado',
        colorBadge: 'bg-amber-100 text-amber-800 border-amber-300',
        cardBorder: 'border-amber-200 bg-amber-50/40 hover:border-amber-400',
        icon: Navigation,
        iconColor: 'text-amber-600',
      };
    }

    // EN_REVISION, REVISION_COMPLETADA, VALIDADA
    const arrivedTime = activeBurn.patrol_arrived_at ? parseISO(activeBurn.patrol_arrived_at) : now;
    const elapsed = Math.max(0, differenceInMinutes(now, arrivedTime));
    return {
      patrol,
      statusType: 'EN_INSPECCION' as const,
      activeBurn,
      isCriminal: false,
      elapsedMinutes: elapsed,
      statusLabel: 'En Inspección',
      colorBadge: 'bg-orange-100 text-orange-800 border-orange-300',
      cardBorder: 'border-orange-200 bg-orange-50/40 hover:border-orange-400',
      icon: Shield,
      iconColor: 'text-orange-600',
    };
  });

  const countDisponibles = patrolStates.filter((p) => p.statusType === 'DISPONIBLE').length;
  const countCriminal = patrolStates.filter((p) => p.statusType === 'QUEMA_CRIMINAL').length;
  const countTraslado = patrolStates.filter((p) => p.statusType === 'EN_TRASLADO' || p.statusType === 'EN_INSPECCION').length;
  const countQuema = patrolStates.filter((p) => p.statusType === 'EN_QUEMA').length;

  return (
    <section className="mb-8 bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
      
      {/* Header with KPI Chips */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
              {isPatrullaRole
                ? `Estado Operativo de Mi Unidad (${currentUser?.assigned_patrol_name || 'Mi Patrulla'})`
                : 'Disponibilidad y Tiempos de Patrullas en Tiempo Real'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isPatrullaRole
              ? 'Monitoreo exclusivo de tu unidad, cronómetros de servicio y asignación activa.'
              : 'Monitoreo en vivo de ocupación, quemas programadas, quemas criminales y tiempos de respuesta.'}
          </p>
        </div>

        {/* Counters shown only for Global views */}
        {!isPatrullaRole && (
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {countDisponibles} Disponibles
            </span>
            {countCriminal > 0 && (
              <span className="px-2.5 py-1 bg-red-600 text-white border border-red-700 rounded-xl flex items-center gap-1.5 font-black animate-pulse shadow-sm">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
                {countCriminal} En Quema Criminal
              </span>
            )}
            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {countTraslado} En Ruta / Revisión
            </span>
            <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              {countQuema} En Quema Prog.
            </span>
          </div>
        )}
      </div>

      {/* Grid of Patrol Cards with Real-time Timers */}
      <div className={`grid gap-3.5 ${isPatrullaRole ? 'grid-cols-1 max-w-md' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
        {patrolStates.map(({ patrol, statusType, activeBurn, isCriminal, elapsedMinutes, statusLabel, colorBadge, cardBorder, icon: Icon, iconColor }) => {
          return (
            <div
              key={patrol.id}
              className={`p-4 rounded-2xl border transition-all duration-200 shadow-sm flex flex-col justify-between ${cardBorder}`}
            >
              <div>
                {/* Top Row: Name & Status Badge */}
                <div className="flex items-start justify-between gap-1 mb-2">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-1">
                      {patrol.name}
                    </h3>
                    <div className="text-[11px] text-slate-500 font-medium truncate max-w-[140px]" title={patrol.leader_name}>
                      👤 {patrol.leader_name.split(' / ')[0]}
                    </div>
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-lg border shrink-0 ${colorBadge}`}>
                    {statusLabel}
                  </span>
                </div>

                {/* Status Details / Live Timers */}
                {statusType === 'DISPONIBLE' ? (
                  <div className="py-2 space-y-1">
                    <div className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Base • Libre para despacho</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Sin siniestros ni servicios asignados
                    </div>
                  </div>
                ) : (
                  <div className="py-1.5 space-y-1.5 text-xs">
                    {/* Quema & Location info */}
                    <div className={`p-2 rounded-xl border space-y-0.5 ${isCriminal ? 'bg-red-100/80 border-red-300' : 'bg-white/80 border-slate-200/80'}`}>
                      <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                        <span className={isCriminal ? 'text-red-900 font-black flex items-center gap-1' : ''}>
                          {isCriminal && <Flame className="w-3 h-3 text-red-600" />}
                          {activeBurn?.burn_number} {isCriminal ? '(Criminal)' : ''}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                          {activeBurn?.front_number}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 truncate">
                        📍 {activeBurn?.farm_name} {activeBurn?.lote_um ? `• ${activeBurn?.lote_um}` : ''}
                      </div>
                    </div>

                    {/* Live Timer */}
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 px-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {isCriminal ? 'Tiempo en combate:' : 'Tiempo en curso:'}
                      </span>
                      <span className={`font-mono ${isCriminal ? 'text-red-700 font-black text-xs' : statusType === 'EN_QUEMA' ? 'text-rose-700 font-black' : 'text-amber-800'}`}>
                        {elapsedMinutes} min
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom footer: Vehicle / Unit code */}
              <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span>Unidad: {patrol.vehicle_code || 'N/A'}</span>
                <span>{patrol.phone || 'Radio'}</span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
