'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Front, Patrol, UserProfile } from '@/lib/types';
import { FincaInfo, LoteInfo } from '@/lib/fincasLotesData';
import { storageService } from '@/lib/storageService';
import { INITIAL_USERS } from '@/lib/mockData';
import {
  Database,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  Shield,
  Layers,
  MapPin,
  Flame,
  Search,
  Sparkles,
  AlertCircle,
  X,
  Save,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

export default function MaestrosPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'lotes' | 'fronts' | 'patrols'>('lotes');

  // Master Data
  const [fronts, setFronts] = useState<Front[]>([]);
  const [patrols, setPatrols] = useState<Patrol[]>([]);
  const [fincasLotes, setFincasLotes] = useState<FincaInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter for Fincas / Lotes
  const [searchQuery, setSearchQuery] = useState('');
  const [fincaFilter, setFincaFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Modals
  const [editingLoteModal, setEditingLoteModal] = useState<{
    isOpen: boolean;
    isNew: boolean;
    fincaName: string;
    lote: LoteInfo;
  } | null>(null);

  const [frontModal, setFrontModal] = useState<{
    isOpen: boolean;
    front: Partial<Front> | null;
  }>({ isOpen: false, front: null });

  const [patrolModal, setPatrolModal] = useState<{
    isOpen: boolean;
    patrol: Partial<Patrol> | null;
  }>({ isOpen: false, patrol: null });

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const loadData = async () => {
    let user = storageService.getActiveUser();
    if (!user) {
      user = INITIAL_USERS.find((u) => u.role === 'digitador') || INITIAL_USERS[0];
      storageService.setActiveUser(user);
    }
    setCurrentUser(user);

    setIsLoading(true);
    const [fetchedFronts, fetchedPatrols, fetchedFincas] = await Promise.all([
      storageService.getFronts(),
      storageService.getPatrols(),
      storageService.getFincasLotes(),
    ]);
    setFronts(fetchedFronts);
    setPatrols(fetchedPatrols);
    setFincasLotes(fetchedFincas);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUserChange = (user: UserProfile) => {
    setCurrentUser(user);
    storageService.setActiveUser(user);
    loadData();
  };

  // Flattened Lotes for Table view
  const flattenedLotes = useMemo(() => {
    const list: { fincaName: string; lote: LoteInfo }[] = [];
    fincasLotes.forEach((f) => {
      f.lotes.forEach((l) => {
        list.push({ fincaName: f.name, lote: l });
      });
    });
    return list;
  }, [fincasLotes]);

  // Filtered Lotes
  const filteredLotes = useMemo(() => {
    return flattenedLotes.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.fincaName.toLowerCase().includes(q) ||
        item.lote.lote.toLowerCase().includes(q) ||
        (item.lote.variedad && item.lote.variedad.toLowerCase().includes(q));

      const matchFinca = fincaFilter === 'ALL' || item.fincaName === fincaFilter;

      return matchSearch && matchFinca;
    });
  }, [flattenedLotes, searchQuery, fincaFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredLotes.length / pageSize) || 1;
  const paginatedLotes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLotes.slice(start, start + pageSize);
  }, [filteredLotes, currentPage]);

  // Handle Save Lote
  const handleSaveLote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLoteModal || !currentUser) return;
    const { fincaName, lote, isNew } = editingLoteModal;

    if (!fincaName.trim() || !lote.lote.trim()) {
      alert('Debe ingresar la finca y el número de lote');
      return;
    }

    const updated = await storageService.addOrUpdateLoteInFinca(fincaName, lote, currentUser, isNew);
    setFincasLotes(updated);
    setEditingLoteModal(null);
    showToast(isNew ? `Lote ${lote.lote} agregado a ${fincaName}` : `Lote ${lote.lote} actualizado`);
  };

  // Handle Delete Lote
  const handleDeleteLote = async (fincaName: string, loteCode: string) => {
    if (!currentUser) return;
    if (confirm(`¿Está seguro de eliminar el Lote ${loteCode} de la finca ${fincaName}?`)) {
      const updated = await storageService.deleteLoteFromFinca(fincaName, loteCode, currentUser);
      setFincasLotes(updated);
      showToast(`Lote ${loteCode} eliminado`);
    }
  };

  // Handle Save Front
  const handleSaveFront = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!frontModal.front || !currentUser) return;
    const { id, name, harvest_type, supervisor_turno_a, supervisor_turno_b } = frontModal.front;

    if (!name?.trim()) return;

    if (id) {
      await storageService.updateFront(id, { name, harvest_type, supervisor_turno_a, supervisor_turno_b }, currentUser);
    } else {
      await storageService.createFront({
        name,
        harvest_type: harvest_type || 'Mecanizada',
        supervisor_turno_a: supervisor_turno_a || '',
        supervisor_turno_b: supervisor_turno_b || '',
        active: true,
      }, currentUser);
    }
    const updated = await storageService.getFronts();
    setFronts(updated);
    setFrontModal({ isOpen: false, front: null });
    showToast('Frente de cosecha guardado');
  };

  // Handle Save Patrol
  const handleSavePatrol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patrolModal.patrol || !currentUser) return;
    const { id, name, leader_name, phone, vehicle_code } = patrolModal.patrol;

    if (!name?.trim()) return;

    if (id) {
      await storageService.updatePatrol(id, { name, leader_name, phone, vehicle_code }, currentUser);
    } else {
      await storageService.createPatrol({
        name,
        leader_name: leader_name || '',
        phone: phone || '',
        vehicle_code: vehicle_code || '',
        status: 'DISPONIBLE',
        active: true,
      }, currentUser);
    }
    const updated = await storageService.getPatrols();
    setPatrols(updated);
    setPatrolModal({ isOpen: false, patrol: null });
    showToast('Patrulla de quema guardada');
  };

  if (!currentUser) return null;

  return (
    <>
      <Navbar currentUser={currentUser} onUserChange={handleUserChange} />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-sm font-medium animate-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        
        {/* Banner Header */}
        <div className="mb-6 bg-gradient-to-r from-union-950 via-union-900 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-union-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Administración de Catálogos Maestros
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
              Base de Datos Maestra • Zafra 56
            </h1>
            <p className="text-xs sm:text-sm text-union-200 mt-1 max-w-2xl">
              Aquí se gestionan las <strong>Fincas, Lotes y TCH oficiales</strong>, los <strong>Frentes de Cosecha</strong> y las <strong>Patrullas de Quema</strong>. Los cambios se reflejan de inmediato al solicitar quemas.
            </p>
          </div>

          {/* Quick Action Button based on Active Tab */}
          <div>
            {activeTab === 'lotes' && (
              <button
                onClick={() =>
                  setEditingLoteModal({
                    isOpen: true,
                    isNew: true,
                    fincaName: fincasLotes[0]?.name || '',
                    lote: { lote: '', area: 10, tch: 110, tons: 1100, variedad: '' },
                  })
                }
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Agregar Lote / Finca</span>
              </button>
            )}

            {activeTab === 'fronts' && (
              <button
                onClick={() => setFrontModal({ isOpen: true, front: { harvest_type: 'Mecanizada' } })}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Nuevo Frente</span>
              </button>
            )}

            {activeTab === 'patrols' && (
              <button
                onClick={() => setPatrolModal({ isOpen: true, patrol: {} })}
                className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Nueva Patrulla</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 border-b border-gray-200 mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => { setActiveTab('lotes'); setCurrentPage(1); }}
            className={`px-4 py-3 font-bold text-xs sm:text-sm rounded-t-xl border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'lotes'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>1. Maestro Fincas y Lotes (TCH Zafra 56)</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
              {flattenedLotes.length} lotes
            </span>
          </button>

          <button
            onClick={() => setActiveTab('fronts')}
            className={`px-4 py-3 font-bold text-xs sm:text-sm rounded-t-xl border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'fronts'
                ? 'border-blue-600 text-blue-800 bg-white shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
            }`}
          >
            <Layers className="w-4 h-4 text-blue-600" />
            <span>2. Frentes de Cosecha</span>
            <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
              {fronts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('patrols')}
            className={`px-4 py-3 font-bold text-xs sm:text-sm rounded-t-xl border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'patrols'
                ? 'border-orange-600 text-orange-800 bg-white shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
            }`}
          >
            <Shield className="w-4 h-4 text-orange-600" />
            <span>3. Patrullas de Quema</span>
            <span className="bg-orange-100 text-orange-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
              {patrols.length}
            </span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: MAESTRO FINCAS Y LOTES (TCH ZAFRA 56)                             */}
        {/* ========================================================================= */}
        {activeTab === 'lotes' && (
          <div className="space-y-4">
            
            {/* Search and Finca Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Buscar por Finca, Lote o Variedad..."
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={fincaFilter}
                  onChange={(e) => { setFincaFilter(e.target.value); setCurrentPage(1); }}
                  className="p-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 bg-white focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="ALL">Todas las Fincas ({fincasLotes.length})</option>
                  {fincasLotes.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.name} ({f.lotes.length} lotes)
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-xs text-gray-500 font-medium">
                Mostrando <strong className="text-gray-900">{filteredLotes.length}</strong> lotes encontrados
              </div>
            </div>

            {/* Master Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 text-gray-700 font-bold uppercase border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4">Finca</th>
                      <th className="py-3 px-4">Lote / UM</th>
                      <th className="py-3 px-4 text-right">TCH (TM/ha)</th>
                      <th className="py-3 px-4 text-right">Área Lote (ha)</th>
                      <th className="py-3 px-4 text-right">Caña Est. (TM)</th>
                      <th className="py-3 px-4">Variedad</th>
                      <th className="py-3 px-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedLotes.map((item, idx) => (
                      <tr key={`${item.fincaName}-${item.lote.lote}-${idx}`} className="hover:bg-emerald-50/40">
                        <td className="py-2.5 px-4 font-bold text-gray-900">
                          {item.fincaName}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-emerald-800">
                          Lote {item.lote.lote}
                        </td>
                        <td className="py-2.5 px-4 text-right font-black text-union-900">
                          {item.lote.tch} <span className="text-[10px] text-gray-400 font-normal">TM/ha</span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-medium text-gray-800">
                          {item.lote.area} ha
                        </td>
                        <td className="py-2.5 px-4 text-right font-bold text-gray-900">
                          {item.lote.tons?.toLocaleString()} TM
                        </td>
                        <td className="py-2.5 px-4 text-gray-600 font-mono text-[11px]">
                          {item.lote.variedad || '—'}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              onClick={() =>
                                setEditingLoteModal({
                                  isOpen: true,
                                  isNew: false,
                                  fincaName: item.fincaName,
                                  lote: { ...item.lote },
                                })
                              }
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Editar Lote / TCH"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteLote(item.fincaName, item.lote.lote)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Eliminar Lote"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> (Página de {pageSize} registros)
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-200 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-200 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FRENTES DE COSECHA                                                */}
        {/* ========================================================================= */}
        {activeTab === 'fronts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fronts.map((f) => (
              <div key={f.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-black text-blue-900 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-blue-700" />
                      {f.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Cosecha {f.harvest_type}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-600 mt-3 pt-3 border-t border-gray-100">
                    <div><strong>Turno A:</strong> {f.supervisor_turno_a || 'Sin asignar'}</div>
                    <div><strong>Turno B:</strong> {f.supervisor_turno_b || 'Sin asignar'}</div>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => setFrontModal({ isOpen: true, front: f })}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar Frente</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PATRULLAS DE QUEMA                                                */}
        {/* ========================================================================= */}
        {activeTab === 'patrols' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {patrols.map((p) => (
              <div key={p.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-black text-orange-950 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-orange-600" />
                      {p.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                      {p.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-gray-600 mt-2">
                    <div><strong>Líder:</strong> {p.leader_name}</div>
                    <div><strong>Teléfono/Radio:</strong> {p.phone}</div>
                    <div><strong>Vehículo:</strong> {p.vehicle_code || '—'}</div>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => setPatrolModal({ isOpen: true, patrol: p })}
                    className="text-xs font-bold text-orange-700 hover:text-orange-900 flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar Patrulla</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL CREAR / EDITAR LOTE Y FINCA                                        */}
      {/* ========================================================================= */}
      {editingLoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-emerald-800">
                <MapPin className="w-5 h-5" />
                <h3 className="text-base font-bold text-gray-900">
                  {editingLoteModal.isNew ? 'Nuevo Lote en Catálogo' : 'Editar Lote / TCH'}
                </h3>
              </div>
              <button onClick={() => setEditingLoteModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLote} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Nombre de la Finca *</label>
                <input
                  type="text"
                  value={editingLoteModal.fincaName}
                  onChange={(e) => setEditingLoteModal({ ...editingLoteModal, fincaName: e.target.value })}
                  placeholder="ej: FINCA LAS PALMAS"
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-bold text-gray-900 focus:ring-2 focus:ring-emerald-600 uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">No. Lote / UM *</label>
                  <input
                    type="text"
                    value={editingLoteModal.lote.lote}
                    onChange={(e) =>
                      setEditingLoteModal({
                        ...editingLoteModal,
                        lote: { ...editingLoteModal.lote, lote: e.target.value },
                      })
                    }
                    placeholder="ej: 15.04"
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">TCH (TM/ha) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingLoteModal.lote.tch}
                    onChange={(e) => {
                      const tch = Number(e.target.value);
                      const area = editingLoteModal.lote.area || 0;
                      setEditingLoteModal({
                        ...editingLoteModal,
                        lote: {
                          ...editingLoteModal.lote,
                          tch,
                          tons: Math.round(area * tch),
                        },
                      });
                    }}
                    className="w-full p-2.5 rounded-xl border border-emerald-300 font-bold text-emerald-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Área Total (ha)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingLoteModal.lote.area}
                    onChange={(e) => {
                      const area = Number(e.target.value);
                      const tch = editingLoteModal.lote.tch || 0;
                      setEditingLoteModal({
                        ...editingLoteModal,
                        lote: {
                          ...editingLoteModal.lote,
                          area,
                          tons: Math.round(area * tch),
                        },
                      });
                    }}
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Toneladas Est.</label>
                  <input
                    type="number"
                    value={editingLoteModal.lote.tons}
                    onChange={(e) =>
                      setEditingLoteModal({
                        ...editingLoteModal,
                        lote: { ...editingLoteModal.lote, tons: Number(e.target.value) },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-bold bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Variedad de Caña</label>
                <input
                  type="text"
                  value={editingLoteModal.lote.variedad || ''}
                  onChange={(e) =>
                    setEditingLoteModal({
                      ...editingLoteModal,
                      lote: { ...editingLoteModal.lote, variedad: e.target.value },
                    })
                  }
                  placeholder="ej: CG02-163 o CP72-2086"
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLoteModal(null)}
                  className="px-4 py-2 font-medium text-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl shadow"
                >
                  Guardar en Maestro
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL CREAR / EDITAR FRENTE                                              */}
      {/* ========================================================================= */}
      {frontModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-4">
            <h3 className="text-base font-bold text-gray-900">
              {frontModal.front?.id ? 'Editar Frente de Cosecha' : 'Nuevo Frente de Cosecha'}
            </h3>
            <form onSubmit={handleSaveFront} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nombre del Frente *</label>
                <input
                  type="text"
                  value={frontModal.front?.name || ''}
                  onChange={(e) => setFrontModal({ ...frontModal, front: { ...frontModal.front, name: e.target.value } })}
                  placeholder="ej: Frente 26"
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-bold"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Tipo de Cosecha</label>
                <select
                  value={frontModal.front?.harvest_type || 'Mecanizada'}
                  onChange={(e) => setFrontModal({ ...frontModal, front: { ...frontModal.front, harvest_type: e.target.value as any } })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-bold"
                >
                  <option value="Mecanizada">Mecanizada</option>
                  <option value="Manual">Manual</option>
                  <option value="Mixta">Mixta</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Supervisor Turno A</label>
                <input
                  type="text"
                  value={frontModal.front?.supervisor_turno_a || ''}
                  onChange={(e) => setFrontModal({ ...frontModal, front: { ...frontModal.front, supervisor_turno_a: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Supervisor Turno B</label>
                <input
                  type="text"
                  value={frontModal.front?.supervisor_turno_b || ''}
                  onChange={(e) => setFrontModal({ ...frontModal, front: { ...frontModal.front, supervisor_turno_b: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setFrontModal({ isOpen: false, front: null })} className="px-4 py-2">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-700 text-white font-bold rounded-xl">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL CREAR / EDITAR PATRULLA                                            */}
      {/* ========================================================================= */}
      {patrolModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-4">
            <h3 className="text-base font-bold text-gray-900">
              {patrolModal.patrol?.id ? 'Editar Patrulla de Quema' : 'Nueva Patrulla de Quema'}
            </h3>
            <form onSubmit={handleSavePatrol} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nombre de la Patrulla *</label>
                <input
                  type="text"
                  value={patrolModal.patrol?.name || ''}
                  onChange={(e) => setPatrolModal({ ...patrolModal, patrol: { ...patrolModal.patrol, name: e.target.value } })}
                  placeholder="ej: Patrulla Épsilon"
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-bold"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Líder de Cuadrilla *</label>
                <input
                  type="text"
                  value={patrolModal.patrol?.leader_name || ''}
                  onChange={(e) => setPatrolModal({ ...patrolModal, patrol: { ...patrolModal.patrol, leader_name: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Teléfono / Radio de Contacto</label>
                <input
                  type="text"
                  value={patrolModal.patrol?.phone || ''}
                  onChange={(e) => setPatrolModal({ ...patrolModal, patrol: { ...patrolModal.patrol, phone: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Código de Vehículo / Cisterna</label>
                <input
                  type="text"
                  value={patrolModal.patrol?.vehicle_code || ''}
                  onChange={(e) => setPatrolModal({ ...patrolModal, patrol: { ...patrolModal.patrol, vehicle_code: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setPatrolModal({ isOpen: false, patrol: null })} className="px-4 py-2">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-orange-700 text-white font-bold rounded-xl">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </>
  );
}
