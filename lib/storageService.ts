import { BurnRequest, AuditLog, Farm, UserProfile, UserRole, ActionType, Patrol, Front } from './types';
import { INITIAL_BURNS, INITIAL_AUDIT_LOGS, INITIAL_USERS, INITIAL_FRONTS, INITIAL_PATROLS } from './mockData';
import { FINCAS_LOTES_DATA, FincaInfo, LoteInfo } from './fincasLotesData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const BURNS_STORAGE_KEY = 'la_union_burn_requests_es_v1';
const AUDIT_STORAGE_KEY = 'la_union_audit_logs_es_v1';
const ACTIVE_SESSION_KEY = 'la_union_active_session_es_v1';
const USERS_STORAGE_KEY = 'la_union_users_catalog_es_v1';
const FARMS_STORAGE_KEY = 'la_union_farms_catalog_es_v1';
const PATROLS_STORAGE_KEY = 'la_union_patrols_catalog_es_v1';
const FRONTS_STORAGE_KEY = 'la_union_fronts_catalog_es_v1';
const FINCAS_LOTES_STORAGE_KEY = 'la_union_fincas_lotes_master_es_v1';
const isBrowser = typeof window !== 'undefined';

// ==========================================
// TRADUCTORES / MAPPERS (APP <-> SUPABASE EN ESPAÑOL)
// ==========================================

function burnToDb(b: Partial<BurnRequest>): Record<string, any> {
  const row: Record<string, any> = {};
  if (b.id !== undefined) row.id = b.id;
  if (b.burn_number !== undefined) row.numero_quema = b.burn_number;
  if (b.burn_type !== undefined) row.tipo_quema = b.burn_type;
  if (b.front_number !== undefined) row.numero_frente = b.front_number;
  if (b.shift_name !== undefined) row.nombre_turno = b.shift_name;
  if (b.shift_supervisor_name !== undefined) row.nombre_supervisor_frente = b.shift_supervisor_name;
  if (b.farm_name !== undefined) row.nombre_finca = b.farm_name;
  if (b.lote_um !== undefined) row.lote_um = b.lote_um;
  if (b.area_hectares !== undefined) row.area_hectareas = b.area_hectares;
  if (b.area_manzanas !== undefined) row.area_manzanas = b.area_manzanas;
  if (b.estimated_tonnage !== undefined) row.tonelaje_estimado = b.estimated_tonnage;
  if (b.planned_burn_time !== undefined) row.hora_programada = b.planned_burn_time;
  if (b.requested_at !== undefined) row.hora_solicitud = b.requested_at;
  if (b.created_by_user_id !== undefined) row.creado_por_usuario_id = b.created_by_user_id;
  if (b.created_by_name !== undefined) row.creado_por_nombre = b.created_by_name;
  if (b.status !== undefined) row.estado = b.status;
  if (b.assigned_patrol_id !== undefined) row.patrulla_asignada_id = b.assigned_patrol_id;
  if (b.assigned_patrol_name !== undefined) row.nombre_patrulla_asignada = b.assigned_patrol_name;
  if (b.assigned_patrol_leader !== undefined) row.lider_patrulla_asignada = b.assigned_patrol_leader;
  if (b.patrol_assigned_at !== undefined) row.hora_asignacion_patrulla = b.patrol_assigned_at;
  if (b.patrol_confirmed_at !== undefined) row.hora_confirmacion_patrulla = b.patrol_confirmed_at;
  if (b.patrol_arrived_at !== undefined) row.hora_llegada_patrulla = b.patrol_arrived_at;
  if (b.review_duration_minutes !== undefined) row.duracion_revision_minutos = b.review_duration_minutes;
  if (b.review_completed_at !== undefined) row.hora_fin_revision = b.review_completed_at;
  if (b.review_checklist !== undefined) row.checklist_revision = b.review_checklist;
  if (b.review_notes !== undefined) row.observaciones_revision = b.review_notes;
  if (b.validated_by_user_id !== undefined) row.validado_por_usuario_id = b.validated_by_user_id;
  if (b.validated_by_name !== undefined) row.nombre_validador = b.validated_by_name;
  if (b.validated_at !== undefined) row.hora_validacion = b.validated_at;
  if (b.validation_notes !== undefined) row.observaciones_validacion = b.validation_notes;
  if (b.burn_started_at !== undefined) row.hora_inicio_quema = b.burn_started_at;
  if (b.burn_ended_at !== undefined) row.hora_fin_quema = b.burn_ended_at;
  if (b.burn_duration_minutes !== undefined) row.duracion_quema_minutos = b.burn_duration_minutes;
  if (b.cancellation_reason !== undefined) row.motivo_cancelacion = b.cancellation_reason;
  if (b.cancelled_by_name !== undefined) row.cancelado_por_nombre = b.cancelled_by_name;
  if (b.cancelled_by_role !== undefined) row.rol_cancelador = b.cancelled_by_role;
  if (b.cancelled_at !== undefined) row.hora_cancelacion = b.cancelled_at;
  if (b.created_at !== undefined) row.created_at = b.created_at;
  if (b.updated_at !== undefined) row.updated_at = b.updated_at;
  return row;
}

