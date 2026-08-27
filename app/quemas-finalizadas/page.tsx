'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { StatusBadge } from '@/components/StatusBadge';
import { AuditLogModal } from '@/components/AuditLogModal';
import { EditBurnModal } from '@/components/EditBurnModal';
import { BurnRequest, Farm, Patrol, Front, UserProfile, ROLE_DETAILS } from '@/lib/types';
import { storageService } from '@/lib/storageService';
import { exportToExcel, exportToPDF } from '@/lib/exportUtils';
import { format } from 'date-fns';
import {
  CheckCircle2,
  Search,
  Filter,
  FileSpreadsheet,
  FileText,
  Clock,
  MapPin,
  Flame,
  ShieldCheck,
  History,
  Edit,
  RotateCcw,
  Sparkles,
  Layers,
  Award,
  TrendingUp,
  X,
} from 'lucide-react';

export default function QuemasFinalizadasPage() {
  const router = useRouter();

  // State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [burns, setBurns] = useState<BurnRequest[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [patrols, setPatrols] = useState<Patrol[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [farmFilter, setFarmFilter] = useState('ALL');
  const [frontFilter, setFrontFilter] = useState('ALL');

  // Modals
  const [selectedBurnForAudit, setSelectedBurnForAudit] = useState<BurnRequest | null>(null);
  const [selectedBurnForEdit, setSelectedBurnForEdit] = useState<BurnRequest | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      let user = storageService.getActiveUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      setCurrentUser(user);

      const [userBurns, fetchedFarms, fetchedPatrols] = await Promise.all([
        storageService.getBurnRequestsForUser(user),
        storageService.getFarms(),
        storageService.getPatrols(),
      ]);

      setBurns(userBurns);
      setFarms(fetchedFarms);
      setPatrols(fetchedPatrols);
    } catch (err) {
      console.error('Error loading finalized burns', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUserChange = (user: UserProfile) => {
    setCurrentUser(user);
    storageService.setActiveUser(user);
    loadData();
  };

  // Solo Quemas Finalizadas
  const finalizedBurns = useMemo(() => {
    return burns.filter((b) => b.status === 'FINALIZADA');
  }, [burns]);

  // Lista única de frentes presentes en las finalizadas
  const uniqueFronts = useMemo(() => {
    const frontsSet = new Set<string>();
    finalizedBurns.forEach((b) => {
      if (b.front_number) frontsSet.add(b.front_number);
    });
    return Array.from(frontsSet).sort();
  }, [finalizedBurns]);

  // Quemas filtradas
  const filteredBurns = useMemo(() => {
    return finalizedBurns.filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        b.burn_number.toLowerCase().includes(q) ||
        b.front_number.toLowerCase().includes(q) ||
        b.farm_name.toLowerCase().includes(q) ||
        b.shift_supervisor_name?.toLowerCase().includes(q) ||
        (b.assigned_patrol_name && b.assigned_patrol_name.toLowerCase().includes(q));

      const matchFarm = farmFilter === 'ALL' || b.farm_name === farmFilter;
      const matchFront = frontFilter === 'ALL' || b.front_number === frontFilter;

      return matchSearch && matchFarm && matchFront;
    });
  }, [finalizedBurns, searchQuery, farmFilter, frontFilter]);

  // Totales & Estadísticas de Quemas Finalizadas
  const totalCount = filteredBurns.length;
  const totalHa = filteredBurns.reduce((acc, b) => acc + (Number(b.area_hectares) || 0), 0);
  const totalMz = totalHa * 1.4308;
  const totalTons = filteredBurns.reduce((acc, b) => acc + (Number(b.estimated_tonnage) || 0), 0);
  
  const burnsWithDuration = filteredBurns.filter((b) => b.burn_duration_minutes && b.burn_duration_minutes > 0);
  const avgDuration = burnsWithDuration.length > 0
    ? Math.round(burnsWithDuration.reduce((acc, b) => acc + (b.burn_duration_minutes || 0), 0) / burnsWithDuration.length)
    : 0;

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

  const handleSaveEdit = async (
    burnId: string,
    updates: Partial<BurnRequest>,
    reason: string,
    fieldChanges: { field: string; oldVal: any; newVal: any }[]
  ) => {
    if (!currentUser) return;
    await storageService.updateBurnRequest(
      burnId,
      updates,
      currentUser,
      'EDICION_CAMPO',
      reason,
      fieldChanges
    );
    await loadData();
    showToast('Corrección guardada y registrada en la bitácora.');
  };

  if (!currentUser || isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="flex items-center gap-3 text-sm text-emerald-400 font-bold">
          <Clock className="w-5 h-5 animate-spin" />
          <span>Cargando registro de quemas finalizadas...</span>
        </div>
      </div>
    );
  }

  const isDigitador = currentUser.role === 'digitador' || currentUser.role === 'admin';

  return (
    <>
      <Navbar
        currentUser={currentUser}
        onUserChange={handleUserChange}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-sm font-medium animate-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="lg:pl-64 flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Header Banner */}
          <div className="mb-6 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-5 sm:p-6 rounded-3xl shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  Archivo Maestro & Historial Completo
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1.5 flex items-center gap-2">
                <span>Registro de Quemas Finalizadas</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Historial auditado de todas las quemas completadas y liquidadas en campo. Consulta tiempos reales de quema, patrullas responsables, validación de digitador y bitácora de cambios.
              </p>
            </div>

            {/* Quick Export Actions */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => exportToExcel(filteredBurns, 'Reporte_Quemas_Finalizadas')}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition hover:scale-105 cursor-pointer"
                title="Descargar reporte completo en Excel"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Exportar Excel</span>
              </button>

              <button
                onClick={() => exportToPDF(filteredBurns)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 flex items-center gap-2 transition cursor-pointer"
                title="Descargar en PDF"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Exportar PDF</span>
              </button>
            </div>
          </div>

          {/* KPI Summary Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Total Quemas</span>
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900">{totalCount}</div>
                <div className="text-[11px] text-slate-500 font-medium">Liquidadas con éxito</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Área Total</span>
                <Layers className="w-4 h-4 text-blue-600" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900">{totalHa.toFixed(1)} <span className="text-xs font-bold text-slate-500">ha</span></div>
                <div className="text-[11px] text-slate-500 font-medium">{totalMz.toFixed(1)} manzanas</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Caña Cosechada</span>
                <TrendingUp className="w-4 h-4 text-amber-600" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900">{totalTons.toLocaleString()} <span className="text-xs font-bold text-slate-500">TM</span></div>
                <div className="text-[11px] text-slate-500 font-medium">Toneladas métricas</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Tiempo Promedio</span>
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900">{avgDuration} <span className="text-xs font-bold text-slate-500">min</span></div>
                <div className="text-[11px] text-slate-500 font-medium">Por quema controlada</div>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              
              {/* Buscador */}
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por no. quema, frente, finca o patrulla..."
                  className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filtro Finca */}
              <div className="sm:col-span-3">
                <select
                  value={farmFilter}
                  onChange={(e) => setFarmFilter(e.target.value)}
                  className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                >
                  <option value="ALL">Todas las Fincas</option>
                  {farms.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro Frente */}
              <div className="sm:col-span-3">
                <select
                  value={frontFilter}
                  onChange={(e) => setFrontFilter(e.target.value)}
                  className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                >
                  <option value="ALL">Todos los Frentes</option>
                  {uniqueFronts.map((front) => (
                    <option key={front} value={front}>
                      {front}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Filters */}
              <div className="sm:col-span-1 flex justify-end">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFarmFilter('ALL');
                    setFrontFilter('ALL');
                  }}
                  disabled={searchQuery === '' && farmFilter === 'ALL' && frontFilter === 'ALL'}
                  className={`p-2 rounded-xl border text-sm font-medium transition flex items-center justify-center ${
                    searchQuery !== '' || farmFilter !== 'ALL' || frontFilter !== 'ALL'
                      ? 'border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-red-600 cursor-pointer'
                      : 'border-slate-200 text-slate-300 cursor-not-allowed'
                  }`}
                  title="Limpiar filtros"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Header row before table */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="text-xs sm:text-sm text-slate-600 font-medium">
              Mostrando <strong className="text-slate-900 font-black">{filteredBurns.length}</strong> quemas finalizadas y liquidadas
            </div>
          </div>

          {/* Master Table of Finalized Burns */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-white uppercase text-[11px] tracking-wider font-bold">
                  <tr>
                    <th className="py-3.5 px-4">No. Quema</th>
                    <th className="py-3.5 px-4">Frente / Finca / Lote</th>
                    <th className="py-3.5 px-4">Sup. Turno</th>
                    <th className="py-3.5 px-4 text-right">Área</th>
                    <th className="py-3.5 px-4 text-right">Tons (TM)</th>
                    <th className="py-3.5 px-4">Patrulla Responsable</th>
                    <th className="py-3.5 px-4 text-center">Horario Real</th>
                    <th className="py-3.5 px-4 text-center">Duración</th>
                    <th className="py-3.5 px-4">Validado Por</th>
                    <th className="py-3.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBurns.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-16 text-center text-slate-500">
                        <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-bold text-slate-700">No se encontraron quemas finalizadas</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {finalizedBurns.length === 0
                            ? 'Aún no se ha finalizado ninguna quema en la zafra activa.'
                            : 'Intenta limpiar los filtros de búsqueda para ver más resultados.'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredBurns.map((burn) => (
                      <tr key={burn.id} className="hover:bg-slate-50/80 transition">
                        
                        {/* No. Quema */}
                        <td className="py-3.5 px-4 font-black text-slate-900 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                              {burn.burn_number}
                            </span>
                            {burn.burn_type === 'CRIMINAL' && (
                              <span className="text-[9px] font-black uppercase bg-red-600 text-white px-1.5 py-0.2 rounded border border-red-700">
                                Criminal
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Frente / Finca / Lote */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{burn.farm_name}</div>
                          {burn.lote_um && (
                            <div className="text-[11px] text-emerald-800 font-bold">
                              Lote: {burn.lote_um}
                            </div>
                          )}
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{burn.front_number}</span>
                          </div>
                        </td>

                        {/* Supervisor Turno */}
                        <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                          <div>{burn.shift_supervisor_name}</div>
                          {burn.shift_name && (
                            <div className="text-[10px] text-slate-400">{burn.shift_name}</div>
                          )}
                        </td>

                        {/* Área */}
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                          <div>{burn.area_hectares} ha</div>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {burn.area_manzanas ?? (burn.area_hectares * 1.4308).toFixed(1)} mz
                          </span>
                        </td>

                        {/* Toneladas */}
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                          {burn.estimated_tonnage.toLocaleString()} TM
                        </td>

                        {/* Patrulla Responsable */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-bold text-slate-900">{burn.assigned_patrol_name || 'N/A'}</div>
                          {burn.assigned_patrol_leader && (
                            <div className="text-[10px] text-slate-500 font-medium">
                              👤 {burn.assigned_patrol_leader}
                            </div>
                          )}
                        </td>

                        {/* Horario Real */}
                        <td className="py-3.5 px-4 text-center font-mono whitespace-nowrap">
                          <div className="font-bold text-slate-800">
                            {burn.burn_started_at ? formatTime(burn.burn_started_at) : '—'} ➔ {burn.burn_ended_at ? formatTime(burn.burn_ended_at) : '—'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {formatDate(burn.burn_ended_at || burn.planned_burn_time)}
                          </div>
                        </td>

                        {/* Duración */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {burn.burn_duration_minutes ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-black text-xs px-2.5 py-1 rounded-xl border border-emerald-300">
                              <Clock className="w-3 h-3" />
                              {burn.burn_duration_minutes} min
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>

                        {/* Validado Por */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {burn.validated_by_name ? (
                            <div>
                              <div className="font-semibold text-slate-800 flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                                <span>{burn.validated_by_name}</span>
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {formatTime(burn.validated_at)} ({formatDate(burn.validated_at)})
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">No registrado</span>
                          )}
                        </td>

                        {/* Acciones */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1.5">
                            {/* Botón Bitácora */}
                            <button
                              onClick={() => setSelectedBurnForAudit(burn)}
                              className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl border border-slate-200 transition cursor-pointer"
                              title="Ver Bitácora de Auditoría"
                            >
                              <History className="w-4 h-4" />
                            </button>

                            {/* Botón Editar (Solo Digitador / Admin) */}
                            {isDigitador && (
                              <button
                                onClick={() => setSelectedBurnForEdit(burn)}
                                className="p-2 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl border border-slate-200 transition cursor-pointer"
                                title="Corregir Información con Bitácora"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      {/* Modal Bitácora de Auditoría */}
      {selectedBurnForAudit && (
        <AuditLogModal
          isOpen={Boolean(selectedBurnForAudit)}
          onClose={() => setSelectedBurnForAudit(null)}
          burn={selectedBurnForAudit}
        />
      )}

      {/* Modal Edición / Corrección */}
      {selectedBurnForEdit && (
        <EditBurnModal
          isOpen={Boolean(selectedBurnForEdit)}
          onClose={() => setSelectedBurnForEdit(null)}
          burn={selectedBurnForEdit}
          farms={farms}
          patrols={patrols}
          currentUser={currentUser}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
}
