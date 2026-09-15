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

const ESTILO_ESTADO: Record<EstadoPatrulla, { label: string; badge: string; icon: React.ElementType; iconColor: string }> = {
  DISPONIBLE: { label: 'Disponible', badge: 'bg-emerald-100 text-emerald-700 border-emerald-300', icon: CheckCircle2, iconColor: 'text-emerald-600' },
  EN_CAMINO: { label: 'En Camino', badge: 'bg-amber-100 text-amber-700 border-amber-300', icon: Navigation, iconColor: 'text-amber-600' },
  EN_FRENTE: { label: 'En Frente', badge: 'bg-orange-100 text-orange-700 border-orange-300', icon: ShieldCheck, iconColor: 'text-orange-600' },
  EN_QUEMA: { label: 'En Quema', badge: 'bg-rose-100 text-rose-700 border-rose-300', icon: Flame, iconColor: 'text-rose-600' },
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
    <section className="bg-white border border-slate-200 rounded">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <Radio className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <h2 className="text-[13px] font-bold uppercase tracking-wide text-slate-800">
              {esPatrulla ? 'Estado Operativo de Mi Unidad' : 'Disponibilidad y Tiempos de Patrullas en Tiempo Real'}
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {esPatrulla ? 'Monitoreo de tu unidad y su servicio activo.' : 'Monitoreo en vivo de ocupación, quemas programadas y tiempos de respuesta.'}
            </p>
          </div>
        </div>

        {!esPatrulla && (
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {countDisponibles} Disponibles
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              {countRutaFrente} En Ruta / Revisión
            </span>
            <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {countQuema} En Quema Prog.
            </span>
          </div>
        )}
      </div>

      {estados.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-8">No hay patrullas activas registradas.</p>
      ) : (
        <div className={`grid gap-3.5 p-5 ${esPatrulla ? 'grid-cols-1 max-w-md' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
          {estados.map(({ patrulla, tipo, quema, elapsed }) => {
            const s = ESTILO_ESTADO[tipo];
            const Icon = s.icon;
            return (
              <div
                key={patrulla.nombre}
                className="bg-white border border-slate-200 rounded p-4 flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-2.5">
                    <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">Clave {patrulla.nombre}</h3>
                    <span className={`text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full border shrink-0 ${s.badge}`}>
                      {s.label}
                    </span>
                  </div>

                  {tipo === 'DISPONIBLE' ? (
                    <div className="space-y-1">
                      <p className="text-[13px] text-emerald-700 font-semibold flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5" /> Base · Libre para despacho
                      </p>
                      <p className="text-[11px] text-slate-400">Sin siniestros ni servicios asignados</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <p className="text-[13px] font-semibold flex items-center gap-1.5" style={{ color: tipo === 'EN_QUEMA' ? '#e11d48' : tipo === 'EN_FRENTE' ? '#ea580c' : '#d97706' }}>
                        <Icon className="w-3.5 h-3.5" /> {s.label}
                      </p>
                      <div className="bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5">
                        <p className="text-[12px] font-mono font-bold text-slate-800">{quema?.numero_quema}</p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {quema?.numero_frente} · {quema?.nombre_finca} {quema?.lote_um ? `· ${quema.lote_um}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> En curso
                        </span>
                        <span className="font-mono text-slate-700">{elapsed} min</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2.5 mt-2.5 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
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
