'use client';

import React, { useEffect, useState } from 'react';
import { BurnRequest, PatrolCatalog, UserProfile } from '@/lib/types';
import { Radio, CheckCircle2, Navigation, ShieldCheck, Flame, Clock, Truck } from 'lucide-react';

interface PatrolAvailabilityMonitorProps {
  patrullas: PatrolCatalog[];
  solicitudes: BurnRequest[];
  currentUser?: UserProfile | null;
}

type EstadoPatrulla = 'DISPONIBLE' | 'EN_CAMINO' | 'EN_FRENTE' | 'EN_QUEMA';

const ESTILO_ESTADO: Record<EstadoPatrulla, { label: string; badge: string; icon: React.ElementType; iconColor: string }> = {
  DISPONIBLE: { label: 'Disponible', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold', icon: CheckCircle2, iconColor: 'text-emerald-600' },
  EN_CAMINO: { label: 'En Camino', badge: 'bg-amber-100 text-amber-800 border-amber-300 font-bold', icon: Navigation, iconColor: 'text-amber-600' },
  EN_FRENTE: { label: 'En Frente', badge: 'bg-orange-100 text-orange-800 border-orange-300 font-bold', icon: ShieldCheck, iconColor: 'text-orange-600' },
  EN_QUEMA: { label: 'En Quema', badge: 'bg-rose-100 text-rose-800 border-rose-300 font-black animate-pulse', icon: Flame, iconColor: 'text-rose-600' },
};

function minutosDesde(iso: string | undefined, now: Date): number {
  if (!iso) return 0;
  return Math.max(0, Math.round((now.getTime() - new Date(iso).getTime()) / 60000));
}

function limpiarNombreClave(nombre: string): string {
  if (!nombre) return '';
  return nombre.toLowerCase().startsWith('clave') ? nombre : `Clave ${nombre}`;
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
    <section className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
      {/* Encabezado con chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <span>{esPatrulla ? 'Estado Operativo de Mi Unidad' : 'Disponibilidad y Tiempos de Patrullas en Tiempo Real'}</span>
            </h2>
            <p className="text-[11px] text-slate-500">
              {esPatrulla ? 'Monitoreo de tu unidad y su servicio activo.' : 'Monitoreo en vivo de ocupación, desplazamientos y tiempos de respuesta.'}
            </p>
          </div>
        </div>

        {!esPatrulla && (
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {countDisponibles} Disponibles
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {countRutaFrente} En Ruta / Revisión
            </span>
            <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              {countQuema} En Quema Prog.
            </span>
          </div>
        )}
      </div>

      {estados.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-8">No hay patrullas activas registradas.</p>
      ) : (
        <div className={`grid gap-3 p-4 sm:p-5 ${esPatrulla ? 'grid-cols-1 max-w-md' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
          {estados.map(({ patrulla, tipo, quema, elapsed }) => {
            const s = ESTILO_ESTADO[tipo];
            const Icon = s.icon;
            return (
              <div
                key={patrulla.nombre}
                className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex flex-col justify-between hover:border-emerald-300 hover:shadow-sm transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-2">
                    <h3 className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{limpiarNombreClave(patrulla.nombre)}</span>
                    </h3>
                    <span className={`text-[9px] uppercase tracking-wide px-2 py-0.5 rounded-full border shrink-0 ${s.badge}`}>
                      {s.label}
                    </span>
                  </div>

                  {tipo === 'DISPONIBLE' ? (
                    <div className="py-1.5 space-y-0.5">
                      <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-emerald-600" /> Base · Libre para despacho
                      </p>
                      <p className="text-[10.5px] text-slate-400">Sin siniestros ni servicios asignados</p>
                    </div>
                  ) : (
                    <div className="py-1 space-y-1.5">
                      <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                          <span className="font-mono">{quema?.numero_quema}</span>
                          <span className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                            {quema?.numero_frente}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-600 truncate mt-0.5">
                          📍 {quema?.nombre_finca} {quema?.lote_um ? `· ${quema.lote_um}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-[10.5px] font-semibold text-slate-500 px-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> En curso:
                        </span>
                        <span className={`font-mono font-bold ${tipo === 'EN_QUEMA' ? 'text-rose-600' : 'text-amber-700'}`}>
                          {elapsed} min
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-400 font-medium">
                  <span>{patrulla.codigo_vehiculo ? `Unidad: ${patrulla.codigo_vehiculo}` : 'Unidad móvil'}</span>
                  <span>Canal Radio</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
