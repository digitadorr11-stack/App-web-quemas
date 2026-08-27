'use client';

import React from 'react';
import { BurnRequest, UserProfile } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { format } from 'date-fns';
import {
  MapPin,
  Clock,
  User,
  History,
  Edit,
  UserPlus,
  Search,
  CheckCircle2,
  Flame,
  CheckCircle,
  AlertTriangle,
  MoreHorizontal,
} from 'lucide-react';

interface BurnTableProps {
  burns: BurnRequest[];
  currentUser: UserProfile;
  onOpenAssign: (burn: BurnRequest) => void;
  onOpenPatrolAction: (burn: BurnRequest) => void;
  onOpenValidation: (burn: BurnRequest) => void;
  onOpenEdit: (burn: BurnRequest) => void;
  onOpenAudit: (burn: BurnRequest) => void;
  onOpenCancel: (burn: BurnRequest) => void;
}

export const BurnTable: React.FC<BurnTableProps> = ({
  burns,
  currentUser,
  onOpenAssign,
  onOpenPatrolAction,
  onOpenValidation,
  onOpenEdit,
  onOpenAudit,
  onOpenCancel,
}) => {
  const isDigitador = currentUser.role === 'digitador' || currentUser.role === 'admin';
  const isQuemas = currentUser.role === 'supervisor_quemas' || isDigitador;
  const isPatrulla = currentUser.role === 'patrulla' || isDigitador;

  const formatTime = (iso?: string) => {
    if (!iso) return '-';
    try {
      return format(new Date(iso), 'HH:mm');
    } catch {
      return '-';
    }
  };

  const formatDate = (iso?: string) => {
    if (!iso) return '-';
    try {
      return format(new Date(iso), 'dd/MM/yyyy');
    } catch {
      return '-';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-white uppercase text-[11px] tracking-wider font-bold">
            <tr>
              <th className="py-3.5 px-4">No. Quema</th>
              <th className="py-3.5 px-4">Frente / Finca</th>
              <th className="py-3.5 px-4">Sup. Turno</th>
              <th className="py-3.5 px-4 text-right">Área (ha)</th>
              <th className="py-3.5 px-4 text-right">Tons (TM)</th>
              <th className="py-3.5 px-4 text-center">Hora Plan.</th>
              <th className="py-3.5 px-4">Patrulla</th>
              <th className="py-3.5 px-4">Estado</th>
              <th className="py-3.5 px-4 text-center">Tiempos</th>
              <th className="py-3.5 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {burns.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-gray-500">
                  No se encontraron solicitudes de quema con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              burns.map((burn) => (
                <tr key={burn.id} className="hover:bg-gray-50/80 transition">
                  {/* No. Quema */}
                  <td className="py-3.5 px-4 font-black text-gray-900 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span>{burn.burn_number}</span>
                      {burn.burn_type === 'CRIMINAL' && (
                        <span className="text-[9px] font-black uppercase bg-red-600 text-white px-1.5 py-0.2 rounded border border-red-700 animate-pulse">
                          Criminal
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Frente & Finca */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-gray-900">{burn.farm_name}</div>
                    {burn.lote_um && (
                      <div className="text-[11px] text-union-800 font-bold">
                        Lote / UM: {burn.lote_um}
                      </div>
                    )}
                    <div className="text-[11px] text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span>{burn.front_number}</span>
                    </div>
                  </td>

                  {/* Sup. Turno */}
                  <td className="py-3.5 px-4 font-medium text-gray-700 whitespace-nowrap">
                    {burn.shift_supervisor_name}
                  </td>

                  {/* Área ha */}
                  <td className="py-3.5 px-4 text-right font-bold text-gray-900">
                    {burn.area_hectares} ha
                    <span className="block text-[10px] text-gray-400 font-normal">
                      {burn.area_manzanas ?? (burn.area_hectares * 1.4308).toFixed(1)} mz
                    </span>
                  </td>

                  {/* Tons */}
                  <td className="py-3.5 px-4 text-right font-bold text-gray-900">
                    {burn.estimated_tonnage.toLocaleString()} TM
                  </td>

                  {/* Hora Plan */}
                  <td className="py-3.5 px-4 text-center font-bold text-fire-700 whitespace-nowrap">
                    {formatDate(burn.planned_burn_time)}
                    <span className="block text-[11px] font-normal text-gray-600">
                      {formatTime(burn.planned_burn_time)}
                    </span>
                  </td>

                  {/* Patrulla */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {burn.assigned_patrol_name ? (
                      <span className="font-semibold text-gray-900">{burn.assigned_patrol_name}</span>
                    ) : (
                      <span className="text-amber-600 italic">Sin Asignar</span>
                    )}
                  </td>

                  {/* Estado */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={burn.status} size="sm" />
                  </td>

                  {/* Tiempos */}
                  <td className="py-3.5 px-4 text-center text-xs text-gray-700 whitespace-nowrap">
                    {burn.status === 'FINALIZADA' ? (
                      <div className="space-y-0.5 font-mono">
                        <div className="font-bold text-gray-900">
                          {burn.burn_started_at ? formatTime(burn.burn_started_at) : '—'} ➔ {burn.burn_ended_at ? formatTime(burn.burn_ended_at) : '—'}
                        </div>
                        {burn.burn_duration_minutes && (
                          <span className="inline-block bg-emerald-100 text-emerald-800 font-black text-[10px] px-1.5 py-0.2 rounded border border-emerald-300">
                            ⏱️ {burn.burn_duration_minutes} min
                          </span>
                        )}
                      </div>
                    ) : burn.status === 'EN_QUEMA' ? (
                      <div className="space-y-0.5">
                        <span className="text-red-700 font-bold block font-mono">
                          Inicio: {formatTime(burn.burn_started_at)}
                        </span>
                        <span className="inline-block bg-red-100 text-red-800 text-[10px] font-black px-1.5 py-0.2 rounded border border-red-300 animate-pulse">
                          🔥 En progreso
                        </span>
                      </div>
                    ) : burn.patrol_arrived_at ? (
                      <span className="text-union-800 font-medium font-mono">
                        Llegada: {formatTime(burn.patrol_arrived_at)}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1.5">
                      
                      {/* Contextual Primary Action */}
                      {burn.status === 'SOLICITADA' && isQuemas && (
                        <button
                          onClick={() => onOpenAssign(burn)}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-amber-700 hover:bg-amber-600 rounded-md transition cursor-pointer"
                        >
                          Asignar
                        </button>
                      )}

                      {burn.status === 'PATRULLA_ASIGNADA' && isPatrulla && (
                        <button
                          onClick={() => onOpenPatrolAction(burn)}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-fire-600 hover:bg-fire-500 rounded-md transition cursor-pointer"
                        >
                          Llegada
                        </button>
                      )}

                      {burn.status === 'EN_REVISION' && isPatrulla && (
                        <button
                          onClick={() => onOpenPatrolAction(burn)}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-union-800 hover:bg-union-700 rounded-md transition cursor-pointer"
                        >
                          Revisar
                        </button>
                      )}

                      {burn.status === 'REVISION_COMPLETADA' && isDigitador && (
                        <button
                          onClick={() => onOpenValidation(burn)}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-purple-700 hover:bg-purple-600 rounded-md transition cursor-pointer"
                        >
                          Validar
                        </button>
                      )}

                      {burn.status === 'VALIDADA' && isPatrulla && (
                        <button
                          onClick={() => onOpenPatrolAction(burn)}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-md animate-pulse transition cursor-pointer"
                        >
                          Iniciar
                        </button>
                      )}

                      {burn.status === 'EN_QUEMA' && (isPatrulla || isQuemas || isDigitador) && (
                        <button
                          onClick={() => onOpenPatrolAction(burn)}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-md transition cursor-pointer flex items-center gap-1"
                        >
                          <span>{burn.burn_type === 'CRIMINAL' ? '🚨 Liquidar' : 'Finalizar'}</span>
                        </button>
                      )}

                      {/* Botón Bitácora */}
                      <button
                        onClick={() => onOpenAudit(burn)}
                        className="p-1.5 text-gray-500 hover:text-union-800 hover:bg-union-50 rounded-md border border-gray-200 transition"
                        title="Ver Bitácora de Auditoría"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>

                      {/* Botón Editar */}
                      <button
                        onClick={() => onOpenEdit(burn)}
                        className="p-1.5 text-gray-500 hover:text-purple-700 hover:bg-purple-50 rounded-md border border-gray-200 transition"
                        title="Corregir Información"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
