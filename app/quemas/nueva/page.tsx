'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/authService';
import { quemasService } from '@/lib/quemasService';
import { supabase } from '@/lib/supabaseClient';
import { FrontCatalog, FarmLoteCatalog, UserProfile, Prioridad, PRIORIDADES_CONFIG } from '@/lib/types';
import {
  Flame,
  ArrowLeft,
  Search,
  MapPin,
  Clock,
  Layers,
  Sprout,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  X,
} from 'lucide-react';

const ROLES_PERMITIDOS = ['supervisor_frente', 'supervisor_quemas', 'digitador', 'admin'];

function defaultHoraPlanificada(): string {
  const d = new Date(Date.now() + 60 * 60 * 1000); // +1 hora por defecto
  d.setSeconds(0, 0);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export default function NuevaSolicitudPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [frentes, setFrentes] = useState<FrontCatalog[]>([]);
  const [lotes, setLotes] = useState<FarmLoteCatalog[]>([]);

  const [selectedFrente, setSelectedFrente] = useState('');
  const [fincaQuery, setFincaQuery] = useState('');
  const [selectedFinca, setSelectedFinca] = useState('');
  const [isFincaDropdownOpen, setIsFincaDropdownOpen] = useState(false);
  const [selectedLoteId, setSelectedLoteId] = useState('');

  const [areaHa, setAreaHa] = useState<number>(0);
  const [variedad, setVariedad] = useState('');
  const [tipoCosecha, setTipoCosecha] = useState<'Mecanizada' | 'Manual' | 'Mixta'>('Mecanizada');
  const [tonelaje, setTonelaje] = useState('');
  const [horaPlanificada, setHoraPlanificada] = useState(defaultHoraPlanificada());
  const [prioridad, setPrioridad] = useState<Prioridad>('NORMAL');
  const [observaciones, setObservaciones] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
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

        if (supabase) {
          const [{ data: frentesData }, { data: lotesData }] = await Promise.all([
            supabase.from('catalogo_frentes').select('*').eq('activo', true).order('nombre'),
            supabase.from('catalogo_fincas_lotes').select('*').eq('activo', true).order('finca').order('lote'),
          ]);
          setFrentes((frentesData || []) as FrontCatalog[]);
          setLotes(
            ((lotesData || []) as any[]).map((row) => ({
              id: row.id,
              finca: row.finca,
              lote: row.lote,
              area_ha: Number(row.area_ha || 0),
              area_mz: 0,
              variedad: row.variedad || '',
              activo: row.activo,
            }))
          );
        }

        if (user.rol === 'supervisor_frente' && user.frente_asignado) {
          setSelectedFrente(user.frente_asignado);
        }
      } catch (err) {
        console.error('Error inicializando solicitud de quema:', err);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [router]);

  // Al elegir un frente, precargar su tipo de cosecha por defecto
  useEffect(() => {
    if (!selectedFrente) return;
    const frente = frentes.find((f) => f.nombre === selectedFrente);
    if (frente) setTipoCosecha(frente.tipo_cosecha);
  }, [selectedFrente, frentes]);

  const fincasUnicas = useMemo(() => {
    const set = new Set(lotes.map((l) => l.finca));
    return Array.from(set).sort();
  }, [lotes]);

  const fincasFiltradas = useMemo(() => {
    const q = fincaQuery.toLowerCase().trim();
    if (!q) return fincasUnicas.slice(0, 8);
    return fincasUnicas.filter((f) => f.toLowerCase().includes(q)).slice(0, 8);
  }, [fincaQuery, fincasUnicas]);

  const lotesDeFinca = useMemo(() => {
    if (!selectedFinca) return [];
    return lotes.filter((l) => l.finca === selectedFinca);
  }, [lotes, selectedFinca]);

  const handleSelectFinca = (finca: string) => {
    setSelectedFinca(finca);
    setFincaQuery(finca);
    setIsFincaDropdownOpen(false);
    setSelectedLoteId('');
    setAreaHa(0);
    setVariedad('');
  };

  const handleSelectLote = (loteId: string) => {
    setSelectedLoteId(loteId);
    const lote = lotesDeFinca.find((l) => l.id === loteId);
    if (lote) {
      setAreaHa(lote.area_ha);
      setVariedad(lote.variedad || '');
    }
  };

  const frenteActivo = currentUser?.rol === 'supervisor_frente';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!currentUser) return;
    if (!selectedFrente) {
      setErrorMessage('Debe seleccionar el Frente de cosecha.');
      return;
    }
    if (!selectedFinca) {
      setErrorMessage('Debe seleccionar la Finca.');
      return;
    }
    const lote = lotesDeFinca.find((l) => l.id === selectedLoteId);
    if (!lote) {
      setErrorMessage('Debe seleccionar el Lote.');
      return;
    }
    if (!horaPlanificada) {
      setErrorMessage('Debe indicar la hora planificada de la quema.');
      return;
    }

    try {
      setIsSubmitting(true);
      const nuevaSolicitud = await quemasService.crearSolicitud({
        numero_frente: selectedFrente,
        nombre_finca: selectedFinca,
        lote_um: lote.lote,
        area_hectareas: areaHa,
        variedad_cana: variedad || null,
        tonelaje_estimado: tonelaje ? parseFloat(tonelaje) : null,
        hora_planificada: new Date(horaPlanificada).toISOString(),
        creado_por_usuario_id: currentUser.id,
        nombre_supervisor_frente: currentUser.nombre_completo,
        tipo_cosecha: tipoCosecha,
        prioridad,
        observaciones_solicitud: observaciones.trim() || null,
      });

      showToast(`Solicitud ${nuevaSolicitud.numero_quema} enviada correctamente`);

      // Reiniciar formulario (mantener frente si es supervisor_frente)
      setFincaQuery('');
      setSelectedFinca('');
      setSelectedLoteId('');
      setAreaHa(0);
      setVariedad('');
      setTonelaje('');
      setHoraPlanificada(defaultHoraPlanificada());
      setPrioridad('NORMAL');
      setObservaciones('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al enviar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide">Cargando formulario...</p>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-union-900 text-white px-4 py-3 rounded-xl shadow-panel flex items-center gap-2 text-sm font-semibold max-w-sm">
          <CheckCircle2 className="w-4 h-4 text-union-300 shrink-0" />
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
        <div className="w-9 h-9 rounded-md bg-blue-600 flex items-center justify-center shadow-card">
          <Flame className="w-4 h-4 text-amber-300" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-tight">Nueva Solicitud de Quema</h1>
          <p className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
            {currentUser.frente_asignado ? currentUser.frente_asignado : 'Planificación Operativa'}
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-4 flex items-start gap-3 text-sm">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Frente */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-card">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" /> Frente de Cosecha
            </label>
            <select
              value={selectedFrente}
              onChange={(e) => setSelectedFrente(e.target.value)}
              disabled={frenteActivo && !!currentUser.frente_asignado}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 disabled:opacity-60"
            >
              <option value="">Seleccione un frente...</option>
              {frentes.map((f) => (
                <option key={f.nombre} value={f.nombre}>
                  {f.nombre} ({f.tipo_cosecha})
                </option>
              ))}
            </select>
          </div>

          {/* Finca y Lote */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-card">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" /> Ubicación Agronómica
            </label>

            <div className="relative">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fincaQuery}
                  onChange={(e) => {
                    setFincaQuery(e.target.value);
                    setIsFincaDropdownOpen(true);
                    if (e.target.value !== selectedFinca) {
                      setSelectedFinca('');
                      setSelectedLoteId('');
                    }
                  }}
                  onFocus={() => setIsFincaDropdownOpen(true)}
                  placeholder="Buscar finca..."
                  className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-9 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                />
                {fincaQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setFincaQuery('');
                      setSelectedFinca('');
                      setSelectedLoteId('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {isFincaDropdownOpen && fincasFiltradas.length > 0 && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden max-h-56 overflow-y-auto">
                  {fincasFiltradas.map((finca) => (
                    <button
                      key={finca}
                      type="button"
                      onClick={() => handleSelectFinca(finca)}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                    >
                      {finca}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedFinca && (
              <select
                value={selectedLoteId}
                onChange={(e) => handleSelectLote(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="">Seleccione un lote...</option>
                {lotesDeFinca.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.lote} · {l.area_ha.toFixed(2)} Ha{l.variedad ? ` · ${l.variedad}` : ''}
                  </option>
                ))}
              </select>
            )}

            {selectedLoteId && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Hectáreas</p>
                  <p className="text-sm font-bold text-emerald-700">{areaHa.toFixed(2)} Ha</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-center overflow-hidden">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Variedad</p>
                  <p className="text-sm font-bold text-blue-700 truncate">{variedad || '—'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Tipo de cosecha, tonelaje y hora planificada */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-card">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Sprout className="w-3.5 h-3.5" /> Detalle de la Quema
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500">Tipo de Cosecha</span>
                <select
                  value={tipoCosecha}
                  onChange={(e) => setTipoCosecha(e.target.value as 'Mecanizada' | 'Manual' | 'Mixta')}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="Mecanizada">Mecanizada</option>
                  <option value="Manual">Manual</option>
                  <option value="Mixta">Mixta</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500">Tonelaje Estimado (opcional)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={tonelaje}
                  onChange={(e) => setTonelaje(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> Hora Planificada de Quema *
              </span>
              <input
                type="datetime-local"
                required
                value={horaPlanificada}
                onChange={(e) => setHoraPlanificada(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500">Prioridad</span>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(PRIORIDADES_CONFIG) as Prioridad[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPrioridad(p)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition ${
                      prioridad === p
                        ? PRIORIDADES_CONFIG[p].badgeColor + ' ring-1 ring-black/5'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {PRIORIDADES_CONFIG[p].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500">Observaciones (opcional)</span>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={3}
                placeholder="Indicaciones adicionales para la patrulla o el despacho..."
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-sm py-4 rounded-2xl shadow-panel transition"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Enviando...
              </>
            ) : (
              <>
                <Flame className="w-4 h-4" /> Enviar Solicitud de Quema
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
