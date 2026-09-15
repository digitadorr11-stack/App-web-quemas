// ====================================================================
// TIPOS Y MODELOS: CONTROL DE QUEMAS - INGENIO LA UNIÓN
// ====================================================================

export type UserRole =
  | 'admin'
  | 'digitador'
  | 'jefatura'
  | 'supervisor_quemas'
  | 'supervisor_frente'
  | 'patrulla'
  | 'pendiente';

export type BurnStatus =
  | 'SOLICITADA'
  | 'PATRULLA_ASIGNADA'
  | 'EN_FRENTE'
  | 'EN_REVISION'
  | 'EN_QUEMA'
  | 'FINALIZADA'
  | 'CANCELADA';

export type Prioridad = 'NORMAL' | 'ALTA' | 'URGENTE';

export interface UserProfile {
  id: string; // UUID de auth.users
  correo: string;
  nombre_completo: string;
  rol: UserRole;
  frente_asignado?: string; // Ej: "Frente 15"
  patrulla_asignada?: string; // Ej: "Patrulla Alfa"
  activo: boolean;
  created_at?: string;
}

export interface ReviewChecklist {
  guardarrayas_limpias: boolean;
  humedad_adecuada: boolean;
  viento_favorable: boolean;
  cultivos_vecinos_protegidos: boolean;
  equipo_extincion_listo: boolean;
  cisterna_disponible: boolean;
}

export interface BurnRequest {
  id: string; // UUID
  numero_quema: string; // Ej: "QM-2026-0001"
  
  // Ubicación y Agronomía
  numero_frente: string; // Ej: "Frente 15"
  nombre_finca: string;
  lote_um: string;
  area_hectareas: number;
  area_manzanas: number;
  variedad_cana?: string;
  tonelaje_estimado?: number;
  tipo_cosecha: 'Mecanizada' | 'Manual' | 'Mixta';
  observaciones_solicitud?: string;
  prioridad: Prioridad;

  // 1. Solicitud y Planificación
  hora_solicitud: string;
  hora_planificada: string;
  creado_por_usuario_id: string;
  nombre_supervisor_frente: string;

  // 2. Asignación
  hora_asignacion?: string;
  nombre_patrulla_asignada?: string;
  lider_patrulla?: string;

  // 3. Llegada al Frente y Espera
  hora_llegada_frente?: string;
  tiempo_espera_minutos?: number;
  motivo_espera?: string;

  // 4. Revisión Técnica de Seguridad
  hora_inicio_revision?: string;
  hora_fin_revision?: string;
  duracion_revision_minutos?: number;
  checklist_revision?: ReviewChecklist;
  observaciones_revision?: string;

  // 5. Quema Activa y Cierre
  hora_inicio_quema?: string;
  hora_fin_quema?: string;
  duracion_quema_minutos?: number;
  tiempo_total_minutos?: number;

  // Estado y Cancelación
  estado: BurnStatus;
  etapa_cancelacion?: BurnStatus;
  motivo_cancelacion?: string;
  cancelado_por_nombre?: string;
  hora_cancelacion?: string;

  created_at: string;
  updated_at: string;
}

export interface FrontCatalog {
  nombre: string;
  tipo_cosecha: 'Mecanizada' | 'Manual' | 'Mixta';
  activo: boolean;
  created_at?: string;
}

export interface PatrolCatalog {
  nombre: string;
  codigo_vehiculo?: string;
  estado: 'DISPONIBLE' | 'EN_FRENTE' | 'EN_QUEMA';
  activo: boolean;
  created_at?: string;
}

export interface FarmLoteCatalog {
  id?: string;
  finca: string;
  lote: string;
  area_ha: number;
  area_mz: number;
  variedad?: string;
  activo?: boolean;
  created_at?: string;
}

export interface AuditLog {
  id: string;
  solicitud_quema_id?: string;
  numero_quema?: string;
  usuario_id: string;
  nombre_usuario: string;
  rol_usuario: UserRole;
  tipo_accion: string;
  nombre_campo?: string;
  valor_anterior?: string;
  valor_nuevo?: string;
  motivo_cambio?: string;
  created_at: string;
}

