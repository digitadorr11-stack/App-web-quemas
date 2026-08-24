'use client';

import React, { useState } from 'react';
import { BurnRequest, Patrol, UserProfile } from '@/lib/types';
import { X, UserPlus, Clock, Shield, Phone, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface AssignPatrolModalProps {
  isOpen: boolean;
  onClose: () => void;
  burn: BurnRequest;
  patrols: Patrol[];
  currentUser: UserProfile;
  onAssign: (burnId: string, patrolId: string, patrolName: string, assignedAt: string) => Promise<void>;
}

export const AssignPatrolModal: React.FC<AssignPatrolModalProps> = ({
  isOpen,
  onClose,
  burn,
  patrols,
  currentUser,
  onAssign,
}) => {
  const [selectedPatrolId, setSelectedPatrolId] = useState(patrols[0]?.id || 'pat-1');
  const [assignedAt, setAssignedAt] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const patrol = patrols.find((p) => p.id === selectedPatrolId);
    if (!patrol) {
      setErrorMsg('Seleccione una patrulla válida.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await onAssign(burn.id, patrol.id, patrol.name, new Date(assignedAt).toISOString());
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al asignar patrulla');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-amber-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-700/50 border border-amber-500/40 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Asignación de Patrulla de Quema</h2>
              <p className="text-xs text-amber-200">Quema {burn.burn_number} - {burn.front_number} ({burn.farm_name})</p>
            </div>
          </div>
          <button onClick={onClose} className="text-amber-200 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* Resumen de la Solicitud */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500 block">Finca y Frente:</span>
              <span className="font-bold text-gray-800">{burn.farm_name} - {burn.front_number}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Área y Toneladas:</span>
              <span className="font-bold text-gray-800">{burn.area_hectares} ha / {burn.estimated_tonnage} TM</span>
            </div>
            <div>
              <span className="text-gray-500 block">Hora Planificada:</span>
              <span className="font-bold text-fire-700">{format(new Date(burn.planned_burn_time), 'dd/MM/yyyy HH:mm')}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Supervisor Frente:</span>
              <span className="font-bold text-gray-800">{burn.shift_supervisor_name}</span>
            </div>
          </div>

          {/* Selector de Patrulla */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Seleccionar Patrulla Disponible <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {patrols.map((patrol) => {
                const isSelected = selectedPatrolId === patrol.id;
                return (
                  <label
                    key={patrol.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/70 ring-1 ring-amber-600'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="patrol"
                        value={patrol.id}
                        checked={isSelected}
                        onChange={() => setSelectedPatrolId(patrol.id)}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <div className="font-bold text-sm text-gray-900">{patrol.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <span>{patrol.leader_name}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400" /> {patrol.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        patrol.status === 'DISPONIBLE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : patrol.status === 'EN_FRENTE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {patrol.status}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Hora de Asignación */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Hora de Despacho / Asignación <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="datetime-local"
                value={assignedAt}
                onChange={(e) => setAssignedAt(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                required
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Quedará registrado el tiempo exacto en que se instruye a la patrulla a desplazarse al frente.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-bold text-white bg-amber-700 hover:bg-amber-600 rounded-lg shadow-md transition flex items-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <span>{isSubmitting ? 'Asignando...' : 'Confirmar Asignación'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
