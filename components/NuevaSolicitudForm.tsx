'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { quemasService } from '@/lib/quemasService';
import { supabase } from '@/lib/supabaseClient';
import {
  FrontCatalog,
  FarmLoteCatalog,
  UserProfile,
  Prioridad,
  PRIORIDADES_CONFIG,
  BurnRequest,
} from '@/lib/types';
import {
  Flame,
  Search,
  X,
  Clock,
  MapPin,
  Layers,
  Sprout,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

interface NuevaSolicitudFormProps {
  currentUser: UserProfile;
  onSuccess: (solicitud: BurnRequest) => void;
  onCancel?: () => void;
}

function defaultHoraPlanificada(): string {
  const d = new Date();
  d.setHours(d.getHours() + 1);
  d.setMinutes(0, 0, 0);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export const NuevaSolicitudForm: React.FC<NuevaSolicitudFormProps> = ({
  currentUser,
  onSuccess,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
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

        if (currentUser.rol === 'supervisor_frente' && currentUser.frente_asignado) {
          setSelectedFrente(currentUser.frente_asignado);
        }
      } catch (err) {
        console.error('Error inicializando catálogos para nueva solicitud:', err);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [currentUser]);

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

  const frenteActivo = currentUser.rol === 'supervisor_frente';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

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

      onSuccess(nuevaSolicitud);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al enviar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center text-slate-500 space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold tracking-wide">Cargando catálogo agronómico y frentes...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl mx-auto">
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-4 flex items-start gap-3 text-sm">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* FRENTE DE COSECHA */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-blue-600" /> Frente de Cosecha
        </label>
        <select
          value={selectedFrente}
          onChange={(e) => setSelectedFrente(e.target.value)}
          disabled={frenteActivo && !!currentUser.frente_asignado}
          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 disabled:opacity-60"
        >
          <option value="">Seleccione un frente...</option>
          {frentes.map((f) => (
            <option key={f.nombre} value={f.nombre}>
              {f.nombre} ({f.tipo_cosecha})
            </option>
          ))}
        </select>
      </div>

      {/* UBICACIÓN AGRONÓMICA (FINCA Y LOTE) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Ubicación Agronómica
        </label>

        <div className="relative">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
              placeholder="Buscar finca en el maestro..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-9 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
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
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition font-medium"
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
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
          >
            <option value="">Seleccione un lote de {selectedFinca}...</option>
            {lotesDeFinca.map((l) => (
              <option key={l.id} value={l.id}>
                {l.lote} · {l.area_ha.toFixed(2)} Ha{l.variedad ? ` · ${l.variedad}` : ''}
              </option>
            ))}
          </select>
        )}

        {selectedLoteId && (
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-center">
              <p className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Hectáreas</p>
              <p className="text-base font-bold text-emerald-900 mt-0.5">{areaHa.toFixed(2)} Ha</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-center overflow-hidden">
              <p className="text-[10px] uppercase font-bold text-blue-800 tracking-wider">Variedad</p>
              <p className="text-base font-bold text-blue-900 truncate mt-0.5">{variedad || '—'}</p>
            </div>
          </div>
        )}
      </div>

      {/* DETALLE DE LA QUEMA */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Sprout className="w-3.5 h-3.5 text-amber-600" /> Detalle de la Quema
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Tipo de Cosecha</span>
            <select
              value={tipoCosecha}
              onChange={(e) => setTipoCosecha(e.target.value as 'Mecanizada' | 'Manual' | 'Mixta')}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
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
              placeholder="0.00 Tm"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-slate-400" /> Hora Planificada de Quema *
          </span>
          <input
            type="datetime-local"
            required
            value={horaPlanificada}
            onChange={(e) => setHoraPlanificada(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-500">Prioridad Operativa</span>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(PRIORIDADES_CONFIG) as Prioridad[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPrioridad(p)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  prioridad === p
                    ? PRIORIDADES_CONFIG[p].badgeColor + ' ring-2 ring-blue-500 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {PRIORIDADES_CONFIG[p].label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-500">Observaciones o Instrucciones (opcional)</span>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows={3}
            placeholder="Indicaciones para la patrulla, accesos, puntos de referencia..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3.5 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition cursor-pointer"
          >
            Cancelar y Volver
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-[#156b49] hover:bg-[#0f4e34] disabled:opacity-60 text-white font-bold text-xs sm:text-sm px-8 py-3.5 rounded-2xl shadow-card transition cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Registrando solicitud...</span>
            </>
          ) : (
            <>
              <Flame className="w-4 h-4 text-amber-300" />
              <span>Programar Solicitud de Quema</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
