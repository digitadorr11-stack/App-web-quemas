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
  MOTIVOS_CANCELACION_ESTANDAR,
  ROLES_CONFIG,
  ESTADOS_CONFIG,
  PRIORIDADES_CONFIG,
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
  ShieldCheck,
  Sparkles,
  Inbox,
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

function EstadoTag({ estado }: { estado: BurnStatus }) {
  const s = ESTADOS_CONFIG[estado] || { label: estado, badgeColor: 'bg-slate-100 text-slate-700 border-slate-200' };
  return <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${s.badgeColor}`}>{s.label}</span>;
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

  // Filtro de Estado (integrado con StatsOverview)
  const [filtroStatus, setFiltroStatus] = useState<string>('ALL');
  const [vista, setVista] = useState<'grid' | 'tabla'>('grid');

  // Modal Despacho
  const [dispatchTarget, setDispatchTarget] = useState<BurnRequest | null>(null);
  const [selectedPatrulla, setSelectedPatrulla] = useState('');
  const [selectedLider, setSelectedLider] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);

  // Modal Cancelacion
  const [cancelTarget, setCancelTarget] = useState<BurnRequest | null>(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  // Modal Detalle
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

  const puedeCrear = currentUser ? ROLES_CREAR_SOLICITUD.includes(currentUser.rol) : false;
  const puedeDespachar = currentUser ? ROLES_DESPACHO.includes(currentUser.rol) : false;
  const puedeCancelar = currentUser ? ROLES_CANCELACION.includes(currentUser.rol) : false;

  const patrullasDisponibles = useMemo(() => patrullas.filter((p) => p.estado === 'DISPONIBLE' && p.activo), [patrullas]);

  // Filtrado de solicitudes segun la tarjeta de estado seleccionada
  const listaFiltrada = useMemo(() => {
    return solicitudes.filter((s) => {
      if (filtroStatus === 'ALL') {
        // En vista "ALL" mostrar las que estan en proceso (no finalizadas ni canceladas)
        return s.estado !== 'FINALIZADA' && s.estado !== 'CANCELADA';
      }
      if (filtroStatus === 'SOLICITADA') {
        return s.estado === 'SOLICITADA';
      }
      if (filtroStatus === 'EN_PROCESO') {
        return s.estado === 'PATRULLA_ASIGNADA' || s.estado === 'EN_FRENTE' || s.estado === 'EN_REVISION';
      }
      if (filtroStatus === 'VALIDADAS') {
        // Etapa sin lógica de aprobación real en el flujo operativo — nunca hay resultados.
        return false;
      }
      if (filtroStatus === 'EN_QUEMA') {
        return s.estado === 'EN_QUEMA';
      }
      if (filtroStatus === 'FINALIZADA') {
        return s.estado === 'FINALIZADA';
      }
      if (filtroStatus === 'CANCELADA') {
        return s.estado === 'CANCELADA';
      }
      return true;
    });
  }, [solicitudes, filtroStatus]);

  const finalizadasCount = useMemo(
    () => solicitudes.filter((s) => s.estado === 'FINALIZADA').length,
    [solicitudes]
  );

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
          )}","${s.nombre_patrulla_asignada || ''}","${ESTADOS_CONFIG[s.estado]?.label || s.estado}","${PRIORIDADES_CONFIG[s.prioridad]?.label || s.prioridad}"`
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

  const roleMeta = ROLES_CONFIG[currentUser.rol] || {
    label: currentUser.rol,
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    description: '',
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-union-900 text-white px-4 py-3 rounded-md shadow-panel flex items-center gap-2 text-sm font-medium max-w-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-union-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Sidebar currentUser={currentUser} open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />

      <div className={`transition-[padding] duration-200 ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}`}>
        
        {/* Barra superior de navegacion / breadcrumb */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition shrink-0 cursor-pointer"
              title="Alternar barra lateral"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400 font-medium">Quemas</span>
              <span className="text-slate-300">/</span>
              <span className="font-bold text-slate-800">Panel de Control</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden md:inline text-xs font-semibold text-slate-600">
              {currentUser.nombre_completo}
            </span>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${roleMeta.badgeColor}`}>
              {roleMeta.label}
            </span>
            {currentUser.frente_asignado && (
              <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {currentUser.frente_asignado}
              </span>
            )}
            {currentUser.patrulla_asignada && (
              <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded-full font-bold bg-orange-50 text-orange-700 border border-orange-200">
                {currentUser.patrulla_asignada}
              </span>
            )}
          </div>
        </header>

        <main className="max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* ENCABEZADO DE MÓDULO */}
          <div className="bg-union-900 text-white rounded-md shadow-panel p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-start gap-3.5 max-w-3xl min-w-0">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 text-amber-400" />
              </div>
              <div className="space-y-1 min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-union-300">Módulo activo</p>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Quemas Programadas
                </h1>
                <p className="text-xs sm:text-sm text-union-100/80 leading-relaxed">
                  {currentUser.rol === 'supervisor_frente' &&
                    `Vista de Frente: Administra las solicitudes correspondientes a tu turno/frente (${currentUser.frente_asignado || 'Frente asignado'}).`}
                  {currentUser.rol === 'supervisor_quemas' &&
                    'Coordinación de Quemas: Monitorea todas las solicitudes entrantes y asigna patrullas de campo con medición de tiempos.'}
                  {currentUser.rol === 'patrulla' &&
                    `Operación de Patrulla: Registra tus tiempos de llegada, inspección técnica y finalización para tu unidad (${currentUser.patrulla_asignada || 'Patrulla'}).`}
                  {currentUser.rol === 'digitador' &&
                    'Control Total de Digitador: Supervisión global de todos los frentes, despacho de unidades y administración de catálogos.'}
                  {currentUser.rol === 'admin' &&
                    'Administración Integral: Control total del flujo de despacho, constantes operativas, fincas, lotes y usuarios.'}
                  {currentUser.rol === 'jefatura' &&
                    'Supervisión Gerencial: Visión ejecutiva y consolidada de avance de zafra en toda la plantación.'}
                </p>
              </div>
            </div>

            {/* Acciones rapidas del encabezado */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {puedeCrear && (
                <Link
                  href="/quemas/nueva"
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm rounded-md shadow-card flex items-center gap-2 transition cursor-pointer"
                >
                  <FilePlus2 className="w-4 h-4" />
                  <span>Nueva Solicitud de Quema</span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => setFiltroStatus(filtroStatus === 'FINALIZADA' ? 'ALL' : 'FINALIZADA')}
                className={`px-3.5 py-2.5 rounded-md border text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  filtroStatus === 'FINALIZADA'
                    ? 'bg-union-700 text-white border-union-700'
                    : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finalizadas ({finalizadasCount})</span>
              </button>

              <button
                type="button"
                onClick={exportarExcel}
                className="px-3 py-2.5 rounded-md bg-white hover:bg-slate-50 border border-slate-300 text-slate-600 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                title="Descargar reporte en CSV / Excel"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span className="hidden sm:inline">Excel</span>
              </button>

              <button
                type="button"
                onClick={exportarPDF}
                className="px-3 py-2.5 rounded-md bg-white hover:bg-slate-50 border border-slate-300 text-slate-600 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                title="Imprimir / Exportar a PDF"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            </div>
          </div>


          {/* MONITOR EN VIVO DE PATRULLAS */}
          <PatrolAvailabilityMonitor
            patrullas={patrullas}
            solicitudes={solicitudes}
            currentUser={currentUser}
          />

          {/* BARRA DE HERRAMIENTAS Y LISTADO DE SOLICITUDES */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div>
                <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <span>Listado de Quemas</span>
                  <span className="text-[11px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                    {listaFiltrada.length}
                  </span>
                  {filtroStatus !== 'ALL' && (
                    <button
                      type="button"
                      onClick={() => setFiltroStatus('ALL')}
                      className="text-[10px] text-emerald-700 hover:text-emerald-800 underline font-bold cursor-pointer"
                    >
                      (Quitar filtro)
                    </button>
                  )}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {filtroStatus === 'ALL'
                    ? 'Mostrando todas las solicitudes activas en proceso.'
                    : `Filtradas por: ${filtroStatus}`}
                </p>
              </div>

              {/* Selector de modo de vista (Tarjetas / Tabla) */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setVista('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    vista === 'grid'
                      ? 'bg-[#156b49] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Tarjetas</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVista('tabla')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    vista === 'tabla'
                      ? 'bg-[#156b49] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Tabla</span>
                </button>
              </div>
            </div>

            {/* CONTENIDO DEL LISTADO */}
            {listaFiltrada.length === 0 ? (
              /* EMPTY STATE MEJORADO Y ELEGANTE */
              <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
                  <Inbox className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h4 className="text-sm font-semibold text-slate-800">
                    No hay solicitudes registradas en este filtro
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {filtroStatus === 'ALL'
                      ? 'No hay solicitudes de quema activas en curso en este momento. Todas las patrullas se encuentran disponibles en base.'
                      : `No se encontraron quemas con estado "${filtroStatus}". Selecciona "TOTAL QUEMAS" para ver todo el tablero.`}
                  </p>
                </div>
                {puedeCrear && filtroStatus === 'ALL' && (
                  <div className="pt-2">
                    <Link
                      href="/quemas/nueva"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#156b49] hover:bg-[#0f4e34] text-white text-xs font-bold transition shadow-sm cursor-pointer"
                    >
                      <FilePlus2 className="w-4 h-4" />
                      <span>Crear Primera Solicitud</span>
                    </Link>
                  </div>
                )}
              </div>
            ) : vista === 'grid' ? (
              /* VISTA DE TARJETAS (CARDS) */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
                {listaFiltrada.map((s) => {
                  const prioridadInfo = PRIORIDADES_CONFIG[s.prioridad] || PRIORIDADES_CONFIG.NORMAL;
                  const tiempoTranscurrido = s.hora_asignacion ? minutosDesde(s.hora_asignacion) : minutosDesde(s.hora_solicitud);
                  const colorTiempo = tiempoTranscurrido < 15 ? 'text-emerald-700' : tiempoTranscurrido < 30 ? 'text-amber-700' : 'text-rose-700';

                  return (
                    <div
                      key={s.id}
                      className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 hover:border-emerald-400 hover:shadow-md transition cursor-pointer"
                      onClick={() => setDetailTarget(s)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-slate-900 font-mono tracking-tight">{s.numero_quema}</p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Layers className="w-3 h-3 text-slate-400" /> {s.numero_frente}
                          </p>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold shrink-0 ${prioridadInfo.badgeColor}`}>
                          {prioridadInfo.label}
                        </span>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 space-y-1 text-xs">
                        <p className="font-bold text-slate-800 flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{s.nombre_finca} · {s.lote_um}</span>
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono pl-5">
                          {s.area_hectareas} Ha ({s.area_manzanas} Mz) {s.variedad_cana ? `· Var: ${s.variedad_cana}` : ''}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> Plan: {formatearHora(s.hora_planificada)}
                        </span>
                        {!['FINALIZADA', 'CANCELADA'].includes(s.estado) && (
                          <span className={`flex items-center gap-1 font-bold font-mono ${colorTiempo}`}>
                            <Timer className="w-3 h-3" /> {formatearMinutos(tiempoTranscurrido)}
                          </span>
                        )}
                      </div>

                      {s.nombre_patrulla_asignada && (
                        <p className="text-[11.5px] text-emerald-800 font-bold flex items-center gap-1.5 bg-emerald-50/70 border border-emerald-200/80 rounded-lg px-2.5 py-1">
                          <Truck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="truncate">{s.nombre_patrulla_asignada} {s.lider_patrulla ? `· ${s.lider_patrulla}` : ''}</span>
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <EstadoTag estado={s.estado} />

                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {s.estado === 'SOLICITADA' && puedeDespachar && (
                            <button
                              type="button"
                              onClick={() => abrirDespacho(s)}
                              className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-xs cursor-pointer"
                            >
                              Despachar
                            </button>
                          )}
                          {puedeCancelar && !['FINALIZADA', 'CANCELADA'].includes(s.estado) && (
                            <button
                              type="button"
                              onClick={() => abrirCancelacion(s)}
                              className="text-[10px] font-bold p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition cursor-pointer"
                              title="Cancelar solicitud"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* VISTA DE TABLA DETALLADA */
              <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider bg-slate-50/80">
                        <th className="px-4 py-3.5">Quema</th>
                        <th className="px-4 py-3.5">Frente</th>
                        <th className="px-4 py-3.5">Finca / Lote</th>
                        <th className="px-4 py-3.5">Área (Ha / Mz)</th>
                        <th className="px-4 py-3.5">Hora Plan.</th>
                        <th className="px-4 py-3.5">Patrulla Asignada</th>
                        <th className="px-4 py-3.5">Estado</th>
                        <th className="px-4 py-3.5 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {listaFiltrada.map((s, i) => (
                        <tr
                          key={s.id}
                          className={`hover:bg-emerald-50/40 transition cursor-pointer ${i % 2 === 1 ? 'bg-slate-50/40' : ''}`}
                          onClick={() => setDetailTarget(s)}
                        >
                          <td className="px-4 py-3 font-mono font-bold text-slate-900 whitespace-nowrap">{s.numero_quema}</td>
                          <td className="px-4 py-3 text-slate-600 font-semibold whitespace-nowrap">{s.numero_frente}</td>
                          <td className="px-4 py-3 text-slate-800 font-medium">
                            {s.nombre_finca} · {s.lote_um}
                          </td>
                          <td className="px-4 py-3 text-slate-600 font-mono whitespace-nowrap">
                            {s.area_hectareas} Ha / {s.area_manzanas} Mz
                          </td>
                          <td className="px-4 py-3 text-slate-600 font-mono whitespace-nowrap">{formatearHora(s.hora_planificada)}</td>
                          <td className="px-4 py-3 text-emerald-800 font-bold whitespace-nowrap">{s.nombre_patrulla_asignada || '—'}</td>
                          <td className="px-4 py-3">
                            <EstadoTag estado={s.estado} />
                          </td>
                          <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              {s.estado === 'SOLICITADA' && puedeDespachar && (
                                <button
                                  type="button"
                                  onClick={() => abrirDespacho(s)}
                                  className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-xs cursor-pointer"
                                >
                                  Despachar
                                </button>
                              )}
                              {puedeCancelar && !['FINALIZADA', 'CANCELADA'].includes(s.estado) && (
                                <button
                                  type="button"
                                  onClick={() => abrirCancelacion(s)}
                                  className="text-[10px] font-bold p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition cursor-pointer"
                                  title="Cancelar solicitud"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL DESPACHO DE PATRULLA */}
      {dispatchTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Despachar Patrulla a Quema</span>
              </h3>
              <button onClick={() => setDispatchTarget(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 space-y-1">
              <p className="font-mono font-bold text-slate-900">{dispatchTarget.numero_quema}</p>
              <p>{dispatchTarget.nombre_finca} · {dispatchTarget.lote_um} · {dispatchTarget.numero_frente}</p>
              <p className="text-[11px] text-slate-500">Planificada para: {formatearHora(dispatchTarget.hora_planificada)}</p>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3 text-xs flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {errorMessage}
              </div>
            )}

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700">Patrulla Disponible *</span>
              <select
                value={selectedPatrulla}
                onChange={(e) => setSelectedPatrulla(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="">Seleccione una patrulla...</option>
                {patrullasDisponibles.map((p) => (
                  <option key={p.nombre} value={p.nombre}>
                    {p.nombre} {p.codigo_vehiculo ? `(${p.codigo_vehiculo})` : ''}
                  </option>
                ))}
              </select>
              {patrullasDisponibles.length === 0 && (
                <p className="text-[11px] text-amber-700 font-medium">No hay patrullas en estado DISPONIBLE en este momento.</p>
              )}
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700">Líder / Encargado de Patrulla (opcional)</span>
              <input
                type="text"
                value={selectedLider}
                onChange={(e) => setSelectedLider(e.target.value)}
                placeholder="Nombre del encargado"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDispatchTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarDespacho}
                disabled={!selectedPatrulla || isDispatching}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition shadow-md cursor-pointer"
              >
                {isDispatching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Truck className="w-3.5 h-3.5" />}
                <span>Confirmar Despacho</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CANCELAR SOLICITUD */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-rose-700 flex items-center gap-1.5">
                <Ban className="w-4 h-4 text-rose-600" />
                <span>Cancelar Solicitud de Quema</span>
              </h3>
              <button onClick={() => setCancelTarget(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 space-y-1">
              <p className="font-mono font-bold text-slate-900">{cancelTarget.numero_quema}</p>
              <p>{cancelTarget.nombre_finca} · {cancelTarget.lote_um} · {cancelTarget.numero_frente}</p>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3 text-xs flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {errorMessage}
              </div>
            )}

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700">Motivo de Cancelación *</span>
              <select
                value={motivoCancelacion}
                onChange={(e) => setMotivoCancelacion(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="">Seleccione un motivo...</option>
                {MOTIVOS_CANCELACION_ESTANDAR.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={confirmarCancelacion}
                disabled={!motivoCancelacion || isCancelling}
                className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition shadow-md cursor-pointer"
              >
                {isCancelling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ban className="w-3.5 h-3.5" />}
                <span>Confirmar Cancelación</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLE DE QUEMA */}
      {detailTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-lg space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-semibold text-slate-900 font-mono">{detailTarget.numero_quema}</h3>
              </div>
              <button onClick={() => setDetailTarget(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <EstadoTag estado={detailTarget.estado} />
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold ${PRIORIDADES_CONFIG[detailTarget.prioridad]?.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                Prioridad: {PRIORIDADES_CONFIG[detailTarget.prioridad]?.label || detailTarget.prioridad}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                <p className="text-slate-400 text-[10px] uppercase font-bold">Frente de Cosecha</p>
                <p className="text-slate-900 font-bold mt-0.5">{detailTarget.numero_frente}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                <p className="text-slate-400 text-[10px] uppercase font-bold">Finca / Lote</p>
                <p className="text-slate-900 font-bold mt-0.5">{detailTarget.nombre_finca} · {detailTarget.lote_um}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                <p className="text-slate-400 text-[10px] uppercase font-bold">Área Registrada</p>
                <p className="text-slate-900 font-bold mt-0.5">{detailTarget.area_hectareas} Ha ({detailTarget.area_manzanas} Mz)</p>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                <p className="text-slate-400 text-[10px] uppercase font-bold">Patrulla Asignada</p>
                <p className="text-slate-900 font-bold mt-0.5">{detailTarget.nombre_patrulla_asignada || 'Sin asignar'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] uppercase font-semibold text-slate-400">Cronología Operativa</p>
              {[
                ['Hora Solicitada', detailTarget.hora_solicitud],
                ['Hora Planificada', detailTarget.hora_planificada],
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
                    <span className="text-slate-800 font-mono font-bold">{formatearHora(value as string)}</span>
                  </div>
                ) : null
              )}
            </div>

            {detailTarget.observaciones_solicitud && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
                <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Observaciones de Solicitud</p>
                {detailTarget.observaciones_solicitud}
              </div>
            )}

            {detailTarget.motivo_cancelacion && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-700">
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
