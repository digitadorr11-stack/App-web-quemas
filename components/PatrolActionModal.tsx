'use client';

import React, { useState } from 'react';
import { BurnRequest, ReviewChecklist, UserProfile } from '@/lib/types';
import { X, CheckCircle, Clock, ShieldCheck, Flame, AlertTriangle, CheckSquare, Square, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface PatrolActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  burn: BurnRequest;
  currentUser: UserProfile;
  onConfirmArrival: (burnId: string, arrivedAt: string) => Promise<void>;
  onCompleteReview: (
    burnId: string,
    durationMinutes: number,
    checklist: ReviewChecklist,
    notes: string,
    completedAt: string
  ) => Promise<void>;
  onStartBurn: (burnId: string, startedAt: string) => Promise<void>;
  onFinishBurn: (burnId: string, endedAt: string, durationMinutes: number) => Promise<void>;
  onOpenCancel: (burn: BurnRequest) => void;
}

export const PatrolActionModal: React.FC<PatrolActionModalProps> = ({
  isOpen,
  onClose,
  burn,
  currentUser,
  onConfirmArrival,
  onCompleteReview,
  onStartBurn,
  onFinishBurn,
  onOpenCancel,
}) => {
  const now = new Date();
  const formatTimeInput = (d: Date) => format(d, "yyyy-MM-dd'T'HH:mm");

  // Arrival state
  const [arrivedAt, setArrivedAt] = useState(formatTimeInput(now));

  // Review state
  const [reviewDuration, setReviewDuration] = useState<number | ''>(25);
  const [checklist, setChecklist] = useState<ReviewChecklist>({
    firebreak_verified: true,
    wind_conditions_favorable: true,
    neighboring_crops_safe: true,
    water_tank_ready: true,
    personnel_equipped: true,
  });
  const [reviewNotes, setReviewNotes] = useState('Ronda y cortafuegos en óptimas condiciones. Equipo de respuesta listo.');

  // Burn Execution state
  const [startedAt, setStartedAt] = useState(formatTimeInput(now));
  const [endedAt, setEndedAt] = useState(formatTimeInput(now));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const isArrivalStage = burn.status === 'PATRULLA_ASIGNADA';
  const isReviewStage = burn.status === 'EN_REVISION';
  const isStartBurnStage = burn.status === 'VALIDADA';
  const isFinishBurnStage = burn.status === 'EN_QUEMA';

  // Toggle checklist items
  const toggleCheck = (key: keyof ReviewChecklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecksPassed = Object.values(checklist).every(Boolean);

  const handleArrivalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await onConfirmArrival(burn.id, new Date(arrivedAt).toISOString());
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al registrar llegada');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewDuration || Number(reviewDuration) <= 0) {
      setErrorMsg('Ingrese la duración de la revisión en minutos.');
      return;
    }
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await onCompleteReview(
        burn.id,
        Number(reviewDuration),
        checklist,
        reviewNotes,
        new Date().toISOString()
      );
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al completar revisión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartBurnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await onStartBurn(burn.id, new Date(startedAt).toISOString());
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al iniciar quema');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishBurnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      const start = burn.burn_started_at ? new Date(burn.burn_started_at).getTime() : now.getTime() - 60 * 60 * 1000;
      const end = new Date(endedAt).getTime();
      const durationMin = Math.max(1, Math.round((end - start) / (1000 * 60)));

      await onFinishBurn(burn.id, new Date(endedAt).toISOString(), durationMin);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al finalizar quema');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-fire-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-fire-700/60 border border-fire-500/40 flex items-center justify-center">
              <Flame className="w-5 h-5 text-fire-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Panel de Operaciones de Patrulla</h2>
              <p className="text-xs text-fire-200">
                {burn.burn_number} • {burn.front_number} ({burn.farm_name})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-fire-200 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* ============================================================== */}
          {/* ETAPA 1: CONFIRMAR LLEGADA AL FRENTE                           */}
          {/* ============================================================== */}
          {isArrivalStage && (
            <form onSubmit={handleArrivalSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>
                  Confirma que la patrulla ha recibido la asignación y registra la <strong>hora exacta de llegada al frente</strong>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Hora de Llegada al Frente <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="datetime-local"
                    value={arrivedAt}
                    onChange={(e) => setArrivedAt(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-fire-600 font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-fire-700 hover:bg-fire-600 rounded-lg shadow-md flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isSubmitting ? 'Registrando...' : 'Confirmar Llegada e Iniciar Revisión'}</span>
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* ETAPA 2: REVISIÓN DE SEGURIDAD Y TIEMPOS                       */}
          {/* ============================================================== */}
          {isReviewStage && (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="p-3 bg-union-50 border border-union-200 rounded-xl text-xs text-union-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-union-700 flex-shrink-0 mt-0.5" />
                <p>
                  Inspecciona el área antes de la quema. Verifica el checklist de seguridad y registra el tiempo total que tomó la inspección.
                </p>
              </div>

              {/* Checklist de Seguridad */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Lista de Verificación de Seguridad en Campo <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  
                  <label
                    onClick={() => toggleCheck('firebreak_verified')}
                    className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-union-500 transition"
                  >
                    {checklist.firebreak_verified ? (
                      <CheckSquare className="w-5 h-5 text-union-700 flex-shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                    <span className="text-xs font-medium text-gray-800">
                      Rondas y cortafuegos limpios (ancho mínimo reglamentario verificado)
                    </span>
                  </label>

                  <label
                    onClick={() => toggleCheck('wind_conditions_favorable')}
                    className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-union-500 transition"
                  >
                    {checklist.wind_conditions_favorable ? (
                      <CheckSquare className="w-5 h-5 text-union-700 flex-shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                    <span className="text-xs font-medium text-gray-800">
                      Condición y velocidad del viento favorable (sin ráfagas de riesgo)
                    </span>
                  </label>

                  <label
                    onClick={() => toggleCheck('neighboring_crops_safe')}
                    className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-union-500 transition"
                  >
                    {checklist.neighboring_crops_safe ? (
                      <CheckSquare className="w-5 h-5 text-union-700 flex-shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                    <span className="text-xs font-medium text-gray-800">
                      Cañales, cultivos y comunidades vecinas asegurados / sin riesgo
                    </span>
                  </label>

                  <label
                    onClick={() => toggleCheck('water_tank_ready')}
                    className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-union-500 transition"
                  >
                    {checklist.water_tank_ready ? (
                      <CheckSquare className="w-5 h-5 text-union-700 flex-shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                    <span className="text-xs font-medium text-gray-800">
                      Cisterna de agua con motobomba y mangueras en posición de contingencia
                    </span>
                  </label>

                  <label
                    onClick={() => toggleCheck('personnel_equipped')}
                    className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-union-500 transition"
                  >
                    {checklist.personnel_equipped ? (
                      <CheckSquare className="w-5 h-5 text-union-700 flex-shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                    <span className="text-xs font-medium text-gray-800">
                      Personal de patrulla completo con EPP y matarruegos listos
                    </span>
                  </label>

                </div>
              </div>

              {/* Tiempo de Revisión */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Tiempo que tomó la revisión del área (Minutos) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={reviewDuration}
                    onChange={(e) => setReviewDuration(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-union-600 font-bold"
                    required
                  />
                </div>
              </div>

              {/* Notas de la Revisión */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Observaciones / Notas de la Inspección
                </label>
                <textarea
                  rows={2}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Detalles sobre rondas, viento o precauciones tomadas..."
                  className="w-full p-2.5 text-xs rounded-lg border border-gray-300 focus:ring-2 focus:ring-union-600"
                />
              </div>

              {/* Opciones de Cancelación y Envío */}
              <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCancel(burn);
                  }}
                  className="px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Cancelar Quema por Riesgo</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !allChecksPassed}
                    className={`px-4 py-2 text-xs font-bold text-white rounded-lg shadow-md transition flex items-center space-x-1.5 ${
                      allChecksPassed
                        ? 'bg-union-800 hover:bg-union-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{isSubmitting ? 'Guardando...' : 'Completar Revisión ➔ Enviar a Digitador'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* ETAPA 3: INICIAR QUEMA (POST-VALIDACIÓN)                       */}
          {/* ============================================================== */}
          {isStartBurnStage && (
            <form onSubmit={handleStartBurnSubmit} className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <p>
                  Esta solicitud ha sido <strong>VALIDADA por el Digitador ({burn.validated_by_name})</strong>. Tienes luz verde para encender la quema.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Hora de Inicio de Quema <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Flame className="w-4 h-4 text-fire-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="datetime-local"
                    value={startedAt}
                    onChange={(e) => setStartedAt(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-fire-400 bg-fire-50/50 text-fire-900 focus:ring-2 focus:ring-fire-600 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg shadow-md flex items-center space-x-2 animate-pulse"
                >
                  <Flame className="w-4 h-4" />
                  <span>{isSubmitting ? 'Registrando...' : 'Registrar Inicio de Fuego'}</span>
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* ETAPA 4: FINALIZAR QUEMA Y LIQUIDACIÓN                         */}
          {/* ============================================================== */}
          {isFinishBurnStage && (
            <form onSubmit={handleFinishBurnSubmit} className="space-y-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-start gap-2">
                <Flame className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p>
                  Quema actualmente activa iniciada a las{' '}
                  <span className="font-bold">
                    {burn.burn_started_at ? format(new Date(burn.burn_started_at), 'HH:mm') : '-'}
                  </span>
                  . Registra la hora de finalización una vez liquidado todo rescoldo.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Hora de Fin de Quema y Liquidación <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="datetime-local"
                    value={endedAt}
                    onChange={(e) => setEndedAt(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 rounded-lg shadow-md flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isSubmitting ? 'Guardando...' : 'Finalizar y Liquidar Quema'}</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
