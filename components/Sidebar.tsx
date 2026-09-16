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
  icon: React.ElementType;
  roles: string[];
  proximamente?: boolean;
}

interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    id: 'operacion',
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
    id: 'supervision',
    title: 'Supervisión & Control',
    items: [
      { label: 'Reportes & KPIs', icon: BarChart3, roles: ['admin', 'digitador', 'jefatura'], proximamente: true },
      { label: 'Bitácora de Auditoría', icon: ClipboardList, roles: ['admin', 'digitador'], proximamente: true },
    ],
  },
  {
    id: 'administracion',
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
    badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
    description: '',
  };

  const seccionActiva = SECTIONS.find((s) => s.items.some((i) => i.href === pathname))?.id || 'operacion';
  const [abierto, setAbierto] = useState<string>(seccionActiva);

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-union-950 flex flex-col shadow-panel transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center gap-2.5 px-4 shrink-0 border-b border-white/10">
          <div className="w-8 h-8 rounded-md bg-union-700 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-white leading-tight truncate">Ingenio La Unión</p>
            <p className="text-[10.5px] text-union-300/80 truncate">Control Operativo de Quemas</p>
          </div>
          <button onClick={onClose} className="ml-auto lg:hidden text-union-300 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {SECTIONS.map((section) => {
            const items = section.items.filter((item) => item.roles.includes(currentUser.rol));
            if (items.length === 0) return null;
            const expandido = abierto === section.id;

            return (
              <div key={section.id} className="border-b border-white/5 px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => setAbierto(expandido ? '' : section.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-[10.5px] font-bold uppercase tracking-wider transition cursor-pointer ${
                    expandido ? 'text-union-100' : 'text-union-400/80 hover:text-union-200'
                  }`}
                >
                  <span className="flex-1 text-left">{section.title}</span>
                  <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${expandido ? 'rotate-180' : ''}`} />
                </button>

                {expandido && (
                  <div className="space-y-0.5 pb-1.5">
                    {items.map((item) => {
                      const activo = item.href ? pathname === item.href : false;
                      const ItemIcon = item.icon;

                      if (item.proximamente || !item.href) {
                        return (
                          <div
                            key={item.label}
                            className="flex items-center gap-2.5 pl-2.5 pr-2 py-2 rounded-md text-[12.5px] text-union-300/40 cursor-not-allowed"
                          >
                            <ItemIcon className="w-4 h-4 shrink-0" />
                            <span className="flex-1 truncate">{item.label}</span>
                            <span className="text-[8px] font-semibold uppercase tracking-wide bg-black/30 text-union-300/70 px-1.5 py-0.5 rounded shrink-0">
                              Pronto
                            </span>
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-2.5 pl-2.5 pr-2 py-2 rounded-md text-[12.5px] font-medium border-l-2 transition ${
                            activo
                              ? 'bg-union-800/70 border-amber-400 text-white font-semibold'
                              : 'border-transparent text-union-200/80 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <ItemIcon className={`w-4 h-4 shrink-0 ${activo ? 'text-amber-400' : 'text-union-300/70'}`} />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3 shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-md bg-white/5">
            <div className="w-8 h-8 rounded-full bg-union-700 flex items-center justify-center text-[11px] font-semibold text-white shrink-0">
              {iniciales(currentUser.nombre_completo)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-white truncate">{currentUser.nombre_completo}</p>
              <p className="text-[10px] text-union-300/80 truncate">{roleInfo.label}</p>
            </div>
            <button
              onClick={onLogout}
              className="w-7 h-7 rounded flex items-center justify-center text-union-300 hover:text-white hover:bg-white/10 transition shrink-0"
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
