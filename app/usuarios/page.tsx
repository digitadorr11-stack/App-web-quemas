'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/authService';
import { supabase } from '@/lib/supabaseClient';
import { UserProfile, UserRole, ROLES_CONFIG, FrontCatalog, PatrolCatalog } from '@/lib/types';
import {
  Users,
  Shield,
  Search,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Flame,
  Filter,
  UserCheck,
  Clock,
  Sparkles,
  Layers,
  AlertCircle,
  Truck,
  Edit2,
} from 'lucide-react';

export default function UsuariosPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [fronts, setFronts] = useState<FrontCatalog[]>([]);
  const [patrols, setPatrols] = useState<PatrolCatalog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edición de usuario
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isSubmittingEditUser, setIsSubmittingEditUser] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenEditUser = (user: UserProfile) => {
    setEditingUser({ ...user });
    setIsEditUserModalOpen(true);
  };

  const handleSaveEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !editingUser) return;
    try {
      setIsSubmittingEditUser(true);
      const updatePayload: any = {
        nombre_completo: editingUser.nombre_completo.trim(),
        rol: editingUser.rol,
        frente_asignado: editingUser.rol === 'supervisor_frente' ? editingUser.frente_asignado : null,
        patrulla_asignada: editingUser.rol === 'patrulla' ? editingUser.patrulla_asignada : null,
        activo: editingUser.activo,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('perfiles_usuarios')
        .update(updatePayload)
        .eq('id', editingUser.id);

      if (error) throw error;
      showToast(`Usuario "${editingUser.nombre_completo}" actualizado`);
      setIsEditUserModalOpen(false);
      setEditingUser(null);
      loadUsers();
    } catch (err: any) {
      alert(`Error actualizando usuario: ${err.message}`);
    } finally {
      setIsSubmittingEditUser(false);
    }
  };

  // Cargar usuario actual, verificar permisos y cargar lista
  useEffect(() => {
    const initPage = async () => {
      try {
        setIsLoading(true);
        const user = await authService.getCurrentUserProfile();
        if (!user || !user.activo) {
          router.push('/login');
          return;
        }

        // Restringido exclusivamente a admin y digitador
        if (user.rol !== 'admin' && user.rol !== 'digitador') {
          router.push('/');
          return;
        }

        setCurrentUser(user);
        await Promise.all([loadUsers(), loadFronts(), loadPatrols()]);
      } catch (err) {
        console.error('Error inicializando módulo de usuarios:', err);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    initPage();

    // Suscripción en tiempo real a perfiles_usuarios
    if (supabase) {
      const channel = supabase
        .channel('realtime_perfiles_usuarios')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'perfiles_usuarios' },
          () => {
            loadUsers();
          }
        )
        .subscribe();

      return () => {
        supabase?.removeChannel(channel);
      };
    }
  }, [router]);

  const loadUsers = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('perfiles_usuarios')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUsers(
        data.map((u) => ({
          id: u.id,
          correo: u.correo,
          nombre_completo: u.nombre_completo,
          rol: u.rol as UserRole,
          frente_asignado: u.frente_asignado,
          patrulla_asignada: u.patrulla_asignada,
          activo: u.activo,
          created_at: u.created_at,
        }))
      );
    }
  };

  const loadFronts = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('catalogo_frentes')
      .select('*')
      .eq('activo', true)
      .order('nombre', { ascending: true });

    if (data) {
      setFronts(data);
    }
  };

  const loadPatrols = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('catalogo_patrullas')
      .select('*')
      .eq('activo', true)
      .order('nombre', { ascending: true });

    if (data) {
      setPatrols(data);
    }
  };

  // Cambiar rol de un usuario
  const handleRoleChange = async (targetUserId: string, newRole: UserRole) => {
    if (!supabase) return;
    try {
      const updatePayload: any = { rol: newRole, updated_at: new Date().toISOString() };
      if (newRole !== 'supervisor_frente') updatePayload.frente_asignado = null;
      if (newRole !== 'patrulla') updatePayload.patrulla_asignada = null;

      const { error } = await supabase
        .from('perfiles_usuarios')
        .update(updatePayload)
        .eq('id', targetUserId);

      if (error) throw error;
      showToast(`Rol actualizado a: ${ROLES_CONFIG[newRole].label}`);
      loadUsers();
    } catch (err: any) {
      alert(`Error actualizando rol: ${err.message}`);
    }
  };

  // Cambiar frente asignado
  const handleFrontChange = async (targetUserId: string, frontName: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('perfiles_usuarios')
        .update({
          frente_asignado: frontName || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetUserId);

      if (error) throw error;
      showToast(`Frente asignado: ${frontName || 'Ninguno'}`);
      loadUsers();
    } catch (err: any) {
      alert(`Error asignando frente: ${err.message}`);
    }
  };

  // Cambiar patrulla asignada
  const handlePatrolChange = async (targetUserId: string, patrolName: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('perfiles_usuarios')
        .update({
          patrulla_asignada: patrolName || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetUserId);

      if (error) throw error;
      showToast(`Patrulla asignada: ${patrolName || 'Ninguna'}`);
      loadUsers();
    } catch (err: any) {
      alert(`Error asignando patrulla: ${err.message}`);
    }
  };

  // Activar o suspender usuario
  const handleToggleActive = async (targetUserId: string, currentStatus: boolean) => {
    if (!supabase) return;
    try {
      const newStatus = !currentStatus;
      const { error } = await supabase
        .from('perfiles_usuarios')
        .update({ activo: newStatus, updated_at: new Date().toISOString() })
        .eq('id', targetUserId);

      if (error) throw error;
      showToast(newStatus ? 'Usuario activado y autorizado' : 'Usuario desactivado');
      loadUsers();
    } catch (err: any) {
      alert(`Error cambiando estado: ${err.message}`);
    }
  };

  // Filtrado de usuarios
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.nombre_completo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.correo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.rol === roleFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && u.activo) ||
      (statusFilter === 'PENDING' && !u.activo);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = users.length;
  const activeCount = users.filter((u) => u.activo).length;
  const pendingCount = users.filter((u) => !u.activo).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-600">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide">Cargando Maestro de Usuarios...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-union-900 border border-union-900 text-white px-4 py-3 rounded-md shadow-panel text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-300 transition"
            title="Volver al Inicio"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-md bg-purple-700 flex items-center justify-center shadow-card">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-slate-900 leading-tight">
              Maestro de Usuarios & Roles
            </h1>
            <p className="text-[10px] uppercase font-bold text-purple-600 tracking-wider">
              Control de Accesos y Frentes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <Link
              href="/usuarios"
              className="px-3 py-1 rounded-lg text-xs font-bold bg-purple-600 text-white shadow"
            >
              Usuarios
            </Link>
            <Link
              href="/constantes"
              className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
            >
              Constantes
            </Link>
            <Link
              href="/fincas"
              className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
            >
              Fincas y Lotes
            </Link>
          </nav>

          <span className="hidden sm:inline text-xs font-bold text-slate-600">
            {currentUser?.nombre_completo}
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-purple-50 text-purple-700 border border-purple-200">
            {currentUser?.rol.toUpperCase()}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Registrados</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{totalUsers}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Usuarios Activos</p>
              <p className="text-2xl font-bold text-emerald-600 mt-0.5">{activeCount}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pendientes de Aprobación</p>
              <p className="text-2xl font-bold text-amber-600 mt-0.5">{pendingCount}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-600/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o correo..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-600 focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">Todos los Roles</option>
              <option value="pendiente">Pendiente</option>
              <option value="supervisor_frente">Supervisor de Frente</option>
              <option value="supervisor_quemas">Supervisor de Quemas</option>
              <option value="patrulla">Patrulla de Quema</option>
              <option value="digitador">Digitador</option>
              <option value="jefatura">Jefatura</option>
              <option value="admin">Administrador</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-600 focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="ACTIVE">Solo Activos</option>
              <option value="PENDING">Solo Pendientes</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">Usuario</th>
                  <th className="px-4 py-4">Rol Asignado</th>
                  <th className="px-4 py-4">Asignación Operativa</th>
                  <th className="px-4 py-4 text-center">Estado</th>
                  <th className="px-5 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-500">
                      No se encontraron usuarios con los filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const roleCfg = ROLES_CONFIG[u.rol];
                    const isSelf = currentUser?.id === u.id;

                    return (
                      <tr key={u.id} className="hover:bg-slate-50 transition">
                        {/* Datos de Usuario */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-slate-900 text-xs shrink-0">
                              {u.nombre_completo.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-xs">
                                  {u.nombre_completo}
                                </span>
                                {isSelf && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                    Tú
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-500 font-mono">
                                {u.correo}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Selector de Rol */}
                        <td className="px-4 py-4">
                          <select
                            value={u.rol}
                            disabled={isSelf}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                            className={`bg-slate-50 border rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${roleCfg.badgeColor}`}
                          >
                            <option value="pendiente">Pendiente de Aprobación</option>
                            <option value="supervisor_frente">Supervisor de Frente</option>
                            <option value="supervisor_quemas">Supervisor de Quemas</option>
                            <option value="patrulla">Patrulla de Quema</option>
                            <option value="digitador">Digitador</option>
                            <option value="jefatura">Jefatura</option>
                            <option value="admin">Administrador</option>
                          </select>
                        </td>

                        {/* Asignación Operativa: Frente o Patrulla */}
                        <td className="px-4 py-4">
                          {u.rol === 'supervisor_frente' ? (
                            <div className="flex items-center gap-1.5">
                              <select
                                value={u.frente_asignado || ''}
                                onChange={(e) => handleFrontChange(u.id, e.target.value)}
                                className="bg-slate-50 border border-blue-200 text-blue-800 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                              >
                                <option value="">-- Sin Frente --</option>
                                {fronts.map((f) => (
                                  <option key={f.nombre} value={f.nombre}>
                                    {f.nombre} ({f.tipo_cosecha})
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : u.rol === 'patrulla' ? (
                            <div className="flex items-center gap-1.5">
                              <select
                                value={u.patrulla_asignada || ''}
                                onChange={(e) => handlePatrolChange(u.id, e.target.value)}
                                className="bg-slate-50 border border-orange-200 text-orange-800 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-orange-500 cursor-pointer"
                              >
                                <option value="">-- Sin Patrulla --</option>
                                {patrols.map((p) => (
                                  <option key={p.nombre} value={p.nombre}>
                                    {p.nombre} {p.codigo_vehiculo ? `(${p.codigo_vehiculo})` : ''}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">No aplica</span>
                          )}
                        </td>

                        {/* Estado Activo / Inactivo */}
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                              u.activo
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {u.activo ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Activo</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                <span>Inactivo</span>
                              </>
                            )}
                          </span>
                        </td>

                        {/* Botones de Acción: Editar y Activar/Desactivar */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditUser(u)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-purple-600 hover:text-purple-700 border border-slate-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              title="Editar datos del usuario"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Editar</span>
                            </button>
                            <button
                              onClick={() => handleToggleActive(u.id, u.activo)}
                              disabled={isSelf}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                                u.activo
                                  ? 'bg-rose-50 hover:bg-rose-900 border border-rose-200 text-rose-700'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              }`}
                            >
                              {u.activo ? 'Desactivar' : 'Aprobar Acceso'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL EDITAR USUARIO */}
      {isEditUserModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-purple-600" />
                <span>Editar Usuario</span>
              </h3>
              <button
                onClick={() => {
                  setIsEditUserModalOpen(false);
                  setEditingUser(null);
                }}
                className="text-slate-500 hover:text-slate-900 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.nombre_completo}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, nombre_completo: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  disabled
                  value={editingUser.correo}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500 font-mono opacity-60 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Rol Asignado
                </label>
                <select
                  value={editingUser.rol}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, rol: e.target.value as UserRole })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="pendiente">Pendiente de Aprobación</option>
                  <option value="supervisor_frente">Supervisor de Frente</option>
                  <option value="supervisor_quemas">Supervisor de Quemas</option>
                  <option value="patrulla">Patrulla de Quema</option>
                  <option value="digitador">Digitador</option>
                  <option value="jefatura">Jefatura</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              {editingUser.rol === 'supervisor_frente' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Frente Asignado
                  </label>
                  <select
                    value={editingUser.frente_asignado || ''}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, frente_asignado: e.target.value || undefined })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="">-- Sin Frente --</option>
                    {fronts.map((f) => (
                      <option key={f.nombre} value={f.nombre}>
                        {f.nombre} ({f.tipo_cosecha})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {editingUser.rol === 'patrulla' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Patrulla Asignada
                  </label>
                  <select
                    value={editingUser.patrulla_asignada || ''}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, patrulla_asignada: e.target.value || undefined })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="">-- Sin Patrulla --</option>
                    {patrols.map((p) => (
                      <option key={p.nombre} value={p.nombre}>
                        {p.nombre} {p.codigo_vehiculo ? `(${p.codigo_vehiculo})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Estado de la Cuenta
                </label>
                <select
                  value={editingUser.activo ? 'true' : 'false'}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, activo: e.target.value === 'true' })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="true">Activo (Autorizado)</option>
                  <option value="false">Inactivo / Pendiente</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditUserModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEditUser}
                  className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs py-2 px-5 rounded-xl transition shadow-lg shadow-purple-200 cursor-pointer"
                >
                  {isSubmittingEditUser ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
