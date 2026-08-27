'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { StatsOverview } from '@/components/StatsOverview';
import { BurnFilters } from '@/components/BurnFilters';
import { BurnCard } from '@/components/BurnCard';
import { BurnTable } from '@/components/BurnTable';
import { NewBurnModal } from '@/components/NewBurnModal';
import { AssignPatrolModal } from '@/components/AssignPatrolModal';
import { PatrolAvailabilityMonitor } from '@/components/PatrolAvailabilityMonitor';
import { PatrolActionModal } from '@/components/PatrolActionModal';
import { ValidationModal } from '@/components/ValidationModal';
import { EditBurnModal } from '@/components/EditBurnModal';
import { CancelBurnModal } from '@/components/CancelBurnModal';
import { AuditLogModal } from '@/components/AuditLogModal';
import { BurnRequest, Farm, Patrol, Front, UserProfile, ROLE_DETAILS, ReviewChecklist } from '@/lib/types';
import { storageService } from '@/lib/storageService';
import { exportToExcel, exportToPDF } from '@/lib/exportUtils';
import confetti from 'canvas-confetti';
import {
  PlusCircle,
  FileSpreadsheet,
  FileText,
  LayoutGrid,
  List,
  Flame,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Shield,
  Layers,
  Activity,
  CheckCircle2,
  History,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  
  // State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [burns, setBurns] = useState<BurnRequest[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [patrols, setPatrols] = useState<Patrol[]>([]);
  const [fronts, setFronts] = useState<Front[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & View Scope
  const [activeTab, setActiveTab] = useState<'operativas' | 'todas' | 'finalizadas'>('operativas');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [farmFilter, setFarmFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedBurnForAssign, setSelectedBurnForAssign] = useState<BurnRequest | null>(null);
  const [selectedBurnForPatrol, setSelectedBurnForPatrol] = useState<BurnRequest | null>(null);
  const [selectedBurnForValidation, setSelectedBurnForValidation] = useState<BurnRequest | null>(null);
  const [selectedBurnForEdit, setSelectedBurnForEdit] = useState<BurnRequest | null>(null);
  const [selectedBurnForCancel, setSelectedBurnForCancel] = useState<BurnRequest | null>(null);
  const [selectedBurnForAudit, setSelectedBurnForAudit] = useState<BurnRequest | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Load Data with Role Isolation
  const refreshData = async () => {
    try {
      setIsLoading(true);
      let user = storageService.getActiveUser();
      if (!user) {
        // Redirigir al login si es primera vez o no hay sesión activa
        window.location.href = '/login';
        return;
      }
      setCurrentUser(user);

      const [userBurns, fetchedFarms, fetchedPatrols, fetchedFronts] = await Promise.all([
        storageService.getBurnRequestsForUser(user),
        storageService.getFarms(),
        storageService.getPatrols(),
        storageService.getFronts(),
      ]);

      setBurns(userBurns);
      setFarms(fetchedFarms);
      setPatrols(fetchedPatrols);
      setFronts(fetchedFronts);
    } catch (err) {
      console.error('Error loading data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleUserChange = (user: UserProfile) => {
    setCurrentUser(user);
    storageService.setActiveUser(user);
    showToast(`Sesión cambiada a: ${user.full_name} (${ROLE_DETAILS[user.role]?.label})`);
    refreshData();
  };

  const handleResetDemoData = () => {
    storageService.resetToMockData();
    refreshData();
    showToast('Datos de prueba reiniciados correctamente.');
  };

  // ==========================================
  // WORKFLOW ACTION HANDLERS
  // ==========================================

  // 1. Crear Solicitud
  const handleCreateBurn = async (
    data: Omit<BurnRequest, 'id' | 'burn_number' | 'created_at' | 'updated_at'>
  ) => {
    if (!currentUser) return;
    try {
      const created = await storageService.createBurnRequest(data, currentUser);
      await refreshData();
      showToast(`Solicitud ${created.burn_number} creada con éxito.`);
    } catch (err: any) {
      console.error('Error creating burn:', err);
      showToast('Error al registrar solicitud');
    }
  };

  // 2. Asignar Patrulla
  const handleAssignPatrol = async (
    burnId: string,
    patrolId: string,
    patrolName: string,
    assignedAt: string,
    patrolLeader?: string
  ) => {
    if (!currentUser) return;
    await storageService.updateBurnRequest(
      burnId,
      {
        assigned_patrol_id: patrolId,
        assigned_patrol_name: patrolName,
        assigned_patrol_leader: patrolLeader,
        patrol_assigned_at: assignedAt,
        status: 'PATRULLA_ASIGNADA',
      },
      currentUser,
      'ASIGNACION_PATRULLA',
      `Asignada ${patrolName} (Encargado: ${patrolLeader || 'No especificado'}) para desplazamiento al frente.`
    );
    await refreshData();
    showToast(`Patrulla ${patrolName} (${patrolLeader || ''}) asignada.`);
  };

  // 3. Confirmar Llegada
  const handleConfirmArrival = async (burnId: string, arrivedAt: string) => {
    if (!currentUser) return;
    await storageService.updateBurnRequest(
      burnId,
      {
        patrol_confirmed_at: new Date().toISOString(),
        patrol_arrived_at: arrivedAt,
        status: 'EN_REVISION',
      },
      currentUser,
      'LLEGADA_PATRULLA',
      'Patrulla en el frente de quema, iniciando inspección de seguridad.'
    );
    await refreshData();
    showToast('Llegada confirmada. Solicitud en fase de revisión de área.');
  };

  // 4. Completar Revisión de Seguridad
  const handleCompleteReview = async (
    burnId: string,
    durationMinutes: number,
    checklist: ReviewChecklist,
    notes: string,
    completedAt: string
  ) => {
    if (!currentUser) return;
    await storageService.updateBurnRequest(
      burnId,
      {
        review_duration_minutes: durationMinutes,
        review_checklist: checklist,
        review_notes: notes,
        review_completed_at: completedAt,
        status: 'REVISION_COMPLETADA',
      },
      currentUser,
      'REVISION_AREA',
      `Revisión completada en ${durationMinutes} min. Enviado a validación del digitador.`
    );
    await refreshData();
    showToast('Revisión completada con éxito. Pendiente de visto bueno del digitador.');
  };

  // 5. Validar Pre-Quema (Digitador)
  const handleValidateBurn = async (burnId: string, validationNotes: string) => {
    if (!currentUser) return;
    await storageService.updateBurnRequest(
      burnId,
      {
        validated_by_user_id: currentUser.id,
        validated_by_name: currentUser.full_name,
        validated_at: new Date().toISOString(),
        validation_notes: validationNotes,
        status: 'VALIDADA',
      },
      currentUser,
      'VALIDACION_DIGITADOR',
      `Validación técnica aprobada por digitador: ${validationNotes}`
    );
    await refreshData();
    showToast('Solicitud validada. Luz verde otorgada a patrulla para inicio de quema.');
  };

  // 6. Iniciar Quema (Patrulla)
  const handleStartBurn = async (burnId: string, startedAt: string) => {
    if (!currentUser) return;
    await storageService.updateBurnRequest(
      burnId,
      {
        burn_started_at: startedAt,
        status: 'EN_QUEMA',
      },
      currentUser,
      'INICIO_QUEMA',
      'Inicio de quema controlada en campo.'
    );
    await refreshData();
    showToast('Quema activa iniciada en campo.');
  };

  // 7. Finalizar Quema (Patrulla)
  const handleFinishBurn = async (burnId: string, endedAt: string, durationMinutes: number) => {
    if (!currentUser) return;
    const targetBurn = burns.find((b) => b.id === burnId);
    const isCriminal = targetBurn?.burn_type === 'CRIMINAL';

    await storageService.updateBurnRequest(
      burnId,
      {
        burn_ended_at: endedAt,
        burn_duration_minutes: durationMinutes,
        status: 'FINALIZADA',
      },
      currentUser,
      'FIN_QUEMA',
      isCriminal
        ? `Quema criminal combatida y liquidada en terreno. La patrulla queda liberada y 100% DISPONIBLE. Duración: ${durationMinutes} min.`
        : `Quema concluida y liquidada sin incidentes. Duración total: ${durationMinutes} min.`
    );
    await refreshData();

    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}

    if (isCriminal) {
      showToast('🚨 Quema criminal liquidada con éxito. La patrulla queda nuevamente 100% DISPONIBLE.');
    } else {
      showToast('¡Quema finalizada y liquidada con éxito! Patrulla disponible.');
    }
  };

  // 8. Cancelar Quema
  const handleConfirmCancel = async (burnId: string, reason: string) => {
    if (!currentUser) return;
    await storageService.updateBurnRequest(
      burnId,
      {
        status: 'CANCELADA',
        cancellation_reason: reason,
        cancelled_by_name: currentUser.full_name,
        cancelled_by_role: currentUser.role,
        cancelled_at: new Date().toISOString(),
      },
      currentUser,
      'CANCELACION',
      reason
    );
    await refreshData();
    showToast('Solicitud de quema cancelada.');
  };

  // 9. Guardar Edición / Corrección
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
    await refreshData();
    showToast('Correcciones guardadas y registradas en la bitácora.');
  };

  // Filtered Programadas Burns
  const programadasBurns = useMemo(() => burns.filter((b) => b.burn_type !== 'CRIMINAL'), [burns]);

  // Contadores dinámicos por ámbito
  const activeBurnsCount = useMemo(
    () => programadasBurns.filter((b) => b.status !== 'FINALIZADA' && b.status !== 'CANCELADA').length,
    [programadasBurns]
  );
  const finalizedBurnsCount = useMemo(
    () => programadasBurns.filter((b) => b.status === 'FINALIZADA').length,
    [programadasBurns]
  );
  const totalBurnsCount = programadasBurns.length;

  const filteredBurns = useMemo(() => {
    return programadasBurns.filter((b) => {
      // 1. Filtro por Pestaña / Ámbito de visualización
      if (activeTab === 'operativas') {
        // En la vista operativa diaria excluimos finalizadas y canceladas para no estorbar
        if (b.status === 'FINALIZADA' || b.status === 'CANCELADA') {
          return false;
        }
      } else if (activeTab === 'finalizadas') {
        if (b.status !== 'FINALIZADA') {
          return false;
        }
      }

      // 2. Filtro de búsqueda por texto
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        b.burn_number.toLowerCase().includes(q) ||
        b.front_number.toLowerCase().includes(q) ||
        b.farm_name.toLowerCase().includes(q) ||
        b.shift_supervisor_name?.toLowerCase().includes(q) ||
        (b.assigned_patrol_name && b.assigned_patrol_name.toLowerCase().includes(q));

      // 3. Filtro de estado
      const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;

      // 4. Filtro de finca
      const matchFarm = farmFilter === 'ALL' || b.farm_name === farmFilter;

      return matchSearch && matchStatus && matchFarm;
    });
  }, [programadasBurns, activeTab, searchQuery, statusFilter, farmFilter]);

  const handleFilterFromStats = (status: string) => {
    if (status === 'ALL') {
      setActiveTab('todas');
      setStatusFilter('ALL');
    } else if (status === 'FINALIZADA') {
      router.push('/quemas-finalizadas');
    } else if (status === 'CANCELADA') {
      setActiveTab('todas');
      setStatusFilter('CANCELADA');
    } else {
      setActiveTab('operativas');
      setStatusFilter(status);
    }
  };

  if (!currentUser || isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
            <Flame className="w-8 h-8 text-amber-500 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-white">
              Ingenio La Unión
            </h2>
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mt-0.5">
              Control de Quemas Programadas
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
            <span>Cargando sistema...</span>
          </div>
        </div>
      </div>
    );
  }

  const roleMeta = ROLE_DETAILS[currentUser.role];
  const canCreate = currentUser.role === 'supervisor_frente' || currentUser.role === 'digitador' || currentUser.role === 'admin';
  const isGlobalView = currentUser.role === 'digitador' || currentUser.role === 'jefatura' || currentUser.role === 'supervisor_quemas' || currentUser.role === 'admin';
  
  // Disponibilidad de patrullas visible únicamente para supervisor de quemas, digitador, jefatura, admin y patrulla
  const canViewPatrolAvailability =
    currentUser.role === 'supervisor_quemas' ||
    currentUser.role === 'digitador' ||
    currentUser.role === 'jefatura' ||
    currentUser.role === 'admin' ||
    currentUser.role === 'patrulla';

  return (
    <>
      <Navbar
        currentUser={currentUser}
        onUserChange={handleUserChange}
        onResetDemoData={handleResetDemoData}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-sm font-medium animate-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-fire-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="lg:pl-64 flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Banner de Rol e Instrucciones con Aislamiento de Funciones */}
        <div className="mb-6 bg-gradient-to-r from-union-900 via-union-800 to-slate-900 text-white p-4 sm:p-6 rounded-2xl shadow-md border border-union-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${roleMeta.badgeColor}`}>
                {roleMeta.label}
              </span>
              <span className="text-xs text-union-200">({currentUser.full_name})</span>
              {currentUser.assigned_front && (
                <span className="text-[10px] bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-full font-bold">
                  {currentUser.assigned_front}
                </span>
              )}
            </div>
            
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1 flex items-center gap-2">
              <Flame className="w-6 h-6 text-amber-400" />
              <span>Registro y Control de Quemas Programadas</span>
            </h1>

            <p className="text-xs sm:text-sm text-union-100 mt-1 max-w-2xl">
              {currentUser.role === 'supervisor_frente' &&
                `Vista de Frente: Estás viendo únicamente las quemas asignadas a tu turno / frente (${currentUser.assigned_front || 'Frente asignado'}). Puedes crear nuevas solicitudes y editar los datos iniciales.`}
              {currentUser.role === 'supervisor_quemas' &&
                'Coordinación de Quemas: Monitorea todas las solicitudes pendientes y asigna patrullas de campo con registro de tiempo.'}
              {currentUser.role === 'patrulla' &&
                `Operación de Patrulla: Estás viendo únicamente las solicitudes asignadas a tu patrulla (${currentUser.assigned_patrol_name || 'Patrulla'}). Confirma tu llegada, realiza el checklist, inicia y finaliza la quema.`}
              {currentUser.role === 'digitador' &&
                'Control Total de Digitador: Visión global de todos los frentes. Puedes validar pre-quema, corregir cualquier dato con bitácora y administrar catálogos de frentes y credenciales de usuario.'}
              {currentUser.role === 'jefatura' &&
                'Supervisión Gerencial: Visión consolidada de toda la zafra, avance por finca, auditoría de cambios y exportación de reportes ejecutivos.'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {canCreate && (
              <button
                onClick={() => setIsNewModalOpen(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-fire-500 to-fire-600 hover:from-fire-600 hover:to-fire-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-fire-900/30 flex items-center gap-2 transition hover:scale-105 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Nueva Solicitud de Quema</span>
              </button>
            )}

            <Link
              href="/quemas-finalizadas"
              className="px-3.5 py-2 bg-emerald-800/90 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl border border-emerald-600/60 flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              title="Abrir tabla con todas las quemas finalizadas"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Ver Finalizadas ({finalizedBurnsCount})</span>
            </Link>

            <button
              onClick={() => exportToExcel(filteredBurns, 'Reporte_Quemas_Programadas')}
              className="px-3.5 py-2 bg-union-800 hover:bg-union-700 text-union-100 hover:text-white font-semibold text-xs rounded-xl border border-union-600 flex items-center gap-1.5 transition cursor-pointer"
              title="Descargar datos en Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Excel</span>
            </button>

            <button
              onClick={() => exportToPDF(filteredBurns)}
              className="px-3.5 py-2 bg-union-800 hover:bg-union-700 text-union-100 hover:text-white font-semibold text-xs rounded-xl border border-union-600 flex items-center gap-1.5 transition cursor-pointer"
              title="Descargar reporte en PDF"
            >
              <FileText className="w-4 h-4 text-fire-400" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          </div>
        </div>

        {/* Overview KPI Cards */}
        <StatsOverview
          burns={programadasBurns}
          activeFilter={statusFilter}
          onFilterStatus={handleFilterFromStats}
        />

        {/* Real-time Patrol Availability & Timers Monitor (Visible para Supervisor de Quemas, Digitador, Jefatura, Admin y Patrulla) */}
        {canViewPatrolAvailability && (
          <PatrolAvailabilityMonitor
            patrols={patrols}
            burns={burns}
            currentUser={currentUser}
          />
        )}

        {/* Pestañas de Alcance Operativo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => {
                setActiveTab('operativas');
                setStatusFilter('ALL');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'operativas'
                  ? 'bg-union-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Activity className={`w-3.5 h-3.5 ${activeTab === 'operativas' ? 'text-amber-400' : 'text-amber-600'}`} />
              <span>Solicitudes en Proceso</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'operativas' ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-800'
              }`}>
                {activeBurnsCount}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('todas');
                setStatusFilter('ALL');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'todas'
                  ? 'bg-union-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${activeTab === 'todas' ? 'text-blue-400' : 'text-blue-600'}`} />
              <span>Todas las Quemas</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'todas' ? 'bg-blue-400 text-slate-950' : 'bg-slate-200 text-slate-800'
              }`}>
                {totalBurnsCount}
              </span>
            </button>

            <Link
              href="/quemas-finalizadas"
              className="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tabla de Finalizadas</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white">
                {finalizedBurnsCount}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* View Switcher Cards / Table */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white text-union-900 shadow-sm font-bold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
                title="Vista en Tarjetas"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-union-900 shadow-sm font-bold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
                title="Vista en Tabla Detallada"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <BurnFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          farmFilter={farmFilter}
          onFarmChange={setFarmFilter}
          farms={farms}
          onReset={() => {
            setSearchQuery('');
            setStatusFilter('ALL');
            setFarmFilter('ALL');
          }}
        />

        {/* Header Bar with Count Indicator */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-xs sm:text-sm text-gray-600 font-medium flex items-center gap-2">
            <span>
              Mostrando <strong className="text-slate-900 font-black">{filteredBurns.length}</strong>{' '}
              {activeTab === 'operativas'
                ? 'solicitudes activas/en proceso'
                : activeTab === 'finalizadas'
                ? 'quemas finalizadas'
                : 'quemas en total'}
            </span>
            {activeTab === 'operativas' && (
              <span className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md font-semibold">
                ⚡ Sin finalizadas para máxima agilidad
              </span>
            )}
          </div>
        </div>

        {/* Main List / Table */}
        {isLoading ? (
          <div className="py-20 text-center text-gray-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-union-700 mb-2" />
            <p className="text-sm font-medium">Cargando solicitudes de quema...</p>
          </div>
        ) : filteredBurns.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <Flame className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">
              {activeTab === 'operativas'
                ? 'No hay solicitudes de quema activas o en proceso en este momento'
                : activeTab === 'finalizadas'
                ? 'No hay quemas finalizadas registradas'
                : 'No se encontraron registros de quema'}
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
              {activeTab === 'operativas'
                ? 'Todas las solicitudes han sido completadas o no se han emitido nuevas solicitudes para tu turno.'
                : 'Puedes cambiar los filtros o buscar con otro criterio.'}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              {activeTab === 'operativas' && totalBurnsCount > 0 && (
                <button
                  onClick={() => {
                    setActiveTab('todas');
                    setStatusFilter('ALL');
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Ver Registro Maestro ({totalBurnsCount} quemas)</span>
                </button>
              )}
              {canCreate && (
                <button
                  onClick={() => setIsNewModalOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-union-800 hover:bg-union-700 rounded-lg shadow inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Registrar Solicitud Ahora</span>
                </button>
              )}
            </div>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBurns.map((burn) => (
              <BurnCard
                key={burn.id}
                burn={burn}
                currentUser={currentUser}
                onOpenAssign={(b) => setSelectedBurnForAssign(b)}
                onOpenPatrolAction={(b) => setSelectedBurnForPatrol(b)}
                onOpenValidation={(b) => setSelectedBurnForValidation(b)}
                onOpenEdit={(b) => setSelectedBurnForEdit(b)}
                onOpenAudit={(b) => setSelectedBurnForAudit(b)}
                onOpenCancel={(b) => setSelectedBurnForCancel(b)}
              />
            ))}
          </div>
        ) : (
          <BurnTable
            burns={filteredBurns}
            currentUser={currentUser}
            onOpenAssign={(b) => setSelectedBurnForAssign(b)}
            onOpenPatrolAction={(b) => setSelectedBurnForPatrol(b)}
            onOpenValidation={(b) => setSelectedBurnForValidation(b)}
            onOpenEdit={(b) => setSelectedBurnForEdit(b)}
            onOpenAudit={(b) => setSelectedBurnForAudit(b)}
            onOpenCancel={(b) => setSelectedBurnForCancel(b)}
          />
        )}
        </div>
      </main>

      {/* ================================================================ */}
      {/* MODALES DEL SISTEMA                                             */}
      {/* ================================================================ */}

      {/* 1. Modal Nueva Solicitud */}
      <NewBurnModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleCreateBurn}
        farms={farms}
        fronts={fronts}
        currentUser={currentUser}
      />

      {/* 2. Modal Asignar Patrulla (Supervisor Quemas) */}
      {selectedBurnForAssign && (
        <AssignPatrolModal
          isOpen={Boolean(selectedBurnForAssign)}
          onClose={() => setSelectedBurnForAssign(null)}
          burn={selectedBurnForAssign}
          patrols={patrols}
          allBurns={burns}
          currentUser={currentUser}
          onAssign={handleAssignPatrol}
        />
      )}

      {/* 3. Modal Acciones de Patrulla (Llegada, Revisión, Quema, Fin) */}
      {selectedBurnForPatrol && (
        <PatrolActionModal
          isOpen={Boolean(selectedBurnForPatrol)}
          onClose={() => setSelectedBurnForPatrol(null)}
          burn={selectedBurnForPatrol}
          currentUser={currentUser}
          onConfirmArrival={handleConfirmArrival}
          onCompleteReview={handleCompleteReview}
          onStartBurn={handleStartBurn}
          onFinishBurn={handleFinishBurn}
          onOpenCancel={(b) => {
            setSelectedBurnForPatrol(null);
            setSelectedBurnForCancel(b);
          }}
        />
      )}

      {/* 4. Modal Validación Pre-Quema (Digitador) */}
      {selectedBurnForValidation && (
        <ValidationModal
          isOpen={Boolean(selectedBurnForValidation)}
          onClose={() => setSelectedBurnForValidation(null)}
          burn={selectedBurnForValidation}
          currentUser={currentUser}
          onValidate={handleValidateBurn}
          onOpenEdit={(b) => {
            setSelectedBurnForValidation(null);
            setSelectedBurnForEdit(b);
          }}
          onOpenCancel={(b) => {
            setSelectedBurnForValidation(null);
            setSelectedBurnForCancel(b);
          }}
        />
      )}

      {/* 5. Modal Edición y Corrección (Digitador / Roles) */}
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

      {/* 6. Modal Cancelación de Quema */}
      {selectedBurnForCancel && (
        <CancelBurnModal
          isOpen={Boolean(selectedBurnForCancel)}
          onClose={() => setSelectedBurnForCancel(null)}
          burn={selectedBurnForCancel}
          currentUser={currentUser}
          onConfirmCancel={handleConfirmCancel}
        />
      )}

      {/* 7. Modal Bitácora de Auditoría */}
      {selectedBurnForAudit && (
        <AuditLogModal
          isOpen={Boolean(selectedBurnForAudit)}
          onClose={() => setSelectedBurnForAudit(null)}
          burn={selectedBurnForAudit}
        />
      )}
    </>
  );
}
