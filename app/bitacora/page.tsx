'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { AuditLog, UserProfile, ROLE_DETAILS, ActionType } from '@/lib/types';
import { storageService } from '@/lib/storageService';
import { exportAuditLogsToExcel } from '@/lib/exportUtils';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Clock,
  User,
  ArrowRight,
  FileText,
  RotateCcw,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';

export default function BitacoraPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => storageService.getActiveUser());
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const data = await storageService.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error('Error loading audit logs', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleUserChange = (user: UserProfile) => {
    setCurrentUser(user);
    storageService.setActiveUser(user);
  };

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (log.burn_number && log.burn_number.toLowerCase().includes(q)) ||
        log.user_name.toLowerCase().includes(q) ||
        (log.field_name && log.field_name.toLowerCase().includes(q)) ||
        (log.change_reason && log.change_reason.toLowerCase().includes(q)) ||
        (log.new_value && log.new_value.toLowerCase().includes(q));

      const matchRole = roleFilter === 'ALL' || log.user_role === roleFilter;
      const matchAction = actionFilter === 'ALL' || log.action_type === actionFilter;

      return matchSearch && matchRole && matchAction;
    });
  }, [logs, searchQuery, roleFilter, actionFilter]);

  return (
    <>
      <Navbar
        currentUser={currentUser}
        onUserChange={handleUserChange}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        
        {/* Header Banner */}
        <div className="mb-6 bg-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Sistema de Trazabilidad & Cumplimiento
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
              Bitácora de Auditoría e Historial de Modificaciones
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Registro inmutable de todas las acciones operativas, correcciones de datos, tiempos de campo, validaciones de digitador y cancelaciones realizadas en el sistema.
            </p>
          </div>

          <div>
            <button
              onClick={() => exportAuditLogsToExcel(filteredLogs)}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Bitácora a Excel</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            
            {/* Search */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por usuario, no. quema, campo o motivo..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-600 focus:outline-none"
              />
            </div>

            {/* Role Filter */}
            <div className="sm:col-span-3">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full py-2 px-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-600 bg-white"
              >
                <option value="ALL">Todos los Roles</option>
                <option value="supervisor_frente">Supervisor de Frente</option>
                <option value="supervisor_quemas">Supervisor de Quemas</option>
                <option value="patrulla">Patrulla de Quema</option>
                <option value="digitador">Digitador de Quemas</option>
                <option value="jefatura">Jefatura / Gerencia</option>
              </select>
            </div>

            {/* Action Filter */}
            <div className="sm:col-span-3">
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full py-2 px-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-600 bg-white"
              >
                <option value="ALL">Todas las Acciones</option>
                <option value="CREACION">Creación de Solicitud</option>
                <option value="ASIGNACION_PATRULLA">Asignación de Patrulla</option>
                <option value="LLEGADA_PATRULLA">Llegada de Patrulla</option>
                <option value="REVISION_AREA">Revisión de Área</option>
                <option value="VALIDACION_DIGITADOR">Validación de Digitador</option>
                <option value="INICIO_QUEMA">Inicio de Quema</option>
                <option value="FIN_QUEMA">Fin de Quema</option>
                <option value="EDICION_CAMPO">Edición / Corrección de Campo</option>
                <option value="CANCELACION">Cancelación de Quema</option>
              </select>
            </div>

            {/* Reset */}
            <div className="sm:col-span-1 flex justify-end">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setRoleFilter('ALL');
                  setActionFilter('ALL');
                }}
                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                title="Limpiar filtros"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Audit Trail List */}
        <div className="space-y-3">
          <div className="text-xs text-gray-500 font-medium px-1">
            Total de eventos registrados: <span className="font-bold text-gray-900">{filteredLogs.length}</span>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-gray-500 text-sm">
              Cargando bitácora de auditoría...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">No se encontraron registros</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                No hay eventos de auditoría que coincidan con los filtros seleccionados.
              </p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const roleMeta = ROLE_DETAILS[log.user_role] || {
                label: log.user_role,
                badgeColor: 'bg-gray-100 text-gray-800 border-gray-300',
              };

              const isCorrection = log.action_type === 'EDICION_CAMPO';
              const isCancellation = log.action_type === 'CANCELACION';

              return (
                <div
                  key={log.id}
                  className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-sm transition hover:shadow ${
                    isCorrection
                      ? 'border-purple-200 bg-purple-50/10'
                      : isCancellation
                      ? 'border-rose-200 bg-rose-50/10'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 flex items-center gap-2">
                          <span>{log.user_name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleMeta.badgeColor}`}>
                            {roleMeta.label}
                          </span>
                        </div>
                        {log.burn_number && (
                          <div className="text-[11px] text-gray-500 font-semibold">
                            Solicitud: <span className="text-union-800 font-bold">{log.burn_number}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss')}</span>
                    </div>
                  </div>

                  <div className="mt-3 text-xs space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                          isCorrection
                            ? 'bg-purple-100 text-purple-900 border border-purple-300'
                            : isCancellation
                            ? 'bg-rose-100 text-rose-900 border border-rose-300'
                            : 'bg-slate-100 text-slate-800 border border-slate-300'
                        }`}
                      >
                        {log.action_type.replace(/_/g, ' ')}
                      </span>

                      {log.field_name && (
                        <span className="text-[11px] font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                          Campo: {log.field_name}
                        </span>
                      )}
                    </div>

                    {/* Diff comparison */}
                    {(log.old_value !== undefined || log.new_value !== undefined) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 p-3 rounded-xl bg-gray-50 border border-gray-200">
                        {log.old_value && (
                          <div className="p-2 bg-rose-50 rounded-lg border border-rose-200 text-rose-900">
                            <span className="text-[10px] font-bold uppercase text-rose-700 block mb-0.5">
                              Valor Anterior:
                            </span>
                            <span className="line-through">{log.old_value}</span>
                          </div>
                        )}
                        {log.new_value && (
                          <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900">
                            <span className="text-[10px] font-bold uppercase text-emerald-700 block mb-0.5">
                              Valor Nuevo:
                            </span>
                            <span className="font-bold">{log.new_value}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reason */}
                    {log.change_reason && (
                      <div className="mt-2 text-xs text-gray-800 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200">
                        <span className="font-bold text-amber-900">Justificación / Motivo:</span>{' '}
                        {log.change_reason}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </main>
    </>
  );
}
