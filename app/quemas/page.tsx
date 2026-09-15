'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/authService';
import { quemasService } from '@/lib/quemasService';
import { supabase } from '@/lib/supabaseClient';
import {
  BurnRequest,
  PatrolCatalog,
  UserProfile,
  BurnStatus,
  ESTADOS_CONFIG,
  PRIORIDADES_CONFIG,
  MOTIVOS_CANCELACION_ESTANDAR,
} from '@/lib/types';
import {
  Flame,
  ArrowLeft,
  Truck,
  Clock,
  MapPin,
  Layers,
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Ban,
  User,
  Timer,
} from 'lucide-react';

const ROLES_PERMITIDOS = ['supervisor_quemas', 'digitador', 'admin', 'jefatura', 'supervisor_frente'];
const ROLES_DESPACHO = ['supervisor_quemas', 'digitador', 'admin'];
const ROLES_CANCELACION = ['supervisor_frente', 'supervisor_quemas', 'digitador', 'admin'];

function minutosDesde(iso?: string): number {
  if (!iso) return 0;
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
}

function formatearMinutos(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

function formatearHora(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });
}

const COLUMNAS: { estados: BurnStatus[]; titulo: string }[] = [
  { estados: ['SOLICITADA'], titulo: 'Pendientes de Despacho' },
  { estados: ['PATRULLA_ASIGNADA'], titulo: 'En Camino' },
  { estados: ['EN_FRENTE', 'EN_REVISION'], titulo: 'En Frente / Revisión' },
  { estados: ['EN_QUEMA'], titulo: 'En Quema' },
  { estados: ['FINALIZADA'], titulo: 'Finalizadas Hoy' },
];

