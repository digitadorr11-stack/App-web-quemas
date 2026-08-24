import React from 'react';
import { BurnStatus, STATUS_DETAILS } from '@/lib/types';
import { Clock, UserPlus, Search, CheckCircle2, Flame, CheckCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: BurnStatus;
  size?: 'sm' | 'md' | 'lg';
  showStep?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showStep = true }) => {
  const meta = STATUS_DETAILS[status] || {
    label: status,
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300',
    stepIndex: 0,
  };

  const getIcon = () => {
    switch (status) {
      case 'SOLICITADA':
        return <Clock className="w-3.5 h-3.5" />;
      case 'PATRULLA_ASIGNADA':
        return <UserPlus className="w-3.5 h-3.5" />;
      case 'EN_REVISION':
        return <Search className="w-3.5 h-3.5 animate-pulse" />;
      case 'REVISION_COMPLETADA':
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'VALIDADA':
        return <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />;
      case 'EN_QUEMA':
        return <Flame className="w-3.5 h-3.5 text-red-600 animate-bounce" />;
      case 'FINALIZADA':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />;
      case 'CANCELADA':
        return <XCircle className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border shadow-sm ${meta.bg} ${meta.text} ${meta.border} ${sizeClasses[size]}`}
    >
      {getIcon()}
      <span>{meta.label}</span>
    </span>
  );
};
