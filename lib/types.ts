export type UserRole =
  | 'admin'
  | 'digitador'
  | 'jefatura'
  | 'supervisor_quemas'
  | 'supervisor_frente'
  | 'patrulla'
  | 'pendiente';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  active: boolean;
  created_at?: string;
}

export const ROLE_DETAILS: Record<UserRole, { label: string; badgeColor: string; description: string }> = {
  admin: {
    label: 'Administrador del Sistema',
    badgeColor: 'bg-gray-100 text-gray-800 border-gray-300',
    description: 'Control de usuarios, configuración y mantenimiento global.',
  },
  digitador: {
    label: 'Digitador de Quemas',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Valida, registra y administra las operaciones y catálogos.',
  },
  jefatura: {
    label: 'Jefatura / Gerencia',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Supervisión ejecutiva, indicadores y auditoría.',
  },
  supervisor_quemas: {
    label: 'Supervisor de Quemas',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Monitorea y coordina la ejecución de quemas en campo.',
  },
  supervisor_frente: {
    label: 'Supervisor de Frente',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Gestiona las solicitudes operativas de su frente asignado.',
  },
  patrulla: {
    label: 'Patrulla de Quema',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    description: 'Cuadrilla de inspección y respuesta en campo.',
  },
  pendiente: {
    label: 'Pendiente de Aprobación',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    description: 'Usuario registrado a la espera de aprobación y asignación de rol.',
  },
};
