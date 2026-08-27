export type UserRole =
  | 'supervisor_frente'
  | 'supervisor_quemas'
  | 'patrulla'
  | 'digitador'
  | 'jefatura'
  | 'admin';

export type ShiftType = 'Turno Día (06:00 - 18:00)' | 'Turno Noche (18:00 - 06:00)' | 'Relevo / Cobertura de Descanso';

export type BurnStatus =
  | 'SOLICITADA'
  | 'PATRULLA_ASIGNADA'
  | 'EN_REVISION'
  | 'REVISION_COMPLETADA'
  | 'VALIDADA'
  | 'EN_QUEMA'
  | 'FINALIZADA'
  | 'CANCELADA';

export type ActionType =
  | 'CREACION'
  | 'ASIGNACION_PATRULLA'
  | 'CONFIRMACION_PATRULLA'
  | 'LLEGADA_PATRULLA'
  | 'REVISION_AREA'
  | 'VALIDACION_DIGITADOR'
  | 'INICIO_QUEMA'
  | 'FIN_QUEMA'
  | 'EDICION_CAMPO'
  | 'CANCELACION'
  | 'CAMBIO_CREDENCIALES'
  | 'ACTUALIZACION_MAESTRO'
  | 'CAMBIO_TURNO_FRENTE'
  | 'REGISTRO_QUEMA_CRIMINAL';

export interface ReviewChecklist {
  firebreak_verified: boolean;
  wind_conditions_favorable: boolean;
  neighboring_crops_safe: boolean;
  water_tank_ready: boolean;
  personnel_equipped: boolean;
}

export interface BurnRequest {
  id: string;
  burn_number: string;
  burn_type?: 'PROGRAMADA' | 'CRIMINAL';
  front_number: string;
  shift_name?: string;
  shift_supervisor_name: string;
  farm_name: string;
  lote_um?: string;
  area_hectares: number;
  area_manzanas?: number;
  estimated_tonnage: number;
  planned_burn_time: string;
  requested_at: string;
  created_by_user_id: string;
  created_by_name: string;
  status: BurnStatus;
  assigned_patrol_id?: string;
  assigned_patrol_name?: string;
  assigned_patrol_leader?: string;
  patrol_assigned_at?: string;
  patrol_confirmed_at?: string;
  patrol_arrived_at?: string;
  review_duration_minutes?: number;
  review_completed_at?: string;
  review_checklist?: ReviewChecklist;
  review_notes?: string;
  validated_by_user_id?: string;
  validated_by_name?: string;
  validated_at?: string;
  validation_notes?: string;
  burn_started_at?: string;
  burn_ended_at?: string;
  burn_duration_minutes?: number;
  cancellation_reason?: string;
  cancelled_by_name?: string;
  cancelled_by_role?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  burn_request_id?: string;
  burn_number?: string;
  user_id: string;
  user_name: string;
  user_role: UserRole;
  action_type: ActionType;
  field_name?: string;
  old_value?: string;
  new_value?: string;
  change_reason?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  password?: string;
  pin?: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string;
  assigned_front?: string;      // Frente configurado (ej: "Frente 01", "Frente 03")
  current_shift?: ShiftType;     // Turno activo para hoy (Día, Noche, Relevo)
  is_relief_supervisor?: boolean;// Indica si es supervisor de cobertura de descansos
  assigned_patrol_id?: string;
  assigned_patrol_name?: string;
  active: boolean;
  created_at?: string;
}

export interface Farm {
  id: string;
  name: string;
  code?: string;
  zone?: string;
  active?: boolean;
}

export interface Front {
  id: string;
  name: string;
  code?: string;
  harvest_type: 'Mecanizada' | 'Manual' | 'Mixta';
  supervisor_turno_a?: string;
  supervisor_turno_b?: string;
  active: boolean;
}

export interface Patrol {
  id: string;
  name: string;
  leader_name: string;
  shift_info?: string;
  crew_members?: string[];
  phone?: string;
  vehicle_code?: string;
  status: 'DISPONIBLE' | 'EN_FRENTE' | 'EN_QUEMA';
  active: boolean;
}

export const ROLE_DETAILS: Record<UserRole, { label: string; badgeColor: string; description: string }> = {
  supervisor_frente: {
    label: 'Supervisor de Frente',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Configura su frente y turno para gestionar las solicitudes de quema.',
  },
  supervisor_quemas: {
    label: 'Supervisor de Quemas',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Monitorea el plan general y despacha patrullas a los frentes.',
  },
  patrulla: {
    label: 'Patrulla de Quema',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    description: 'Cuadrilla de campo: Inspecciona, enciende, liquida y resguarda la seguridad.',
  },
  digitador: {
    label: 'Digitador de Quemas',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Valida, corrige cualquier dato, administra credenciales y catálogos maestros.',
  },
  jefatura: {
    label: 'Jefatura / Gerencia',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Supervisión ejecutiva, indicadores de zafra y auditoría inmutable.',
  },
  admin: {
    label: 'Administrador del Sistema',
    badgeColor: 'bg-gray-100 text-gray-800 border-gray-300',
    description: 'Control de usuarios, configuración y mantenimiento global.',
  },
};

export const STATUS_DETAILS: Record<BurnStatus, { label: string; bg: string; text: string; border: string; stepIndex: number }> = {
  SOLICITADA: {
    label: '1. Solicitada',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    stepIndex: 1,
  },
  PATRULLA_ASIGNADA: {
    label: '2. Patrulla Asignada',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    stepIndex: 2,
  },
  EN_REVISION: {
    label: '3. En Revisión de Área',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    stepIndex: 3,
  },
  REVISION_COMPLETADA: {
    label: '4. Revisión Completada',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    stepIndex: 4,
  },
  VALIDADA: {
    label: '5. Validada (Lista para Quema)',
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    stepIndex: 5,
  },
  EN_QUEMA: {
    label: '6. En Quema Activa',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    stepIndex: 6,
  },
  FINALIZADA: {
    label: '7. Finalizada con Éxito',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    stepIndex: 7,
  },
  CANCELADA: {
    label: 'Cancelada',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-300',
    stepIndex: -1,
  },
};
