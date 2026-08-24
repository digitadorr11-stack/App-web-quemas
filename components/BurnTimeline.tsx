import React from 'react';
import { BurnRequest, BurnStatus } from '@/lib/types';
import { Check, Clock, AlertTriangle, Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

interface BurnTimelineProps {
  burn: BurnRequest;
  compact?: boolean;
}

interface Step {
  key: string;
  title: string;
  subtitle?: string;
  time?: string;
  actor?: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isFailed?: boolean;
}

export const BurnTimeline: React.FC<BurnTimelineProps> = ({ burn, compact = false }) => {
  const isCancelled = burn.status === 'CANCELADA';

  const formatStepTime = (iso?: string) => {
    if (!iso) return undefined;
    try {
      return format(new Date(iso), 'HH:mm');
    } catch {
      return undefined;
    }
  };

  const steps: Step[] = [
    {
      key: 'solicitud',
      title: '1. Solicitud',
      subtitle: `Frente: ${burn.front_number}`,
      time: formatStepTime(burn.requested_at),
      actor: burn.created_by_name,
      isCompleted: true,
      isCurrent: burn.status === 'SOLICITADA',
    },
    {
      key: 'asignacion',
      title: '2. Asignación',
      subtitle: burn.assigned_patrol_name || 'Pendiente',
      time: formatStepTime(burn.patrol_assigned_at),
      actor: burn.assigned_patrol_name,
      isCompleted: Boolean(burn.assigned_patrol_id),
      isCurrent: burn.status === 'PATRULLA_ASIGNADA',
    },
    {
      key: 'revision',
      title: '3. Revisión',
      subtitle: burn.review_completed_at
        ? `${burn.review_duration_minutes || 20} min (Aprobada)`
        : burn.patrol_arrived_at
        ? 'En inspección'
        : 'Por iniciar',
      time: formatStepTime(burn.review_completed_at || burn.patrol_arrived_at),
      isCompleted: Boolean(burn.review_completed_at),
      isCurrent: burn.status === 'EN_REVISION' || burn.status === 'REVISION_COMPLETADA',
      isFailed: isCancelled && !burn.validated_at,
    },
    {
      key: 'validacion',
      title: '4. Validación',
      subtitle: burn.validated_at ? 'Visto Bueno Digitador' : 'Pendiente',
      time: formatStepTime(burn.validated_at),
      actor: burn.validated_by_name,
      isCompleted: Boolean(burn.validated_at),
      isCurrent: burn.status === 'VALIDADA',
      isFailed: isCancelled && Boolean(burn.review_completed_at) && !burn.burn_started_at,
    },
    {
      key: 'quema',
      title: '5. Quema',
      subtitle: burn.burn_started_at ? 'En progreso' : 'En espera',
      time: formatStepTime(burn.burn_started_at),
      isCompleted: Boolean(burn.burn_started_at),
      isCurrent: burn.status === 'EN_QUEMA',
    },
    {
      key: 'fin',
      title: '6. Fin & Liquidación',
      subtitle: burn.burn_ended_at ? 'Finalizada segura' : 'Pendiente',
      time: formatStepTime(burn.burn_ended_at),
      isCompleted: burn.status === 'FINALIZADA',
      isCurrent: burn.status === 'FINALIZADA',
    },
  ];

  if (compact) {
    return (
      <div className="w-full">
        {isCancelled && (
          <div className="mb-2 p-2 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <div>
              <span className="font-bold">Quema Cancelada:</span> {burn.cancellation_reason || 'Sin motivo registrado.'}
            </div>
          </div>
        )}
        <div className="grid grid-cols-6 gap-1 text-center">
          {steps.map((s, idx) => (
            <div key={s.key} className="flex flex-col items-center">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  s.isFailed
                    ? 'bg-rose-600 text-white'
                    : s.isCompleted
                    ? 'bg-emerald-600 text-white'
                    : s.isCurrent
                    ? 'bg-fire-500 text-white ring-2 ring-fire-300 ring-offset-1 animate-pulse'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s.isCompleted ? <Check className="w-3 h-3" /> : idx + 1}
              </div>
              <span className="text-[10px] text-gray-600 mt-1 truncate max-w-full font-medium">{s.title.split('.')[1]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      {isCancelled && (
        <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-600 rounded-r-lg flex items-start gap-3 text-sm text-rose-900">
          <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">SOLICITUD CANCELADA</p>
            <p className="text-xs text-rose-800 mt-0.5">
              Motivo: <span className="font-medium">{burn.cancellation_reason || 'No especificado'}</span>
            </p>
            {burn.cancelled_by_name && (
              <p className="text-[11px] text-rose-700 mt-1">
                Cancelado por: {burn.cancelled_by_name} ({burn.cancelled_by_role}) el {formatStepTime(burn.cancelled_at)}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="relative">
        {/* Connector Line */}
        <div className="hidden sm:block absolute top-5 left-6 right-6 h-0.5 bg-gray-200 -z-0" />

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative z-10">
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            return (
              <div
                key={step.key}
                className={`flex flex-col items-center text-center p-2 rounded-lg transition ${
                  step.isCurrent ? 'bg-fire-50/80 border border-fire-200' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all ${
                    step.isFailed
                      ? 'bg-rose-600 text-white'
                      : step.isCompleted
                      ? 'bg-union-700 text-white ring-4 ring-union-100'
                      : step.isCurrent
                      ? 'bg-fire-500 text-white ring-4 ring-fire-200 animate-pulse'
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}
                >
                  {step.isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : step.isCurrent ? (
                    <Flame className="w-5 h-5" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                <div className="mt-2.5">
                  <div className="text-xs font-bold text-gray-900">{step.title}</div>
                  <div className="text-[11px] text-gray-500 font-medium truncate max-w-[110px]">
                    {step.subtitle}
                  </div>
                  {step.time && (
                    <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-union-800 bg-union-50 px-1.5 py-0.5 rounded mt-1">
                      <Clock className="w-2.5 h-2.5" />
                      {step.time}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
