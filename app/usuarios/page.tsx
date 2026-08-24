'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { UserProfile, UserRole, ROLE_DETAILS, Front, Patrol } from '@/lib/types';
import { storageService } from '@/lib/storageService';
import {
  Users,
  KeyRound,
  Eye,
  EyeOff,
  Edit,
  PlusCircle,
  ShieldCheck,
  Search,
  Phone,
  Layers,
  Shield,
  Sparkles,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function UsuariosPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [fronts, setFronts] = useState<Front[]>([]);
  const [patrols, setPatrols] = useState<Patrol[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Edit / Create User Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    pin: '',
    full_name: '',
    email: '',
    role: 'supervisor_frente' as UserRole,
    phone: '',
    assigned_front: '',
    assigned_patrol_name: '',
    active: true,
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const loadData = async () => {
    let active = storageService.getActiveUser();
    if (!active) {
      active = INITIAL_USERS.find((u) => u.role === 'digitador') || INITIAL_USERS[3];
      storageService.setActiveUser(active);
    }
    setCurrentUser(active);

    const [uList, fList, pList] = await Promise.all([
      storageService.getAllUsers(),
      storageService.getFronts(),
      storageService.getPatrols(),
    ]);
    setUsers(uList);
    setFronts(fList);
    setPatrols(pList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUserChange = (user: UserProfile) => {
    setCurrentUser(user);
    storageService.setActiveUser(user);
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleOpenModal = (user?: UserProfile) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        password: user.password || '',
        pin: user.pin || '',
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        assigned_front: user.assigned_front || '',
        assigned_patrol_name: user.assigned_patrol_name || '',
        active: user.active ?? true,
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        password: 'launion2026',
        pin: '1234',
        full_name: '',
        email: '',
        role: 'supervisor_frente',
        phone: '+502 ',
        assigned_front: fronts[0]?.name || 'Frente 01',
        assigned_patrol_name: '',
        active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (editingUser) {
      await storageService.updateUserCredentials(editingUser.id, formData, currentUser);
      showToast(`Credenciales de ${formData.full_name} actualizadas.`);
    } else {
      await storageService.createUser(formData, currentUser);
      showToast(`Usuario ${formData.full_name} creado exitosamente.`);
    }

    setIsModalOpen(false);
    loadData();
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchQ =
      !q ||
      u.full_name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.assigned_front && u.assigned_front.toLowerCase().includes(q));

    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchQ && matchRole;
  });

  if (!currentUser) return null;

  return (
    <>
      <Navbar currentUser={currentUser} onUserChange={handleUserChange} />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-sm font-medium animate-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        
        {/* Header */}
        <div className="mb-6 bg-purple-950 text-white p-6 rounded-2xl shadow-md border border-purple-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-purple-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Panel Exclusivo de Digitadores y Administradores
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
              Gestión de Usuarios, Roles y Credenciales
            </h1>
            <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-2xl">
              Consulta contraseñas y PINes olvidados en campo, restablece credenciales y asigna frentes de trabajo o patrullas a los colaboradores.
            </p>
          </div>

          <div>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrar Nuevo Colaborador</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[260px] relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar colaborador por nombre, usuario o frente..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="py-2 px-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 bg-white"
            >
              <option value="ALL">Todos los Roles</option>
              <option value="supervisor_frente">Supervisores de Frente</option>
              <option value="supervisor_quemas">Supervisores de Quemas</option>
              <option value="patrulla">Patrullas de Quema</option>
              <option value="digitador">Digitadores</option>
              <option value="jefatura">Jefaturas</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Colaborador / Rol</th>
                  <th className="py-3.5 px-4">Usuario (@)</th>
                  <th className="py-3.5 px-4">Asignación</th>
                  <th className="py-3.5 px-4">Contraseña / PIN (Consultable)</th>
                  <th className="py-3.5 px-4">Contacto</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((u) => {
                  const roleMeta = ROLE_DETAILS[u.role];
                  const isVisible = showPasswords[u.id];

                  return (
                    <tr key={u.id} className="hover:bg-purple-50/20 transition">
                      
                      {/* Name & Role */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900 text-sm">{u.full_name}</div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mt-0.5 ${roleMeta.badgeColor}`}>
                          {roleMeta.label}
                        </span>
                      </td>

                      {/* Username */}
                      <td className="py-3.5 px-4 font-mono font-bold text-purple-950">
                        @{u.username}
                        <span className="block text-[11px] font-normal text-gray-500 font-sans">{u.email}</span>
                      </td>

                      {/* Assignment */}
                      <td className="py-3.5 px-4">
                        {u.assigned_front ? (
                          <span className="font-semibold text-blue-800 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                            {u.assigned_front}
                          </span>
                        ) : u.assigned_patrol_name ? (
                          <span className="font-semibold text-orange-800 bg-orange-50 px-2 py-1 rounded border border-orange-200">
                            {u.assigned_patrol_name}
                          </span>
                        ) : (
                          <span className="text-gray-400">General Ingenio</span>
                        )}
                      </td>

                      {/* Pass / PIN with Toggle */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded border border-gray-200 text-gray-800 font-bold">
                            {isVisible ? u.password || 'Sin clave' : '••••••••'}
                          </span>
                          {u.pin && (
                            <span className="font-mono bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                              PIN: {isVisible ? u.pin : '•••'}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(u.id)}
                            className="text-gray-400 hover:text-purple-700 p-1"
                            title={isVisible ? 'Ocultar' : 'Ver credencial'}
                          >
                            {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                        {u.phone ? (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {u.phone}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleOpenModal(u)}
                          className="px-3 py-1.5 text-xs font-bold text-purple-900 bg-purple-100 hover:bg-purple-200 rounded-lg flex items-center gap-1.5 ml-auto transition"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Modificar Clave / Rol</span>
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* ================================================================ */}
      {/* MODAL EDITAR / CREAR USUARIO                                    */}
      {/* ================================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900">
              {editingUser ? `Editar Credenciales: ${editingUser.full_name}` : 'Registrar Nuevo Colaborador'}
            </h3>

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="ej: Juan Carlos Pérez"
                    className="w-full p-2 rounded-lg border border-gray-300 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Nombre de Usuario (@) *</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="ej: juan.perez"
                    className="w-full p-2 rounded-lg border border-gray-300 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-purple-900 mb-1">Contraseña de Acceso *</label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="ej: clave123"
                    className="w-full p-2 rounded-lg border-2 border-purple-300 bg-purple-50/30 font-mono font-bold text-purple-950"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-amber-900 mb-1">PIN Rápido (4 dígitos)</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                    placeholder="ej: 1234"
                    className="w-full p-2 rounded-lg border border-amber-300 bg-amber-50/30 font-mono font-bold text-amber-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Rol Asignado *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full p-2 rounded-lg border border-gray-300 bg-white font-bold text-gray-800"
                  >
                    <option value="supervisor_frente">Supervisor de Frente</option>
                    <option value="supervisor_quemas">Supervisor de Quemas</option>
                    <option value="patrulla">Patrulla de Quema</option>
                    <option value="digitador">Digitador de Quemas</option>
                    <option value="jefatura">Jefatura / Gerencia</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Teléfono / Celular</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+502 5555-0000"
                    className="w-full p-2 rounded-lg border border-gray-300"
                  />
                </div>
              </div>

              {/* Asignación específica por rol */}
              {formData.role === 'supervisor_frente' && (
                <div>
                  <label className="block font-bold text-blue-900 mb-1">Frente Asignado al Supervisor</label>
                  <select
                    value={formData.assigned_front}
                    onChange={(e) => setFormData({ ...formData, assigned_front: e.target.value })}
                    className="w-full p-2 rounded-lg border border-blue-300 bg-blue-50/50 font-bold text-blue-900"
                  >
                    <option value="">-- Sin frente fijo --</option>
                    {fronts.map((f) => (
                      <option key={f.id} value={f.name}>
                        {f.name} ({f.harvest_type})
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Este supervisor solo verá y creará quemas asociadas a este frente.
                  </p>
                </div>
              )}

              {formData.role === 'patrulla' && (
                <div>
                  <label className="block font-bold text-orange-900 mb-1">Patrulla de Quema Asignada</label>
                  <select
                    value={formData.assigned_patrol_name}
                    onChange={(e) => setFormData({ ...formData, assigned_patrol_name: e.target.value })}
                    className="w-full p-2 rounded-lg border border-orange-300 bg-orange-50/50 font-bold text-orange-900"
                  >
                    <option value="">-- Sin patrulla fija --</option>
                    {patrols.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} (Líder: {p.leader_name})
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Este patrullero solo verá las quemas asignadas a esta patrulla.
                  </p>
                </div>
              )}

              <div>
                <label className="block font-bold text-gray-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ej: colaborador@launion.com"
                  className="w-full p-2 rounded-lg border border-gray-300"
                />
              </div>

              <div className="pt-3 border-t flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-800 hover:bg-purple-700 text-white font-bold rounded-lg shadow-md transition"
                >
                  Guardar Credenciales
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </>
  );
}
