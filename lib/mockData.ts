import { BurnRequest, AuditLog, Farm, Patrol, Front, UserProfile } from './types';

// ============================================================================
// CATÁLOGO OFICIAL DE FRENTES - INGENIO LA UNIÓN
// ============================================================================
export const INITIAL_FRONTS: Front[] = [
  {
    id: 'fr-15',
    name: 'Frente 15',
    code: 'FR-15',
    harvest_type: 'Mecanizada',
    supervisor_turno_a: 'Christian Josue Perez Car',
    supervisor_turno_b: 'Oscar Geovany Villalobos Ixcal',
    active: true,
  },
  {
    id: 'fr-16',
    name: 'Frente 16',
    code: 'FR-16',
    harvest_type: 'Mecanizada',
    supervisor_turno_a: 'Moises Elizardo Argueta',
    supervisor_turno_b: 'Marvin Castillo',
    active: true,
  },
  {
    id: 'fr-17',
    name: 'Frente 17',
    code: 'FR-17',
    harvest_type: 'Manual',
    supervisor_turno_a: 'Angel Leonardo Ortega',
    supervisor_turno_b: 'Elio Omar Noguera',
    active: true,
  },
  {
    id: 'fr-19',
    name: 'Frente 19',
    code: 'FR-19',
    harvest_type: 'Manual',
    supervisor_turno_a: 'Leidy Johana Nij Velasquez',
    supervisor_turno_b: 'Marlon Jehu Colorado',
    active: true,
  },
  {
    id: 'fr-23',
    name: 'Frente 23',
    code: 'FR-23',
    harvest_type: 'Mixta',
    supervisor_turno_a: 'Wendy Fabiola Aguirre',
    supervisor_turno_b: 'Rosa Lopez',
    active: true,
  },
  {
    id: 'fr-25',
    name: 'Frente 25',
    code: 'FR-25',
    harvest_type: 'Mecanizada',
    supervisor_turno_a: 'Oslin Corina Mazariegos',
    supervisor_turno_b: 'Milton Pineda Ovalle',
    active: true,
  },
];

// ============================================================================
// FINCAS DEL INGENIO LA UNIÓN
// ============================================================================
export const INITIAL_FARMS: Farm[] = [
  { id: 'f-1', name: 'Finca Las Palmas', code: 'LP-01', zone: 'Zona Sur - Costa', active: true },
  { id: 'f-2', name: 'Finca El Trapiche', code: 'ET-02', zone: 'Zona Sur - Costa', active: true },
  { id: 'f-3', name: 'Finca San Jerónimo', code: 'SJ-03', zone: 'Zona Central', active: true },
  { id: 'f-4', name: 'Finca La Esperanza', code: 'LE-04', zone: 'Zona Central', active: true },
  { id: 'f-5', name: 'Finca Santa Rosa', code: 'SR-05', zone: 'Zona Norte', active: true },
  { id: 'f-6', name: 'Finca Los Almendros', code: 'LA-06', zone: 'Zona Norte', active: true },
  { id: 'f-7', name: 'Finca San Francisco', code: 'SF-07', zone: 'Zona Oriente', active: true },
  { id: 'f-8', name: 'Finca Miramar', code: 'MM-08', zone: 'Zona Costa', active: true },
];

// ============================================================================
// PATRULLAS DE QUEMA
// ============================================================================
export const INITIAL_PATROLS: Patrol[] = [
  { id: 'pat-1', name: 'Patrulla Alfa', leader_name: 'Juan Pérez', phone: '+502 5555-0301', vehicle_code: 'UNI-401', status: 'DISPONIBLE', active: true },
  { id: 'pat-2', name: 'Patrulla Beta', leader_name: 'Luis Morales', phone: '+502 5555-0302', vehicle_code: 'UNI-402', status: 'EN_FRENTE', active: true },
  { id: 'pat-3', name: 'Patrulla Gamma', leader_name: 'Pedro Ruiz', phone: '+502 5555-0303', vehicle_code: 'UNI-403', status: 'DISPONIBLE', active: true },
  { id: 'pat-4', name: 'Patrulla Delta', leader_name: 'Hugo Estrada', phone: '+502 5555-0304', vehicle_code: 'UNI-404', status: 'EN_QUEMA', active: true },
];

