'use client';

import React, { useEffect, useState } from 'react';
import { BurnRequest, AuditLog, ROLE_DETAILS } from '@/lib/types';
import { storageService } from '@/lib/storageService';
import { X, ShieldCheck, Clock, User, ArrowRight, FileText, Search, Download } from 'lucide-react';
import { format } from 'date-fns';
import { exportAuditLogsToExcel } from '@/lib/exportUtils';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  burn: BurnRequest;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ isOpen, onClose, burn }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && burn) {
      setIsLoading(true);
      storageService
        .getAuditLogs(burn.id)
        .then((data) => setLogs(data))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, burn]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Bitácora de Auditoría e Historial de Cambios</h2>
              <p className="text-xs text-slate-300">
                Trazabilidad oficial de Quema: <span className="font-semibold text-white">{burn.burn_number}</span> ({burn.farm_name})
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => exportAuditLogsToExcel(logs, `Bitacora_${burn.burn_number}`)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-600 flex items-center gap-1.5 transition"
              title="Descargar Excel de esta bitácora"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Excel</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {isLoading ? (
            <div className="py-12 text-center text-gray-500 text-sm">
              Cargando historial de auditoría...
            </div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-sm">
              No hay registros de auditoría para esta solicitud.
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log, index) => {
                const roleMeta = ROLE_DETAILS[log.user_role] || {
                  label: log.user_role,
                  badgeColor: 'bg-gray-100 text-gray-800 border-gray-200',
                };

                return (
                  <div
                    key={log.id || index}
                    className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 hover:bg-gray-50 transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-gray-500" />
                          {log.user_name}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleMeta.badgeColor}`}>
                          {roleMeta.label}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-[11px] text-gray-500 font-medium">
                        <Clock className="w-3 h-3" />
                        <span>{format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss')}</span>
                      </div>
                    </div>

                    <div className="mt-2.5 text-xs space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider bg-slate-200/70 px-2 py-0.5 rounded">
                          {log.action_type.replace(/_/g, ' ')}
                        </span>
                        {log.field_name && (
                          <span className="font-semibold text-purple-900 bg-purple-100/70 px-2 py-0.5 rounded text-[11px]">
                            Campo: {log.field_name}
                          </span>
                        )}
                      </div>

                      {/* Diff view if values exist */}
                      {(log.old_value !== undefined || log.new_value !== undefined) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 p-2.5 rounded-lg bg-white border border-gray-200 text-xs">
                          {log.old_value && (
                            <div className="p-1.5 bg-rose-50 rounded border border-rose-200 text-rose-900">
                              <span className="text-[10px] font-bold uppercase text-rose-700 block">Valor Anterior:</span>
                              <span className="line-through">{log.old_value}</span>
                            </div>
                          )}
                          {log.new_value && (
                            <div className="p-1.5 bg-emerald-50 rounded border border-emerald-200 text-emerald-900">
                              <span className="text-[10px] font-bold uppercase text-emerald-700 block">Valor Nuevo:</span>
                              <span className="font-semibold">{log.new_value}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Justification Reason */}
                      {log.change_reason && (
                        <div className="mt-2 text-xs text-gray-700 bg-amber-50/70 p-2 rounded border border-amber-200/80">
                          <span className="font-bold text-amber-900">Justificación / Motivo:</span>{' '}
                          {log.change_reason}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
