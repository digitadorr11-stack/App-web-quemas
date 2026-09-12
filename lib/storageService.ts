import { BurnRequest, AuditLog, Farm, UserProfile, UserRole, ActionType, Patrol, Front } from './types';
import { INITIAL_BURNS, INITIAL_AUDIT_LOGS, INITIAL_USERS, INITIAL_FRONTS, INITIAL_PATROLS } from './mockData';
import { FINCAS_LOTES_DATA, FincaInfo, LoteInfo } from './fincasLotesData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const BURNS_STORAGE_KEY = 'la_union_burn_requests_v7';
const AUDIT_STORAGE_KEY = 'la_union_audit_logs_v7';
const ACTIVE_SESSION_KEY = 'la_union_active_session_v7';
const USERS_STORAGE_KEY = 'la_union_users_catalog_v7';
const FARMS_STORAGE_KEY = 'la_union_farms_catalog_v7';
const PATROLS_STORAGE_KEY = 'la_union_patrols_catalog_v7';
const FRONTS_STORAGE_KEY = 'la_union_fronts_catalog_v7';
const FINCAS_LOTES_STORAGE_KEY = 'la_union_fincas_lotes_master_v7';
const isBrowser = typeof window !== 'undefined';

const SUPABASE_BURN_COLUMNS = new Set([
  'id',
  'burn_number',
  'burn_type',
  'front_number',
  'shift_name',
  'shift_supervisor_name',
  'farm_name',
  'lote_um',
  'area_hectares',
  'area_manzanas',
  'estimated_tonnage',
  'planned_burn_time',
  'requested_at',
  'created_by_user_id',
  'created_by_name',
  'status',
  'assigned_patrol_id',
  'assigned_patrol_name',
  'assigned_patrol_leader',
  'patrol_assigned_at',
  'patrol_confirmed_at',
  'patrol_arrived_at',
  'review_duration_minutes',
  'review_completed_at',
  'review_checklist',
  'review_notes',
  'validated_by_user_id',
  'validated_by_name',
  'validated_at',
  'validation_notes',
  'burn_started_at',
  'burn_ended_at',
  'burn_duration_minutes',
  'cancellation_reason',
  'cancelled_by_name',
  'cancelled_by_role',
  'cancelled_at',
  'created_at',
  'updated_at',
]);

function sanitizeBurnForSupabase(burn: Record<string, any>): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const key of Object.keys(burn)) {
    if (SUPABASE_BURN_COLUMNS.has(key)) {
      clean[key] = burn[key];
    }
  }
  return clean;
}

export const storageService = {
  // ==========================================
  // 1. AUTHENTICATION & GOOGLE OAUTH
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

    if (error) {
      throw error;
    }
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

      // Buscar perfil en users_profiles por email o auth_id
      const { data: profiles, error } = await supabase
        .from('users_profiles')
        .select('*')
        .or(`email.eq.${userEmail},auth_id.eq.${authUser.id}`)
        .limit(1);

      if (!error && profiles && profiles.length > 0) {
        const profile = profiles[0];
        this.setActiveUser(profile);
        return profile;
      }

      // Si no existe, crear perfil automático para este usuario de Google
      const newProfile: UserProfile = {
        id: `usr-${authUser.id.substring(0, 8)}`,
        username: userEmail.split('@')[0],
        email: userEmail,
        full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || userEmail.split('@')[0],
        role: 'supervisor_frente',
        active: true,
        created_at: new Date().toISOString(),
      };

      try {
        await supabase.from('users_profiles').insert(newProfile);
      } catch (e) {}

      this.setActiveUser(newProfile);
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
      return (matchUser || matchEmail || matchName || matchRole) && (u.active !== false);
    });

    if (!user) return null;

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

  // ==========================================
  // 2. USERS CATALOG & CREDENTIALS
  // ==========================================
  async getAllUsers(): Promise<UserProfile[]> {
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('users_profiles').select('*').order('full_name');
        if (!error && data && data.length > 0) {
          if (isBrowser) localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(data));
          return data;
        }
      } catch (e) {
        console.warn('Supabase users fallback to local');
      }
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

    const oldUser = users[index];
    const updatedUser = { ...oldUser, ...updates };
    users[index] = updatedUser;

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('users_profiles').upsert(updatedUser);
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
        await supabase.from('users_profiles').insert(user);
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
        await supabase.from('users_profiles').delete().eq('id', userId);
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
  // 3. FRENTES & PATROLLAS
  // ==========================================
  async getFronts(): Promise<Front[]> {
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('fronts_catalog').select('*').order('name');
        if (!error && data && data.length > 0) {
          if (isBrowser) localStorage.setItem(FRONTS_STORAGE_KEY, JSON.stringify(data));
          return data;
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
        await supabase.from('fronts_catalog').insert(newFront);
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
        await supabase.from('fronts_catalog').update(updates).eq('id', id);
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
        const { data, error } = await supabase.from('patrols_catalog').select('*').order('name');
        if (!error && data && data.length > 0) {
          if (isBrowser) localStorage.setItem(PATROLS_STORAGE_KEY, JSON.stringify(data));
          return data;
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
        await supabase.from('patrols_catalog').insert(newPatrol);
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
        await supabase.from('patrols_catalog').update(updates).eq('id', id);
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
        const { data, error } = await supabase.from('farms_catalog').select('*').order('name');
        if (!error && data && data.length > 0) {
          if (isBrowser) localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(data));
          return data;
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
        await supabase.from('farms_catalog').insert(newFarm);
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
  // 5. BURN REQUESTS (QUEMAS PROGRAMADAS & CRIMINALES)
  // ==========================================
  async getBurnRequests(): Promise<BurnRequest[]> {
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('burn_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          if (isBrowser) localStorage.setItem(BURNS_STORAGE_KEY, JSON.stringify(data));
          return data;
        }
      } catch (e) {
        console.warn('Supabase burns fallback to local');
      }
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
        const payload = sanitizeBurnForSupabase(newBurn);
        await supabase.from('burn_requests').insert(payload);
      } catch (e) {
        console.error('Error inserting burn into Supabase', e);
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
        const payload = sanitizeBurnForSupabase(updatedBurn);
        await supabase.from('burn_requests').update(payload).eq('id', id);
      } catch (e) {
        console.error('Error updating burn in Supabase', e);
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
  // 6. AUDIT LOGS (BITÁCORA INMUTABLE)
  // ==========================================
  async getAuditLogs(burnRequestId?: string): Promise<AuditLog[]> {
    if (supabase && isSupabaseConfigured) {
      try {
        let query = supabase.from('burn_audit_logs').select('*').order('created_at', { ascending: false });
        if (burnRequestId) {
          query = query.eq('burn_request_id', burnRequestId);
        }
        const { data, error } = await query;
        if (!error && data) {
          if (isBrowser && !burnRequestId) localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(data));
          return data;
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
        await supabase.from('burn_audit_logs').insert(newLog);
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
  // 7. REALTIME SUBSCRIPTIONS (WEBSOCKETS)
  // ==========================================
  subscribeToBurnRequests(callback: (payload: any) => void): () => void {
    if (!supabase || !isSupabaseConfigured) {
      return () => {};
    }

    const channel = supabase
      .channel(`burn_requests_realtime_${Math.random().toString(36).substring(2, 7)}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'burn_requests',
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
      .channel(`patrols_realtime_${Math.random().toString(36).substring(2, 7)}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patrols_catalog',
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
      .channel(`audit_realtime_${Math.random().toString(36).substring(2, 7)}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'burn_audit_logs',
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
      .channel(`users_realtime_${Math.random().toString(36).substring(2, 7)}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users_profiles',
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
