'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserProfile, ROLES_CONFIG } from '@/lib/types';
import { Flame, FilePlus2, Truck, Smartphone, Users, Layers, MapPin, LogOut, X } from 'lucide-react';

interface SidebarProps {
  currentUser: UserProfile;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const NAV_ITEMS: { href: string; label: string; icon: React.ElementType; roles: string[] }[] = [
  { href: '/quemas/nueva', label: 'Nueva Solicitud', icon: FilePlus2, roles: ['supervisor_frente', 'supervisor_quemas', 'digitador', 'admin'] },
  { href: '/quemas', label: 'Tablero de Despacho', icon: Truck, roles: ['supervisor_quemas', 'digitador', 'admin', 'jefatura', 'supervisor_frente'] },
  { href: '/campo', label: 'Vista de Campo', icon: Smartphone, roles: ['patrulla', 'supervisor_quemas', 'digitador', 'admin'] },
  { href: '/usuarios', label: 'Usuarios', icon: Users, roles: ['admin', 'digitador'] },
  { href: '/constantes', label: 'Constantes Operativas', icon: Layers, roles: ['admin', 'digitador'] },
  { href: '/fincas', label: 'Fincas & Lotes', icon: MapPin, roles: ['admin', 'digitador'] },
];

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  return ((partes[0]?.[0] || '') + (partes[1]?.[0] || '')).toUpperCase();
}

export const Sidebar: React.FC<SidebarProps> = ({ currentUser, open, onClose, onLogout }) => {
  const pathname = usePathname();
  const roleInfo = ROLES_CONFIG[currentUser.rol] || {
    label: currentUser.rol,
    badgeColor: 'bg-slate-900 text-slate-300 border-slate-700',
    description: '',
  };
  const items = NAV_ITEMS.filter((item) => item.roles.includes(currentUser.rol));

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-[#111B2C] to-[#080B12] border-r border-slate-800/80 flex flex-col transition-transform duration-200 shadow-[inset_-1px_0_0_rgba(255,255,255,0.02)] ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center gap-2.5 px-4 border-b border-slate-800/80 shrink-0">
          <div className="w-8 h-8 rounded-md bg-amber-500/10 border border-amber-700/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-white leading-tight truncate">Ingenio La Unión</p>
            <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Control de Quemas</p>
          </div>
          <button onClick={onClose} className="ml-auto lg:hidden text-slate-500 hover:text-slate-300 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          <p className="px-2.5 pb-1.5 pt-1 text-[10px] uppercase tracking-widest text-slate-600 font-bold">Operación</p>
          {items.map((item) => {
            const activo = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition border ${
                  activo
                    ? 'bg-amber-500/10 text-amber-400 border-amber-800/50'
                    : 'text-slate-400 border-transparent hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800/80 p-3 shrink-0 space-y-2">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-md bg-slate-900/60 border border-slate-800/60">
            <div className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center text-[11px] font-bold text-slate-300 shrink-0">
              {iniciales(currentUser.nombre_completo)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-white truncate">{currentUser.nombre_completo}</p>
              <p className="text-[10px] text-slate-500 truncate">{roleInfo.label}</p>
            </div>
          </div>
          {(currentUser.frente_asignado || currentUser.patrulla_asignada) && (
            <div className="flex flex-wrap gap-1.5 px-1">
              {currentUser.frente_asignado && (
                <span className="text-[9px] px-2 py-0.5 rounded-md font-bold bg-blue-950/60 text-blue-400 border border-blue-900/60">
                  {currentUser.frente_asignado}
                </span>
              )}
              {currentUser.patrulla_asignada && (
                <span className="text-[9px] px-2 py-0.5 rounded-md font-bold bg-amber-950/60 text-amber-400 border border-amber-900/60">
                  {currentUser.patrulla_asignada}
                </span>
              )}
            </div>
          )}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900/60 text-slate-400 hover:text-rose-400 text-[12px] font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
};
