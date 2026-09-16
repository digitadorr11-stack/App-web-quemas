'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/authService';
import { quemasService } from '@/lib/quemasService';
import { supabase } from '@/lib/supabaseClient';
import {
  BurnRequest,
  UserProfile,
  ReviewChecklist,
  ESTADOS_CONFIG,
  PRIORIDADES_CONFIG,
  MOTIVOS_ESPERA_ESTANDAR,
  CHECKLIST_REVISION_LABELS,
  CHECKLIST_REVISION_DEFAULT,
} from '@/lib/types';
import {
  Flame,
  LogOut,
  MapPin,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Truck,
  X,
  ClipboardCheck,
  PauseCircle,
  PlayCircle,
  Square,
  Navigation,
} from 'lucide-react';

const ROLES_PERMITIDOS = ['patrulla', 'admin', 'digitador', 'supervisor_quemas'];

function formatearHora(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });
}

export default function VistaCampoPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [solicitudes, setSolicitudes] = useState<BurnRequest[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isEsperaOpen, setIsEsperaOpen] = useState(false);
  const [motivoEspera, setMotivoEspera] = useState('');

  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [checklist, setChecklist] = useState<ReviewChecklist>(CHECKLIST_REVISION_DEFAULT);
  const [observacionesRevision, setObservacionesRevision] = useState('');

  const [isFinalizarOpen, setIsFinalizarOpen] = useState(false);
  const [observacionesFinales, setObservacionesFinales] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const cargarSolicitudes = async (patrulla: string) => {
    try {
      const data = await quemasService.listarSolicitudesPatrulla(patrulla);
      setSolicitudes(data);
    } catch (err) {
      console.error('Error cargando quema asignada:', err);
    }
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
        if (user.rol === 'patrulla' && !user.patrulla_asignada) {
          setCurrentUser(user);
          setIsLoading(false);
          return;
        }
        setCurrentUser(user);
        if (user.patrulla_asignada) {
          await cargarSolicitudes(user.patrulla_asignada);
        }
      } catch (err) {
        console.error('Error inicializando vista de campo:', err);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [router]);

  useEffect(() => {
    if (!currentUser?.patrulla_asignada || !supabase) return;
    const channel = supabase
      .channel('realtime_campo_solicitudes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'solicitudes_quemas' }, () =>
        cargarSolicitudes(currentUser.patrulla_asignada!)
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, [currentUser?.patrulla_asignada]);

  const solicitudActiva = useMemo(() => {
    if (solicitudes.length === 0) return null;
    return [...solicitudes].sort((a, b) => (a.hora_asignacion || '').localeCompare(b.hora_asignacion || ''))[0];
  }, [solicitudes]);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  const handleLlegada = async () => {
    if (!solicitudActiva) return;
    try {
      setIsProcessing(true);
      setErrorMessage(null);
      await quemasService.registrarLlegada(solicitudActiva.id);
      showToast('Llegada al frente registrada');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmarEspera = async () => {
    if (!solicitudActiva || !motivoEspera) return;
    try {
      setIsProcessing(true);
      setErrorMessage(null);
      await quemasService.registrarEspera(solicitudActiva.id, motivoEspera);
      showToast('Motivo de espera registrado');
      setIsEsperaOpen(false);
      setMotivoEspera('');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleIniciarRevision = async () => {
    if (!solicitudActiva) return;
    try {
      setIsProcessing(true);
      setErrorMessage(null);
      await quemasService.iniciarRevision(solicitudActiva.id);
      setChecklist(CHECKLIST_REVISION_DEFAULT);
      setObservacionesRevision('');
      setIsRevisionOpen(true);
      showToast('Revisión iniciada');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompletarRevision = async () => {
    if (!solicitudActiva) return;
    try {
      setIsProcessing(true);
      setErrorMessage(null);
      await quemasService.completarRevision(solicitudActiva.id, checklist, observacionesRevision.trim() || null);
      showToast('Revisión completada');
      setIsRevisionOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleIniciarQuema = async () => {
    if (!solicitudActiva) return;
    try {
      setIsProcessing(true);
      setErrorMessage(null);
      await quemasService.iniciarQuema(solicitudActiva.id);
      showToast('Quema iniciada');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalizarQuema = async () => {
    if (!solicitudActiva) return;
    try {
      setIsProcessing(true);
      setErrorMessage(null);
      await quemasService.finalizarQuema(solicitudActiva.id, observacionesFinales.trim() || null);
      showToast('Quema finalizada. Patrulla disponible.');
      setIsFinalizarOpen(false);
      setObservacionesFinales('');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide">Cargando vista de campo...</p>
      </div>
    );
  }

  if (!currentUser) return null;

  if (currentUser.rol === 'patrulla' && !currentUser.patrulla_asignada) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-600 p-6 text-center gap-4">
        <AlertTriangle className="w-10 h-10 text-amber-500" />
        <p className="text-sm font-semibold">Su usuario no tiene una patrulla asignada.</p>
        <p className="text-xs text-slate-500">Solicite al administrador que le asigne una patrulla de quema.</p>
        <button
          onClick={handleLogout}
          className="mt-2 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-semibold shadow-card"
        >
          <LogOut className="w-4 h-4" /> Cerrar Sesión
        </button>
      </div>
    );
  }

  const estadoInfo = solicitudActiva ? ESTADOS_CONFIG[solicitudActiva.estado] : null;
  const prioridadInfo = solicitudActiva ? PRIORIDADES_CONFIG[solicitudActiva.prioridad] : null;
  const revisionCompleta = !!solicitudActiva?.hora_fin_revision;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-10">
      {toastMessage && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-union-900 text-white px-4 py-3 rounded-xl shadow-panel flex items-center gap-2 text-sm font-semibold justify-center">
          <CheckCircle2 className="w-4 h-4 text-union-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between sticky top-0 z-30 shadow-card">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-md bg-orange-600 flex items-center justify-center shadow-card">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-tight">{currentUser.patrulla_asignada}</h1>
            <p className="text-[10px] uppercase font-bold text-orange-700 tracking-wider">{currentUser.nombre_completo}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-9 h-9 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 flex items-center justify-center text-slate-500 shadow-card"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-4">
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-4 flex items-start gap-3 text-sm">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {!solicitudActiva && (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 flex flex-col items-center text-center gap-3 shadow-card">
            <Flame className="w-10 h-10 text-slate-300" />
            <p className="text-sm font-bold text-slate-600">Sin quema asignada</p>
            <p className="text-xs text-slate-500">
              Cuando el despacho le asigne una quema, aparecerá aquí automáticamente.
            </p>
          </div>
        )}

        {solicitudActiva && (
          <>
            {/* Ficha de la quema */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-900 font-mono">{solicitudActiva.numero_quema}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Layers className="w-3.5 h-3.5" /> {solicitudActiva.numero_frente}
                  </p>
                </div>
                {prioridadInfo && (
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${prioridadInfo.badgeColor}`}>
                    {prioridadInfo.label}
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                {solicitudActiva.nombre_finca} · {solicitudActiva.lote_um}
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Área</p>
                  <p className="text-xs font-bold text-emerald-700">
                    {solicitudActiva.area_hectareas.toFixed(2)} Ha
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" /> Planificada
                  </p>
                  <p className="text-xs font-bold text-blue-700">{formatearHora(solicitudActiva.hora_planificada)}</p>
                </div>
              </div>

              {solicitudActiva.observaciones_solicitud && (
                <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                  {solicitudActiva.observaciones_solicitud}
                </p>
              )}

              {estadoInfo && (
                <span className={`inline-block text-[10px] px-2.5 py-1 rounded-full font-bold border ${estadoInfo.badgeColor}`}>
                  {estadoInfo.label}
                </span>
              )}
            </div>

            {/* Botonera de acciones por etapa */}
            <div className="space-y-3">
              {solicitudActiva.estado === 'PATRULLA_ASIGNADA' && (
                <button
                  onClick={handleLlegada}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-base py-6 rounded-lg shadow-panel"
                >
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Navigation className="w-6 h-6" />}
                  Llegada al Frente
                </button>
              )}

              {solicitudActiva.estado === 'EN_FRENTE' && (
                <>
                  <button
                    onClick={handleIniciarRevision}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-bold text-base py-6 rounded-lg shadow-panel"
                  >
                    {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <ClipboardCheck className="w-6 h-6" />}
                    Iniciar Revisión Técnica
                  </button>
                  <button
                    onClick={() => setIsEsperaOpen(true)}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 disabled:opacity-60 text-slate-600 font-bold text-sm py-4 rounded-2xl shadow-card"
                  >
                    <PauseCircle className="w-5 h-5" /> Registrar En Espera
                  </button>
                </>
              )}

              {solicitudActiva.estado === 'EN_REVISION' && !revisionCompleta && (
                <button
                  onClick={() => setIsRevisionOpen(true)}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-bold text-base py-6 rounded-lg shadow-panel"
                >
                  <ClipboardCheck className="w-6 h-6" /> Completar Checklist
                </button>
              )}

              {solicitudActiva.estado === 'EN_REVISION' && revisionCompleta && (
                <button
                  onClick={handleIniciarQuema}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-bold text-base py-6 rounded-lg shadow-panel"
                >
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <PlayCircle className="w-6 h-6" />}
                  Iniciar Quema
                </button>
              )}

              {solicitudActiva.estado === 'EN_QUEMA' && (
                <button
                  onClick={() => setIsFinalizarOpen(true)}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-base py-6 rounded-lg shadow-panel"
                >
                  <Square className="w-6 h-6" /> Finalizar Quema
                </button>
              )}
            </div>
          </>
        )}
      </main>

      {/* Modal En Espera */}
      {isEsperaOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Motivo de Espera</h3>
              <button onClick={() => setIsEsperaOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {MOTIVOS_ESPERA_ESTANDAR.map((m) => (
                <button
                  key={m}
                  onClick={() => setMotivoEspera(m)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold border transition ${
                    motivoEspera === m
                      ? 'bg-amber-50 border-amber-300 text-amber-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <button
              onClick={handleConfirmarEspera}
              disabled={!motivoEspera || isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-sm py-4 rounded-2xl shadow-card"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <PauseCircle className="w-4 h-4" />}
              Confirmar
            </button>
          </div>
        </div>
      )}

      {/* Modal Checklist de Revisión */}
      {isRevisionOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Checklist de Seguridad</h3>
              <button onClick={() => setIsRevisionOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {(Object.keys(CHECKLIST_REVISION_LABELS) as (keyof ReviewChecklist)[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setChecklist((prev) => ({ ...prev, [key]: !prev[key] }))}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold border transition ${
                    checklist[key]
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {CHECKLIST_REVISION_LABELS[key]}
                  {checklist[key] ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-300" />}
                </button>
              ))}
            </div>
            <textarea
              value={observacionesRevision}
              onChange={(e) => setObservacionesRevision(e.target.value)}
              rows={2}
              placeholder="Observaciones de la revisión (opcional)"
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-amber-500 resize-none"
            />
            <button
              onClick={handleCompletarRevision}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-sm py-4 rounded-2xl shadow-card"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ClipboardCheck className="w-4 h-4" />}
              Completar Revisión
            </button>
          </div>
        </div>
      )}

      {/* Modal Finalizar Quema */}
      {isFinalizarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Finalizar Quema</h3>
              <button onClick={() => setIsFinalizarOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={observacionesFinales}
              onChange={(e) => setObservacionesFinales(e.target.value)}
              rows={3}
              placeholder="Observaciones finales (opcional)"
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-emerald-500 resize-none"
            />
            <button
              onClick={handleFinalizarQuema}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm py-4 rounded-2xl shadow-card"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
              Confirmar Finalización
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
