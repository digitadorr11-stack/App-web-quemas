'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserProfile, ROLES_CONFIG } from '@/lib/types';
import { Flame, FilePlus2, Truck, Smartphone, Users, Layers, MapPin, LogOut, X, ShieldAlert, BarChart3, ClipboardList } from 'lucide-react';

interface SidebarProps {
  currentUser: UserProfile;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

interface NavItem {
  href?: string;
  label: string;
  icon: React.ElementType;
  roles: string[];
  proximamente?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    title: 'Operación de Quemas',
    items: [
      { href: '/', label: 'Quemas Programadas', icon: Flame, roles: ['admin', 'digitador', 'jefatura', 'supervisor_quemas', 'supervisor_frente', 'patrulla'] },
      { href: '/quemas/nueva', label: 'Nueva Solicitud', icon: FilePlus2, roles: ['supervisor_frente', 'supervisor_quemas', 'digitador', 'admin'] },
      { href: '/quemas', label: 'Tablero de Despacho', icon: Truck, roles: ['supervisor_quemas', 'digitador', 'admin', 'jefatura', 'supervisor_frente'] },
      { href: '/campo', label: 'Vista de Campo', icon: Smartphone, roles: ['patrulla', 'supervisor_quemas', 'digitador', 'admin'] },
      { label: 'Quemas Criminales', icon: ShieldAlert, roles: ['admin', 'digitador', 'jefatura', 'supervisor_quemas'], proximamente: true },
    ],
  },
  {
    title: 'Supervisión & Control',
    items: [
      { label: 'Reportes & KPIs', icon: BarChart3, roles: ['admin', 'digitador', 'jefatura'], proximamente: true },
      { label: 'Bitácora de Auditoría', icon: ClipboardList, roles: ['admin', 'digitador'], proximamente: true },
    ],
  },
  {
    title: 'Administración & Maestros',
    items: [
      { href: '/constantes', label: 'Constantes Operativas', icon: Layers, roles: ['admin', 'digitador'] },
      { href: '/fincas', label: 'Fincas & Lotes', icon: MapPin, roles: ['admin', 'digitador'] },
      { href: '/usuarios', label: 'Gestión de Usuarios', icon: Users, roles: ['admin', 'digitador'] },
    ],
  },
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

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#064e3b] flex flex-col transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center gap-3 px-5 border-b border-emerald-900/60 shrink-0">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
            <Flame className="w-4.5 h-4.5 text-amber-500" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-white leading-tight truncate">Ingenio La Unión</p>
            <p className="text-[10px] text-emerald-300/80 truncate">Control Operativo de Quemas</p>
          </div>
          <button onClick={onClose} className="ml-auto lg:hidden text-emerald-300 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {SECTIONS.map((section) => {
            const items = section.items.filter((item) => item.roles.includes(currentUser.rol));
            if (items.length === 0) return null;
            return (
              <div key={section.title}>
                <p className="px-2.5 pb-2 text-[10px] uppercase tracking-widest text-emerald-400/70 font-bold">{section.title}</p>
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const activo = item.href ? pathname === item.href : false;

                    if (item.proximamente || !item.href) {
                      return (
                        <div
                          key={item.label}
                          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium text-emerald-100/40 cursor-not-allowed"
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="flex-1">{item.label}</span>
                          <span className="text-[8px] font-bold uppercase tracking-wide bg-emerald-900/70 text-emerald-400 px-1.5 py-0.5 rounded">
                            Pronto
                          </span>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition ${
                          activo ? 'bg-white text-emerald-800 font-semibold shadow-sm' : 'text-emerald-100/90 hover:bg-emerald-900/50'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-emerald-900/60 p-3 shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-emerald-900/40">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
              {iniciales(currentUser.nombre_completo)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-white truncate">{currentUser.nombre_completo}</p>
              <p className="text-[10px] text-emerald-300/80 truncate">{roleInfo.label}</p>
            </div>
            <button
              onClick={onLogout}
              className="w-7 h-7 rounded-md bg-emerald-900/60 hover:bg-rose-900/60 flex items-center justify-center text-emerald-300 hover:text-rose-300 transition shrink-0"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
