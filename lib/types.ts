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

export interface UserProfile {
  id: string; // UUID de auth.users
  correo: string;
  nombre_completo: string;
  rol: UserRole;
  telefono?: string;
  frente_asignado?: string; // Ej: "Frente 15"
  patrulla_asignada_id?: string;
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

  // 1. Solicitud y Planificación
  hora_solicitud: string; // Timestamp de cuando se solicita
  hora_planificada: string; // Timestamp de cuando se desea quemar
  creado_por_usuario_id: string;
  nombre_supervisor_frente: string;

  // 2. Asignación
  hora_asignacion?: string; // Timestamp de despacho
  patrulla_asignada_id?: string;
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
  id: string;
  nombre: string;
  codigo?: string;
  tipo_cosecha: 'Mecanizada' | 'Manual' | 'Mixta';
  supervisor_turno_a?: string;
  supervisor_turno_b?: string;
  activo: boolean;
}

export interface PatrolCatalog {
  id: string;
  nombre: string;
  nombre_lider: string;
  telefono: string;
  codigo_vehiculo?: string;
  estado: 'DISPONIBLE' | 'EN_FRENTE' | 'EN_QUEMA';
  activo: boolean;
}

export interface FarmLoteCatalog {
  id: string;
  finca: string;
  lote: string;
  area_ha: number;
  area_mz: number;
  variedad?: string;
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
    badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
    description: 'Control total de configuración, seguridad y usuarios.',
  },
  digitador: {
    label: 'Digitador de Quemas',
    badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
    description: 'Administración de usuarios, catálogos maestros y auditoría.',
  },
  jefatura: {
    label: 'Jefatura / Gerencia',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    description: 'Supervisión ejecutiva, indicadores y reportes a Excel.',
  },
  supervisor_quemas: {
    label: 'Supervisor de Quemas',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    description: 'Monitoreo de solicitudes y despacho/asignación de patrullas.',
  },
  supervisor_frente: {
    label: 'Supervisor de Frente',
    badgeColor: 'bg-blue-950 text-blue-300 border-blue-800',
    description: 'Creación de solicitudes con hora planificada para su frente.',
  },
  patrulla: {
    label: 'Patrulla de Quema',
    badgeColor: 'bg-orange-950 text-orange-300 border-orange-800',
    description: 'Ejecución en campo: llegada, esperas, revisión, quema y cierre.',
  },
  pendiente: {
    label: 'Pendiente de Aprobación',
    badgeColor: 'bg-slate-900 text-slate-400 border-slate-700',
    description: 'Cuenta registrada en espera de activación por el Administrador.',
  },
};
