'use client';

import React, { useEffect, useState } from 'react';
import { BurnRequest, PatrolCatalog, UserProfile } from '@/lib/types';
import { Radio, Clock } from 'lucide-react';

interface PatrolAvailabilityMonitorProps {
  patrullas: PatrolCatalog[];
  solicitudes: BurnRequest[];
  currentUser?: UserProfile | null;
}

type EstadoPatrulla = 'DISPONIBLE' | 'EN_CAMINO' | 'EN_FRENTE' | 'EN_QUEMA';

const ESTILO_ESTADO: Record<EstadoPatrulla, { label: string; dot: string; text: string; borde: string }> = {
  DISPONIBLE: { label: 'Disponible', dot: 'bg-emerald-500', text: 'text-emerald-400', borde: 'border-l-emerald-600' },
  EN_CAMINO: { label: 'En Camino', dot: 'bg-amber-500', text: 'text-amber-400', borde: 'border-l-amber-600' },
  EN_FRENTE: { label: 'En Frente', dot: 'bg-orange-500', text: 'text-orange-400', borde: 'border-l-orange-600' },
  EN_QUEMA: { label: 'En Quema', dot: 'bg-rose-500', text: 'text-rose-400', borde: 'border-l-rose-600' },
};

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
      return { patrulla, tipo: 'DISPONIBLE' as EstadoPatrulla, quema: null as BurnRequest | null, elapsed: 0 };
    }
    if (quemaActiva.estado === 'EN_QUEMA') {
      return { patrulla, tipo: 'EN_QUEMA' as EstadoPatrulla, quema: quemaActiva, elapsed: minutosDesde(quemaActiva.hora_inicio_quema, now) };
    }
    if (quemaActiva.estado === 'EN_FRENTE' || quemaActiva.estado === 'EN_REVISION') {
      return {
        patrulla,
        tipo: 'EN_FRENTE' as EstadoPatrulla,
        quema: quemaActiva,
        elapsed: minutosDesde(quemaActiva.hora_llegada_frente || quemaActiva.hora_asignacion, now),
      };
    }
    return { patrulla, tipo: 'EN_CAMINO' as EstadoPatrulla, quema: quemaActiva, elapsed: minutosDesde(quemaActiva.hora_asignacion, now) };
  });

  const countDisponibles = estados.filter((e) => e.tipo === 'DISPONIBLE').length;
  const countRutaFrente = estados.filter((e) => e.tipo === 'EN_CAMINO' || e.tipo === 'EN_FRENTE').length;
  const countQuema = estados.filter((e) => e.tipo === 'EN_QUEMA').length;

  return (
    <section className="bg-[#0B121E] border border-slate-800 rounded-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-5 py-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-300">
              {esPatrulla ? 'Estado Operativo de Mi Unidad' : 'Disponibilidad de Patrullas · Tiempo Real'}
            </h2>
          </div>
        </div>

        {!esPatrulla && (
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {countDisponibles} Disponibles
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {countRutaFrente} En Ruta / Frente
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className={`w-1.5 h-1.5 rounded-full bg-rose-500 ${countQuema > 0 ? 'animate-pulse' : ''}`} />
              {countQuema} En Quema
            </span>
          </div>
        )}
      </div>

      {estados.length === 0 ? (
        <p className="text-xs text-slate-600 text-center py-8">No hay patrullas activas registradas.</p>
      ) : (
        <div className={`grid gap-2.5 p-4 ${esPatrulla ? 'grid-cols-1 max-w-md' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
          {estados.map(({ patrulla, tipo, quema, elapsed }) => {
            const s = ESTILO_ESTADO[tipo];
            return (
              <div
                key={patrulla.nombre}
                className={`bg-slate-900/50 border border-slate-800 border-l-[3px] ${s.borde} rounded-md p-3.5 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-2">
                    <h3 className="text-[13px] font-bold text-white tracking-tight">{patrulla.nombre}</h3>
                    <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide shrink-0 ${s.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${tipo === 'EN_QUEMA' ? 'animate-pulse' : ''}`} />
                      {s.label}
                    </span>
                  </div>

                  {tipo === 'DISPONIBLE' ? (
                    <div className="py-1.5 space-y-0.5">
                      <p className="text-[11px] text-slate-400">Base · Libre para despacho</p>
                    </div>
                  ) : (
                    <div className="py-1 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-slate-200">{quema?.numero_quema}</span>
                        <span className="text-[10px] bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded font-mono border border-slate-800">
                          {quema?.numero_frente}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {quema?.nombre_finca} {quema?.lote_um ? `· ${quema.lote_um}` : ''}
                      </p>
                      <div className="flex items-center justify-between text-[11px] font-semibold pt-1 border-t border-slate-800/60">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3 h-3" /> En curso
                        </span>
                        <span className={`font-mono ${s.text}`}>{elapsed} min</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 mt-2 border-t border-slate-800/60 text-[10px] text-slate-600 font-medium">
                  Unidad: {patrulla.codigo_vehiculo || 'N/A'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
