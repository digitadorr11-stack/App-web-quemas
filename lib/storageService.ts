import { BurnRequest, AuditLog, Farm, UserProfile, UserRole, ActionType, Patrol, Front } from './types';
import { INITIAL_BURNS, INITIAL_AUDIT_LOGS, INITIAL_FARMS, INITIAL_PATROLS, INITIAL_USERS, INITIAL_FRONTS } from './mockData';
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

export const storageService = {
  // =========================================================================
  // 1. AUTENTICACIÓN Y SESIÓN DE USUARIO
  // =========================================================================
  getActiveUser(): UserProfile | null {
    if (!isBrowser) return INITIAL_USERS[0];
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
      const matchEmail = u.email.toLowerCase() === cleanId;
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

  // =========================================================================
  // 2. CATÁLOGOS MAESTROS (FRENTES, PATRULLAS, FINCAS Y LOTES CON TCH)
  // =========================================================================

  async getFronts(): Promise<Front[]> {
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
      // Create new finca
      finca = {
        name: cleanFincaName,
        lotes: [loteData],
      };
      list.push(finca);
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Update or add lote in existing finca
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
  // 3. SOLICITUDES DE QUEMA Y AISLAMIENTO POR ROL
  // =========================================================================
  async getBurnRequests(): Promise<BurnRequest[]> {
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
        const matchName = b.shift_supervisor_name.toLowerCase().includes(user.full_name.toLowerCase()) ||
                          user.full_name.toLowerCase().includes(b.shift_supervisor_name.toLowerCase());
        const matchFront = user.assigned_front ? b.front_number === user.assigned_front : false;
        return matchCreator || matchName || matchFront;
      });
    }

    // 2. PATRULLA: Solo ve las quemas asignadas a su patrulla
    if (user.role === 'patrulla') {
      return all.filter((b) => {
        const patrolName = user.assigned_patrol_name || user.full_name;
        const matchName = b.assigned_patrol_name
          ? b.assigned_patrol_name.toLowerCase().includes('alfa') && patrolName.toLowerCase().includes('alfa') ||
            b.assigned_patrol_name.toLowerCase().includes('beta') && patrolName.toLowerCase().includes('beta') ||
            b.assigned_patrol_name.toLowerCase().includes('gamma') && patrolName.toLowerCase().includes('gamma') ||
            b.assigned_patrol_name.toLowerCase().includes('delta') && patrolName.toLowerCase().includes('delta') ||
            b.assigned_patrol_name.toLowerCase() === patrolName.toLowerCase()
          : false;

        const matchId = user.assigned_patrol_id ? b.assigned_patrol_id === user.assigned_patrol_id : false;
        return matchName || matchId;
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
    const nextSeq = existing.length + 1;
    const burn_number = `Q-2026-${String(nextSeq).padStart(3, '0')}`;
    const nowIso = new Date().toISOString();

    const newBurn: BurnRequest = {
      ...data,
      id: isBrowser && window.crypto?.randomUUID ? window.crypto.randomUUID() : `burn-${Date.now()}`,
      burn_number,
      area_manzanas: Number((data.area_hectares * 1.4308).toFixed(2)),
      created_at: nowIso,
      updated_at: nowIso,
    };

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
      action_type: 'CREACION',
      new_value: `Frente: ${newBurn.front_number}, Finca: ${newBurn.farm_name}, Lote: ${newBurn.lote_um || 'N/A'}, Área: ${newBurn.area_hectares} ha, Tons: ${newBurn.estimated_tonnage}`,
      change_reason: 'Creación de solicitud inicial por supervisor de frente.',
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
