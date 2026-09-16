'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/authService';
import { supabase } from '@/lib/supabaseClient';
import { FarmLoteCatalog, UserProfile } from '@/lib/types';
import {
  MapPin,
  Search,
  Plus,
  Upload,
  Download,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Filter,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Database,
  Layers,
  Sparkles,
  Edit2,
  Trash2,
  AlertCircle,
} from 'lucide-react';

const ITEMS_PER_PAGE = 25;

export default function FincasPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lista de lotes
  const [lotes, setLotes] = useState<FarmLoteCatalog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // Modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Formulario lote individual
  const [formFinca, setFormFinca] = useState('');
  const [formLote, setFormLote] = useState('');
  const [formHa, setFormHa] = useState('');
  const [formMz, setFormMz] = useState('');
  const [formVariedad, setFormVariedad] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para Edición de Lote
  const [editingLote, setEditingLote] = useState<FarmLoteCatalog | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFinca, setEditFinca] = useState('');
  const [editLote, setEditLote] = useState('');
  const [editHa, setEditHa] = useState('');
  const [editMz, setEditMz] = useState('');
  const [editVariedad, setEditVariedad] = useState('');
  const [editActivo, setEditActivo] = useState(true);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Carga Masiva (Texto CSV / Tab)
  const [bulkDataText, setBulkDataText] = useState('');
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Convertidor Ha <-> Mz en tiempo real en formulario nuevo
  const handleHaChange = (val: string) => {
    setFormHa(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setFormMz((num * 1.4308).toFixed(2));
    } else {
      setFormMz('');
    }
  };

  const handleMzChange = (val: string) => {
    setFormMz(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setFormHa((num * 0.698896).toFixed(2));
    } else {
      setFormHa('');
    }
  };

  // Convertidores para formulario de edición
  const handleEditHaChange = (val: string) => {
    setEditHa(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setEditMz((num * 1.4308).toFixed(2));
    } else {
      setEditMz('');
    }
  };

  const handleEditMzChange = (val: string) => {
    setEditMz(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setEditHa((num * 0.698896).toFixed(2));
    } else {
      setEditHa('');
    }
  };

  const handleOpenEdit = (item: FarmLoteCatalog) => {
    setEditingLote(item);
    setEditFinca(item.finca);
    setEditLote(item.lote);
    setEditHa(item.area_ha ? item.area_ha.toString() : '');
    setEditMz(item.area_mz ? item.area_mz.toString() : '');
    setEditVariedad(item.variedad || '');
    setEditActivo(item.activo !== false);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !editingLote?.id || !editFinca.trim() || !editLote.trim()) return;

    try {
      setIsSubmittingEdit(true);
      const payload = {
        finca: editFinca.trim(),
        lote: editLote.trim(),
        area_ha: parseFloat(editHa) || 0,
        area_mz: parseFloat(editMz) || 0,
        variedad: editVariedad.trim().toUpperCase() || null,
        activo: editActivo,
      };

      const { error } = await supabase
        .from('catalogo_fincas_lotes')
        .update(payload)
        .eq('id', editingLote.id);

      if (error) {
        if (error.code === '23505') {
          throw new Error(`El lote "${payload.lote}" ya existe en la finca "${payload.finca}".`);
        }
        throw error;
      }

      showToast(`Lote ${payload.finca} - ${payload.lote} actualizado con éxito`);
      setIsEditModalOpen(false);
      setEditingLote(null);
      loadLotes();
    } catch (err: any) {
      alert(`Error al actualizar lote: ${err.message}`);
    } finally {
      setIsSubmittingEdit(false);
    }
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
        await loadLotes();
      } catch (err) {
        console.error('Error inicializando catálogo de fincas:', err);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    initPage();

    if (supabase) {
      const channel = supabase
        .channel('realtime_catalogo_fincas')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'catalogo_fincas_lotes' },
          () => loadLotes()
        )
        .subscribe();

      return () => {
        supabase?.removeChannel(channel);
      };
    }
  }, [router]);

  const loadLotes = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('catalogo_fincas_lotes')
      .select('*')
      .order('finca', { ascending: true })
      .order('lote', { ascending: true });

    if (!error && data) {
      setLotes(
        data.map((row) => ({
          id: row.id,
          finca: row.finca,
          lote: row.lote,
          area_ha: Number(row.area_ha || 0),
          area_mz: Number(row.area_mz || 0),
          variedad: row.variedad || '',
          activo: row.activo !== false,
          created_at: row.created_at,
        }))
      );
    }
  };

  // Crear Lote Individual
  const handleCreateLote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !formFinca.trim() || !formLote.trim()) return;

    try {
      setIsSubmitting(true);
      const payload = {
        finca: formFinca.trim(),
        lote: formLote.trim(),
        area_ha: parseFloat(formHa) || 0,
        area_mz: parseFloat(formMz) || 0,
        variedad: formVariedad.trim().toUpperCase() || null,
        activo: true,
      };

      const { error } = await supabase
        .from('catalogo_fincas_lotes')
        .insert(payload);

      if (error) {
        if (error.code === '23505') {
          throw new Error(`El lote "${payload.lote}" de la finca "${payload.finca}" ya existe en el catálogo.`);
        }
        throw error;
      }

      showToast(`Lote ${payload.finca} - ${payload.lote} registrado`);
      setIsCreateModalOpen(false);
      setFormFinca('');
      setFormLote('');
      setFormHa('');
      setFormMz('');
      setFormVariedad('');
      loadLotes();
    } catch (err: any) {
      alert(`Error guardando lote: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Carga Masiva (CSV / Excel copiado)
  const handleProcessBulk = async () => {
    if (!supabase || !bulkDataText.trim()) return;

    try {
      setIsProcessingBulk(true);
      const lines = bulkDataText.trim().split('\n');
      const recordsToInsert: any[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Omitir cabecera si existe
        if (i === 0 && (line.toLowerCase().includes('finca') || line.toLowerCase().includes('lote'))) {
          continue;
        }

        // Separadores soportados: coma, punto y coma, tabulador
        let parts = line.split('\t');
        if (parts.length < 2) parts = line.split(';');
        if (parts.length < 2) parts = line.split(',');

        if (parts.length >= 2) {
          const finca = parts[0]?.trim();
          const lote = parts[1]?.trim();
          const ha = parseFloat(parts[2]?.trim() || '0') || 0;
          const mz = parseFloat(parts[3]?.trim() || '0') || (ha > 0 ? Number((ha * 1.4308).toFixed(2)) : 0);
          const variedad = parts[4]?.trim() || null;

          if (finca && lote) {
            recordsToInsert.push({
              finca,
              lote,
              area_ha: ha,
              area_mz: mz,
              variedad,
              activo: true,
            });
          }
        }
      }

      if (recordsToInsert.length === 0) {
        throw new Error('No se encontraron registros válidos. Verifica el formato: Finca, Lote, Ha, Mz, Variedad');
      }

      const { error } = await supabase
        .from('catalogo_fincas_lotes')
        .upsert(recordsToInsert, { onConflict: 'finca,lote' });

      if (error) throw error;

      showToast(`¡Se procesaron ${recordsToInsert.length} lotes con éxito!`);
      setBulkDataText('');
      setIsBulkModalOpen(false);
      loadLotes();
    } catch (err: any) {
      alert(`Error en carga masiva: ${err.message}`);
    } finally {
      setIsProcessingBulk(false);
    }
  };

  // Activar / Desactivar Lote
  const handleToggleLoteActive = async (id: string, currentStatus: boolean) => {
    if (!supabase) return;
    try {
      const newStatus = !currentStatus;
      const { error } = await supabase
        .from('catalogo_fincas_lotes')
        .update({ activo: newStatus })
        .eq('id', id);

      if (error) throw error;
      showToast(newStatus ? 'Lote activado' : 'Lote desactivado');
      loadLotes();
    } catch (err: any) {
      alert(`Error cambiando estado: ${err.message}`);
    }
  };

  // Exportar Catálogo a CSV
  const handleExportCSV = () => {
    if (lotes.length === 0) return;
    const header = 'Finca,Lote,Area_Ha,Area_Mz,Variedad,Estado\n';
    const rows = lotes
      .map(
        (l) =>
          `"${l.finca}","${l.lote}",${l.area_ha},${l.area_mz},"${l.variedad || ''}",${l.activo ? 'ACTIVO' : 'INACTIVO'}`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `catalogo_fincas_lotes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtrado y búsqueda
  const filteredLotes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return lotes.filter((l) => {
      const matchesSearch =
        !q ||
        l.finca.toLowerCase().includes(q) ||
        l.lote.toLowerCase().includes(q) ||
        (l.variedad && l.variedad.toLowerCase().includes(q));

      const matchesStatus =
        activeFilter === 'ALL' ||
        (activeFilter === 'ACTIVE' && l.activo) ||
        (activeFilter === 'INACTIVE' && !l.activo);

      return matchesSearch && matchesStatus;
    });
  }, [lotes, searchQuery, activeFilter]);

  // Paginación
  const totalPages = Math.ceil(filteredLotes.length / ITEMS_PER_PAGE) || 1;
  const paginatedLotes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLotes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLotes, currentPage]);

  // KPIs Totales
  const uniqueFincasCount = useMemo(() => {
    return new Set(lotes.map((l) => l.finca.toLowerCase())).size;
  }, [lotes]);

  const totalHa = useMemo(() => {
    return lotes.reduce((acc, curr) => acc + curr.area_ha, 0).toFixed(2);
  }, [lotes]);

  const totalMz = useMemo(() => {
    return lotes.reduce((acc, curr) => acc + curr.area_mz, 0).toFixed(2);
  }, [lotes]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-600">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-bold text-sm tracking-wide">Cargando Catálogo Agronómico...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
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
          <div className="w-10 h-10 rounded-md bg-blue-700 flex items-center justify-center shadow-card">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-slate-900 leading-tight">
              Catálogo de Fincas y Lotes
            </h1>
            <p className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
              Datos Agronómicos & Áreas (Ingenio La Unión)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <Link
              href="/usuarios"
              className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
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
              className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white shadow"
            >
              Fincas y Lotes
            </Link>
          </nav>

          <span className="hidden sm:inline text-xs font-bold text-slate-600">
            {currentUser?.nombre_completo}
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200">
            {currentUser?.rol.toUpperCase()}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Lotes</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{lotes.length}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fincas Registradas</p>
            <p className="text-2xl font-bold text-blue-600 mt-0.5">{uniqueFincasCount}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Hectáreas</p>
            <p className="text-2xl font-bold text-emerald-600 mt-0.5">{totalHa} <span className="text-xs font-normal text-slate-500">ha</span></p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Manzanas</p>
            <p className="text-2xl font-bold text-amber-600 mt-0.5">{totalMz} <span className="text-xs font-normal text-slate-500">mz</span></p>
          </div>
        </div>

        {/* Toolbar: Buscador, Filtros y Acciones */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Buscador */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por finca, número de lote o variedad..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Filtro de Estado */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={activeFilter}
              onChange={(e) => {
                setActiveFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 text-slate-700 rounded-2xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">Todos los Lotes</option>
              <option value="ACTIVE">Solo Activos</option>
              <option value="INACTIVE">Solo Inactivos</option>
            </select>

            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold py-2.5 px-3 rounded-2xl transition flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Carga Masiva desde Excel o CSV"
            >
              <Upload className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Carga Masiva</span>
            </button>

            <button
              onClick={handleExportCSV}
              disabled={lotes.length === 0}
              className="bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 border border-slate-300 text-xs font-bold py-2.5 px-3 rounded-2xl transition flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Descargar Catálogo a CSV"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Exportar</span>
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-4 rounded-2xl transition shadow-lg shadow-blue-200 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Lote</span>
            </button>
          </div>
        </div>

        {/* Tabla de Fincas y Lotes */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">Finca</th>
                  <th className="px-4 py-4">Lote (U.M.)</th>
                  <th className="px-4 py-4 text-right">Área (Ha)</th>
                  <th className="px-4 py-4 text-right">Área (Mz)</th>
                  <th className="px-4 py-4">Variedad</th>
                  <th className="px-4 py-4 text-center">Estado</th>
                  <th className="px-5 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedLotes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-500">
                      No se encontraron lotes que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  paginatedLotes.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-slate-900 text-xs">{item.finca}</span>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-slate-700">
                        {item.lote}
                      </td>

                      <td className="px-4 py-3.5 text-right font-mono text-emerald-600 font-semibold">
                        {item.area_ha.toFixed(2)}
                      </td>

                      <td className="px-4 py-3.5 text-right font-mono text-amber-600 font-semibold">
                        {item.area_mz.toFixed(2)}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-slate-500 text-[11px]">
                        {item.variedad || <span className="text-slate-400 italic">No esp.</span>}
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            item.activo
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {item.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-600 hover:text-blue-700 border border-slate-300 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                            title="Editar datos del lote"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Editar</span>
                          </button>

                          <button
                            onClick={() => handleToggleLoteActive(item.id!, item.activo!)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition shadow-sm cursor-pointer ${
                              item.activo
                                ? 'bg-rose-50 hover:bg-rose-900 border border-rose-200 text-rose-700'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }`}
                          >
                            {item.activo ? 'Desactivar' : 'Activar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginador */}
          <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              Mostrando{' '}
              <span className="font-bold text-slate-900">
                {filteredLotes.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{' '}
              a{' '}
              <span className="font-bold text-slate-900">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredLotes.length)}
              </span>{' '}
              de <span className="font-bold text-slate-900">{filteredLotes.length}</span> lotes
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-slate-900 px-2">
                Página {currentPage} de {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL CREAR LOTE INDIVIDUAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Agregar Nuevo Lote</span>
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLote} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Nombre de la Finca *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Finca El Baúl"
                  value={formFinca}
                  onChange={(e) => setFormFinca(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Número / Código de Lote *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Lote 101"
                  value={formLote}
                  onChange={(e) => setFormLote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Área en Hectáreas (Ha)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="12.50"
                    value={formHa}
                    onChange={(e) => handleHaChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Área en Manzanas (Mz)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="17.88"
                    value={formMz}
                    onChange={(e) => handleMzChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Variedad de Caña (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: CP-72-2086"
                  value={formVariedad}
                  onChange={(e) => setFormVariedad(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs py-2 px-5 rounded-xl transition shadow-lg shadow-blue-200"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Lote'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR LOTE EXISTENTE */}
      {isEditModalOpen && editingLote && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" />
                <span>Editar Lote: {editingLote.finca} - {editingLote.lote}</span>
              </h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingLote(null);
                }}
                className="text-slate-500 hover:text-slate-900 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Nombre de la Finca *
                </label>
                <input
                  type="text"
                  required
                  value={editFinca}
                  onChange={(e) => setEditFinca(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Número / Código de Lote *
                </label>
                <input
                  type="text"
                  required
                  value={editLote}
                  onChange={(e) => setEditLote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Área en Hectáreas (Ha)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="12.50"
                    value={editHa}
                    onChange={(e) => handleEditHaChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Área en Manzanas (Mz)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="17.88"
                    value={editMz}
                    onChange={(e) => handleEditMzChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Variedad de Caña
                </label>
                <input
                  type="text"
                  placeholder="Ej: CP-72-2086"
                  value={editVariedad}
                  onChange={(e) => setEditVariedad(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Estado del Lote
                </label>
                <select
                  value={editActivo ? 'true' : 'false'}
                  onChange={(e) => setEditActivo(e.target.value === 'true')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="true">Activo (Disponible para Quemas)</option>
                  <option value="false">Inactivo (Deshabilitado)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingLote(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs py-2 px-5 rounded-xl transition shadow-lg shadow-blue-200 cursor-pointer"
                >
                  {isSubmittingEdit ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CARGA MASIVA */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>Carga Masiva de Fincas y Lotes</span>
              </h3>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 transition"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Copia y pega las columnas desde tu Excel o CSV. El orden esperado por fila es:
              <br />
              <code className="bg-slate-50 text-blue-700 px-2 py-0.5 rounded text-[11px] font-mono mt-1 block">
                Finca [tab/coma] Lote [tab/coma] Área_Ha [tab/coma] Área_Mz [tab/coma] Variedad
              </code>
            </p>

            <textarea
              rows={8}
              placeholder={`Finca El Baúl\tLote 101\t12.50\t17.88\tCP-72-2086\nFinca El Baúl\tLote 102\t15.20\t21.75\tCG-96-01\nFinca San Antonio\tLote 01\t10.00\t14.30\tCP-88-1165`}
              value={bulkDataText}
              onChange={(e) => setBulkDataText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
            />

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <span className="text-[11px] text-slate-500">
                {bulkDataText.trim() ? `${bulkDataText.trim().split('\n').length} filas detectadas` : 'Sin datos'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleProcessBulk}
                  disabled={isProcessingBulk || !bulkDataText.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs py-2 px-5 rounded-xl transition shadow-lg shadow-blue-200 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isProcessingBulk ? 'Importando...' : 'Importar a Base de Datos'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
