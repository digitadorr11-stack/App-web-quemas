'use client';

import React from 'react';
import { BurnRequest, UserProfile } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { BurnTimeline } from './BurnTimeline';
import { format } from 'date-fns';
import {
  MapPin,
  Clock,
  User,
  Shield,
  Edit,
  History,
  Flame,
  CheckCircle2,
  UserPlus,
  Search,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

interface BurnCardProps {
  burn: BurnRequest;
  currentUser: UserProfile;
  onOpenAssign: (burn: BurnRequest) => void;
  onOpenPatrolAction: (burn: BurnRequest) => void;
  onOpenValidation: (burn: BurnRequest) => void;
  onOpenEdit: (burn: BurnRequest) => void;
  onOpenAudit: (burn: BurnRequest) => void;
  onOpenCancel: (burn: BurnRequest) => void;
}

export const BurnCard: React.FC<BurnCardProps> = ({
  burn,
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
  const isFrente = currentUser.role === 'supervisor_frente' || isDigitador;

  const formatDateTime = (iso?: string) => {
    if (!iso) return '-';
    try {
      return format(new Date(iso), 'dd/MM HH:mm');
    } catch {
      return '-';
    }
  };

  const formatTime = (iso?: string) => {
    if (!iso) return '-';
    try {
      return format(new Date(iso), 'HH:mm');
    } catch {
      return '-';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-gray-900 tracking-tight">
                {burn.burn_number}
              </span>
              {burn.burn_type === 'CRIMINAL' && (
                <span className="text-[10px] font-black uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-md border border-red-700 animate-pulse flex items-center gap-1 shadow-sm">
                  <Flame className="w-3 h-3 text-amber-300" />
                  Criminal
                </span>
              )}
              <span className="text-xs font-bold text-union-800 bg-union-100 px-2 py-0.5 rounded-md">
                {burn.front_number}
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-gray-700 font-medium">
              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="truncate">{burn.farm_name}</span>
              {burn.lote_um && (
                <span className="bg-union-100 text-union-900 border border-union-300 text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                  Lote {burn.lote_um}
                </span>
              )}
            </div>
          </div>

          <StatusBadge status={burn.status} size="sm" />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 bg-gray-50/80 p-3 rounded-xl border border-gray-100 text-xs mb-4">
          <div>
            <span className="text-[11px] text-gray-500 block">Área & Toneladas:</span>
            <span className="font-bold text-gray-900">
              {burn.area_hectares} ha ({burn.estimated_tonnage} TM)
            </span>
          </div>
          <div>
            <span className="text-[11px] text-gray-500 block">Hora Planificada:</span>
            <span className="font-bold text-fire-700">
              {formatDateTime(burn.planned_burn_time)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-gray-500 block">Supervisor Frente:</span>
            <span className="font-medium text-gray-800 truncate block">
              {burn.shift_supervisor_name}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-gray-500 block">Patrulla & Encargado:</span>
            <span className="font-semibold text-gray-900 truncate block">
              {burn.assigned_patrol_name ? (
                <>
                  <span className="text-amber-900 font-bold">{burn.assigned_patrol_name}</span>
                  {burn.assigned_patrol_leader && (
                    <span className="text-[10px] text-gray-600 block truncate font-normal">
                      👤 {burn.assigned_patrol_leader}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-amber-600 italic">Sin asignar</span>
              )}
            </span>
          </div>
        </div>

        {/* Tiempos y Cronometría del Evento */}
        {(burn.burn_started_at || burn.burn_ended_at || burn.status === 'FINALIZADA') && (
          <div
            className={`mb-3 p-2.5 rounded-xl border text-xs flex items-center justify-between ${
              burn.status === 'FINALIZADA'
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : burn.burn_type === 'CRIMINAL'
                ? 'bg-red-50 border-red-200 text-red-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>{burn.status === 'FINALIZADA' ? 'Evento Finalizado:' : 'En Combate/Quema:'}</span>
              <span className="font-mono font-semibold">
                {burn.burn_started_at ? formatTime(burn.burn_started_at) : '—'}
                {burn.burn_ended_at ? ` ➔ ${formatTime(burn.burn_ended_at)}` : ''}
              </span>
            </div>
            {burn.burn_duration_minutes ? (
              <span className="bg-white px-2 py-0.5 rounded-md border border-emerald-300 font-extrabold text-emerald-800 font-mono shadow-xs">
                ⏱️ {burn.burn_duration_minutes} min
              </span>
            ) : burn.status === 'EN_QUEMA' ? (
              <span className="bg-red-600 text-white px-2 py-0.5 rounded-md font-extrabold text-[10px] animate-pulse">
                🔥 En progreso
              </span>
            ) : null}
          </div>
        )}

        {/* Compact Timeline */}
        <div className="mb-4">
          <BurnTimeline burn={burn} compact />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
        
        {/* Left Side: Audit & Edit */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onOpenAudit(burn)}
            className="p-2 text-gray-600 hover:text-union-800 hover:bg-union-50 rounded-lg border border-gray-200 transition"
            title="Ver Bitácora de Auditoría"
          >
            <History className="w-4 h-4" />
          </button>

          <button
            onClick={() => onOpenEdit(burn)}
            className="p-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg border border-gray-200 transition"
            title="Editar / Corregir Información"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>

        {/* Right Side: Role Workflow Step Action Buttons */}
        <div className="flex items-center space-x-1.5">
          
          {/* Step 1: Supervisor Quemas Asigna */}
          {burn.status === 'SOLICITADA' && isQuemas && (
            <button
              onClick={() => onOpenAssign(burn)}
              className="px-3 py-1.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-600 rounded-lg shadow-sm flex items-center gap-1.5 transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Asignar Patrulla</span>
            </button>
          )}

          {/* Step 2: Patrulla Confirma Llegada */}
          {burn.status === 'PATRULLA_ASIGNADA' && isPatrulla && (
            <button
              onClick={() => onOpenPatrolAction(burn)}
              className="px-3 py-1.5 text-xs font-bold text-white bg-fire-600 hover:bg-fire-500 rounded-lg shadow-sm flex items-center gap-1.5 transition"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Confirmar Llegada</span>
            </button>
          )}

          {/* Step 3: Patrulla Registra Revisión */}
          {burn.status === 'EN_REVISION' && isPatrulla && (
            <button
              onClick={() => onOpenPatrolAction(burn)}
              className="px-3 py-1.5 text-xs font-bold text-white bg-union-800 hover:bg-union-700 rounded-lg shadow-sm flex items-center gap-1.5 transition"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Registrar Revisión</span>
            </button>
          )}

          {/* Step 4: Digitador Valida */}
          {burn.status === 'REVISION_COMPLETADA' && isDigitador && (
            <button
              onClick={() => onOpenValidation(burn)}
              className="px-3 py-1.5 text-xs font-bold text-white bg-purple-700 hover:bg-purple-600 rounded-lg shadow-sm flex items-center gap-1.5 transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Validar Quema</span>
            </button>
          )}

          {/* Step 5: Patrulla Inicia Quema */}
          {burn.status === 'VALIDADA' && isPatrulla && (
            <button
              onClick={() => onOpenPatrolAction(burn)}
              className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 active:bg-red-700 rounded-lg shadow-sm flex items-center gap-1.5 animate-pulse transition"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Iniciar Quema</span>
            </button>
          )}

          {/* Step 6: Patrulla, Supervisor Quemas, Digitador o Admin Finaliza Quema */}
          {burn.status === 'EN_QUEMA' && (isPatrulla || isQuemas || isDigitador) && (
            <button
              onClick={() => onOpenPatrolAction(burn)}
              className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{burn.burn_type === 'CRIMINAL' ? '🚨 Liquidar y Liberar Patrulla' : 'Finalizar Quema'}</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
