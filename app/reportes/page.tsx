'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { BurnRequest, UserProfile, ROLE_DETAILS, Front } from '@/lib/types';
import { storageService } from '@/lib/storageService';
import { INITIAL_USERS } from '@/lib/mockData';
import { exportToExcel, exportToPDF } from '@/lib/exportUtils';
import {
  BarChart3,
  Flame,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Weight,
  Download,
  FileSpreadsheet,
  FileText,
  MapPin,
  Shield,
  TrendingUp,
  User,
  ShieldCheck,
  Users,
  ShieldAlert,
} from 'lucide-react';

export default function ReportesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => storageService.getActiveUser() || INITIAL_USERS[0]);
  const [allBurns, setAllBurns] = useState<BurnRequest[]>([]);
  const [userBurns, setUserBurns] = useState<BurnRequest[]>([]);
  const [fronts, setFronts] = useState<Front[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    let user = storageService.getActiveUser();
    if (!user) {
      user = INITIAL_USERS[0];
      storageService.setActiveUser(user);
    }
    setCurrentUser(user);

    setIsLoading(true);
    const [all, userSpecific, fList] = await Promise.all([
      storageService.getBurnRequests(),
      storageService.getBurnRequestsForUser(user),
      storageService.getFronts(),
    ]);
    setAllBurns(all);
    setUserBurns(userSpecific);
    setFronts(fList);
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

  if (!currentUser) return null;

  const isGlobalRole = currentUser.role === 'digitador' || currentUser.role === 'jefatura' || currentUser.role === 'admin';
  const isFrenteRole = currentUser.role === 'supervisor_frente';
  const isPatrullaRole = currentUser.role === 'patrulla';
  const isQuemasRole = currentUser.role === 'supervisor_quemas';

  // Data to display based on permissions
  const activeDataset = isGlobalRole || isQuemasRole ? allBurns : userBurns;

  // Key Metrics
  const total = activeDataset.length;
  const finalizadas = activeDataset.filter((b) => b.status === 'FINALIZADA');
  const canceladas = activeDataset.filter((b) => b.status === 'CANCELADA');
  const enProceso = activeDataset.filter((b) => b.status !== 'FINALIZADA' && b.status !== 'CANCELADA');

  // Criminal Burns Analytics
  const criminalBurns = activeDataset.filter((b) => b.burn_type === 'CRIMINAL');
  const criminalHa = criminalBurns.reduce((acc, b) => acc + (Number(b.area_hectares) || 0), 0);
  const criminalTons = criminalBurns.reduce((acc, b) => acc + (Number(b.estimated_tonnage) || 0), 0);

  const totalHa = activeDataset.reduce((acc, b) => acc + (Number(b.area_hectares) || 0), 0);
  const finalizadasHa = finalizadas.reduce((acc, b) => acc + (Number(b.area_hectares) || 0), 0);
  const totalTons = activeDataset.reduce((acc, b) => acc + (Number(b.estimated_tonnage) || 0), 0);
  const finalizadasTons = finalizadas.reduce((acc, b) => acc + (Number(b.estimated_tonnage) || 0), 0);

  // Averages
  const withReview = activeDataset.filter((b) => b.review_duration_minutes);
  const avgReviewMin = withReview.length > 0
    ? Math.round(withReview.reduce((acc, b) => acc + (b.review_duration_minutes || 0), 0) / withReview.length)
    : 0;

  const withBurnDur = activeDataset.filter((b) => b.burn_duration_minutes);
  const avgBurnMin = withBurnDur.length > 0
    ? Math.round(withBurnDur.reduce((acc, b) => acc + (b.burn_duration_minutes || 0), 0) / withBurnDur.length)
    : 0;

  // Breakdown by FRENTE (Frentes 15, 16, 17, 19, 23, 25)
  const frontStats = useMemo(() => {
    const map: Record<string, { count: number; ha: number; tons: number; finalizadas: number; criminales: number }> = {};
    
    // Seed with all known fronts
    fronts.forEach((f) => {
      map[f.name] = { count: 0, ha: 0, tons: 0, finalizadas: 0, criminales: 0 };
    });

    allBurns.forEach((b) => {
      const fName = b.front_number || 'Frente General';
      if (!map[fName]) map[fName] = { count: 0, ha: 0, tons: 0, finalizadas: 0, criminales: 0 };
      map[fName].count += 1;
      map[fName].ha += Number(b.area_hectares) || 0;
      map[fName].tons += Number(b.estimated_tonnage) || 0;
      if (b.status === 'FINALIZADA') map[fName].finalizadas += 1;
      if (b.burn_type === 'CRIMINAL') map[fName].criminales += 1;
    });

    return Object.entries(map).map(([name, data]) => ({ name, ...data }));
  }, [allBurns, fronts]);

  // Breakdown by PATRULLA / CLAVE
  const patrolStats = useMemo(() => {
    const map: Record<string, { count: number; finalizadas: number; criminales: number; programadas: number; ha: number; totalRevMin: number; revCount: number }> = {};
    allBurns.forEach((b) => {
      const p = b.assigned_patrol_name || 'Sin Asignar';
      if (!map[p]) map[p] = { count: 0, finalizadas: 0, criminales: 0, programadas: 0, ha: 0, totalRevMin: 0, revCount: 0 };
      map[p].count += 1;
      if (b.status === 'FINALIZADA') map[p].finalizadas += 1;
      if (b.burn_type === 'CRIMINAL') map[p].criminales += 1;
      else map[p].programadas += 1;
      map[p].ha += Number(b.area_hectares) || 0;
      if (b.review_duration_minutes) {
        map[p].totalRevMin += b.review_duration_minutes;
        map[p].revCount += 1;
      }
    });
    return Object.entries(map).map(([name, data]) => ({
      name,
      ...data,
      avgRev: data.revCount > 0 ? Math.round(data.totalRevMin / data.revCount) : 0,
    }));
  }, [allBurns]);

  return (
    <>
      <Navbar currentUser={currentUser} onUserChange={handleUserChange} />

      <main className="lg:pl-64 flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header Banner */}
        <div className="mb-6 bg-gradient-to-r from-union-950 via-union-900 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-union-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {isGlobalRole
                  ? 'Panel Ejecutivo por Frente y Patrulla'
                  : isFrenteRole
                  ? `Métricas de Rendimiento - ${currentUser.assigned_front || 'Mi Frente'}`
                  : isPatrullaRole
                  ? `Métricas Operativas - ${currentUser.assigned_patrol_name || 'Mi Patrulla'}`
                  : 'Métricas de Despacho de Quemas'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
              {isGlobalRole
                ? 'Reportes y KPIs por Frente y Cuadrilla de Quema'
                : isFrenteRole
                ? `Rendimiento de ${currentUser.full_name} (${currentUser.assigned_front})`
                : isPatrullaRole
                ? `Servicios y Tiempos de ${currentUser.full_name}`
                : 'Control y Eficiencia de Quemas'}
            </h1>
            <p className="text-xs sm:text-sm text-union-200 mt-1 max-w-2xl">
              {isGlobalRole
                ? 'Monitoreo enfocado por Frente de Cosecha y Patrulla de Quema. Registro con identificación de Finca y Lote (UM).'
                : isFrenteRole
                ? `Muestra las ${total} quemas correspondientes a tu frente y turno activo.`
                : isPatrullaRole
                ? `Muestra los ${total} servicios atendidos por tu patrulla en terreno.`
                : 'Métricas de asignación y despacho para optimizar los tiempos de respuesta.'}
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => exportToExcel(activeDataset, isGlobalRole ? 'Reporte_General_Quemas' : `Reporte_Personal_${currentUser.username}`)}
              className="px-4 py-2.5 bg-union-800 hover:bg-union-700 text-white font-bold text-xs sm:text-sm rounded-xl border border-union-600 flex items-center gap-2 transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Exportar Excel</span>
            </button>
            <button
              onClick={() => exportToPDF(activeDataset)}
              className="px-4 py-2.5 bg-fire-700 hover:bg-fire-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition"
            >
              <FileText className="w-4 h-4 text-fire-200" />
              <span>Generar PDF</span>
            </button>
          </div>
        </div>

        {/* Personalized KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {isFrenteRole ? 'Quemas de mi Frente' : isPatrullaRole ? 'Servicios de mi Patrulla' : 'Total Quemas Zafra'}
              </span>
              <div className="text-3xl font-black text-gray-900 mt-1">
                {total} <span className="text-xs font-semibold text-emerald-700">({finalizadas.length} cerradas)</span>
              </div>
              <span className="text-xs text-gray-500 mt-1 block">
                {total > 0 ? ((finalizadas.length / total) * 100).toFixed(0) : 0}% de efectividad
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {isFrenteRole ? 'Área de mi Frente' : isPatrullaRole ? 'Área Liquidada' : 'Área Total Quemada'}
              </span>
              <div className="text-3xl font-black text-gray-900 mt-1">
                {finalizadasHa.toFixed(1)} <span className="text-base font-bold text-gray-500">ha</span>
              </div>
              <span className="text-xs text-gray-500 mt-1 block">
                {(finalizadasHa * 1.4308).toFixed(1)} Manzanas liquidadas
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-union-50 border border-union-200 flex items-center justify-center text-union-800">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {isFrenteRole ? 'Caña de mi Frente' : 'Toneladas Métricas'}
              </span>
              <div className="text-3xl font-black text-gray-900 mt-1">
                {finalizadasTons.toLocaleString()} <span className="text-base font-bold text-gray-500">TM</span>
              </div>
              <span className="text-xs text-gray-500 mt-1 block">
                De {totalTons.toLocaleString()} TM programadas
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Weight className="w-6 h-6" />
            </div>
          </div>

          {/* Quemas Criminales KPI */}
          <div className="bg-white p-5 rounded-2xl border-2 border-red-200 bg-red-50/20 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-red-600 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                Quemas Criminales
              </span>
              <div className="text-3xl font-black text-red-950 mt-1">
                {criminalBurns.length} <span className="text-xs font-bold text-red-700">({criminalHa.toFixed(1)} ha)</span>
              </div>
              <span className="text-xs text-gray-500 mt-1 block font-medium">
                {criminalTons.toLocaleString()} TM en fuego no programado
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-100 border border-red-300 flex items-center justify-center text-red-700">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Tiempos de Operación
              </span>
              <div className="text-2xl font-black text-gray-900 mt-1">
                {avgReviewMin} min <span className="text-xs font-normal text-gray-400">rev</span> / {avgBurnMin} min <span className="text-xs font-normal text-gray-400">quema</span>
              </div>
              <span className="text-xs text-gray-500 mt-1 block">
                Promedio de inspección y liquidación
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
              <Clock className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Global Breakdown Tables: BY FRENTE and BY PATRULLA */}
        {isGlobalRole ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 1. BY FRENTE (Frentes 15, 16, 17, 19, 23, 25) */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-gray-700 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-700" />
                  Consolidado General por Frente de Cosecha
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {frontStats.length} frentes
                </span>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-gray-500 font-bold border-b border-gray-200">
                    <tr>
                      <th className="pb-2">Frente</th>
                      <th className="pb-2 text-center">Quemas</th>
                      <th className="pb-2 text-center text-red-600">Criminales</th>
                      <th className="pb-2 text-right">Área Total</th>
                      <th className="pb-2 text-right">Toneladas</th>
                      <th className="pb-2 text-center">Finalizadas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {frontStats.map((f) => (
                      <tr key={f.name} className="hover:bg-blue-50/50">
                        <td className="py-2.5 font-bold text-blue-900">{f.name}</td>
                        <td className="py-2.5 text-center font-semibold text-gray-700">{f.count}</td>
                        <td className="py-2.5 text-center font-bold text-red-600">
                          {f.criminales > 0 ? (
                            <span className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full text-[10px] font-black">
                              🚨 {f.criminales}
                            </span>
                          ) : (
                            '0'
                          )}
                        </td>
                        <td className="py-2.5 text-right font-medium text-gray-800">{f.ha.toFixed(1)} ha</td>
                        <td className="py-2.5 text-right font-bold text-gray-900">{f.tons.toLocaleString()} TM</td>
                        <td className="py-2.5 text-center font-bold text-emerald-700">
                          {f.finalizadas} / {f.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. BY PATRULLA / CLAVE */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-gray-700 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-fire-600" />
                  Desempeño Operativo por Patrulla de Quema
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {patrolStats.length} patrullas
                </span>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-gray-500 font-bold border-b border-gray-200">
                    <tr>
                      <th className="pb-2">Patrulla</th>
                      <th className="pb-2 text-center">Total</th>
                      <th className="pb-2 text-center">Prog.</th>
                      <th className="pb-2 text-center text-red-600">🚨 Criminal</th>
                      <th className="pb-2 text-center text-emerald-700">Finalizadas</th>
                      <th className="pb-2 text-right">Efectividad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {patrolStats.map((p) => (
                      <tr key={p.name} className="hover:bg-orange-50/50">
                        <td className="py-2.5 font-bold text-orange-950">{p.name}</td>
                        <td className="py-2.5 text-center font-semibold text-gray-700">{p.count}</td>
                        <td className="py-2.5 text-center font-medium text-gray-600">{p.programadas}</td>
                        <td className="py-2.5 text-center font-bold text-red-600">
                          {p.criminales > 0 ? (
                            <span className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full text-[10px] font-black">
                              🚨 {p.criminales}
                            </span>
                          ) : (
                            '0'
                          )}
                        </td>
                        <td className="py-2.5 text-center font-bold text-emerald-700">{p.finalizadas}</td>
                        <td className="py-2.5 text-right font-black text-union-800">
                          {p.count > 0 ? ((p.finalizadas / p.count) * 100).toFixed(0) : 0}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : (
          /* Individual User History Table for Frente or Patrol */
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-union-700" />
              Historial de Quemas de {currentUser.full_name} ({currentUser.assigned_front || currentUser.assigned_patrol_name})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-600 uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">No. Quema</th>
                    <th className="py-2.5 px-3">Tipo</th>
                    <th className="py-2.5 px-3">Frente</th>
                    <th className="py-2.5 px-3">Finca</th>
                    <th className="py-2.5 px-3">Lote / UM</th>
                    <th className="py-2.5 px-3 text-right">Área (ha)</th>
                    <th className="py-2.5 px-3 text-right">Toneladas</th>
                    <th className="py-2.5 px-3">Patrulla</th>
                    <th className="py-2.5 px-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {userBurns.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="py-2 px-3 font-bold text-gray-900">{b.burn_number}</td>
                      <td className="py-2 px-3">
                        {b.burn_type === 'CRIMINAL' ? (
                          <span className="text-[10px] font-black uppercase bg-red-600 text-white px-2 py-0.5 rounded-md animate-pulse">
                            🚨 Criminal
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                            Programada
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-semibold text-blue-800">{b.front_number}</td>
                      <td className="py-2 px-3 text-gray-800 font-medium">{b.farm_name}</td>
                      <td className="py-2 px-3 text-union-800 font-bold">{b.lote_um ? `Lote ${b.lote_um}` : '—'}</td>
                      <td className="py-2 px-3 text-right font-medium">{b.area_hectares} ha</td>
                      <td className="py-2 px-3 text-right font-bold">{b.estimated_tonnage} TM</td>
                      <td className="py-2 px-3 text-gray-700">{b.assigned_patrol_name || 'Sin Asignar'}</td>
                      <td className="py-2 px-3">
                        <span className="font-semibold text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        </div>
      </main>
    </>
  );
}
