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
  ROLES_CONFIG,
  ESTADOS_CONFIG,
  PRIORIDADES_CONFIG,
  MOTIVOS_CANCELACION_ESTANDAR,
} from '@/lib/types';
import { StatsOverview, StatFilterId } from '@/components/StatsOverview';
import { PatrolAvailabilityMonitor } from '@/components/PatrolAvailabilityMonitor';
import {
  Flame,
  LogOut,
  Users,
  Layers,
  MapPin,
  Truck,
  FilePlus2,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Ban,
  Clock,
  Timer,
  MapPin as PinIcon,
  LayoutGrid,
  List,
  FileSpreadsheet,
  FileText,
  X,
  Info,
} from 'lucide-react';

const ROLES_CREAR_SOLICITUD = ['supervisor_frente', 'supervisor_quemas', 'digitador', 'admin'];
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

function esHoy(iso?: string): boolean {
  if (!iso) return false;
  return new Date(iso).toDateString() === new Date().toDateString();
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

  const [filtro, setFiltro] = useState<StatFilterId | 'FINALIZADA'>('ALL');
  const [vista, setVista] = useState<'grid' | 'tabla'>('grid');

  // Modal de despacho
  const [dispatchTarget, setDispatchTarget] = useState<BurnRequest | null>(null);
  const [selectedPatrulla, setSelectedPatrulla] = useState('');
  const [selectedLider, setSelectedLider] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);

  // Modal de cancelación
  const [cancelTarget, setCancelTarget] = useState<BurnRequest | null>(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  // Modal de detalle
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

  // Reloj para cronómetros en vivo
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
    if (filtro === 'FINALIZADA') return finalizadasHoy;
    const activas = solicitudes.filter((s) => s.estado !== 'FINALIZADA' && s.estado !== 'CANCELADA');
    switch (filtro) {
      case 'SOLICITADA':
        return activas.filter((s) => s.estado === 'SOLICITADA');
      case 'EN_CAMINO':
        return activas.filter((s) => s.estado === 'PATRULLA_ASIGNADA');
      case 'EN_FRENTE_REVISION':
        return activas.filter((s) => s.estado === 'EN_FRENTE' || s.estado === 'EN_REVISION');
      case 'EN_QUEMA':
        return activas.filter((s) => s.estado === 'EN_QUEMA');
      default:
        return activas;
    }
  }, [solicitudes, filtro, finalizadasHoy]);

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
          )}","${s.nombre_patrulla_asignada || ''}","${ESTADOS_CONFIG[s.estado].label}","${PRIORIDADES_CONFIG[s.prioridad].label}"`
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
      <div className="min-h-screen bg-[#070C14] flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide">Cargando plataforma operativa...</p>
      </div>
    );
  }

  if (!currentUser) return null;

  const roleInfo = ROLES_CONFIG[currentUser.rol] || {
    label: currentUser.rol,
    badgeColor: 'bg-slate-900 text-slate-300 border-slate-700',
    description: 'Rol en la plataforma',
  };

  return (
    <div className="min-h-screen bg-[#070C14] text-slate-100 flex flex-col font-sans">
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-900/95 border border-emerald-500/40 text-emerald-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-semibold max-w-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Encabezado / Navbar */}
      <header className="bg-[#0B121E] border-b border-slate-800/80 px-4 sm:px-6 py-4 flex items-center justify-between shadow-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 border border-emerald-400/30 flex items-center justify-center shadow-lg shadow-emerald-950/50 shrink-0">
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-black tracking-tight text-white leading-tight">Ingenio La Unión</h1>
            <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Control de Quemas en Tiempo Real</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            {ROLES_CREAR_SOLICITUD.includes(currentUser.rol) && (
              <Link href="/quemas/nueva" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-orange-300 hover:bg-orange-950/60 transition">
                <FilePlus2 className="w-3.5 h-3.5" />
                <span>Nueva Solicitud</span>
              </Link>
            )}
            {['supervisor_quemas', 'digitador', 'admin', 'jefatura', 'supervisor_frente'].includes(currentUser.rol) && (
              <Link href="/quemas" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 hover:bg-amber-950/60 transition">
                <Truck className="w-3.5 h-3.5" />
                <span>Tablero</span>
              </Link>
            )}
            {['patrulla', 'supervisor_quemas', 'digitador', 'admin'].includes(currentUser.rol) && (
              <Link href="/campo" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 hover:bg-rose-950/60 transition">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Campo</span>
              </Link>
            )}
            {(currentUser.rol === 'admin' || currentUser.rol === 'digitador') && (
              <>
                <Link href="/usuarios" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-300 hover:bg-purple-950/60 transition">
                  <Users className="w-3.5 h-3.5" />
                  <span>Usuarios</span>
                </Link>
                <Link href="/constantes" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 hover:bg-emerald-950/60 transition">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Constantes</span>
                </Link>
                <Link href="/fincas" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-300 hover:bg-blue-950/60 transition">
                  <PinIcon className="w-3.5 h-3.5" />
                  <span>Fincas</span>
                </Link>
              </>
            )}
          </nav>

          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-200">{currentUser.nombre_completo}</span>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${roleInfo.badgeColor}`}>{roleInfo.label}</span>
              {currentUser.frente_asignado && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  {currentUser.frente_asignado}
                </span>
              )}
              {currentUser.patrulla_asignada && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-orange-950 text-orange-300 border border-orange-800">
                  {currentUser.patrulla_asignada}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-300 text-xs font-semibold transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Cerrar Sesión</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* 2. Banner de Rol y Acciones Rápidas */}
        <div className="bg-gradient-to-r from-emerald-950/60 via-[#0B121E] to-[#0B121E] border border-emerald-500/30 rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">Registro y Control de Quemas Programadas</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{roleInfo.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {puedeCrear && (
              <Link
                href="/quemas/nueva"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-xs font-black shadow-lg shadow-orange-950/40 transition"
              >
                <FilePlus2 className="w-4 h-4" />
                Nueva Solicitud de Quema
              </Link>
            )}
            <button
              onClick={() => setFiltro('FINALIZADA')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 border border-emerald-600/40 text-emerald-100 text-xs font-bold shadow-lg transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              Ver Finalizadas ({finalizadasHoy.length})
            </button>
            <button
              onClick={exportarExcel}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition"
              title="Descargar listado filtrado como Excel/CSV"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={exportarPDF}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition"
              title="Imprimir / Guardar como PDF"
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>

        {/* 3. Monitor de Disponibilidad de Patrullas */}
        <PatrolAvailabilityMonitor patrullas={patrullas} solicitudes={solicitudes} currentUser={currentUser} />

        {/* 4. Cuadros de Estado / Filtros */}
        <StatsOverview
          solicitudes={solicitudes}
          activeFilter={filtro === 'FINALIZADA' ? ('ALL' as StatFilterId) : filtro}
          onFilterChange={(id) => setFiltro(id)}
        />

        {/* 5. Barra de herramientas y conmutador de vista */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {listaFiltrada.length} solicitud{listaFiltrada.length === 1 ? '' : 'es'} {filtro === 'FINALIZADA' ? 'finalizadas hoy' : 'visibles'}
          </p>
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setVista('grid')}
              className={`p-1.5 rounded-lg transition ${vista === 'grid' ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700' : 'text-slate-500 hover:text-slate-300'}`}
              title="Vista de tarjetas"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setVista('tabla')}
              className={`p-1.5 rounded-lg transition ${vista === 'tabla' ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700' : 'text-slate-500 hover:text-slate-300'}`}
              title="Vista de tabla"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6. Listado de Quemas */}
        {listaFiltrada.length === 0 ? (
          <div className="bg-[#0B121E] border border-slate-800 rounded-3xl p-10 text-center">
            <p className="text-sm text-slate-500">No hay solicitudes que coincidan con este filtro.</p>
          </div>
        ) : vista === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {listaFiltrada.map((s) => {
              const estadoInfo = ESTADOS_CONFIG[s.estado];
              const prioridadInfo = PRIORIDADES_CONFIG[s.prioridad];
              const tiempoTranscurrido = s.hora_asignacion
                ? minutosDesde(s.hora_asignacion)
                : minutosDesde(s.hora_solicitud);
              const colorTiempo = tiempoTranscurrido < 15 ? 'text-emerald-400' : tiempoTranscurrido < 30 ? 'text-amber-400' : 'text-rose-400';

              return (
                <div
                  key={s.id}
                  className="bg-[#0B121E] border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition cursor-pointer"
                  onClick={() => setDetailTarget(s)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-black text-white font-mono">{s.numero_quema}</p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Layers className="w-3 h-3" /> {s.numero_frente}
                      </p>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border shrink-0 ${prioridadInfo.badgeColor}`}>
                      {prioridadInfo.label}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 flex items-center gap-1">
                    <PinIcon className="w-3 h-3 text-blue-400 shrink-0" />
                    <span className="truncate">{s.nombre_finca} · {s.lote_um}</span>
                  </p>

                  <p className="text-[11px] text-slate-500">
                    {s.area_hectareas} Ha · {s.area_manzanas} Mz
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Plan: {formatearHora(s.hora_planificada)}
                    </span>
                    {!['FINALIZADA', 'CANCELADA'].includes(s.estado) && (
                      <span className={`flex items-center gap-1 font-bold ${colorTiempo}`}>
                        <Timer className="w-3 h-3" /> {formatearMinutos(tiempoTranscurrido)}
                      </span>
                    )}
                  </div>

                  {s.nombre_patrulla_asignada && (
                    <p className="text-[11px] text-orange-300 flex items-center gap-1">
                      <Truck className="w-3 h-3" /> {s.nombre_patrulla_asignada}
                      {s.lider_patrulla ? ` · ${s.lider_patrulla}` : ''}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${estadoInfo.badgeColor}`}>{estadoInfo.label}</span>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {s.estado === 'SOLICITADA' && puedeDespachar && (
                        <button
                          onClick={() => abrirDespacho(s)}
                          className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-blue-950 text-blue-300 border border-blue-800 hover:bg-blue-900 transition"
                        >
                          Despachar
                        </button>
                      )}
                      {puedeCancelar && !['FINALIZADA', 'CANCELADA'].includes(s.estado) && (
                        <button
                          onClick={() => abrirCancelacion(s)}
                          className="text-[10px] font-bold p-1.5 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-900 hover:bg-rose-950 transition"
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
          <div className="bg-[#0B121E] border border-slate-800 rounded-2xl overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px] tracking-wider">
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
                {listaFiltrada.map((s) => {
                  const estadoInfo = ESTADOS_CONFIG[s.estado];
                  return (
                    <tr
                      key={s.id}
                      className="border-b border-slate-800/60 hover:bg-slate-900/50 transition cursor-pointer"
                      onClick={() => setDetailTarget(s)}
                    >
                      <td className="px-4 py-3 font-mono font-bold text-white whitespace-nowrap">{s.numero_quema}</td>
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{s.numero_frente}</td>
                      <td className="px-4 py-3 text-slate-300">
                        {s.nombre_finca} · {s.lote_um}
                      </td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                        {s.area_hectareas} Ha / {s.area_manzanas} Mz
                      </td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{formatearHora(s.hora_planificada)}</td>
                      <td className="px-4 py-3 text-orange-300 whitespace-nowrap">{s.nombre_patrulla_asignada || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${estadoInfo.badgeColor}`}>{estadoInfo.label}</span>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {s.estado === 'SOLICITADA' && puedeDespachar && (
                            <button
                              onClick={() => abrirDespacho(s)}
                              className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-blue-950 text-blue-300 border border-blue-800 hover:bg-blue-900 transition"
                            >
                              Despachar
                            </button>
                          )}
                          {puedeCancelar && !['FINALIZADA', 'CANCELADA'].includes(s.estado) && (
                            <button
                              onClick={() => abrirCancelacion(s)}
                              className="text-[10px] font-bold p-1.5 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-900 hover:bg-rose-950 transition"
                              title="Cancelar solicitud"
                            >
                              <Ban className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal Despacho */}
      {dispatchTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B121E] border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Despachar Patrulla</h3>
              <button onClick={() => setDispatchTarget(null)} className="text-slate-500 hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-300">
              <p className="font-mono font-bold text-white">{dispatchTarget.numero_quema}</p>
              <p>{dispatchTarget.nombre_finca} · {dispatchTarget.lote_um} · {dispatchTarget.numero_frente}</p>
            </div>

            {errorMessage && (
              <div className="bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl p-3 text-xs flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {errorMessage}
              </div>
            )}

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500">Patrulla Disponible</span>
              <select
                value={selectedPatrulla}
                onChange={(e) => setSelectedPatrulla(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Seleccione una patrulla...</option>
                {patrullasDisponibles.map((p) => (
                  <option key={p.nombre} value={p.nombre}>
                    {p.nombre} {p.codigo_vehiculo ? `(${p.codigo_vehiculo})` : ''}
                  </option>
                ))}
              </select>
              {patrullasDisponibles.length === 0 && (
                <p className="text-[11px] text-amber-400">No hay patrullas disponibles en este momento.</p>
              )}
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500">Líder de Patrulla (opcional)</span>
              <input
                type="text"
                value={selectedLider}
                onChange={(e) => setSelectedLider(e.target.value)}
                placeholder="Nombre del encargado"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={confirmarDespacho}
              disabled={!selectedPatrulla || isDispatching}
              className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-sm py-3.5 rounded-xl transition"
            >
              {isDispatching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
              Confirmar Despacho
            </button>
          </div>
        </div>
      )}

      {/* Modal Cancelación */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B121E] border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Cancelar Solicitud</h3>
              <button onClick={() => setCancelTarget(null)} className="text-slate-500 hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-300">
              <p className="font-mono font-bold text-white">{cancelTarget.numero_quema}</p>
              <p>{cancelTarget.nombre_finca} · {cancelTarget.lote_um}</p>
            </div>

            {errorMessage && (
              <div className="bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl p-3 text-xs flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {errorMessage}
              </div>
            )}

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500">Motivo de Cancelación</span>
              <select
                value={motivoCancelacion}
                onChange={(e) => setMotivoCancelacion(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-rose-500"
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
              className="w-full flex items-center justify-center gap-2 bg-rose-800 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-sm py-3.5 rounded-xl transition"
            >
              {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
              Confirmar Cancelación
            </button>
          </div>
        </div>
      )}

      {/* Modal Detalle */}
      {detailTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B121E] border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-black text-white font-mono">{detailTarget.numero_quema}</h3>
              </div>
              <button onClick={() => setDetailTarget(null)} className="text-slate-500 hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${ESTADOS_CONFIG[detailTarget.estado].badgeColor}`}>
                {ESTADOS_CONFIG[detailTarget.estado].label}
              </span>
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${PRIORIDADES_CONFIG[detailTarget.prioridad].badgeColor}`}>
                {PRIORIDADES_CONFIG[detailTarget.prioridad].label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                <p className="text-slate-500 text-[10px] uppercase font-bold">Frente</p>
                <p className="text-white font-semibold mt-0.5">{detailTarget.numero_frente}</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                <p className="text-slate-500 text-[10px] uppercase font-bold">Finca / Lote</p>
                <p className="text-white font-semibold mt-0.5">{detailTarget.nombre_finca} · {detailTarget.lote_um}</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                <p className="text-slate-500 text-[10px] uppercase font-bold">Área</p>
                <p className="text-white font-semibold mt-0.5">{detailTarget.area_hectareas} Ha · {detailTarget.area_manzanas} Mz</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                <p className="text-slate-500 text-[10px] uppercase font-bold">Patrulla</p>
                <p className="text-white font-semibold mt-0.5">{detailTarget.nombre_patrulla_asignada || '—'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold text-slate-500">Cronología</p>
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
                  <div key={label} className="flex items-center justify-between text-xs border-b border-slate-800/60 pb-1.5">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-slate-200 font-mono">{formatearHora(value as string)}</span>
                  </div>
                ) : null
              )}
            </div>

            {detailTarget.observaciones_solicitud && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-300">
                <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Observaciones</p>
                {detailTarget.observaciones_solicitud}
              </div>
            )}

            {detailTarget.motivo_cancelacion && (
              <div className="bg-rose-950/40 border border-rose-900 rounded-xl p-3 text-xs text-rose-300">
                <p className="text-rose-400 text-[10px] uppercase font-bold mb-1">Motivo de Cancelación</p>
                {detailTarget.motivo_cancelacion}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
