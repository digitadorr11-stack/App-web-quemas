'use client';

import React, { useEffect, useState } from 'react';
import { BurnRequest, PatrolCatalog, UserProfile } from '@/lib/types';
import { Radio, CheckCircle2, Navigation, ShieldCheck, Flame, Clock } from 'lucide-react';

interface PatrolAvailabilityMonitorProps {
  patrullas: PatrolCatalog[];
  solicitudes: BurnRequest[];
  currentUser?: UserProfile | null;
}

type EstadoPatrulla = 'DISPONIBLE' | 'EN_CAMINO' | 'EN_FRENTE' | 'EN_QUEMA';

function minutosDesde(iso: string | undefined, now: Date): number {
  if (!iso) return 0;
  return Math.max(0, Math.round((now.getTime() - new Date(iso).getTime()) / 60000));
}

export const PatrolAvailabilityMonitor: React.FC<PatrolAvailabilityMonitorProps> = ({
  patrullas,
  solicitudes,
  currentUser,
}) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const esPatrulla = currentUser?.rol === 'patrulla';

  const patrullasVisibles = esPatrulla
    ? patrullas.filter((p) => p.nombre === currentUser?.patrulla_asignada)
    : patrullas;

  const estados = patrullasVisibles.map((patrulla) => {
    const quemaActiva = solicitudes.find(
      (s) => s.nombre_patrulla_asignada === patrulla.nombre && s.estado !== 'FINALIZADA' && s.estado !== 'CANCELADA'
    );

    if (!quemaActiva) {
      return {
        patrulla,
        tipo: 'DISPONIBLE' as EstadoPatrulla,
        quema: null as BurnRequest | null,
        elapsed: 0,
        label: 'Disponible',
        badge: 'bg-emerald-950 text-emerald-300 border-emerald-800',
        card: 'border-emerald-900/60 hover:border-emerald-700',
        icon: CheckCircle2,
        iconColor: 'text-emerald-400',
      };
    }

    if (quemaActiva.estado === 'EN_QUEMA') {
      return {
        patrulla,
        tipo: 'EN_QUEMA' as EstadoPatrulla,
        quema: quemaActiva,
        elapsed: minutosDesde(quemaActiva.hora_inicio_quema, now),
        label: 'En Quema',
        badge: 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse',
        card: 'border-rose-800/80 ring-1 ring-rose-500/30 hover:border-rose-600',
        icon: Flame,
        iconColor: 'text-rose-400',
      };
    }

    if (quemaActiva.estado === 'EN_FRENTE' || quemaActiva.estado === 'EN_REVISION') {
      return {
        patrulla,
        tipo: 'EN_FRENTE' as EstadoPatrulla,
        quema: quemaActiva,
        elapsed: minutosDesde(quemaActiva.hora_llegada_frente || quemaActiva.hora_asignacion, now),
        label: quemaActiva.estado === 'EN_REVISION' ? 'En Revisión' : 'En Frente',
        badge: 'bg-orange-950 text-orange-300 border-orange-800',
        card: 'border-orange-900/60 hover:border-orange-700',
        icon: ShieldCheck,
        iconColor: 'text-orange-400',
      };
    }

    // PATRULLA_ASIGNADA
    return {
      patrulla,
      tipo: 'EN_CAMINO' as EstadoPatrulla,
      quema: quemaActiva,
      elapsed: minutosDesde(quemaActiva.hora_asignacion, now),
      label: 'En Camino',
      badge: 'bg-amber-950 text-amber-300 border-amber-800',
      card: 'border-amber-900/60 hover:border-amber-700',
      icon: Navigation,
      iconColor: 'text-amber-400',
    };
  });

  const countDisponibles = estados.filter((e) => e.tipo === 'DISPONIBLE').length;
  const countRutaFrente = estados.filter((e) => e.tipo === 'EN_CAMINO' || e.tipo === 'EN_FRENTE').length;
  const countQuema = estados.filter((e) => e.tipo === 'EN_QUEMA').length;

  return (
    <section className="bg-[#0B121E] border border-slate-800 rounded-3xl p-5 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h2 className="text-xs font-black uppercase tracking-wider text-white">
              {esPatrulla ? 'Estado Operativo de Mi Unidad' : 'Disponibilidad de Patrullas en Tiempo Real'}
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {esPatrulla
              ? 'Monitoreo de tu unidad y cronómetro de servicio activo.'
              : 'Monitoreo en vivo de ocupación, quemas asignadas y tiempos de respuesta.'}
          </p>
        </div>

        {!esPatrulla && (
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="px-2.5 py-1 bg-emerald-950/60 text-emerald-300 border border-emerald-800 rounded-xl flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {countDisponibles} Disponibles
            </span>
            <span className="px-2.5 py-1 bg-amber-950/60 text-amber-300 border border-amber-800 rounded-xl flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              {countRutaFrente} En Ruta / Frente
            </span>
            <span className="px-2.5 py-1 bg-rose-950/60 text-rose-300 border border-rose-800 rounded-xl flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full bg-rose-400 ${countQuema > 0 ? 'animate-pulse' : ''}`} />
              {countQuema} En Quema
            </span>
          </div>
        )}
      </div>

      {estados.length === 0 ? (
        <p className="text-xs text-slate-600 text-center py-8">No hay patrullas activas registradas.</p>
      ) : (
        <div className={`grid gap-3.5 ${esPatrulla ? 'grid-cols-1 max-w-md' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
          {estados.map(({ patrulla, tipo, quema, elapsed, label, badge, card, icon: Icon, iconColor }) => (
            <div
              key={patrulla.nombre}
              className={`bg-slate-900/60 p-4 rounded-2xl border transition-all shadow-sm flex flex-col justify-between ${card}`}
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
                    <h3 className="text-sm font-black text-white tracking-tight">{patrulla.nombre}</h3>
                  </div>
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-lg border shrink-0 ${badge}`}>
                    {label}
                  </span>
                </div>

                {tipo === 'DISPONIBLE' ? (
                  <div className="py-2 space-y-1">
                    <p className="text-xs text-emerald-400 font-semibold">Base · Libre para despacho</p>
                    <p className="text-[10px] text-slate-500">Sin quemas activas asignadas</p>
                  </div>
                ) : (
                  <div className="py-1.5 space-y-1.5 text-xs">
                    <div className="p-2 rounded-xl border border-slate-800 bg-slate-950/60 space-y-0.5">
                      <div className="font-bold text-white text-xs flex items-center justify-between">
                        <span className="font-mono">{quema?.numero_quema}</span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                          {quema?.numero_frente}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {quema?.nombre_finca} {quema?.lote_um ? `· ${quema.lote_um}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 px-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        Tiempo en curso:
                      </span>
                      <span className={`font-mono ${tipo === 'EN_QUEMA' ? 'text-rose-400' : 'text-amber-400'}`}>
                        {elapsed} min
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span>Unidad: {patrulla.codigo_vehiculo || 'N/A'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
