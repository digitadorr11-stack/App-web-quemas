'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/authService';
import { supabase } from '@/lib/supabaseClient';
import { FrontCatalog, PatrolCatalog, UserProfile } from '@/lib/types';
import {
  Layers,
  Truck,
  Plus,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Flame,
  Shield,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  Search,
} from 'lucide-react';

export default function ConstantesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'frentes' | 'patrullas'>('frentes');

  // Datos
  const [fronts, setFronts] = useState<FrontCatalog[]>([]);
  const [patrols, setPatrols] = useState<PatrolCatalog[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Formulario nuevo frente
  const [newFrontName, setNewFrontName] = useState('');
  const [newFrontType, setNewFrontType] = useState<'Mecanizada' | 'Manual' | 'Mixta'>('Mecanizada');
  const [isSubmittingFront, setIsSubmittingFront] = useState(false);

  // Formulario nueva patrulla
  const [newPatrolName, setNewPatrolName] = useState('');
  const [newPatrolVehicle, setNewPatrolVehicle] = useState('');
  const [isSubmittingPatrol, setIsSubmittingPatrol] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const initPage = async () => {
      try {
        setIsLoading(true);
        const user = await authService.getCurrentUserProfile();
        if (!user || !user.activo) {
          router.push('/login');
          return;
        }

        if (user.rol !== 'admin' && user.rol !== 'digitador') {
          router.push('/');
          return;
        }

        setCurrentUser(user);
        await Promise.all([loadFronts(), loadPatrols()]);
      } catch (err) {
        console.error('Error inicializando módulo de constantes:', err);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    initPage();

    // Suscripciones Realtime
    if (supabase) {
      const channelFronts = supabase
        .channel('realtime_catalogo_frentes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'catalogo_frentes' },
          () => loadFronts()
        )
        .subscribe();

      const channelPatrols = supabase
        .channel('realtime_catalogo_patrullas')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'catalogo_patrullas' },
          () => loadPatrols()
        )
        .subscribe();

      return () => {
        supabase?.removeChannel(channelFronts);
        supabase?.removeChannel(channelPatrols);
      };
    }
  }, [router]);

  const loadFronts = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('catalogo_frentes')
      .select('*')
      .order('nombre', { ascending: true });

    if (!error && data) {
      setFronts(data);
    }
  };

  const loadPatrols = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('catalogo_patrullas')
      .select('*')
      .order('nombre', { ascending: true });

    if (!error && data) {
      setPatrols(data);
    }
  };

  // Crear nuevo Frente
  const handleCreateFront = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !newFrontName.trim()) return;

    try {
      setIsSubmittingFront(true);
      const formattedName = newFrontName.trim();

      const { error } = await supabase.from('catalogo_frentes').insert({
        nombre: formattedName,
        tipo_cosecha: newFrontType,
        activo: true,
      });

      if (error) throw error;

      showToast(`Frente "${formattedName}" registrado correctamente`);
      setNewFrontName('');
      loadFronts();
    } catch (err: any) {
      alert(`Error al registrar frente: ${err.message}`);
    } finally {
      setIsSubmittingFront(false);
    }
  };

  // Cambiar tipo de cosecha
  const handleUpdateFrontType = async (nombre: string, tipo: 'Mecanizada' | 'Manual' | 'Mixta') => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('catalogo_frentes')
        .update({ tipo_cosecha: tipo })
        .eq('nombre', nombre);

      if (error) throw error;
      showToast(`Tipo actualizado a: ${tipo}`);
      loadFronts();
    } catch (err: any) {
      alert(`Error actualizando tipo: ${err.message}`);
    }
  };

  // Activar / Desactivar Frente
  const handleToggleFrontActive = async (nombre: string, currentStatus: boolean) => {
    if (!supabase) return;
    try {
      const newStatus = !currentStatus;
      const { error } = await supabase
        .from('catalogo_frentes')
        .update({ activo: newStatus })
        .eq('nombre', nombre);

      if (error) throw error;
      showToast(newStatus ? `"${nombre}" activado` : `"${nombre}" desactivado`);
      loadFronts();
    } catch (err: any) {
      alert(`Error cambiando estado: ${err.message}`);
    }
  };

  // Crear nueva Patrulla
  const handleCreatePatrol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !newPatrolName.trim()) return;

    try {
      setIsSubmittingPatrol(true);
      const formattedName = newPatrolName.trim();
      const formattedVehicle = newPatrolVehicle.trim().toUpperCase() || null;

      const { error } = await supabase.from('catalogo_patrullas').insert({
        nombre: formattedName,
        codigo_vehiculo: formattedVehicle,
        estado: 'DISPONIBLE',
        activo: true,
      });

      if (error) throw error;

      showToast(`Patrulla "${formattedName}" registrada con éxito`);
      setNewPatrolName('');
      setNewPatrolVehicle('');
      loadPatrols();
    } catch (err: any) {
      alert(`Error registrando patrulla: ${err.message}`);
    } finally {
      setIsSubmittingPatrol(false);
    }
  };

  // Activar / Desactivar Patrulla
  const handleTogglePatrolActive = async (nombre: string, currentStatus: boolean) => {
    if (!supabase) return;
    try {
      const newStatus = !currentStatus;
      const { error } = await supabase
        .from('catalogo_patrullas')
        .update({ activo: newStatus })
        .eq('nombre', nombre);

      if (error) throw error;
      showToast(newStatus ? `"${nombre}" activada` : `"${nombre}" desactivada`);
      loadPatrols();
    } catch (err: any) {
      alert(`Error cambiando estado: ${err.message}`);
    }
  };

  // Cambiar estado operativo de Patrulla
  const handleUpdatePatrolStatus = async (
    nombre: string,
    nuevoEstado: 'DISPONIBLE' | 'EN_FRENTE' | 'EN_QUEMA'
  ) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('catalogo_patrullas')
        .update({ estado: nuevoEstado })
        .eq('nombre', nombre);

      if (error) throw error;
      showToast(`Estado de ${nombre}: ${nuevoEstado}`);
      loadPatrols();
    } catch (err: any) {
      alert(`Error cambiando estado operativo: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070C14] flex flex-col items-center justify-center text-slate-300">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-bold text-sm tracking-wide">Cargando Constantes Operativas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070C14] text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-[#0B121E] border-b border-slate-800/80 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 transition"
            title="Volver al Inicio"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-teal-600 border border-emerald-400/30 flex items-center justify-center shadow-lg shadow-emerald-950/50">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white leading-tight">
              Constantes Operativas
            </h1>
            <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              Frentes de Cosecha & Patrullas de Quema
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <Link
              href="/usuarios"
              className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Usuarios
            </Link>
            <Link
              href="/constantes"
              className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow"
            >
              Constantes
            </Link>
            <Link
              href="/fincas"
              className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Fincas y Lotes
            </Link>
          </nav>

          <span className="hidden sm:inline text-xs font-bold text-slate-300">
            {currentUser?.nombre_completo}
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
            {currentUser?.rol.toUpperCase()}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Tabs de Selección */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 bg-slate-900/60 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('frentes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'frentes'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Frentes de Cosecha ({fronts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('patrullas')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'patrullas'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Patrullas de Quema ({patrols.length})</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 hidden sm:block">
            Sincronización en tiempo real con Supabase
          </div>
        </div>

        {/* TAB 1: FRENTES DE COSECHA */}
        {activeTab === 'frentes' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Formulario Agregar Frente */}
            <div className="bg-[#0B121E] border border-slate-800 rounded-3xl p-5 shadow-xl">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-3">
                <Plus className="w-4 h-4" />
                <span>Registrar Nuevo Frente de Cosecha</span>
              </h2>

              <form onSubmit={handleCreateFront} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Nombre del Frente (ej: Frente 18)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Frente 18"
                    value={newFrontName}
                    onChange={(e) => setNewFrontName(e.target.value)}
                    className="w-full bg-[#070C14] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Tipo de Cosecha
                  </label>
                  <select
                    value={newFrontType}
                    onChange={(e) =>
                      setNewFrontType(e.target.value as 'Mecanizada' | 'Manual' | 'Mixta')
                    }
                    className="w-full bg-[#070C14] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Mecanizada">Mecanizada</option>
                    <option value="Manual">Manual</option>
                    <option value="Mixta">Mixta</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={isSubmittingFront}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isSubmittingFront ? 'Guardando...' : 'Agregar Frente'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Lista / Tabla de Frentes */}
            <div className="bg-[#0B121E] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#070C14] border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-4">Frente</th>
                      <th className="px-4 py-4">Tipo de Cosecha</th>
                      <th className="px-4 py-4 text-center">Estado</th>
                      <th className="px-5 py-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {fronts.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-10 text-slate-500">
                          No hay frentes registrados aún.
                        </td>
                      </tr>
                    ) : (
                      fronts.map((f) => (
                        <tr key={f.nombre} className="hover:bg-slate-900/40 transition">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center font-bold text-emerald-300 text-xs">
                                <Layers className="w-4 h-4" />
                              </div>
                              <span className="font-bold text-white text-xs">{f.nombre}</span>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <select
                              value={f.tipo_cosecha}
                              onChange={(e) =>
                                handleUpdateFrontType(
                                  f.nombre,
                                  e.target.value as 'Mecanizada' | 'Manual' | 'Mixta'
                                )
                              }
                              className="bg-[#070C14] border border-slate-800 text-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
                            >
                              <option value="Mecanizada">Mecanizada</option>
                              <option value="Manual">Manual</option>
                              <option value="Mixta">Mixta</option>
                            </select>
                          </td>

                          <td className="px-4 py-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                                f.activo
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                  : 'bg-rose-950 text-rose-300 border-rose-800'
                              }`}
                            >
                              {f.activo ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Activo</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                                  <span>Inactivo</span>
                                </>
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => handleToggleFrontActive(f.nombre, f.activo)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                                f.activo
                                  ? 'bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              }`}
                            >
                              {f.activo ? 'Desactivar' : 'Activar'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PATRULLAS DE QUEMA */}
        {activeTab === 'patrullas' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Formulario Agregar Patrulla */}
            <div className="bg-[#0B121E] border border-slate-800 rounded-3xl p-5 shadow-xl">
              <h2 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2 mb-3">
                <Plus className="w-4 h-4" />
                <span>Registrar Nueva Patrulla de Quema</span>
              </h2>

              <form onSubmit={handleCreatePatrol} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Nombre de la Patrulla (ej: Patrulla Eco)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Patrulla Eco"
                    value={newPatrolName}
                    onChange={(e) => setNewPatrolName(e.target.value)}
                    className="w-full bg-[#070C14] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Código de Vehículo (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="UNI-405"
                    value={newPatrolVehicle}
                    onChange={(e) => setNewPatrolVehicle(e.target.value)}
                    className="w-full bg-[#070C14] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={isSubmittingPatrol}
                    className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition shadow-lg shadow-orange-950/50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isSubmittingPatrol ? 'Guardando...' : 'Agregar Patrulla'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Lista / Tabla de Patrullas */}
            <div className="bg-[#0B121E] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#070C14] border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-4">Patrulla</th>
                      <th className="px-4 py-4">Vehículo</th>
                      <th className="px-4 py-4">Estado Operativo</th>
                      <th className="px-4 py-4 text-center">Estado</th>
                      <th className="px-5 py-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {patrols.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-10 text-slate-500">
                          No hay patrullas registradas aún.
                        </td>
                      </tr>
                    ) : (
                      patrols.map((p) => (
                        <tr key={p.nombre} className="hover:bg-slate-900/40 transition">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-orange-950/60 border border-orange-800/60 flex items-center justify-center font-bold text-orange-300 text-xs">
                                <Truck className="w-4 h-4" />
                              </div>
                              <span className="font-bold text-white text-xs">{p.nombre}</span>
                            </div>
                          </td>

                          <td className="px-4 py-4 font-mono text-slate-300 text-xs">
                            {p.codigo_vehiculo || <span className="text-slate-600 italic">Sin código</span>}
                          </td>

                          <td className="px-4 py-4">
                            <select
                              value={p.estado}
                              onChange={(e) =>
                                handleUpdatePatrolStatus(
                                  p.nombre,
                                  e.target.value as 'DISPONIBLE' | 'EN_FRENTE' | 'EN_QUEMA'
                                )
                              }
                              className="bg-[#070C14] border border-slate-800 text-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-orange-500 cursor-pointer"
                            >
                              <option value="DISPONIBLE">DISPONIBLE</option>
                              <option value="EN_FRENTE">EN FRENTE</option>
                              <option value="EN_QUEMA">EN QUEMA</option>
                            </select>
                          </td>

                          <td className="px-4 py-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                                p.activo
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                  : 'bg-rose-950 text-rose-300 border-rose-800'
                              }`}
                            >
                              {p.activo ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Activa</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                                  <span>Inactiva</span>
                                </>
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => handleTogglePatrolActive(p.nombre, p.activo)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                                p.activo
                                  ? 'bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              }`}
                            >
                              {p.activo ? 'Desactivar' : 'Activar'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
