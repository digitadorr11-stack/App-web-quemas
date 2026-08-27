'use client';

import React, { useState } from 'react';
import { BurnRequest, Farm, Front, Patrol, UserProfile } from '@/lib/types';
import { AlertTriangle, Flame, X, ShieldAlert, Clock, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

interface ReportCriminalBurnModalProps {
  isOpen: boolean;
  onClose: () => void;
  farms: Farm[];
  fronts: Front[];
  patrols: Patrol[];
  currentUser: UserProfile;
  onCreateCriminalBurn: (data: Omit<BurnRequest, 'id' | 'burn_number' | 'created_at' | 'updated_at'>) => Promise<void>;
}

export const ReportCriminalBurnModal: React.FC<ReportCriminalBurnModalProps> = ({
  isOpen,
  onClose,
  farms,
  fronts,
  patrols,
  currentUser,
  onCreateCriminalBurn,
}) => {
  const userPatrol = patrols.find(
    (p) =>
      p.id === currentUser?.assigned_patrol_id ||
      p.name === currentUser?.assigned_patrol_name ||
      (currentUser?.assigned_patrol_name && p.name.includes(currentUser.assigned_patrol_name))
  );

  const [farmName, setFarmName] = useState(farms[0]?.name || 'Finca Las Victorias');
  const [frontNumber, setFrontNumber] = useState(currentUser.assigned_front || fronts[0]?.name || 'Frente 15');
  const [loteUm, setLoteUm] = useState('');
  const [areaHectares, setAreaHectares] = useState<number | ''>(5);
  const [estimatedTonnage, setEstimatedTonnage] = useState<number | ''>(450);
  const [selectedPatrolId, setSelectedPatrolId] = useState(userPatrol?.id || patrols[0]?.id || 'pat-c2');
  const [selectedLeader, setSelectedLeader] = useState(currentUser.role === 'patrulla' ? currentUser.full_name : '');
  const [detectedAt, setDetectedAt] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [observations, setObservations] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentPatrol = patrols.find((p) => p.id === selectedPatrolId) || patrols[0];
  const leadersList = currentPatrol?.leader_name?.split(' / ') || [];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName || !frontNumber) {
      setErrorMsg('Por favor complete la finca y el frente del siniestro.');
      return;
    }
    if (!currentPatrol) {
      setErrorMsg('Debe seleccionar la patrulla despachada a combatir el fuego.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      const nowIso = new Date(detectedAt).toISOString();
      const payload: Omit<BurnRequest, 'id' | 'burn_number' | 'created_at' | 'updated_at'> = {
        burn_type: 'CRIMINAL',
        front_number: frontNumber,
        shift_supervisor_name: currentUser.full_name,
        farm_name: farmName,
        lote_um: loteUm || 'Zona de Emergencia',
        area_hectares: Number(areaHectares) || 0,
        area_manzanas: Number(((Number(areaHectares) || 0) * 1.4308).toFixed(2)),
        estimated_tonnage: Number(estimatedTonnage) || 0,
        planned_burn_time: nowIso,
        requested_at: nowIso,
        created_by_user_id: currentUser.id,
        created_by_name: currentUser.full_name,
        status: 'EN_QUEMA', // Starts directly in active burn
        assigned_patrol_id: currentPatrol.id,
        assigned_patrol_name: currentPatrol.name,
        assigned_patrol_leader: selectedLeader || leadersList[0] || currentPatrol.leader_name,
        patrol_assigned_at: nowIso,
        patrol_confirmed_at: nowIso,
        patrol_arrived_at: nowIso,
        burn_started_at: nowIso,
        review_notes: `[QUEMA CRIMINAL / EMERGENCIA]: ${observations || 'Fuego no programado reportado en campo.'}`,
      };

      await onCreateCriminalBurn(payload);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al reportar quema criminal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border-2 border-red-500 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Emergency Header */}
        <div className="bg-gradient-to-r from-red-700 via-rose-800 to-red-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-red-600 border border-red-400 flex items-center justify-center shadow-lg animate-pulse">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest bg-red-950/80 text-red-200 px-2 py-0.5 rounded-md border border-red-400/40">
                  Protocolo de Emergencia
                </span>
              </div>
              <h2 className="text-lg font-black tracking-tight text-white mt-0.5">
                Reportar Quema Criminal / Incendio
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="text-red-200 hover:text-white p-1.5 rounded-xl hover:bg-red-800/50 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="bg-red-50 px-6 py-2.5 border-b border-red-200 flex items-center gap-2 text-xs text-red-800 font-medium">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>
            Este registro bloqueará la disponibilidad de la patrulla asignada indicando que está en combate de fuego no programado.
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs rounded-xl font-bold">
              {errorMsg}
            </div>
          )}

          {/* Ubicación del Siniestro */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Finca Afectada *</label>
              <select
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-900"
                required
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Frente de Cosecha Cercano *</label>
              <select
                value={frontNumber}
                onChange={(e) => setFrontNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-900"
                required
              >
                {fronts.map((fr) => (
                  <option key={fr.id} value={fr.name}>
                    {fr.name} ({fr.harvest_type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Lote / Punto</label>
              <input
                type="text"
                value={loteUm}
                onChange={(e) => setLoteUm(e.target.value)}
                placeholder="ej: Lote 08 / Callejón 4"
                className="w-full p-2 rounded-xl border border-gray-300 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Área Aprox (ha)</label>
              <input
                type="number"
                step="0.1"
                value={areaHectares}
                onChange={(e) => setAreaHectares(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="5.0"
                className="w-full p-2 rounded-xl border border-gray-300 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Tons Aprox (TM)</label>
              <input
                type="number"
                value={estimatedTonnage}
                onChange={(e) => setEstimatedTonnage(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="450"
                className="w-full p-2 rounded-xl border border-gray-300 text-xs font-bold"
              />
            </div>
          </div>

          {/* Patrulla Despachada de Inmediato */}
          <div className="p-4 bg-red-50/70 border border-red-200 rounded-2xl space-y-3">
            <div>
              <label className="block text-xs font-extrabold text-red-950 uppercase tracking-wider mb-1.5">
                🚒 Patrulla Despachada a Controlar el Fuego *
              </label>
              <select
                value={selectedPatrolId}
                onChange={(e) => {
                  setSelectedPatrolId(e.target.value);
                  const p = patrols.find((x) => x.id === e.target.value);
                  if (p) {
                    const l = p.leader_name.split(' / ')[0];
                    setSelectedLeader(l);
                  }
                }}
                className="w-full bg-white border border-red-300 rounded-xl p-2.5 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-red-600 focus:outline-none"
                required
              >
                {patrols.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.leader_name.split(' / ')[0]})
                  </option>
                ))}
              </select>
            </div>

            {leadersList.length > 1 && (
              <div>
                <label className="block text-xs font-bold text-red-900 mb-1">
                  Encargado al Mando de la Emergencia
                </label>
                <select
                  value={selectedLeader || leadersList[0]}
                  onChange={(e) => setSelectedLeader(e.target.value)}
                  className="w-full bg-white border border-red-300 rounded-xl p-2 text-xs font-bold text-gray-900"
                >
                  {leadersList.map((leader) => (
                    <option key={leader} value={leader}>
                      👤 {leader}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Hora de Detección */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Hora de Detección / Despacho *
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="datetime-local"
                value={detectedAt}
                onChange={(e) => setDetectedAt(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 font-bold"
                required
              />
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Observaciones del Incidente / Causa
            </label>
            <textarea
              rows={2}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Describa el origen del fuego, dirección del viento, riesgo a caña en pie o vecinos..."
              className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
            />
          </div>

          {/* Footer Buttons */}
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
              className="px-5 py-2.5 text-xs font-black text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-600/40 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>{isSubmitting ? 'Registrando...' : 'Despachar Emergencia'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
