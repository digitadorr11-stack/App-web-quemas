'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserProfile, ROLES_CONFIG } from '@/lib/types';
import {
  Flame,
  FilePlus2,
  Truck,
  Smartphone,
  Users,
  Layers,
  MapPin,
  LogOut,
  X,
  ShieldAlert,
  BarChart3,
  ClipboardList,
  ChevronDown,
  Home,
} from 'lucide-react';

interface SidebarProps {
  currentUser: UserProfile;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

interface NavItem {
  href?: string;
  label: string;
  roles: string[];
  proximamente?: boolean;
}

interface NavSection {
  id: string;
  title: string;
  icon: React.ElementType;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    id: 'operacion',
    title: 'Quemas',
    icon: Flame,
    items: [
      { href: '/', label: 'Panel de Quemas', roles: ['admin', 'digitador', 'jefatura', 'supervisor_quemas', 'supervisor_frente', 'patrulla'] },
      { href: '/quemas/nueva', label: 'Nueva Solicitud', roles: ['supervisor_frente', 'supervisor_quemas', 'digitador', 'admin'] },
      { href: '/quemas', label: 'Tablero de Despacho', roles: ['supervisor_quemas', 'digitador', 'admin', 'jefatura', 'supervisor_frente'] },
      { href: '/campo', label: 'Vista de Campo', roles: ['patrulla', 'supervisor_quemas', 'digitador', 'admin'] },
      { label: 'Quemas Criminales', roles: ['admin', 'digitador', 'jefatura', 'supervisor_quemas'], proximamente: true },
    ],
  },
  {
    id: 'supervision',
    title: 'Supervisión & Control',
    icon: ClipboardList,
    items: [
      { label: 'Reportes & KPIs', roles: ['admin', 'digitador', 'jefatura'], proximamente: true },
      { label: 'Bitácora de Auditoría', roles: ['admin', 'digitador'], proximamente: true },
    ],
  },
  {
    id: 'administracion',
    title: 'Administración & Maestros',
    icon: Layers,
    items: [
      { href: '/constantes', label: 'Constantes Operativas', roles: ['admin', 'digitador'] },
      { href: '/fincas', label: 'Fincas & Lotes', roles: ['admin', 'digitador'] },
      { href: '/usuarios', label: 'Gestión de Usuarios', roles: ['admin', 'digitador'] },
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

  const seccionActiva = SECTIONS.find((s) => s.items.some((i) => i.href === pathname))?.id || 'operacion';
  const [abierto, setAbierto] = useState<string>(seccionActiva);

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1B5E3F] flex flex-col transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-14 flex items-center gap-2.5 px-4 shrink-0">
          <div className="w-8 h-8 rounded bg-white flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-[13px] font-bold text-white leading-tight truncate">Ingenio La Unión</p>
          <button onClick={onClose} className="ml-auto lg:hidden text-emerald-200 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <Link
          href="/"
          className={`flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium border-y border-emerald-900/30 ${
            pathname === '/' ? 'bg-white text-[#1B5E3F] font-semibold' : 'text-white/90 hover:bg-black/10'
          }`}
        >
          <Home className="w-4 h-4 shrink-0" />
          Inicio
        </Link>

        <nav className="flex-1 overflow-y-auto">
          {SECTIONS.map((section) => {
            const items = section.items.filter((item) => item.roles.includes(currentUser.rol));
            if (items.length === 0) return null;
            const Icon = section.icon;
            const expandido = abierto === section.id;

            return (
              <div key={section.id} className="border-b border-emerald-900/30">
                <button
                  onClick={() => setAbierto(expandido ? '' : section.id)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium transition ${
                    expandido ? 'bg-black/10 text-white' : 'text-white/90 hover:bg-black/10'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-left">{section.title}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandido ? 'rotate-180' : ''}`} />
                </button>

                {expandido && (
                  <div className="bg-black/10 py-1">
                    {items.map((item) => {
                      const activo = item.href ? pathname === item.href : false;

                      if (item.proximamente || !item.href) {
                        return (
                          <div
                            key={item.label}
                            className="flex items-center gap-2 pl-11 pr-4 py-2 text-[12.5px] text-white/40 cursor-not-allowed"
                          >
                            <span className="flex-1">{item.label}</span>
                            <span className="text-[8px] font-bold uppercase tracking-wide bg-black/30 text-white/60 px-1.5 py-0.5 rounded">
                              Pronto
                            </span>
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`block pl-11 pr-4 py-2 text-[12.5px] transition ${
                            activo ? 'bg-white text-[#1B5E3F] font-semibold mx-2 rounded' : 'text-white/85 hover:bg-black/10'
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="border-t border-emerald-900/30 p-3 shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded bg-black/10">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
              {iniciales(currentUser.nombre_completo)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-white truncate">{currentUser.nombre_completo}</p>
              <p className="text-[10px] text-emerald-200/80 truncate">{roleInfo.label}</p>
            </div>
            <button
              onClick={onLogout}
              className="w-7 h-7 rounded flex items-center justify-center text-emerald-200 hover:text-white hover:bg-black/20 transition shrink-0"
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
