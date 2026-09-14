'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/authService';
import { UserProfile, ROLES_CONFIG } from '@/lib/types';
import { Flame, LogOut, User, Sparkles, Shield, Clock, CheckCircle2, ChevronRight, Activity, Users } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const user = await authService.getCurrentUserProfile();
        if (!user) {
          router.push('/login');
          return;
        }

        if (!user.activo) {
          router.push('/login');
          return;
        }

        setCurrentUser(user);
      } catch (err) {
        console.error('Error cargando sesión:', err);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, [router]);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070C14] flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide">Cargando plataforma operativa...</p>
      </div>
    );
  }

  if (!currentUser) return null;

  const roleInfo = ROLES_CONFIG[currentUser.rol] || {
    label: currentUser.rol,
    badgeColor: 'bg-slate-900 text-slate-300 border-slate-700',
    description: 'Rol en la plataforma',
  };

  return (
    <div className="min-h-screen bg-[#070C14] text-slate-100 flex flex-col font-sans">
      {/* Header / Navbar */}
      <header className="bg-[#0B121E] border-b border-slate-800/80 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 border border-emerald-400/30 flex items-center justify-center shadow-lg shadow-emerald-950/50">
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white leading-tight">
              Ingenio La Unión
            </h1>
            <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              Control de Quemas en Tiempo Real
            </p>
          </div>
        </div>

        {/* User Badge and Logout */}
        <div className="flex items-center gap-4">
          {(currentUser.rol === 'admin' || currentUser.rol === 'digitador') && (
            <Link
              href="/usuarios"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/80 text-purple-300 text-xs font-bold transition shadow-sm"
            >
              <Users className="w-4 h-4" />
              <span>Maestro de Usuarios</span>
            </Link>
          )}

          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-200">
              {currentUser.nombre_completo}
            </span>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${roleInfo.badgeColor}`}>
                {roleInfo.label}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-300 text-xs font-semibold transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 space-y-8">
        
        {/* Banner de Bienvenida y Estado */}
        <div className="bg-gradient-to-r from-emerald-950/60 via-[#0B121E] to-[#0B121E] border border-emerald-500/30 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plataforma Limpia v2.0 · Fase 1 Completada</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Bienvenido, {currentUser.nombre_completo}
            </h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Sistema de trazabilidad operativa y medición de tiempos en tiempo real para la zafra de Ingenio La Unión.
            </p>
          </div>
        </div>

        {/* Tarjeta de Perfil y Rol Actual */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0B121E] border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Tu Perfil</p>
                <p className="text-sm font-bold text-white">{currentUser.nombre_completo}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Correo:</span>
                <span className="text-slate-200 font-mono text-[11px]">{currentUser.correo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rol:</span>
                <span className="text-emerald-400 font-bold">{roleInfo.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estado:</span>
                <span className="text-emerald-400 font-bold">Activo / Autorizado</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0B121E] border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Métricas de Tiempo</p>
                <p className="text-sm font-bold text-white">Cronología Unificada</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
              Medición de tiempo de solicitud, hora planificada, asignación de despacho, esperas en frente con motivo, revisión y combustión efectiva.
            </p>
          </div>

          <div className="bg-[#0B121E] border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Próximo Módulo</p>
                <p className="text-sm font-bold text-white">Fase 2: Maestros</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
              Gestión de usuarios y asignación de roles para el Digitador, catálogo de fincas, lotes, frentes y cuadrillas de quema.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
