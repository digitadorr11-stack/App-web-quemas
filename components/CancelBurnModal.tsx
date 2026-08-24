'use client';

import React, { useState } from 'react';
import { BurnRequest, UserProfile } from '@/lib/types';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';

interface CancelBurnModalProps {
  isOpen: boolean;
  onClose: () => void;
  burn: BurnRequest;
  currentUser: UserProfile;
  onConfirmCancel: (burnId: string, reason: string) => Promise<void>;
}

export const CancelBurnModal: React.FC<CancelBurnModalProps> = ({
  isOpen,
  onClose,
  burn,
  currentUser,
  onConfirmCancel,
}) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('Debe ingresar el motivo detallado de la cancelación.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await onConfirmCancel(burn.id, reason.trim());
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al cancelar la quema');
    } finally {
      setIsSubmitting(false);
    }
  };

  const presetReasons = [
    'Ráfagas de viento fuertes (> 25 km/h) con dirección a poblado o cañal vecino',
    'Ronda cortafuegos no cumple con el ancho reglamentario de seguridad',
    'Falla mecánica en equipo de cisterna o motobomba en campo',
    'Lluvia imprevista o alta humedad del material que impide quema controlada',
    'Presencia de ganado o fauna no evacuada en áreas colindantes',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-rose-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-800 border border-rose-700 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-rose-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Cancelar Solicitud de Quema</h2>
              <p className="text-xs text-rose-200">
                {burn.burn_number} • {burn.front_number} ({burn.farm_name})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-rose-300 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <p>
              Esta acción detendrá el proceso de la quema de forma permanente por motivos de seguridad o riesgo. Quedará registrada la justificación en la bitácora con el usuario <span className="font-bold">{currentUser.full_name}</span>.
            </p>
          </div>

          {/* Preset Buttons */}
          <div>
            <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Motivos frecuentes:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presetReasons.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setReason(preset)}
                  className="text-[11px] bg-gray-100 hover:bg-rose-100 hover:text-rose-800 text-gray-700 px-2 py-1 rounded border border-gray-200 transition text-left"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Motivo Textarea */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Motivo o Causal de Cancelación <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describa claramente la condición de riesgo observada..."
              className="w-full p-2.5 text-xs rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-600 focus:outline-none font-medium"
              required
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Volver Atrás
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-bold text-white bg-rose-700 hover:bg-rose-800 active:bg-rose-900 rounded-lg shadow-md transition flex items-center space-x-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{isSubmitting ? 'Cancelando...' : 'Confirmar Cancelación'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