export default function TableroDespachoPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [solicitudes, setSolicitudes] = useState<BurnRequest[]>([]);
  const [patrullas, setPatrullas] = useState<PatrolCatalog[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, setTick] = useState(0);

  // Modal de despacho
  const [dispatchTarget, setDispatchTarget] = useState<BurnRequest | null>(null);
  const [selectedPatrulla, setSelectedPatrulla] = useState('');
  const [selectedLider, setSelectedLider] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);

  // Modal de cancelación
  const [cancelTarget, setCancelTarget] = useState<BurnRequest | null>(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadSolicitudes = async () => {
    try {
      const data = await quemasService.listarSolicitudes();
      setSolicitudes(data);
    } catch (err) {
      console.error('Error cargando solicitudes:', err);
    }
  };

  const loadPatrullas = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('catalogo_patrullas').select('*').eq('activo', true).order('nombre');
    setPatrullas((data || []) as PatrolCatalog[]);
  };

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const user = await authService.getCurrentUserProfile();
        if (!user || !user.activo) {
          router.push('/login');
          return;
        }
        if (!ROLES_PERMITIDOS.includes(user.rol)) {
          router.push('/');
          return;
        }
        setCurrentUser(user);
        await Promise.all([loadSolicitudes(), loadPatrullas()]);
      } catch (err) {
        console.error('Error inicializando tablero:', err);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    init();

    if (supabase) {
      const channelSolicitudes = supabase
        .channel('realtime_solicitudes_quemas')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'solicitudes_quemas' }, () => loadSolicitudes())
        .subscribe();

      const channelPatrullas = supabase
        .channel('realtime_catalogo_patrullas_tablero')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'catalogo_patrullas' }, () => loadPatrullas())
        .subscribe();

      return () => {
        supabase?.removeChannel(channelSolicitudes);
        supabase?.removeChannel(channelPatrullas);
      };
    }
  }, [router]);

  // Reloj para indicadores de tiempo en vivo
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const gruposPorEstado = useMemo(() => {
    const activas = solicitudes.filter((s) => s.estado !== 'CANCELADA');
    const map: Record<string, BurnRequest[]> = {};
    for (const col of COLUMNAS) {
      map[col.titulo] = activas.filter((s) => col.estados.includes(s.estado));
    }
    return map;
  }, [solicitudes]);

  const canceladas = useMemo(() => solicitudes.filter((s) => s.estado === 'CANCELADA').slice(0, 10), [solicitudes]);

  const patrullasDisponibles = useMemo(() => patrullas.filter((p) => p.estado === 'DISPONIBLE' && p.activo), [patrullas]);

  const puedeDespachar = currentUser ? ROLES_DESPACHO.includes(currentUser.rol) : false;
  const puedeCancelar = currentUser ? ROLES_CANCELACION.includes(currentUser.rol) : false;

  const abrirDespacho = (solicitud: BurnRequest) => {
    setErrorMessage(null);
    setSelectedPatrulla('');
    setSelectedLider('');
    setDispatchTarget(solicitud);
  };

  const confirmarDespacho = async () => {
    if (!dispatchTarget || !selectedPatrulla) return;
    try {
      setIsDispatching(true);
      await quemasService.despacharPatrulla(dispatchTarget.id, selectedPatrulla, selectedLider.trim() || null);
      showToast(`Patrulla ${selectedPatrulla} despachada a ${dispatchTarget.numero_quema}`);
      setDispatchTarget(null);
      loadSolicitudes();
      loadPatrullas();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al despachar la patrulla');
    } finally {
      setIsDispatching(false);
    }
  };

  const abrirCancelacion = (solicitud: BurnRequest) => {
    setErrorMessage(null);
    setMotivoCancelacion('');
    setCancelTarget(solicitud);
  };

  const confirmarCancelacion = async () => {
    if (!cancelTarget || !motivoCancelacion) return;
    try {
      setIsCancelling(true);
      await quemasService.cancelarSolicitud(cancelTarget.id, motivoCancelacion);
      showToast(`Solicitud ${cancelTarget.numero_quema} cancelada`);
      setCancelTarget(null);
      loadSolicitudes();
      loadPatrullas();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al cancelar la solicitud');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f6f4] flex flex-col items-center justify-center text-slate-500">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide">Cargando tablero operativo...</p>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#f4f6f4] text-slate-900 font-sans pb-16">
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#165135] text-white px-4 py-3 rounded-xl shadow-panel flex items-center gap-2 text-sm font-semibold max-w-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center gap-3 sticky top-0 z-30 shadow-card">
        <Link
          href="/"
          className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 shadow-card"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-card">
          <Truck className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-tight">Tablero de Despacho y Monitoreo</h1>
          <p className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
            {solicitudes.filter((s) => !['FINALIZADA', 'CANCELADA'].includes(s.estado)).length} solicitudes activas
          </p>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {COLUMNAS.map((col) => {
            const items = gruposPorEstado[col.titulo] || [];
            return (
              <div key={col.titulo} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col min-h-[200px] shadow-card">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">{col.titulo}</h3>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 rounded-full px-2 py-0.5 font-mono">
                    {items.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {items.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-8">Sin solicitudes</p>
                  )}
                  {items.map((s) => {
                    const estadoInfo = ESTADOS_CONFIG[s.estado];
                    const prioridadInfo = PRIORIDADES_CONFIG[s.prioridad];
                    const tiempoRespuesta = s.hora_asignacion
                      ? Math.round((new Date(s.hora_asignacion).getTime() - new Date(s.hora_solicitud).getTime()) / 60000)
                      : minutosDesde(s.hora_solicitud);
                    const colorTiempo = s.hora_asignacion
                      ? 'text-emerald-400'
                      : tiempoRespuesta < 15
                      ? 'text-emerald-400'
                      : tiempoRespuesta < 30
                      ? 'text-amber-400'
                      : 'text-rose-400';

                    return (
                      <div
                        key={s.id}
                        className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2.5 shadow-card hover:shadow-card-hover hover:border-emerald-300 transition"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-bold text-slate-900 font-mono">{s.numero_quema}</p>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Layers className="w-3 h-3" /> {s.numero_frente}
                            </p>
                          </div>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border shrink-0 ${prioridadInfo.badgeColor}`}>
                            {prioridadInfo.label}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                          <span className="truncate">{s.nombre_finca} · {s.lote_um}</span>
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Plan: {formatearHora(s.hora_planificada)}
                          </span>
                          <span className={`flex items-center gap-1 font-bold ${colorTiempo}`}>
                            <Timer className="w-3 h-3" /> {formatearMinutos(tiempoRespuesta)}
                          </span>
                        </div>

                        {s.nombre_patrulla_asignada && (
                          <p className="text-[11px] text-orange-700 font-semibold flex items-center gap-1">
                            <Truck className="w-3 h-3" /> {s.nombre_patrulla_asignada}
                            {s.lider_patrulla ? ` · ${s.lider_patrulla}` : ''}
                          </p>
                        )}

                        {s.motivo_espera && s.estado !== 'FINALIZADA' && (
                          <p className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
                            En espera: {s.motivo_espera}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-1">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${estadoInfo.badgeColor}`}>
                            {estadoInfo.label}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {s.estado === 'SOLICITADA' && puedeDespachar && (
                              <button
                                onClick={() => abrirDespacho(s)}
                                className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                              >
                                Despachar
                              </button>
                            )}
                            {puedeCancelar && !['FINALIZADA', 'CANCELADA'].includes(s.estado) && (
                              <button
                                onClick={() => abrirCancelacion(s)}
                                className="text-[10px] font-bold p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition"
                                title="Cancelar solicitud"
                              >
                                <Ban className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {canceladas.length > 0 && (
          <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Canceladas Recientes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {canceladas.map((s) => (
                <div key={s.id} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[11px] text-slate-500">
                  <p className="font-mono font-bold text-slate-600">{s.numero_quema}</p>
                  <p className="truncate">{s.nombre_finca} · {s.lote_um}</p>
                  <p className="text-rose-600/80 truncate">{s.motivo_cancelacion}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal Despacho */}
      {dispatchTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Despachar Patrulla</h3>
              <button onClick={() => setDispatchTarget(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
              <p className="font-mono font-bold text-slate-900">{dispatchTarget.numero_quema}</p>
              <p>{dispatchTarget.nombre_finca} · {dispatchTarget.lote_um} · {dispatchTarget.numero_frente}</p>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3 text-xs flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {errorMessage}
              </div>
            )}

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700">Patrulla Disponible</span>
              <select
                value={selectedPatrulla}
                onChange={(e) => setSelectedPatrulla(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="">Seleccione una patrulla...</option>
                {patrullasDisponibles.map((p) => (
                  <option key={p.nombre} value={p.nombre}>
                    {p.nombre} {p.codigo_vehiculo ? `(${p.codigo_vehiculo})` : ''}
                  </option>
                ))}
              </select>
              {patrullasDisponibles.length === 0 && (
                <p className="text-[11px] text-amber-700 font-medium">No hay patrullas disponibles en este momento.</p>
              )}
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700">Líder de Patrulla (opcional)</span>
              <input
                type="text"
                value={selectedLider}
                onChange={(e) => setSelectedLider(e.target.value)}
                placeholder="Nombre del encargado"
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={confirmarDespacho}
              disabled={!selectedPatrulla || isDispatching}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm py-3.5 rounded-xl transition shadow-card"
            >
              {isDispatching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
              Confirmar Despacho
            </button>
          </div>
        </div>
      )}

      {/* Modal Cancelación */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-rose-700">Cancelar Solicitud</h3>
              <button onClick={() => setCancelTarget(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
              <p className="font-mono font-bold text-slate-900">{cancelTarget.numero_quema}</p>
              <p>{cancelTarget.nombre_finca} · {cancelTarget.lote_um}</p>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3 text-xs flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {errorMessage}
              </div>
            )}

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700">Motivo de Cancelación</span>
              <select
                value={motivoCancelacion}
                onChange={(e) => setMotivoCancelacion(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-rose-500"
              >
                <option value="">Seleccione un motivo...</option>
                {MOTIVOS_CANCELACION_ESTANDAR.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={confirmarCancelacion}
              disabled={!motivoCancelacion || isCancelling}
              className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-sm py-3.5 rounded-xl transition shadow-card"
            >
              {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
              Confirmar Cancelación
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