export const MOTIVOS_ESPERA_ESTANDAR = [
  'Espera de hora programada',
  'Frente aún cortando caña',
  'Maquinaria/alzadoras dentro del lote',
  'Viento no favorable (esperando calma)',
  'Espera de cisterna de agua o apoyo',
  'Coordinación de guardarrayas en campo',
  'Otro motivo justificado',
] as const;

export const MOTIVOS_CANCELACION_ESTANDAR = [
  'Condiciones climáticas adversas (viento/lluvia)',
  'Frente retrasado en corte / Lote no liberado',
  'Falla mecánica en equipo de extinción o cisterna',
  'Riesgo de daño a cultivo vecino o instalaciones',
  'Cambio de programa de cosecha de última hora',
  'Otro motivo justificado',
] as const;

export const ROLES_CONFIG: Record<UserRole, { label: string; badgeColor: string; description: string }> = {
  admin: {
    label: 'Administrador del Sistema',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    description: 'Control total de configuración, seguridad y usuarios.',
  },
  digitador: {
    label: 'Digitador de Quemas',
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
    description: 'Administración de usuarios, catálogos maestros y auditoría.',
  },
  jefatura: {
    label: 'Jefatura / Gerencia',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Supervisión ejecutiva, indicadores y reportes a Excel.',
  },
  supervisor_quemas: {
    label: 'Supervisor de Quemas',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Monitoreo de solicitudes y despacho/asignación de patrullas.',
  },
  supervisor_frente: {
    label: 'Supervisor de Frente',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Creación de solicitudes con hora planificada para su frente.',
  },
  patrulla: {
    label: 'Patrulla de Quema',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
    description: 'Ejecución en campo: llegada, esperas, revisión, quema y cierre.',
  },
  pendiente: {
    label: 'Pendiente de Aprobación',
    badgeColor: 'bg-slate-100 text-slate-500 border-slate-200',
    description: 'Cuenta registrada en espera de activación por el Administrador.',
  },
};

export const PRIORIDADES_CONFIG: Record<Prioridad, { label: string; badgeColor: string }> = {
  NORMAL: { label: 'Normal', badgeColor: 'bg-slate-100 text-slate-600 border-slate-200' },
  ALTA: { label: 'Alta', badgeColor: 'bg-amber-50 text-amber-800 border-amber-200' },
  URGENTE: { label: 'Urgente', badgeColor: 'bg-rose-50 text-rose-800 border-rose-200 font-bold' },
};

export const ESTADOS_CONFIG: Record<BurnStatus, { label: string; badgeColor: string; dotColor: string }> = {
  SOLICITADA: {
    label: 'Solicitada',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    dotColor: 'bg-blue-500',
  },
  PATRULLA_ASIGNADA: {
    label: 'En Camino',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    dotColor: 'bg-amber-500',
  },
  EN_FRENTE: {
    label: 'En Frente',
    badgeColor: 'bg-orange-50 text-orange-800 border-orange-200',
    dotColor: 'bg-orange-500',
  },
  EN_REVISION: {
    label: 'En Revisión',
    badgeColor: 'bg-orange-50 text-orange-800 border-orange-200',
    dotColor: 'bg-orange-500',
  },
  EN_QUEMA: {
    label: 'En Quema',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200 font-bold animate-pulse',
    dotColor: 'bg-rose-600',
  },
  FINALIZADA: {
    label: 'Finalizada',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dotColor: 'bg-emerald-500',
  },
  CANCELADA: {
    label: 'Cancelada',
    badgeColor: 'bg-slate-100 text-slate-500 border-slate-200',
    dotColor: 'bg-slate-400',
  },
};

export const CHECKLIST_REVISION_LABELS: Record<keyof ReviewChecklist, string> = {
  guardarrayas_limpias: 'Guardarrayas limpias',
  humedad_adecuada: 'Humedad adecuada',
  viento_favorable: 'Viento favorable',
  cultivos_vecinos_protegidos: 'Cultivos vecinos protegidos',
  equipo_extincion_listo: 'Equipo de extinción listo',
  cisterna_disponible: 'Cisterna disponible',
};

export const CHECKLIST_REVISION_DEFAULT: ReviewChecklist = {
  guardarrayas_limpias: false,
  humedad_adecuada: false,
  viento_favorable: false,
  cultivos_vecinos_protegidos: false,
  equipo_extincion_listo: false,
  cisterna_disponible: false,
};
