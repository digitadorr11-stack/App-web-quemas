'use client';

import React from 'react';
import { UserProfile, ROLE_DETAILS } from '@/lib/types';
import { storageService } from '@/lib/storageService';
import { Flame, LogOut, User } from 'lucide-react';

interface NavbarProps {
  currentUser?: UserProfile | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const handleLogout = async () => {
    await storageService.logout();
    window.location.href = '/login';
  };

  const roleInfo = currentUser?.role ? ROLE_DETAILS[currentUser.role] : null;

  return (
    <header className="bg-[#0B121E] border-b border-slate-800 text-white px-6 py-4 flex items-center justify-between shadow-md">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 border border-emerald-400/30 flex items-center justify-center shadow-lg shadow-emerald-950/50">
          <Flame className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-base font-black tracking-tight text-white leading-tight">
            Ingenio La Unión
          </h1>
          <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
            Control de Quemas
          </p>
        </div>
      </div>

      {/* User Session Info & Logout */}
      {currentUser && (
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-200">
              {currentUser.full_name}
            </span>
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-[10px] text-slate-400">
                {currentUser.email}
              </span>
              {roleInfo && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${roleInfo.badgeColor}`}>
                  {roleInfo.label}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-300 text-xs font-semibold transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Cerrar Sesión</span>
          </button>
        </div>
      )}
    </header>
  );
};
