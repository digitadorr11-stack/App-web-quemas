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
  Prioridad,
  MOTIVOS_CANCELACION_ESTANDAR,
} from '@/lib/types';
import { PatrolAvailabilityMonitor } from '@/components/PatrolAvailabilityMonitor';
import { Sidebar } from '@/components/Sidebar';
import {
  Menu,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Ban,
  Clock,
  Timer,
  MapPin,
  Layers,
  Truck,
  LayoutGrid,
  List,
  FileSpreadsheet,
  FileText,
  FilePlus2,
  X,
  Info,
} from 'lucide-react';

const ROLES_CREAR_SOLICITUD = ['supervisor_frente', 'supervisor_quemas', 'digitador', 'admin'];
const ROLES_DESPACHO = ['supervisor_quemas', 'digitador', 'admin'];
const ROLES_CANCELACION = ['supervisor_frente', 'supervisor_quemas', 'digitador', 'admin'];

const ESTADO_ESTILO: Record<BurnStatus, { label: string; badge: string }> = {
  SOLICITADA: { label: 'Solicitada', badge: 'bg-slate-100 text-slate-600 border-slate-300' },
  PATRULLA_ASIGNADA: { label: 'En Camino', badge: 'bg-amber-100 text-amber-700 border-amber-300' },
  EN_FRENTE: { label: 'En Frente', badge: 'bg-orange-100 text-orange-700 border-orange-300' },
  EN_REVISION: { label: 'En Revisión', badge: 'bg-orange-100 text-orange-700 border-orange-300' },
  EN_QUEMA: { label: 'En Quema', badge: 'bg-rose-100 text-rose-700 border-rose-300' },
  FINALIZADA: { label: 'Finalizada', badge: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  CANCELADA: { label: 'Cancelada', badge: 'bg-slate-100 text-slate-400 border-slate-200' },
};

const PRIORIDAD_ESTILO: Record<Prioridad, { label: string; text: string; bg: string }> = {
  NORMAL: { label: 'Normal', text: 'text-slate-600', bg: 'bg-slate-100 border-slate-300' },
  ALTA: { label: 'Alta', text: 'text-amber-700', bg: 'bg-amber-100 border-amber-300' },
  URGENTE: { label: 'Urgente', text: 'text-rose-700', bg: 'bg-rose-100 border-rose-300' },
};

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

function esHoy(iso?: string): boolean {
  if (!iso) return false;
  return new Date(iso).toDateString() === new Date().toDateString();
}

function EstadoTag({ estado }: { estado: BurnStatus }) {
  const s = ESTADO_ESTILO[estado];
  return <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${s.badge}`}>{s.label}</span>;
}

export default function HomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [solicitudes, setSolicitudes] = useState<BurnRequest[]>([]);
  const [patrullas, setPatrullas] = useState<PatrolCatalog[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, setTick] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [mostrarFinalizadas, setMostrarFinalizadas] = useState(false);
  const [vista, setVista] = useState<'grid' | 'tabla'>('grid');

  const [dispatchTarget, setDispatchTarget] = useState<BurnRequest | null>(null);
  const [selectedPatrulla, setSelectedPatrulla] = useState('');
  const [selectedLider, setSelectedLider] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);

  const [cancelTarget, setCancelTarget] = useState<BurnRequest | null>(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const [detailTarget, setDetailTarget] = useState<BurnRequest | null>(null);

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
    const loadSession = async () => {
      try {
        setIsLoading(true);
        const user = await authService.getCurrentUserProfile();
        if (!user || !user.activo) {
          router.push('/login');
          return;
        }
        setCurrentUser(user);
        await Promise.all([loadSolicitudes(), loadPatrullas()]);
      } catch (err) {
        console.error('Error cargando sesión:', err);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }

    if (supabase) {
      const channelSolicitudes = supabase
        .channel('realtime_solicitudes_quemas_dashboard')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'solicitudes_quemas' }, () => loadSolicitudes())
        .subscribe();

      const channelPatrullas = supabase
        .channel('realtime_catalogo_patrullas_dashboard')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'catalogo_patrullas' }, () => loadPatrullas())
        .subscribe();

      return () => {
        supabase?.removeChannel(channelSolicitudes);
        supabase?.removeChannel(channelPatrullas);
      };
    }
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  const finalizadasHoy = useMemo(
    () => solicitudes.filter((s) => s.estado === 'FINALIZADA' && esHoy(s.hora_fin_quema || s.updated_at)),
    [solicitudes]
  );

  const puedeCrear = currentUser ? ROLES_CREAR_SOLICITUD.includes(currentUser.rol) : false;
  const puedeDespachar = currentUser ? ROLES_DESPACHO.includes(currentUser.rol) : false;
  const puedeCancelar = currentUser ? ROLES_CANCELACION.includes(currentUser.rol) : false;

  const patrullasDisponibles = useMemo(() => patrullas.filter((p) => p.estado === 'DISPONIBLE' && p.activo), [patrullas]);

  const listaFiltrada = useMemo(() => {
    if (mostrarFinalizadas) return finalizadasHoy;
    return solicitudes.filter((s) => s.estado !== 'FINALIZADA' && s.estado !== 'CANCELADA');
  }, [solicitudes, mostrarFinalizadas, finalizadasHoy]);

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

  const exportarExcel = () => {
    if (listaFiltrada.length === 0) return;
    const header = 'Quema,Frente,Finca,Lote,Area_Ha,Area_Mz,Hora_Planificada,Patrulla,Estado,Prioridad\n';
    const rows = listaFiltrada
      .map(
        (s) =>
          `"${s.numero_quema}","${s.numero_frente}","${s.nombre_finca}","${s.lote_um}",${s.area_hectareas},${s.area_manzanas},"${formatearHora(
            s.hora_planificada
          )}","${s.nombre_patrulla_asignada || ''}","${ESTADO_ESTILO[s.estado].label}","${PRIORIDAD_ESTILO[s.prioridad].label}"`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `quemas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportarPDF = () => {
    if (typeof window !== 'undefined') window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center text-slate-500">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide">Cargando plataforma operativa...</p>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-700 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2 text-sm font-semibold max-w-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Sidebar currentUser={currentUser} open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />

      <div className={`transition-[padding] duration-200 ${sidebarOpen ? 'lg:pl-72' : 'lg:pl-0'}`}>
        {/* Banner superior */}
        <div className="bg-[#064e3b] px-5 sm:px-8 py-5 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="w-9 h-9 rounded-lg bg-emerald-900/40 hover:bg-emerald-900/70 border border-emerald-700/40 flex items-center justify-center text-emerald-200 transition shrink-0"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-300">Módulo Activo</p>
            <h1 className="text-lg font-bold text-white leading-tight">Quemas Programadas</h1>
            <p className="text-[12px] text-emerald-200/80 mt-0.5 hidden sm:block">
              Registro y control de quemas programadas, despacho de patrullas y bitácora en tiempo real.
            </p>
          </div>
        </div>

        <main className="max-w-[1600px] w-full mx-auto p-4 sm:p-6 space-y-5">
          {/* Acciones rápidas */}
          <div className="flex flex-wrap items-center justify-end gap-2">
            {puedeCrear && (
              <Link
                href="/quemas/nueva"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm transition"
              >
                <FilePlus2 className="w-4 h-4" />
                Nueva Solicitud de Quema
              </Link>
            )}
            <button
              onClick={() => setMostrarFinalizadas((v) => !v)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border text-xs font-bold transition ${
                mostrarFinalizadas
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-white border-slate-200 text-emerald-700 hover:border-emerald-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Finalizadas ({finalizadasHoy.length})
            </button>
            <button
              onClick={exportarExcel}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={exportarPDF}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold transition"
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>
          </div>

          {/* Monitor de patrullas */}
          <PatrolAvailabilityMonitor patrullas={patrullas} solicitudes={solicitudes} currentUser={currentUser} />

          {/* Barra de herramientas */}
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wide">
              {listaFiltrada.length} solicitud{listaFiltrada.length === 1 ? '' : 'es'} {mostrarFinalizadas ? 'finalizadas hoy' : 'activas'}
            </p>
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setVista('grid')}
                className={`p-1.5 rounded transition ${vista === 'grid' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setVista('tabla')}
                className={`p-1.5 rounded transition ${vista === 'tabla' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Listado */}
          {listaFiltrada.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center shadow-sm">
              <p className="text-sm text-slate-400">No hay solicitudes que coincidan con este filtro.</p>
            </div>
          ) : vista === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {listaFiltrada.map((s) => {
                const prioridadInfo = PRIORIDAD_ESTILO[s.prioridad];
                const tiempoTranscurrido = s.hora_asignacion ? minutosDesde(s.hora_asignacion) : minutosDesde(s.hora_solicitud);
                const colorTiempo = tiempoTranscurrido < 15 ? 'text-emerald-600' : tiempoTranscurrido < 30 ? 'text-amber-600' : 'text-rose-600';

                return (
                  <div
                    key={s.id}
                    className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 hover:border-emerald-300 shadow-sm transition cursor-pointer"
                    onClick={() => setDetailTarget(s)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[13px] font-bold text-slate-900 font-mono">{s.numero_quema}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Layers className="w-3 h-3" /> {s.numero_frente}
                        </p>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold shrink-0 ${prioridadInfo.bg} ${prioridadInfo.text}`}>
                        {prioridadInfo.label}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{s.nombre_finca} · {s.lote_um}</span>
                    </p>

                    <p className="text-[11px] text-slate-400 font-mono">
                      {s.area_hectareas} Ha · {s.area_manzanas} Mz
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Plan: {formatearHora(s.hora_planificada)}
                      </span>
                      {!['FINALIZADA', 'CANCELADA'].includes(s.estado) && (
                        <span className={`flex items-center gap-1 font-bold font-mono ${colorTiempo}`}>
                          <Timer className="w-3 h-3" /> {formatearMinutos(tiempoTranscurrido)}
                        </span>
                      )}
                    </div>

                    {s.nombre_patrulla_asignada && (
                      <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <Truck className="w-3 h-3" /> {s.nombre_patrulla_asignada}
                        {s.lider_patrulla ? ` · ${s.lider_patrulla}` : ''}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <EstadoTag estado={s.estado} />

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {s.estado === 'SOLICITADA' && puedeDespachar && (
                          <button
                            onClick={() => abrirDespacho(s)}
                            className="text-[10px] font-bold px-2.5 py-1.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition"
                          >
                            Despachar
                          </button>
                        )}
                        {puedeCancelar && !['FINALIZADA', 'CANCELADA'].includes(s.estado) && (
                          <button
                            onClick={() => abrirCancelacion(s)}
                            className="text-[10px] font-bold p-1.5 rounded-md bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition"
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
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wide bg-slate-50">
                    <th className="text-left font-bold px-4 py-3">Quema</th>
                    <th className="text-left font-bold px-4 py-3">Frente</th>
                    <th className="text-left font-bold px-4 py-3">Finca / Lote</th>
                    <th className="text-left font-bold px-4 py-3">Área (Ha/Mz)</th>
                    <th className="text-left font-bold px-4 py-3">Hora Plan.</th>
                    <th className="text-left font-bold px-4 py-3">Patrulla</th>
                    <th className="text-left font-bold px-4 py-3">Estado</th>
                    <th className="text-right font-bold px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {listaFiltrada.map((s, i) => (
                    <tr
                      key={s.id}
                      className={`border-b border-slate-100 hover:bg-emerald-50/40 transition cursor-pointer ${i % 2 === 1 ? 'bg-slate-50/50' : ''}`}
                      onClick={() => setDetailTarget(s)}
                    >
                      <td className="px-4 py-3 font-mono font-bold text-slate-900 whitespace-nowrap">{s.numero_quema}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{s.numero_frente}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {s.nombre_finca} · {s.lote_um}
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono whitespace-nowrap">
                        {s.area_hectareas} / {s.area_manzanas}
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono whitespace-nowrap">{formatearHora(s.hora_planificada)}</td>
                      <td className="px-4 py-3 text-emerald-700 font-semibold whitespace-nowrap">{s.nombre_patrulla_asignada || '—'}</td>
                      <td className="px-4 py-3">
                        <EstadoTag estado={s.estado} />
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {s.estado === 'SOLICITADA' && puedeDespachar && (
                            <button
                              onClick={() => abrirDespacho(s)}
                              className="text-[10px] font-bold px-2.5 py-1.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition"
                            >
                              Despachar
                            </button>
                          )}
                          {puedeCancelar && !['FINALIZADA', 'CANCELADA'].includes(s.estado) && (
                            <button
                              onClick={() => abrirCancelacion(s)}
                              className="text-[10px] font-bold p-1.5 rounded-md bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition"
                              title="Cancelar solicitud"
                            >
                              <Ban className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Modal Despacho */}
      {dispatchTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Despachar Patrulla</h3>
              <button onClick={() => setDispatchTarget(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
              <p className="font-mono font-bold text-slate-900">{dispatchTarget.numero_quema}</p>
              <p>{dispatchTarget.nombre_finca} · {dispatchTarget.lote_um} · {dispatchTarget.numero_frente}</p>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-lg p-3 text-xs flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {errorMessage}
              </div>
            )}

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500">Patrulla Disponible</span>
              <select
                value={selectedPatrulla}
                onChange={(e) => setSelectedPatrulla(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                <option value="">Seleccione una patrulla...</option>
                {patrullasDisponibles.map((p) => (
                  <option key={p.nombre} value={p.nombre}>
                    {p.nombre} {p.codigo_vehiculo ? `(${p.codigo_vehiculo})` : ''}
                  </option>
                ))}
              </select>
              {patrullasDisponibles.length === 0 && (
                <p className="text-[11px] text-amber-600">No hay patrullas disponibles en este momento.</p>
              )}
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500">Líder de Patrulla (opcional)</span>
              <input
                type="text"
                value={selectedLider}
                onChange={(e) => setSelectedLider(e.target.value)}
                placeholder="Nombre del encargado"
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={confirmarDespacho}
              disabled={!selectedPatrulla || isDispatching}
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-sm py-3 rounded-lg transition"
            >
              {isDispatching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
              Confirmar Despacho
            </button>
          </div>
        </div>
      )}

      {/* Modal Cancelación */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Cancelar Solicitud</h3>
              <button onClick={() => setCancelTarget(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
              <p className="font-mono font-bold text-slate-900">{cancelTarget.numero_quema}</p>
              <p>{cancelTarget.nombre_finca} · {cancelTarget.lote_um}</p>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-lg p-3 text-xs flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {errorMessage}
              </div>
            )}

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500">Motivo de Cancelación</span>
              <select
                value={motivoCancelacion}
                onChange={(e) => setMotivoCancelacion(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-rose-500"
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
              className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-sm py-3 rounded-lg transition"
            >
              {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
              Confirmar Cancelación
            </button>
          </div>
        </div>
      )}

      {/* Modal Detalle */}
      {detailTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-lg space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 font-mono">{detailTarget.numero_quema}</h3>
              </div>
              <button onClick={() => setDetailTarget(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <EstadoTag estado={detailTarget.estado} />
              <span className={`text-[10px] px-2.5 py-1 rounded-full border font-bold ${PRIORIDAD_ESTILO[detailTarget.prioridad].bg} ${PRIORIDAD_ESTILO[detailTarget.prioridad].text}`}>
                {PRIORIDAD_ESTILO[detailTarget.prioridad].label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-slate-400 text-[10px] uppercase font-bold">Frente</p>
                <p className="text-slate-900 font-semibold mt-0.5">{detailTarget.numero_frente}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-slate-400 text-[10px] uppercase font-bold">Finca / Lote</p>
                <p className="text-slate-900 font-semibold mt-0.5">{detailTarget.nombre_finca} · {detailTarget.lote_um}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-slate-400 text-[10px] uppercase font-bold">Área</p>
                <p className="text-slate-900 font-semibold mt-0.5">{detailTarget.area_hectareas} Ha · {detailTarget.area_manzanas} Mz</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-slate-400 text-[10px] uppercase font-bold">Patrulla</p>
                <p className="text-slate-900 font-semibold mt-0.5">{detailTarget.nombre_patrulla_asignada || '—'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold text-slate-400">Cronología</p>
              {[
                ['Solicitada', detailTarget.hora_solicitud],
                ['Patrulla Asignada', detailTarget.hora_asignacion],
                ['Llegada al Frente', detailTarget.hora_llegada_frente],
                ['Inicio de Revisión', detailTarget.hora_inicio_revision],
                ['Fin de Revisión', detailTarget.hora_fin_revision],
                ['Inicio de Quema', detailTarget.hora_inicio_quema],
                ['Fin de Quema', detailTarget.hora_fin_quema],
              ].map(([label, value]) =>
                value ? (
                  <div key={label} className="flex items-center justify-between text-xs border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">{label}</span>
                    <span className="text-slate-800 font-mono">{formatearHora(value as string)}</span>
                  </div>
                ) : null
              )}
            </div>

            {detailTarget.observaciones_solicitud && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
                <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Observaciones</p>
                {detailTarget.observaciones_solicitud}
              </div>
            )}

            {detailTarget.motivo_cancelacion && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-700">
                <p className="text-rose-500 text-[10px] uppercase font-bold mb-1">Motivo de Cancelación</p>
                {detailTarget.motivo_cancelacion}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
