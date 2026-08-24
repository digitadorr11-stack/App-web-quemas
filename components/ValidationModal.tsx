'use client';

import React, { useState } from 'react';
import { BurnRequest, UserProfile } from '@/lib/types';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, Clock, MapPin, CheckSquare, Edit, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  burn: BurnRequest;
  currentUser: UserProfile;
  onValidate: (burnId: string, validationNotes: string) => Promise<void>;
  onOpenEdit: (burn: BurnRequest) => void;
  onOpenCancel: (burn: BurnRequest) => void;
}

export const ValidationModal: React.FC<ValidationModalProps> = ({
  isOpen,
  onClose,
  burn,
  currentUser,
  onValidate,
  onOpenEdit,
  onOpenCancel,
}) => {
  const [validationNotes, setValidationNotes] = useState('Información técnica y condiciones en campo validadas satisfactoriamente.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleValidateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await onValidate(burn.id, validationNotes);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al validar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-purple-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-800/60 border border-purple-500/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Validación Pre-Quema (Digitador)</h2>
              <p className="text-xs text-purple-200">
                Quema {burn.burn_number} • {burn.front_number} ({burn.farm_name})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-purple-200 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleValidateSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* Resumen de Información */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-bold uppercase text-gray-500">Resumen Técnico de la Solicitud</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenEdit(burn);
                }}
                className="text-xs text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 bg-purple-100 hover:bg-purple-200 px-2 py-1 rounded transition"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>¿Corregir Datos?</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-gray-500 block">Finca y Frente:</span>
                <span className="font-bold text-gray-800">{burn.farm_name} ({burn.front_number})</span>
              </div>
              <div>
                <span className="text-gray-500 block">Área a Quemar:</span>
                <span className="font-bold text-gray-800">{burn.area_hectares} ha ({burn.area_manzanas ?? (burn.area_hectares * 1.4308).toFixed(2)} mz)</span>
              </div>
              <div>
                <span className="text-gray-500 block">Toneladas Estimadas:</span>
                <span className="font-bold text-gray-800">{burn.estimated_tonnage} TM</span>
              </div>
              <div>
                <span className="text-gray-500 block">Hora Planificada:</span>
                <span className="font-bold text-fire-700">{format(new Date(burn.planned_burn_time), 'dd/MM HH:mm')}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Patrulla Asignada:</span>
                <span className="font-bold text-gray-800">{burn.assigned_patrol_name || 'Sin Asignar'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Duración de Revisión:</span>
                <span className="font-bold text-emerald-700">{burn.review_duration_minutes || 20} minutos</span>
              </div>
            </div>

            {burn.review_notes && (
              <div className="pt-2 border-t border-gray-200 text-xs">
                <span className="text-gray-500 font-semibold block">Notas de la Patrulla:</span>
                <p className="text-gray-700 italic mt-0.5">{burn.review_notes}</p>
              </div>
            )}
          </div>

          {/* Checklist de Verificación Verificado */}
          <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-xl">
            <span className="text-xs font-bold text-emerald-900 uppercase block mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Estado de Inspección en Terreno
            </span>
            <div className="space-y-1 text-xs text-emerald-800">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-700" />
                <span>Rondas y cortafuegos inspeccionados y aprobados</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-700" />
                <span>Dirección y fuerza del viento monitoreada</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-700" />
                <span>Equipo de cisterna y personal en posición preventiva</span>
              </div>
            </div>
          </div>

          {/* Notas de Validación */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Dictamen / Notas de Validación del Digitador <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={validationNotes}
              onChange={(e) => setValidationNotes(e.target.value)}
              className="w-full p-3 text-xs rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:outline-none"
              required
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCancel(burn);
              }}
              className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1.5 transition"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Cancelar Quema</span>
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
                disabled={isSubmitting}
                className="px-5 py-2.5 text-xs font-bold text-white bg-purple-700 hover:bg-purple-600 active:bg-purple-800 rounded-lg shadow-md transition flex items-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Validando...' : 'Aprobar y Dar Luz Verde a Quema'}</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
