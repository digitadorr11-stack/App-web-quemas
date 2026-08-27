'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { UserProfile, ROLE_DETAILS } from '@/lib/types';
import { storageService } from '@/lib/storageService';
import { INITIAL_USERS } from '@/lib/mockData';
import { ShieldAlert, Flame, Plus, Sparkles, AlertTriangle } from 'lucide-react';

export default function QuemasCriminalesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let user = storageService.getActiveUser();
    if (!user) {
      user = INITIAL_USERS[0];
      storageService.setActiveUser(user);
    }
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  const handleUserChange = (user: UserProfile) => {
    setCurrentUser(user);
    storageService.setActiveUser(user);
  };

  if (!currentUser || isLoading) {
    return null;
  }

  const roleMeta = ROLE_DETAILS[currentUser.role];

  return (
    <>
      <Navbar currentUser={currentUser} onUserChange={handleUserChange} />

      <main className="lg:pl-64 flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Banner Principal del Módulo */}
        <div className="mb-6 bg-gradient-to-r from-red-950 via-rose-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-red-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${roleMeta.badgeColor}`}>
                {roleMeta.label}
              </span>
              <span className="text-xs text-red-200">({currentUser.full_name})</span>
              <span className="text-[10px] bg-red-500/30 text-red-200 border border-red-400/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Módulo Independiente
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1.5 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-red-400 animate-pulse" />
              <span>Gestión de Quemas Criminales</span>
            </h1>

            <p className="text-xs sm:text-sm text-red-100 mt-1 max-w-2xl">
              Módulo exclusivo y separado para el control, reporte inmediato, combate, liquidación y auditoría de incendios no programados.
            </p>
          </div>
        </div>

        {/* Espacio en Blanco Listo para Configurar */}
        <div className="bg-white rounded-3xl border-2 border-dashed border-red-200 p-12 text-center shadow-xs flex flex-col items-center justify-center min-h-[420px]">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mb-4 shadow-sm">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>

          <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
            Módulo de Quemas Criminales
          </h2>

          <p className="text-xs sm:text-sm text-gray-500 max-w-lg mt-2 font-medium leading-relaxed">
            Este espacio está completamente independizado y listo en blanco para implementar el proceso, formulario y flujo operativo exclusivo que definiremos a continuación.
          </p>

          <div className="mt-6 flex items-center gap-2 text-xs font-bold text-red-800 bg-red-50 px-4 py-2 rounded-xl border border-red-200">
            <Sparkles className="w-4 h-4 text-red-600" />
            <span>Espacio reservado y listo para estructurar</span>
          </div>
        </div>

        </div>
      </main>
    </>
  );
}
