'use client';

import React, { useState, useEffect } from 'react';
import { BurnRequest, Patrol, UserProfile } from '@/lib/types';
import { X, UserPlus, Clock, Shield, Phone, Users, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

interface AssignPatrolModalProps {
  isOpen: boolean;
  onClose: () => void;
  burn: BurnRequest;
  patrols: Patrol[];
  allBurns?: BurnRequest[];
  currentUser: UserProfile;
  onAssign: (burnId: string, patrolId: string, patrolName: string, assignedAt: string, patrolLeader?: string) => Promise<void>;
}

export const AssignPatrolModal: React.FC<AssignPatrolModalProps> = ({
  isOpen,
  onClose,
  burn,
  patrols,
  allBurns = [],
  currentUser,
  onAssign,
}) => {
  const [selectedPatrolId, setSelectedPatrolId] = useState(patrols[0]?.id || 'pat-c2');
  const [selectedLeader, setSelectedLeader] = useState('');
  const [assignedAt, setAssignedAt] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentPatrol = patrols.find((p) => p.id === selectedPatrolId) || patrols[0];

  useEffect(() => {
    if (isOpen && burn) {
      const initialPatrolId = burn.assigned_patrol_id || patrols[0]?.id || 'pat-c2';
      setSelectedPatrolId(initialPatrolId);
      const matched = patrols.find((p) => p.id === initialPatrolId) || patrols[0];
      if (matched) {
        const leaders = matched.leader_name.split(' / ');
        setSelectedLeader(burn.assigned_patrol_leader || leaders[0] || matched.leader_name);
      }
      setAssignedAt(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
      setErrorMsg('');
    }
  }, [isOpen, burn, patrols]);

  useEffect(() => {
    if (currentPatrol) {
      const leaders = currentPatrol.leader_name.split(' / ');
      setSelectedLeader(leaders[0] || currentPatrol.leader_name);
    }
  }, [selectedPatrolId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPatrol) {
      setErrorMsg('Seleccione una clave de patrulla válida.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await onAssign(
        burn.id,
        currentPatrol.id,
        currentPatrol.name,
        new Date(assignedAt).toISOString(),
        selectedLeader || currentPatrol.leader_name
      );
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al asignar patrulla');
    } finally {
      setIsSubmitting(false);
    }
  };

  const leadersList = currentPatrol?.leader_name.split(' / ') || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-amber-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-700/60 border border-amber-500/40 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Despacho & Asignación de Patrulla</h2>
              <p className="text-xs text-amber-200">Quema {burn.burn_number} • {burn.front_number} ({burn.farm_name})</p>
            </div>
          </div>
          <button onClick={onClose} className="text-amber-200 hover:text-white p-1.5 rounded-xl hover:bg-amber-700/50 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          {/* Resumen de la Solicitud */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-2 gap-2.5 text-xs">
            <div>
              <span className="text-gray-500 block">Finca y Frente:</span>
              <span className="font-bold text-gray-900">{burn.farm_name} • {burn.front_number}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Área & Tonelaje:</span>
              <span className="font-bold text-gray-900">{burn.area_hectares} ha ({burn.estimated_tonnage} TM)</span>
            </div>
            <div>
              <span className="text-gray-500 block">Hora Planificada:</span>
              <span className="font-bold text-amber-700">{format(new Date(burn.planned_burn_time), 'dd/MM/yyyy HH:mm')}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Supervisor Solicitante:</span>
              <span className="font-bold text-gray-900">{burn.shift_supervisor_name}</span>
            </div>
          </div>

          {/* Selector de Patrulla / Clave */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider">
              1. Seleccionar Clave de Patrulla <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto p-1">
              {patrols.map((patrol) => {
                const isSelected = selectedPatrolId === patrol.id;
                
                // Find if patrol has an active burn
                const activeBurn = allBurns.find(
                  (b) =>
                    (b.assigned_patrol_id === patrol.id || b.assigned_patrol_name?.includes(patrol.name)) &&
                    b.status !== 'FINALIZADA' &&
                    b.status !== 'CANCELADA'
                );

                const isAvailable = !activeBurn;
                const isBurning = activeBurn?.status === 'EN_QUEMA';

                return (
                  <div
                    key={patrol.id}
                    onClick={() => setSelectedPatrolId(patrol.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/90 ring-2 ring-amber-600/30'
                        : isAvailable
                        ? 'border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50/60'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <div className="font-black text-xs text-gray-900 flex items-center gap-1.5">
                        <span>{patrol.name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
                      </div>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          isAvailable
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isBurning
                            ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {isAvailable ? '🟢 Disponible' : isBurning ? '🔴 En Quema' : '🟡 En Servicio'}
                      </span>
                    </div>

                    <div className="text-[10px] text-gray-600 space-y-0.5">
                      {isAvailable ? (
                        <div className="text-emerald-700 font-medium">Libre para asignación inmediata</div>
                      ) : (
                        <div className="font-medium text-slate-700 truncate">
                          Ocupada en: <span className="font-bold">{activeBurn?.burn_number}</span> ({activeBurn?.front_number})
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Encargado de Turno Específico */}
          {currentPatrol && (
            <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-3 animate-in fade-in">
              <div>
                <label className="block text-xs font-extrabold text-amber-950 uppercase tracking-wider mb-1.5">
                  2. Encargado de Quemas en Turno Hoy <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedLeader}
                  onChange={(e) => setSelectedLeader(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  required
                >
                  {leadersList.map((leader) => (
                    <option key={leader} value={leader}>
                      👤 {leader}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tripulantes de Cuadrilla */}
              {currentPatrol.crew_members && currentPatrol.crew_members.length > 0 && (
                <div className="pt-2 border-t border-amber-200/60">
                  <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Users className="w-3 h-3 text-amber-700" />
                    Personal de Cuadrilla Asignado ({currentPatrol.crew_members.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {currentPatrol.crew_members.map((member, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-white text-gray-700 px-2 py-0.5 rounded-md border border-amber-200 font-medium"
                      >
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Hora de Despacho */}
          <div>
            <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1">
              3. Hora de Despacho al Frente <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="datetime-local"
                value={assignedAt}
                onChange={(e) => setAssignedAt(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-600 focus:outline-none font-bold"
                required
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              Registro del momento exacto en que se envía la instrucción de desplazamiento al Encargado.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-600 rounded-xl shadow-lg shadow-amber-900/30 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Shield className="w-4 h-4" />
              <span>{isSubmitting ? 'Despachando...' : 'Confirmar y Despachar'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
