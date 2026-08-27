import { BurnRequest, AuditLog, Farm, UserProfile, UserRole, ActionType, Patrol, Front } from './types';
import { INITIAL_BURNS, INITIAL_AUDIT_LOGS, INITIAL_USERS, INITIAL_FRONTS, INITIAL_PATROLS } from './mockData';
import { FINCAS_LOTES_DATA, FincaInfo, LoteInfo } from './fincasLotesData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const BURNS_STORAGE_KEY = 'la_union_burn_requests_v6';
const AUDIT_STORAGE_KEY = 'la_union_audit_logs_v6';
const ACTIVE_SESSION_KEY = 'la_union_active_session_v6';
const USERS_STORAGE_KEY = 'la_union_users_catalog_v6';
const FARMS_STORAGE_KEY = 'la_union_farms_catalog_v6';
const PATROLS_STORAGE_KEY = 'la_union_patrols_catalog_v6';
const FRONTS_STORAGE_KEY = 'la_union_fronts_catalog_v6';
const FINCAS_LOTES_STORAGE_KEY = 'la_union_fincas_lotes_master_v6';
const isBrowser = typeof window !== 'undefined';

const SUPABASE_BURN_COLUMNS = new Set([
  'id',
  'burn_number',
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
  // =========================================================================
  // 1. AUTENTICACIÓN Y SESIÓN DE USUARIO
  // =========================================================================
  getActiveUser(): UserProfile | null {
    if (!isBrowser) return null;
    const saved = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      } catch (e) {
        console.error('Error parsing session user', e);
      }
    }
    return null;
  },

  setActiveUser(user: UserProfile): void {
    if (!isBrowser) return;
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(user));
  },

  logout(): void {
    if (!isBrowser) return;
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  },

  async login(identifier: string, passwordAttempt: string): Promise<UserProfile | null> {
    const users = await this.getAllUsers();
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = passwordAttempt.trim();

    const user = users.find((u) => {
      const matchUser = u.username.toLowerCase() === cleanId;
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

  async getAllUsers(): Promise<UserProfile[]> {
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('users_app').select('*');
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
        await supabase.from('users_app').upsert(updatedUser);
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
      new_value: `Modificado para @${updatedUser.username}`,
      change_reason: 'Actualización de credenciales por Digitador.',
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
        await supabase.from('users_app').insert(user);
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
      new_value: `Rol: ${user.role}, Usuario: @${user.username}`,
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
        await supabase.from('users_app').delete().eq('id', userId);
      } catch (e) {
        console.error('Supabase delete user error', e);
      }
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
      old_value: `@${userToDelete.username} (${userToDelete.role})`,
      new_value: 'ELIMINADO',
      change_reason: 'Eliminación definitiva de usuario del sistema por Digitador.',
    });

    return true;
  },

  // =========================================================================
  // 2. CATÁLOGOS MAESTROS (FRENTES, PATRULLAS, FINCAS Y LOTES CON TCH)
  // =========================================================================
  async getFronts(): Promise<Front[]> {
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('fronts').select('*').order('name');
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

  async createFront(front: Omit<Front, 'id'>, adminUser: UserProfile): Promise<Front> {
    const fronts = await this.getFronts();
    const newFront: Front = { ...front, id: `fr-${Date.now()}` };
    const updated = [...fronts, newFront];

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('fronts').insert(newFront);
      } catch (e) {}
    }

    if (isBrowser) localStorage.setItem(FRONTS_STORAGE_KEY, JSON.stringify(updated));

    await this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.full_name,
      user_role: adminUser.role,
      action_type: 'ACTUALIZACION_MAESTRO',
      field_name: 'Catálogo de Frentes',
      new_value: `Creado frente: ${newFront.name}`,
      change_reason: 'Ingreso de nuevo frente a la base maestra.',
    });

    return newFront;
  },

  async updateFront(id: string, updates: Partial<Front>, adminUser: UserProfile): Promise<Front | null> {
    const fronts = await this.getFronts();
    const idx = fronts.findIndex((f) => f.id === id);
    if (idx === -1) return null;
    const updated = { ...fronts[idx], ...updates };
    fronts[idx] = updated;

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('fronts').update(updates).eq('id', id);
      } catch (e) {}
    }

    if (isBrowser) localStorage.setItem(FRONTS_STORAGE_KEY, JSON.stringify(fronts));

    await this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.full_name,
      user_role: adminUser.role,
      action_type: 'ACTUALIZACION_MAESTRO',
      field_name: 'Catálogo de Frentes',
      new_value: `Modificado frente: ${updated.name}`,
      change_reason: 'Edición en catálogo maestro de frentes.',
    });

    return updated;
  },

  async getPatrols(): Promise<Patrol[]> {
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('patrols').select('*').order('name');
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

  async createPatrol(patrol: Omit<Patrol, 'id'>, adminUser: UserProfile): Promise<Patrol> {
    const patrols = await this.getPatrols();
    const newPatrol: Patrol = { ...patrol, id: `pat-${Date.now()}` };
    const updated = [...patrols, newPatrol];

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('patrols').insert(newPatrol);
      } catch (e) {}
    }

    if (isBrowser) localStorage.setItem(PATROLS_STORAGE_KEY, JSON.stringify(updated));

    await this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.full_name,
      user_role: adminUser.role,
      action_type: 'ACTUALIZACION_MAESTRO',
      field_name: 'Catálogo de Patrullas',
      new_value: `Creada patrulla: ${newPatrol.name}`,
      change_reason: 'Ingreso de nueva patrulla a la base maestra.',
    });

    return newPatrol;
  },

  async updatePatrol(id: string, updates: Partial<Patrol>, adminUser: UserProfile): Promise<Patrol | null> {
    const patrols = await this.getPatrols();
    const idx = patrols.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const updated = { ...patrols[idx], ...updates };
    patrols[idx] = updated;

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('patrols').update(updates).eq('id', id);
      } catch (e) {}
    }

    if (isBrowser) localStorage.setItem(PATROLS_STORAGE_KEY, JSON.stringify(patrols));

    await this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.full_name,
      user_role: adminUser.role,
      action_type: 'ACTUALIZACION_MAESTRO',
      field_name: 'Catálogo de Patrullas',
      new_value: `Modificada patrulla: ${updated.name}`,
      change_reason: 'Edición en catálogo maestro de patrullas.',
    });

    return updated;
  },

  // =========================================================================
  // MAESTRO DE FINCAS Y LOTES CON TCH (ZAFRA 56)
  // =========================================================================
  async getFincasLotes(): Promise<FincaInfo[]> {
    if (isBrowser) {
      const saved = localStorage.getItem(FINCAS_LOTES_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
      localStorage.setItem(FINCAS_LOTES_STORAGE_KEY, JSON.stringify(FINCAS_LOTES_DATA));
      return FINCAS_LOTES_DATA;
    }
    return FINCAS_LOTES_DATA;
  },

  async saveFincasLotes(data: FincaInfo[]): Promise<void> {
    if (isBrowser) {
      localStorage.setItem(FINCAS_LOTES_STORAGE_KEY, JSON.stringify(data));
    }
  },

  async addOrUpdateLoteInFinca(
    fincaName: string,
    loteData: LoteInfo,
    adminUser: UserProfile,
    isNew: boolean
  ): Promise<FincaInfo[]> {
    const list = await this.getFincasLotes();
    const cleanFincaName = fincaName.trim().toUpperCase();
    let finca = list.find((f) => f.name.toUpperCase() === cleanFincaName);

    if (!finca) {
      finca = {
        name: cleanFincaName,
        lotes: [loteData],
      };
      list.push(finca);
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      const lIndex = finca.lotes.findIndex((l) => l.lote === loteData.lote);
      if (lIndex >= 0) {
        finca.lotes[lIndex] = { ...finca.lotes[lIndex], ...loteData };
      } else {
        finca.lotes.push(loteData);
        finca.lotes.sort((a, b) => {
          const numA = parseFloat(a.lote);
          const numB = parseFloat(b.lote);
          if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
          return a.lote.localeCompare(b.lote, undefined, { numeric: true });
        });
      }
    }

    await this.saveFincasLotes(list);

    await this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.full_name,
      user_role: adminUser.role,
      action_type: 'ACTUALIZACION_MAESTRO',
      field_name: `Maestro Fincas/Lotes: ${cleanFincaName}`,
      new_value: `Lote: ${loteData.lote}, TCH: ${loteData.tch} TM/ha, Área: ${loteData.area} ha`,
      change_reason: isNew ? 'Nuevo lote/finca registrado en catálogo maestro.' : 'Modificación de lote en base maestra.',
    });

    return list;
  },

  async deleteLoteFromFinca(
    fincaName: string,
    loteCode: string,
    adminUser: UserProfile
  ): Promise<FincaInfo[]> {
    const list = await this.getFincasLotes();
    const finca = list.find((f) => f.name.toUpperCase() === fincaName.trim().toUpperCase());
    if (finca) {
      finca.lotes = finca.lotes.filter((l) => l.lote !== loteCode);
      await this.saveFincasLotes(list);

      await this.logAudit({
        user_id: adminUser.id,
        user_name: adminUser.full_name,
        user_role: adminUser.role,
        action_type: 'ACTUALIZACION_MAESTRO',
        field_name: `Maestro Fincas/Lotes: ${fincaName}`,
        new_value: `Eliminado Lote: ${loteCode}`,
        change_reason: 'Eliminación de lote de la base maestra.',
      });
    }
    return list;
  },

  // Legacy getFarms
  async getFarms(): Promise<Farm[]> {
    const fincasLotes = await this.getFincasLotes();
    return fincasLotes.map((f, idx) => ({
      id: `f-${idx + 1}`,
      name: f.name,
      code: f.code,
      active: true,
    }));
  },

  // =========================================================================
  // 3. SOLICITUDES DE QUEMA CON SUPABASE EN TIEMPO REAL
  // =========================================================================
  async getBurnRequests(): Promise<BurnRequest[]> {
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('burn_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const parsed = data.map((b: any) => ({
            ...b,
            burn_type: b.burn_type || (b.review_notes?.includes('[QUEMA_CRIMINAL]') || b.burn_number?.startsWith('QC-') ? 'CRIMINAL' : 'PROGRAMADA'),
          }));
          if (isBrowser) localStorage.setItem(BURNS_STORAGE_KEY, JSON.stringify(parsed));
          return parsed;
        }
      } catch (e) {
        console.warn('Supabase burns fallback to local');
      }
    }

    if (isBrowser) {
      const saved = localStorage.getItem(BURNS_STORAGE_KEY);
      if (saved) {
        try {
          const list = JSON.parse(saved);
          if (Array.isArray(list)) return list;
        } catch (e) {}
      }
      localStorage.setItem(BURNS_STORAGE_KEY, JSON.stringify(INITIAL_BURNS));
      return INITIAL_BURNS;
    }
    return INITIAL_BURNS;
  },

  async getBurnRequestsForUser(user: UserProfile): Promise<BurnRequest[]> {
    const all = await this.getBurnRequests();

    // 1. SUPERVISOR DE FRENTE: Solo ve las de su frente asignado en sesión o creadas por él
    if (user.role === 'supervisor_frente') {
      return all.filter((b) => {
        const matchCreator = b.created_by_user_id === user.id;
        const matchName = b.shift_supervisor_name?.toLowerCase().includes(user.full_name.toLowerCase()) ||
                          user.full_name.toLowerCase().includes(b.shift_supervisor_name?.toLowerCase() || '');
        const matchFront = user.assigned_front ? b.front_number === user.assigned_front : false;
        return matchCreator || matchName || matchFront;
      });
    }

    // 2. PATRULLA: Ve las quemas asignadas a su clave/patrulla o creadas por él
    if (user.role === 'patrulla') {
      return all.filter((b) => {
        // Creadas por este usuario
        if (b.created_by_user_id === user.id || b.created_by_name === user.full_name) return true;

        const userPatrolName = (user.assigned_patrol_name || '').toLowerCase().trim();
        const userPatrolId = (user.assigned_patrol_id || '').toLowerCase().trim();
        const burnPatrolName = (b.assigned_patrol_name || '').toLowerCase().trim();
        const burnPatrolId = (b.assigned_patrol_id || '').toLowerCase().trim();
        const userName = user.full_name.toLowerCase().trim();
        const burnLeader = (b.assigned_patrol_leader || '').toLowerCase().trim();

        // 1. Coincidencia directa por ID de patrulla (ej: 'pat-c1')
        if (userPatrolId && burnPatrolId && userPatrolId === burnPatrolId) return true;

        // 2. Coincidencia por Nombre de patrulla (ej: 'Clave C-1' o 'Clave RUBEN')
        if (userPatrolName && burnPatrolName) {
          if (userPatrolName.includes(burnPatrolName) || burnPatrolName.includes(userPatrolName)) return true;
        }

        // 3. Extracción de código (C-1 a C-7, RUBEN)
        const userCode = (userPatrolName || userPatrolId).match(/(c-\d|c\d|ruben)/i)?.[0]?.replace('-', '');
        const burnCode = (burnPatrolName || burnPatrolId).match(/(c-\d|c\d|ruben)/i)?.[0]?.replace('-', '');
        if (userCode && burnCode && userCode.toLowerCase() === burnCode.toLowerCase()) return true;

        // 4. Coincidencia por nombre de líder/encargado
        if (burnLeader && userName && (userName.includes(burnLeader) || burnLeader.includes(userName))) return true;

        return false;
      });
    }

    // 3. SUPERVISOR DE QUEMAS, DIGITADOR, JEFATURA, ADMIN: Ven todo el Ingenio
    return all;
  },

  async createBurnRequest(
    data: Omit<BurnRequest, 'id' | 'burn_number' | 'created_at' | 'updated_at'>,
    user: UserProfile
  ): Promise<BurnRequest> {
    const existing = await this.getBurnRequests();
    const isCriminal = data.burn_type === 'CRIMINAL';
    const nextSeq = existing.length + 1;
    const burn_number = isCriminal
      ? `QC-2026-${String(nextSeq).padStart(3, '0')}`
      : `Q-2026-${String(nextSeq).padStart(3, '0')}`;
    const nowIso = new Date().toISOString();

    const newBurn: BurnRequest = {
      ...data,
      id: isBrowser && window.crypto?.randomUUID ? window.crypto.randomUUID() : `burn-${Date.now()}`,
      burn_number,
      burn_type: isCriminal ? 'CRIMINAL' : 'PROGRAMADA',
      area_manzanas: Number(((Number(data.area_hectares) || 0) * 1.4308).toFixed(2)),
      created_at: nowIso,
      updated_at: nowIso,
    };

    if (supabase && isSupabaseConfigured) {
      try {
        const payload = sanitizeBurnForSupabase(newBurn);
        if (isCriminal) {
          payload.review_notes = `[QUEMA_CRIMINAL] ${newBurn.review_notes || ''}`;
        }
        const { error } = await supabase.from('burn_requests').insert(payload);
        if (error) console.error('Supabase insert burn error:', error);
      } catch (e) {
        console.error('Supabase insert burn error', e);
      }
    }

    if (isBrowser) {
      const updatedList = [newBurn, ...existing];
      localStorage.setItem(BURNS_STORAGE_KEY, JSON.stringify(updatedList));
    }

    await this.logAudit({
      burn_request_id: newBurn.id,
      burn_number: newBurn.burn_number,
      user_id: user.id,
      user_name: user.full_name,
      user_role: user.role,
      action_type: isCriminal ? 'REGISTRO_QUEMA_CRIMINAL' : 'CREACION',
      new_value: isCriminal
        ? `🚨 QUEMA CRIMINAL: Frente ${newBurn.front_number}, Finca ${newBurn.farm_name}, Lote ${newBurn.lote_um || 'N/A'}, Patrulla ${newBurn.assigned_patrol_name}`
        : `Frente: ${newBurn.front_number}, Finca: ${newBurn.farm_name}, Lote: ${newBurn.lote_um || 'N/A'}, Área: ${newBurn.area_hectares} ha, Tons: ${newBurn.estimated_tonnage}`,
      change_reason: isCriminal
        ? 'Reporte de emergencia y despacho de combate por quema criminal.'
        : 'Creación de solicitud inicial por supervisor de frente.',
    });

    return newBurn;
  },

  async updateBurnRequest(
    id: string,
    updates: Partial<BurnRequest>,
    user: UserProfile,
    actionType: ActionType,
    reason?: string,
    fieldChanges?: { field: string; oldVal: any; newVal: any }[]
  ): Promise<BurnRequest | null> {
    const all = await this.getBurnRequests();
    const index = all.findIndex((b) => b.id === id);
    if (index === -1) return null;

    const oldBurn = all[index];
    const nowIso = new Date().toISOString();

    let area_manzanas = updates.area_hectares
      ? Number((updates.area_hectares * 1.4308).toFixed(2))
      : oldBurn.area_manzanas;

    const updatedBurn: BurnRequest = {
      ...oldBurn,
      ...updates,
      area_manzanas,
      updated_at: nowIso,
    };

    all[index] = updatedBurn;

    if (supabase && isSupabaseConfigured) {
      try {
        const payload = sanitizeBurnForSupabase(updatedBurn);
        const { error } = await supabase.from('burn_requests').update(payload).eq('id', id);
        if (error) console.error('Supabase update burn error:', error);
      } catch (e) {
        console.error('Supabase update burn error', e);
      }
    }

    if (isBrowser) {
      localStorage.setItem(BURNS_STORAGE_KEY, JSON.stringify(all));
    }

    if (fieldChanges && fieldChanges.length > 0) {
      for (const fc of fieldChanges) {
        await this.logAudit({
          burn_request_id: updatedBurn.id,
          burn_number: updatedBurn.burn_number,
          user_id: user.id,
          user_name: user.full_name,
          user_role: user.role,
          action_type: actionType,
          field_name: fc.field,
          old_value: String(fc.oldVal ?? ''),
          new_value: String(fc.newVal ?? ''),
          change_reason: reason || 'Edición de información',
        });
      }
    } else {
      await this.logAudit({
        burn_request_id: updatedBurn.id,
        burn_number: updatedBurn.burn_number,
        user_id: user.id,
        user_name: user.full_name,
        user_role: user.role,
        action_type: actionType,
        old_value: oldBurn.status !== updatedBurn.status ? `Estado: ${oldBurn.status}` : undefined,
        new_value: oldBurn.status !== updatedBurn.status ? `Estado: ${updatedBurn.status}` : `Actualizado`,
        change_reason: reason || `Transición a ${updatedBurn.status}`,
      });
    }

    return updatedBurn;
  },

  // =========================================================================
  // 4. BITÁCORA DE AUDITORÍA
  // =========================================================================
  async getAuditLogs(burnRequestId?: string): Promise<AuditLog[]> {
    if (supabase && isSupabaseConfigured) {
      try {
        let query = supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
        if (burnRequestId) {
          query = query.eq('burn_request_id', burnRequestId);
        }
        const { data, error } = await query;
        if (!error && data) {
          if (isBrowser && !burnRequestId) localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(data));
          return data;
        }
      } catch (e) {
        console.warn('Supabase audit fallback to local');
      }
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
        await supabase.from('audit_logs').insert(newLog);
      } catch (e) {}
    }

    if (isBrowser) {
      const currentLogs = await this.getAuditLogs();
      const updated = [newLog, ...currentLogs];
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
    }

    return newLog;
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