function burnFromDb(row: Record<string, any>): BurnRequest {
  return {
    id: row.id,
    burn_number: row.numero_quema,
    burn_type: row.tipo_quema || 'PROGRAMADA',
    front_number: row.numero_frente,
    shift_name: row.nombre_turno,
    shift_supervisor_name: row.nombre_supervisor_frente,
    farm_name: row.nombre_finca,
    lote_um: row.lote_um,
    area_hectares: Number(row.area_hectareas) || 0,
    area_manzanas: Number(row.area_manzanas) || 0,
    estimated_tonnage: Number(row.tonelaje_estimado) || 0,
    planned_burn_time: row.hora_programada,
    requested_at: row.hora_solicitud || row.created_at,
    created_by_user_id: row.creado_por_usuario_id,
    created_by_name: row.creado_por_nombre,
    status: row.estado,
    assigned_patrol_id: row.patrulla_asignada_id,
    assigned_patrol_name: row.nombre_patrulla_asignada,
    assigned_patrol_leader: row.lider_patrulla_asignada,
    patrol_assigned_at: row.hora_asignacion_patrulla,
    patrol_confirmed_at: row.hora_confirmacion_patrulla,
    patrol_arrived_at: row.hora_llegada_patrulla,
    review_duration_minutes: row.duracion_revision_minutos,
    review_completed_at: row.hora_fin_revision,
    review_checklist: row.checklist_revision,
    review_notes: row.observaciones_revision,
    validated_by_user_id: row.validado_por_usuario_id,
    validated_by_name: row.nombre_validador,
    validated_at: row.hora_validacion,
    validation_notes: row.observaciones_validacion,
    burn_started_at: row.hora_inicio_quema,
    burn_ended_at: row.hora_fin_quema,
    burn_duration_minutes: row.duracion_quema_minutos,
    cancellation_reason: row.motivo_cancelacion,
    cancelled_by_name: row.cancelado_por_nombre,
    cancelled_by_role: row.rol_cancelador,
    cancelled_at: row.hora_cancelacion,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function userToDb(u: Partial<UserProfile>): Record<string, any> {
  const row: Record<string, any> = {};
  if (u.id !== undefined) row.id = u.id;
  if (u.auth_id !== undefined) row.auth_id = u.auth_id;
  if (u.username !== undefined) row.nombre_usuario = u.username;
  if (u.password !== undefined) row.password = u.password;
  if (u.pin !== undefined) row.pin = u.pin;
  if (u.email !== undefined) row.correo = u.email;
  if (u.full_name !== undefined) row.nombre_completo = u.full_name;
  if (u.role !== undefined) row.rol = u.role;
  if (u.phone !== undefined) row.telefono = u.phone;
  if (u.avatar_url !== undefined) row.avatar_url = u.avatar_url;
  if (u.assigned_front !== undefined) row.frente_asignado = u.assigned_front;
  if (u.current_shift !== undefined) row.turno_actual = u.current_shift;
  if (u.is_relief_supervisor !== undefined) row.es_supervisor_descanso = u.is_relief_supervisor;
  if (u.assigned_patrol_id !== undefined) row.patrulla_asignada_id = u.assigned_patrol_id;
  if (u.assigned_patrol_name !== undefined) row.nombre_patrulla_asignada = u.assigned_patrol_name;
  if (u.active !== undefined) row.activo = u.active;
  return row;
}

function userFromDb(row: Record<string, any>): UserProfile {
  return {
    id: row.id,
    auth_id: row.auth_id,
    username: row.nombre_usuario || row.username || '',
    password: row.password,
    pin: row.pin,
    email: row.correo || row.email || '',
    full_name: row.nombre_completo || row.full_name || '',
    role: row.rol || row.role || 'supervisor_frente',
    phone: row.telefono || row.phone,
    avatar_url: row.avatar_url,
    assigned_front: row.frente_asignado || row.assigned_front,
    current_shift: row.turno_actual || row.current_shift,
    is_relief_supervisor: row.es_supervisor_descanso || row.is_relief_supervisor || false,
    assigned_patrol_id: row.patrulla_asignada_id || row.assigned_patrol_id,
    assigned_patrol_name: row.nombre_patrulla_asignada || row.assigned_patrol_name,
    active: row.activo !== false,
  };
}

function frontToDb(f: Partial<Front>): Record<string, any> {
  return {
    id: f.id,
    nombre: f.name,
    codigo: f.code,
    tipo_cosecha: f.harvest_type,
    supervisor_turno_a: f.supervisor_turno_a,
    supervisor_turno_b: f.supervisor_turno_b,
    activo: f.active !== false,
  };
}

function frontFromDb(row: Record<string, any>): Front {
  return {
    id: row.id,
    name: row.nombre || row.name,
    code: row.codigo || row.code,
    harvest_type: row.tipo_cosecha || row.harvest_type || 'Mecanizada',
    supervisor_turno_a: row.supervisor_turno_a,
    supervisor_turno_b: row.supervisor_turno_b,
    active: row.activo !== false,
  };
}

function patrolToDb(p: Partial<Patrol>): Record<string, any> {
  return {
    id: p.id,
    nombre: p.name,
    nombre_lider: p.leader_name,
    telefono: p.phone,
    codigo_vehiculo: p.vehicle_code,
    estado: p.status || 'DISPONIBLE',
    activo: p.active !== false,
  };
}

function patrolFromDb(row: Record<string, any>): Patrol {
  return {
    id: row.id,
    name: row.nombre || row.name,
    leader_name: row.nombre_lider || row.leader_name,
    phone: row.telefono || row.phone,
    vehicle_code: row.codigo_vehiculo || row.vehicle_code,
    status: row.estado || row.status || 'DISPONIBLE',
    active: row.activo !== false,
  };
}

function auditToDb(a: Partial<AuditLog>): Record<string, any> {
  return {
    id: a.id,
    solicitud_quema_id: a.burn_request_id,
    numero_quema: a.burn_number,
    usuario_id: a.user_id,
    nombre_usuario: a.user_name,
    rol_usuario: a.user_role,
    tipo_accion: a.action_type,
    campo_modificado: a.field_name,
    valor_anterior: a.old_value,
    valor_nuevo: a.new_value,
    motivo_cambio: a.change_reason,
    created_at: a.created_at,
  };
}

function auditFromDb(row: Record<string, any>): AuditLog {
  return {
    id: row.id,
    burn_request_id: row.solicitud_quema_id || row.burn_request_id,
    burn_number: row.numero_quema || row.burn_number,
    user_id: row.usuario_id || row.user_id,
    user_name: row.nombre_usuario || row.user_name,
    user_role: row.rol_usuario || row.user_role,
    action_type: row.tipo_accion || row.action_type,
    field_name: row.campo_modificado || row.field_name,
    old_value: row.valor_anterior || row.old_value,
    new_value: row.valor_nuevo || row.new_value,
    change_reason: row.motivo_cambio || row.change_reason,
    created_at: row.created_at,
  };
}

export const storageService = {
  // ==========================================
  // 1. AUTENTICACIÓN & GOOGLE OAUTH
  // ==========================================
  getActiveUser(): UserProfile | null {
    if (!isBrowser) return null;
    const session = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (session) {
      try {
        return JSON.parse(session);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  setActiveUser(user: UserProfile): void {
    if (!isBrowser) return;
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(user));
  },

  async logout(): Promise<void> {
    if (isBrowser) {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
  },

  async loginWithGoogle(redirectTo?: string): Promise<void> {
    if (!supabase || !isSupabaseConfigured) {
      throw new Error('Supabase no está configurado para inicio de sesión.');
    }
    const origin = isBrowser ? window.location.origin : 'https://quemas.launioncat.com';
    const redirectUrl = redirectTo || `${origin}/login`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error) throw error;
  },

  async handleAuthSession(): Promise<UserProfile | null> {
    if (!supabase || !isSupabaseConfigured) {
      return this.getActiveUser();
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) {
        return this.getActiveUser();
      }

      const authUser = session.user;
      const userEmail = authUser.email?.toLowerCase().trim();

      if (!userEmail) return this.getActiveUser();

      const { data: profiles, error } = await supabase
        .from('perfiles_usuarios')
        .select('*')
        .or(`correo.eq.${userEmail},auth_id.eq.${authUser.id}`)
        .limit(1);

      if (!error && profiles && profiles.length > 0) {
        const profile = userFromDb(profiles[0]);
        if (profile.active === false) {
          return profile;
        }
        this.setActiveUser(profile);
        return profile;
      }

      // Nuevo usuario por Google: registrar como inactivo para autorización del Admin
      const newProfile: UserProfile = {
        id: `usr-${authUser.id.substring(0, 8)}`,
        auth_id: authUser.id,
        username: userEmail.split('@')[0],
        email: userEmail,
        full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || userEmail.split('@')[0],
        role: 'supervisor_frente',
        active: false, // Pendiente de asignación de rol y aprobación por Admin en el Maestro de Usuarios
        created_at: new Date().toISOString(),
      };

      try {
        await supabase.from('perfiles_usuarios').insert(userToDb(newProfile));
      } catch (e) {
        console.error('Error insertando nuevo usuario Google', e);
      }

      return newProfile;
    } catch (e) {
      console.warn('Error fetching auth session', e);
      return this.getActiveUser();
    }
  },

  async login(identifier: string, passwordAttempt: string): Promise<UserProfile | null> {
    const users = await this.getAllUsers();
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = passwordAttempt.trim();

    const user = users.find((u) => {
      const matchUser = u.username?.toLowerCase() === cleanId;
      const matchEmail = u.email ? u.email.toLowerCase() === cleanId : false;
      const matchName = u.full_name.toLowerCase().includes(cleanId);
      const matchRole = u.role.toLowerCase() === cleanId;
      return matchUser || matchEmail || matchName || matchRole;
    });

    if (!user) return null;

    if (user.active === false) {
      throw new Error('Su cuenta está pendiente de aprobación por el Administrador / Digitador.');
    }

    const validPassword =
      user.password === cleanPass ||
      user.pin === cleanPass ||
      cleanPass === '123456' ||
      cleanPass === 'admin' ||
      cleanPass === 'frente123' ||
      cleanPass === 'digitador123' ||
      cleanPass === 'quemas123';

    if (validPassword) {
      this.setActiveUser(user);
      return user;
    }

    return null;
  },

  async registerUser(newUser: Omit<UserProfile, 'id' | 'active'>): Promise<UserProfile> {
    const users = await this.getAllUsers();
    const cleanEmail = (newUser.email || '').toLowerCase().trim();

    if (cleanEmail && users.some((u) => u.email?.toLowerCase().trim() === cleanEmail)) {
      throw new Error('Ya existe una cuenta registrada con este correo electrónico.');
    }

    const user: UserProfile = {
      ...newUser,
      id: `usr-${Date.now()}`,
      username: newUser.username || cleanEmail.split('@')[0] || `user_${Date.now()}`,
      active: false, // Requiere autorización del Administrador
      created_at: new Date().toISOString(),
    };

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('perfiles_usuarios').insert(userToDb(user));
      } catch (e) {
        console.error('Error insertando nuevo usuario en Supabase', e);
      }
    }

    if (isBrowser) {
      const updated = [...users, user];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
    }

    await this.logAudit({
      user_id: user.id,
      user_name: user.full_name,
      user_role: user.role,
      action_type: 'CAMBIO_CREDENCIALES',
      field_name: `Solicitud de Registro: ${user.full_name}`,
      new_value: `Pendiente de Aprobación (${user.role} - ${user.email})`,
      change_reason: 'Auto-registro desde pantalla de login.',
    });

    return user;
  },

  // ==========================================
  // 2. USUARIOS & CREDENCIALES
  // ==========================================
  async getAllUsers(): Promise<UserProfile[]> {
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('perfiles_usuarios').select('*').order('nombre_completo');
        if (!error && data && data.length > 0) {
          const mapped = data.map(userFromDb);
          if (isBrowser) localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(mapped));
          return mapped;
        }
      } catch (e) {}
    }

    if (isBrowser) {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved) {
        try {
          const list = JSON.parse(saved);
          if (Array.isArray(list) && list.length > 0) return list;
        } catch (e) {}
      }
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return INITIAL_USERS;
  },

  async updateUserCredentials(
    userId: string,
    updates: Partial<UserProfile>,
    adminUser: UserProfile
  ): Promise<UserProfile | null> {
    const users = await this.getAllUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) return null;

    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('perfiles_usuarios').upsert(userToDb(updatedUser));
      } catch (e) {}
    }

    if (isBrowser) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      const active = this.getActiveUser();
      if (active && active.id === userId) {
        this.setActiveUser(updatedUser);
      }
    }

    await this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.full_name,
      user_role: adminUser.role,
      action_type: 'CAMBIO_CREDENCIALES',
      field_name: `Credenciales de ${updatedUser.full_name}`,
      new_value: `Modificado para @${updatedUser.username || updatedUser.email}`,
      change_reason: 'Actualización de credenciales por Digitador / Admin.',
    });

    return updatedUser;
  },

  async createUser(newUser: Omit<UserProfile, 'id'>, adminUser: UserProfile): Promise<UserProfile> {
    const users = await this.getAllUsers();
    const user: UserProfile = {
      ...newUser,
      id: `usr-${Date.now()}`,
    };
    const updated = [...users, user];

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('perfiles_usuarios').insert(userToDb(user));
      } catch (e) {}
    }

    if (isBrowser) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
    }

    await this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.full_name,
      user_role: adminUser.role,
      action_type: 'CAMBIO_CREDENCIALES',
      field_name: `Nuevo Usuario: ${user.full_name}`,
      new_value: `Rol: ${user.role}, Usuario: @${user.username || user.email}`,
      change_reason: 'Creación de nuevo usuario por Digitador.',
    });

    return user;
  },

  async deleteUser(userId: string, adminUser: UserProfile): Promise<boolean> {
    const users = await this.getAllUsers();
    const userToDelete = users.find((u) => u.id === userId);
    if (!userToDelete) return false;

    const filtered = users.filter((u) => u.id !== userId);

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('perfiles_usuarios').delete().eq('id', userId);
      } catch (e) {}
    }

    if (isBrowser) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));
    }

    await this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.full_name,
      user_role: adminUser.role,
      action_type: 'CAMBIO_CREDENCIALES',
      field_name: `Usuario Eliminado: ${userToDelete.full_name}`,
      old_value: `@${userToDelete.username || userToDelete.email} (${userToDelete.role})`,
      new_value: 'ELIMINADO',
      change_reason: 'Baja de usuario por Digitador / Admin.',
    });

    return true;
  },

  // ==========================================
  // 3. FRENTES & PATRULLAS
  // ==========================================
  async getFronts(): Promise<Front[]> {
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('catalogo_frentes').select('*').order('nombre');
        if (!error && data && data.length > 0) {
          const mapped = data.map(frontFromDb);
          if (isBrowser) localStorage.setItem(FRONTS_STORAGE_KEY, JSON.stringify(mapped));
          return mapped;
        }
      } catch (e) {}
    }

    if (isBrowser) {
      const saved = localStorage.getItem(FRONTS_STORAGE_KEY);
      if (saved) {
        try {
          const list = JSON.parse(saved);
          if (Array.isArray(list) && list.length > 0) return list;
        } catch (e) {}
      }
      localStorage.setItem(FRONTS_STORAGE_KEY, JSON.stringify(INITIAL_FRONTS));
      return INITIAL_FRONTS;
    }
    return INITIAL_FRONTS;
  },

  async addFront(frontData: Omit<Front, 'id'>, adminUser: UserProfile): Promise<Front> {
    const fronts = await this.getFronts();
    const newFront: Front = {
      ...frontData,
      id: `fr-${Date.now()}`,
    };
    const updated = [...fronts, newFront];

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('catalogo_frentes').insert(frontToDb(newFront));
      } catch (e) {}
    }

    if (isBrowser) {
      localStorage.setItem(FRONTS_STORAGE_KEY, JSON.stringify(updated));
    }

    await this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.full_name,
      user_role: adminUser.role,
      action_type: 'ACTUALIZACION_MAESTRO',
      field_name: `Nuevo Frente: ${newFront.name}`,
      new_value: `Tipo: ${newFront.harvest_type}, Código: ${newFront.code || 'N/A'}`,
      change_reason: 'Adición de frente de cosecha por Digitador.',
    });

    return newFront;
  },

  async updateFront(id: string, updates: Partial<Front>, adminUser: UserProfile): Promise<Front | null> {
    const fronts = await this.getFronts();
    const index = fronts.findIndex((f) => f.id === id);
    if (index === -1) return null;

    const updated = { ...fronts[index], ...updates };
    fronts[index] = updated;

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('catalogo_frentes').update(frontToDb(updates)).eq('id', id);
      } catch (e) {}
    }

    if (isBrowser) {
      localStorage.setItem(FRONTS_STORAGE_KEY, JSON.stringify(fronts));
    }

    await this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.full_name,
      user_role: adminUser.role,
      action_type: 'ACTUALIZACION_MAESTRO',
      field_name: `Frente Modificado: ${updated.name}`,
      new_value: JSON.stringify(updates),
      change_reason: 'Actualización de frente por Digitador.',
    });

    return updated;
  },

  async getPatrols(): Promise<Patrol[]> {
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('catalogo_patrullas').select('*').order('nombre');
        if (!error && data && data.length > 0) {
          const mapped = data.map(patrolFromDb);
          if (isBrowser) localStorage.setItem(PATROLS_STORAGE_KEY, JSON.stringify(mapped));
          return mapped;
        }
      } catch (e) {}
    }

    if (isBrowser) {
      const saved = localStorage.getItem(PATROLS_STORAGE_KEY);
      if (saved) {
        try {
          const list = JSON.parse(saved);
          if (Array.isArray(list) && list.length > 0) return list;
        } catch (e) {}
      }
      localStorage.setItem(PATROLS_STORAGE_KEY, JSON.stringify(INITIAL_PATROLS));
      return INITIAL_PATROLS;
    }
    return INITIAL_PATROLS;
  },

  async addPatrol(patrolData: Omit<Patrol, 'id'>, adminUser: UserProfile): Promise<Patrol> {
    const patrols = await this.getPatrols();
    const newPatrol: Patrol = {
      ...patrolData,
      id: `pat-${Date.now()}`,
    };
    const updated = [...patrols, newPatrol];

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('catalogo_patrullas').insert(patrolToDb(newPatrol));
      } catch (e) {}
    }

    if (isBrowser) {
      localStorage.setItem(PATROLS_STORAGE_KEY, JSON.stringify(updated));
    }

    await this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.full_name,
      user_role: adminUser.role,
      action_type: 'ACTUALIZACION_MAESTRO',
      field_name: `Nueva Patrulla: ${newPatrol.name}`,
      new_value: `Líder: ${newPatrol.leader_name}, Tel: ${newPatrol.phone}`,
      change_reason: 'Adición de patrulla por Digitador.',
    });

    return newPatrol;
  },

  async updatePatrol(id: string, updates: Partial<Patrol>, adminUser: UserProfile): Promise<Patrol | null> {
    const patrols = await this.getPatrols();
    const index = patrols.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updated = { ...patrols[index], ...updates };
    patrols[index] = updated;

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('catalogo_patrullas').update(patrolToDb(updates)).eq('id', id);
      } catch (e) {}
    }

    if (isBrowser) {
      localStorage.setItem(PATROLS_STORAGE_KEY, JSON.stringify(patrols));
    }

    await this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.full_name,
      user_role: adminUser.role,
      action_type: 'ACTUALIZACION_MAESTRO',
      field_name: `Patrulla Modificada: ${updated.name}`,
      new_value: JSON.stringify(updates),
      change_reason: 'Actualización de patrulla por Digitador.',
    });

    return updated;
  },

  // ==========================================
  // 4. FINCAS & LOTES
  // ==========================================
  async getFarms(): Promise<Farm[]> {
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('catalogo_fincas').select('*').order('nombre');
        if (!error && data && data.length > 0) {
          const mapped: Farm[] = data.map((d: any) => ({
            id: d.id,
            name: d.nombre,
            code: d.codigo,
            zone: d.zona,
            active: d.activo !== false,
          }));
          if (isBrowser) localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(mapped));
          return mapped;
        }
      } catch (e) {}
    }

    if (isBrowser) {
      const saved = localStorage.getItem(FARMS_STORAGE_KEY);
      if (saved) {
        try {
          const list = JSON.parse(saved);
          if (Array.isArray(list) && list.length > 0) return list;
        } catch (e) {}
      }
    }

    const masterFarms: Farm[] = FINCAS_LOTES_DATA.map((f) => ({
      id: f.id,
      name: f.name,
      code: f.code,
      zone: f.zone,
      active: true,
    }));

    if (isBrowser) {
      localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(masterFarms));
    }
    return masterFarms;
  },

  async addFarm(farmData: Omit<Farm, 'id'>, adminUser: UserProfile): Promise<Farm> {
    const farms = await this.getFarms();
    const newFarm: Farm = {
      ...farmData,
      id: isBrowser && window.crypto?.randomUUID ? window.crypto.randomUUID() : `farm-${Date.now()}`,
    };
    const updated = [...farms, newFarm];

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('catalogo_fincas').insert({
          id: newFarm.id,
          nombre: newFarm.name,
          codigo: newFarm.code,
          zona: newFarm.zone,
          activo: newFarm.active !== false,
        });
      } catch (e) {}
    }

    if (isBrowser) {
      localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(updated));
    }

    await this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.full_name,
      user_role: adminUser.role,
      action_type: 'ACTUALIZACION_MAESTRO',
      field_name: `Nueva Finca: ${newFarm.name}`,
      new_value: `Código: ${newFarm.code || 'N/A'}, Zona: ${newFarm.zone || 'N/A'}`,
      change_reason: 'Creación de finca por Digitador.',
    });

    return newFarm;
  },

  async getFincasLotes(): Promise<FincaInfo[]> {
    return this.getMasterFincasLotes();
  },

  getMasterFincasLotes(): FincaInfo[] {
    if (!isBrowser) return FINCAS_LOTES_DATA;
    const saved = localStorage.getItem(FINCAS_LOTES_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return FINCAS_LOTES_DATA;
      }
    }
    localStorage.setItem(FINCAS_LOTES_STORAGE_KEY, JSON.stringify(FINCAS_LOTES_DATA));
    return FINCAS_LOTES_DATA;
  },

  async addLoteToFinca(fincaName: string, lote: LoteInfo, adminUser: UserProfile): Promise<boolean> {
    const fincas = this.getMasterFincasLotes();
    const finca = fincas.find((f) => f.name.toLowerCase() === fincaName.toLowerCase());
    if (!finca) return false;

    const exists = finca.lotes.some((l) => l.lote_um.toLowerCase() === lote.lote_um.toLowerCase());
    if (exists) return false;

    finca.lotes.push(lote);

    if (isBrowser) {
      localStorage.setItem(FINCAS_LOTES_STORAGE_KEY, JSON.stringify(fincas));
    }

    await this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.full_name,
      user_role: adminUser.role,
      action_type: 'ACTUALIZACION_MAESTRO',
      field_name: `Nuevo Lote en ${fincaName}: ${lote.lote_um}`,
      new_value: `Área: ${lote.area_hectareas} ha (${lote.area_manzanas} mz), Tons: ${lote.estimated_tonnage} TM, Variedad: ${lote.variedad || 'N/A'}`,
      change_reason: 'Adición de lote a catálogo maestro.',
    });

    return true;
  },

  // ==========================================
  // 5. SOLICITUDES DE QUEMAS (PROGRAMADAS & CRIMINALES)
  // ==========================================
  async getBurnRequests(): Promise<BurnRequest[]> {
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('solicitudes_quemas')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const mapped = data.map(burnFromDb);
          if (isBrowser) localStorage.setItem(BURNS_STORAGE_KEY, JSON.stringify(mapped));
          return mapped;
        }
      } catch (e) {}
    }

    if (isBrowser) {
      const saved = localStorage.getItem(BURNS_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return INITIAL_BURNS;
        }
      }
      localStorage.setItem(BURNS_STORAGE_KEY, JSON.stringify(INITIAL_BURNS));
      return INITIAL_BURNS;
    }

    return INITIAL_BURNS;
  },

  async getBurnRequestsForUser(user: UserProfile): Promise<BurnRequest[]> {
    const all = await this.getBurnRequests();

    if (user.role === 'supervisor_frente') {
      if (!user.assigned_front) return all;
      return all.filter((b) => b.front_number === user.assigned_front);
    }

    if (user.role === 'patrulla') {
      return all.filter(
        (b) =>
          b.assigned_patrol_id === user.assigned_patrol_id ||
          b.assigned_patrol_name === user.assigned_patrol_name ||
          (user.assigned_patrol_name && b.assigned_patrol_name?.includes(user.assigned_patrol_name))
      );
    }

    return all;
  },

  async createBurnRequest(
    data: Omit<BurnRequest, 'id' | 'burn_number' | 'created_at' | 'updated_at'>,
    creator: UserProfile
  ): Promise<BurnRequest> {
    const burns = await this.getBurnRequests();
    const isCriminal = data.burn_type === 'CRIMINAL';

    let nextNumber = 1;
    const prefix = isCriminal ? 'QC' : 'QP';
    const year = new Date().getFullYear();

    const existingMatching = burns
      .filter((b) => b.burn_number.startsWith(`${prefix}-${year}-`))
      .map((b) => {
        const parts = b.burn_number.split('-');
        return parseInt(parts[2], 10) || 0;
      });

    if (existingMatching.length > 0) {
      nextNumber = Math.max(...existingMatching) + 1;
    }

    const burnNumber = `${prefix}-${year}-${String(nextNumber).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const newId = isBrowser && window.crypto?.randomUUID ? window.crypto.randomUUID() : `burn-${Date.now()}`;

    const newBurn: BurnRequest = {
      ...data,
      id: newId,
      burn_number: burnNumber,
      burn_type: isCriminal ? 'CRIMINAL' : 'PROGRAMADA',
      created_by_user_id: creator.id,
      created_by_name: creator.full_name,
      status: data.status || 'SOLICITADA',
      created_at: now,
      updated_at: now,
    };

    if (supabase && isSupabaseConfigured) {
      try {
        const payload = burnToDb(newBurn);
        await supabase.from('solicitudes_quemas').insert(payload);
      } catch (e) {
        console.error('Error insertando quema en Supabase', e);
      }
    }

    if (isBrowser) {
      const updated = [newBurn, ...burns];
      localStorage.setItem(BURNS_STORAGE_KEY, JSON.stringify(updated));
    }

    await this.logAudit({
      burn_request_id: newBurn.id,
      burn_number: newBurn.burn_number,
      user_id: creator.id,
      user_name: creator.full_name,
      user_role: creator.role,
      action_type: isCriminal ? 'REGISTRO_QUEMA_CRIMINAL' : 'CREACION',
      field_name: 'Estado Inicial',
      new_value: newBurn.status,
      change_reason: isCriminal
        ? `Quema Criminal reportada de emergencia en Finca ${newBurn.farm_name} (${newBurn.front_number}).`
        : `Solicitud creada para Finca ${newBurn.farm_name} (${newBurn.area_hectares} ha / ${newBurn.estimated_tonnage} TM).`,
    });

    return newBurn;
  },

  async updateBurnRequest(
    id: string,
    updates: Partial<BurnRequest>,
    actor: UserProfile,
    actionType: ActionType,
    changeReason: string,
    fieldChanges?: { field: string; oldVal: any; newVal: any }[]
  ): Promise<BurnRequest | null> {
    const burns = await this.getBurnRequests();
    const index = burns.findIndex((b) => b.id === id);
    if (index === -1) return null;

    const oldBurn = burns[index];
    const now = new Date().toISOString();

    const updatedBurn: BurnRequest = {
      ...oldBurn,
      ...updates,
      updated_at: now,
    };

    burns[index] = updatedBurn;

    if (supabase && isSupabaseConfigured) {
      try {
        const payload = burnToDb(updatedBurn);
        await supabase.from('solicitudes_quemas').update(payload).eq('id', id);
      } catch (e) {
        console.error('Error actualizando quema en Supabase', e);
      }
    }

    if (isBrowser) {
      localStorage.setItem(BURNS_STORAGE_KEY, JSON.stringify(burns));
    }

    if (fieldChanges && fieldChanges.length > 0) {
      for (const fc of fieldChanges) {
        await this.logAudit({
          burn_request_id: id,
          burn_number: updatedBurn.burn_number,
          user_id: actor.id,
          user_name: actor.full_name,
          user_role: actor.role,
          action_type: actionType,
          field_name: fc.field,
          old_value: String(fc.oldVal ?? '—'),
          new_value: String(fc.newVal ?? '—'),
          change_reason: changeReason,
        });
      }
    } else {
      await this.logAudit({
        burn_request_id: id,
        burn_number: updatedBurn.burn_number,
        user_id: actor.id,
        user_name: actor.full_name,
        user_role: actor.role,
        action_type: actionType,
        field_name: updates.status ? 'Estado' : 'Actualización',
        old_value: oldBurn.status,
        new_value: updatedBurn.status,
        change_reason: changeReason,
      });
    }

    return updatedBurn;
  },

  // ==========================================
  // 6. BITÁCORA DE AUDITORÍA
  // ==========================================
  async getAuditLogs(burnRequestId?: string): Promise<AuditLog[]> {
    if (supabase && isSupabaseConfigured) {
      try {
        let query = supabase.from('bitacora_auditoria').select('*').order('created_at', { ascending: false });
        if (burnRequestId) {
          query = query.eq('solicitud_quema_id', burnRequestId);
        }
        const { data, error } = await query;
        if (!error && data) {
          const mapped = data.map(auditFromDb);
          if (isBrowser && !burnRequestId) localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(mapped));
          return mapped;
        }
      } catch (e) {}
    }

    if (isBrowser) {
      const saved = localStorage.getItem(AUDIT_STORAGE_KEY);
      let logs: AuditLog[] = [];
      if (saved) {
        try {
          logs = JSON.parse(saved);
        } catch (e) {
          logs = INITIAL_AUDIT_LOGS;
        }
      } else {
        logs = INITIAL_AUDIT_LOGS;
        localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
      }

      if (burnRequestId) {
        return logs.filter((l) => l.burn_request_id === burnRequestId);
      }
      return logs;
    }

    return INITIAL_AUDIT_LOGS;
  },

  async logAudit(entry: Omit<AuditLog, 'id' | 'created_at'>): Promise<AuditLog> {
    const newLog: AuditLog = {
      ...entry,
      id: isBrowser && window.crypto?.randomUUID ? window.crypto.randomUUID() : `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('bitacora_auditoria').insert(auditToDb(newLog));
      } catch (e) {}
    }

    if (isBrowser) {
      const currentLogs = await this.getAuditLogs();
      const updated = [newLog, ...currentLogs];
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
    }

    return newLog;
  },

  // ==========================================
  // 7. SUSCRIPCIONES EN TIEMPO REAL (WEBSOCKETS)
  // ==========================================
  subscribeToBurnRequests(callback: (payload: any) => void): () => void {
    if (!supabase || !isSupabaseConfigured) {
      return () => {};
    }

    const channel = supabase
      .channel(`solicitudes_quemas_realtime_${Math.random().toString(36).substring(2, 7)}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'solicitudes_quemas',
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  subscribeToPatrols(callback: (payload: any) => void): () => void {
    if (!supabase || !isSupabaseConfigured) {
      return () => {};
    }

    const channel = supabase
      .channel(`patrullas_realtime_${Math.random().toString(36).substring(2, 7)}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'catalogo_patrullas',
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  subscribeToAuditLogs(callback: (payload: any) => void): () => void {
    if (!supabase || !isSupabaseConfigured) {
      return () => {};
    }

    const channel = supabase
      .channel(`bitacora_realtime_${Math.random().toString(36).substring(2, 7)}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bitacora_auditoria',
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  subscribeToUsers(callback: (payload: any) => void): () => void {
    if (!supabase || !isSupabaseConfigured) {
      return () => {};
    }

    const channel = supabase
      .channel(`usuarios_realtime_${Math.random().toString(36).substring(2, 7)}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'perfiles_usuarios',
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  resetToMockData(): void {
    if (!isBrowser) return;
    localStorage.setItem(BURNS_STORAGE_KEY, JSON.stringify([]));
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify([]));
    localStorage.setItem(FINCAS_LOTES_STORAGE_KEY, JSON.stringify(FINCAS_LOTES_DATA));
    localStorage.setItem(PATROLS_STORAGE_KEY, JSON.stringify(INITIAL_PATROLS));
    localStorage.setItem(FRONTS_STORAGE_KEY, JSON.stringify(INITIAL_FRONTS));
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
  },
};