// ============================================================================
// USUARIOS OFICIALES DE INGENIO LA UNIÓN (FRENTES, DESCANSOS, QUEMAS, DIGITADOR, JEFATURA)
// ============================================================================
export const INITIAL_USERS: UserProfile[] = [
  // FRENTE 15
  {
    id: 'usr-frente-15a',
    username: 'christian.perez',
    password: 'frente123',
    pin: '1501',
    full_name: 'Christian Josue Perez Car',
    email: 'christian.perez@launion.com',
    role: 'supervisor_frente',
    phone: '+502 5555-1501',
    assigned_front: 'Frente 15',
    current_shift: 'Turno Día (06:00 - 18:00)',
    active: true,
  },
  {
    id: 'usr-frente-15b',
    username: 'oscar.villalobos',
    password: 'frente123',
    pin: '1502',
    full_name: 'Oscar Geovany Villalobos Ixcal',
    email: 'oscar.villalobos@launion.com',
    role: 'supervisor_frente',
    phone: '+502 5555-1502',
    assigned_front: 'Frente 15',
    current_shift: 'Turno Noche (18:00 - 06:00)',
    active: true,
  },

  // FRENTE 16
  {
    id: 'usr-frente-16a',
    username: 'moises.argueta',
    password: 'frente123',
    pin: '1601',
    full_name: 'Moises Elizardo Argueta',
    email: 'moises.argueta@launion.com',
    role: 'supervisor_frente',
    phone: '+502 5555-1601',
    assigned_front: 'Frente 16',
    current_shift: 'Turno Día (06:00 - 18:00)',
    active: true,
  },
  {
    id: 'usr-frente-16b',
    username: 'marvin.castillo',
    password: 'frente123',
    pin: '1602',
    full_name: 'Marvin Castillo',
    email: 'marvin.castillo@launion.com',
    role: 'supervisor_frente',
    phone: '+502 5555-1602',
    assigned_front: 'Frente 16',
    current_shift: 'Turno Noche (18:00 - 06:00)',
    active: true,
  },

  // FRENTE 17
  {
    id: 'usr-frente-17a',
    username: 'angel.ortega',
    password: 'frente123',
    pin: '1701',
    full_name: 'Angel Leonardo Ortega',
    email: 'angel.ortega@launion.com',
    role: 'supervisor_frente',
    phone: '+502 5555-1701',
    assigned_front: 'Frente 17',
    current_shift: 'Turno Día (06:00 - 18:00)',
    active: true,
  },
  {
    id: 'usr-frente-17b',
    username: 'elio.noguera',
    password: 'frente123',
    pin: '1702',
    full_name: 'Elio Omar Noguera',
    email: 'elio.noguera@launion.com',
    role: 'supervisor_frente',
    phone: '+502 5555-1702',
    assigned_front: 'Frente 17',
    current_shift: 'Turno Noche (18:00 - 06:00)',
    active: true,
  },

  // FRENTE 19
  {
    id: 'usr-frente-19a',
    username: 'leidy.nij',
    password: 'frente123',
    pin: '1901',
    full_name: 'Leidy Johana Nij Velasquez',
    email: 'leidy.nij@launion.com',
    role: 'supervisor_frente',
    phone: '+502 5555-1901',
    assigned_front: 'Frente 19',
    current_shift: 'Turno Día (06:00 - 18:00)',
    active: true,
  },
  {
    id: 'usr-frente-19b',
    username: 'marlon.colorado',
    password: 'frente123',
    pin: '1902',
    full_name: 'Marlon Jehu Colorado',
    email: 'marlon.colorado@launion.com',
    role: 'supervisor_frente',
    phone: '+502 5555-1902',
    assigned_front: 'Frente 19',
    current_shift: 'Turno Noche (18:00 - 06:00)',
    active: true,
  },

  // FRENTE 23
  {
    id: 'usr-frente-23a',
    username: 'wendy.aguirre',
    password: 'frente123',
    pin: '2301',
    full_name: 'Wendy Fabiola Aguirre',
    email: 'wendy.aguirre@launion.com',
    role: 'supervisor_frente',
    phone: '+502 5555-2301',
    assigned_front: 'Frente 23',
    current_shift: 'Turno Día (06:00 - 18:00)',
    active: true,
  },
  {
    id: 'usr-frente-23b',
    username: 'rosa.lopez',
    password: 'frente123',
    pin: '2302',
    full_name: 'Rosa Lopez',
    email: 'rosa.lopez@launion.com',
    role: 'supervisor_frente',
    phone: '+502 5555-2302',
    assigned_front: 'Frente 23',
    current_shift: 'Turno Noche (18:00 - 06:00)',
    active: true,
  },

  // FRENTE 25
  {
    id: 'usr-frente-25a',
    username: 'oslin.mazariegos',
    password: 'frente123',
    pin: '2501',
    full_name: 'Oslin Corina Mazariegos',
    email: 'oslin.mazariegos@launion.com',
    role: 'supervisor_frente',
    phone: '+502 5555-2501',
    assigned_front: 'Frente 25',
    current_shift: 'Turno Día (06:00 - 18:00)',
    active: true,
  },
  {
    id: 'usr-frente-25b',
    username: 'milton.pineda',
    password: 'frente123',
    pin: '2502',
    full_name: 'Milton Pineda Ovalle',
    email: 'milton.pineda@launion.com',
    role: 'supervisor_frente',
    phone: '+502 5555-2502',
    assigned_front: 'Frente 25',
    current_shift: 'Turno Noche (18:00 - 06:00)',
    active: true,
  },

  // SUPERVISORES DE RELEVO / COBERTURA DE DESCANSOS (Desc1 & Desc2)
  {
    id: 'usr-frente-desc1',
    username: 'rodolfo.samayoa',
    password: 'frente123',
    pin: '9001',
    full_name: 'Rodolfo Elvira Samayoa (Descanso 1 / Relevo)',
    email: 'rodolfo.samayoa@launion.com',
    role: 'supervisor_frente',
    phone: '+502 5555-9001',
    assigned_front: 'Frente 15',
    current_shift: 'Relevo / Cobertura de Descanso',
    is_relief_supervisor: true,
    active: true,
  },
  {
    id: 'usr-frente-desc2',
    username: 'jaqueline.muxin',
    password: 'frente123',
    pin: '9002',
    full_name: 'Jaqueline Viviana Muxin (Descanso 2 / Relevo)',
    email: 'jaqueline.muxin@launion.com',
    role: 'supervisor_frente',
    phone: '+502 5555-9002',
    assigned_front: 'Frente 16',
    current_shift: 'Relevo / Cobertura de Descanso',
    is_relief_supervisor: true,
    active: true,
  },

  // SUPERVISOR DE QUEMAS
  {
    id: 'usr-quemas-1',
    username: 'mario.estrada',
    password: 'quemas123',
    pin: '2001',
    full_name: 'Ing. Mario Estrada',
    email: 'mario.estrada@launion.com',
    role: 'supervisor_quemas',
    phone: '+502 5555-0201',
    active: true,
  },

  // PATRULLAS DE QUEMA
  {
    id: 'usr-patrulla-1',
    username: 'patrulla.alfa',
    password: 'patrulla123',
    pin: '3001',
    full_name: 'Patrulla Alfa (Juan Pérez)',
    email: 'patrulla.alfa@launion.com',
    role: 'patrulla',
    phone: '+502 5555-0301',
    assigned_patrol_id: 'pat-1',
    assigned_patrol_name: 'Patrulla Alfa',
    active: true,
  },
  {
    id: 'usr-patrulla-2',
    username: 'patrulla.beta',
    password: 'patrulla123',
    pin: '3002',
    full_name: 'Patrulla Beta (Luis Morales)',
    email: 'patrulla.beta@launion.com',
    role: 'patrulla',
    phone: '+502 5555-0302',
    assigned_patrol_id: 'pat-2',
    assigned_patrol_name: 'Patrulla Beta',
    active: true,
  },

  // DIGITADOR
  {
    id: 'usr-digitador-1',
    username: 'ana.castillo',
    password: 'digitador123',
    pin: '4001',
    full_name: 'Ana Lucía Castillo',
    email: 'ana.castillo@launion.com',
    role: 'digitador',
    phone: '+502 5555-0401',
    active: true,
  },

  // JEFATURA
  {
    id: 'usr-jefatura-1',
    username: 'fernando.alvarado',
    password: 'jefatura123',
    pin: '5001',
    full_name: 'Lic. Fernando Alvarado',
    email: 'fernando.alvarado@launion.com',
    role: 'jefatura',
    phone: '+502 5555-0501',
    active: true,
  },
];

const now = new Date();
const todayStr = (hours: number, minutes: number) => {
  const d = new Date(now);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

// ============================================================================
// SOLICITUDES DE QUEMA INICIALES (VACÍO PARA PRUEBAS REALES)
// ============================================================================
export const INITIAL_BURNS: BurnRequest[] = [];

// ============================================================================
// BITÁCORA DE AUDITORÍA INICIAL (VACÍO PARA PRUEBAS REALES)
// ============================================================================
export const INITIAL_AUDIT_LOGS: AuditLog[] = [];
