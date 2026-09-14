'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { UserProfile, ROLE_DETAILS } from '@/lib/types';
import { storageService } from '@/lib/storageService';
import { User, ShieldCheck, Mail, KeyRound, CheckCircle, Clock, Sparkles } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        let user = storageService.getActiveUser();
        if (!user) {
          user = await storageService.handleAuthSession();
        }

        if (!user) {
          router.push('/login');
          return;
        }

        setCurrentUser(user);
      } catch (err) {
        console.error('Error validating session:', err);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070C14] flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide">Cargando plataforma...</p>
      </div>
    );
  }

  if (!currentUser) return null;

  const roleInfo = ROLE_DETAILS[currentUser.role] || {
    label: currentUser.role,
    badgeColor: 'bg-slate-800 text-slate-200 border-slate-700',
    description: 'Rol en el sistema',
  };

  return (
    <div className="min-h-screen bg-[#070C14] text-slate-100 flex flex-col font-sans">
      <Navbar currentUser={currentUser} />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-10 flex flex-col justify-center items-center space-y-8">
        {/* Welcome Banner */}
        <div className="text-center space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistema Reiniciado Limpio</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Bienvenido, {currentUser.full_name}
          </h2>
          <p className="text-sm text-slate-400">
            La plataforma ha sido reseteada por completo. Solo se encuentran activos el módulo de autenticación y esta página principal limpia.
          </p>
        </div>

        {/* User Card */}
        <div className="w-full max-w-md bg-[#0B121E] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-800/80">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                {currentUser.full_name}
              </h3>
              <p className="text-xs text-slate-400">{currentUser.email}</p>
              <div className="mt-1">
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${roleInfo.badgeColor}`}>
                  {roleInfo.label}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                Correo
              </span>
              <span className="text-slate-200 font-mono">{currentUser.email}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                Rol Asignado
              </span>
              <span className="text-slate-200 font-bold">{currentUser.role}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-slate-500" />
                Estado
              </span>
              <span className={`font-bold ${currentUser.active ? 'text-emerald-400' : 'text-amber-400'}`}>
                {currentUser.active ? 'Activo' : 'Pendiente de Aprobación'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                ID Usuario
              </span>
              <span className="text-slate-400 font-mono text-[10px] truncate max-w-[180px]">
                {currentUser.id}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-center text-slate-500 italic">
            {roleInfo.description}
          </p>
        </div>
      </main>
    </div>
  );
}
