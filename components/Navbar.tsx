'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserProfile, ROLE_DETAILS } from '@/lib/types';
import { INITIAL_USERS } from '@/lib/mockData';
import { storageService } from '@/lib/storageService';
import {
  Flame,
  ShieldCheck,
  BarChart3,
  Users,
  Layers,
  LogOut,
  User,
  ShieldAlert,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Activity,
  Radio,
} from 'lucide-react';
import FlameLogo from '@/components/FlameLogo';

interface NavbarProps {
  currentUser?: UserProfile | null;
  onUserChange?: (user: UserProfile) => void;
  onResetDemoData?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeUser = currentUser || INITIAL_USERS[0];
  const isDigitador = activeUser.role === 'digitador' || activeUser.role === 'admin';
  const isJefatura = activeUser.role === 'jefatura';

  // Navigation Items Grouped by Category for Sidebar
  const navigationGroups = [
    {
      group: 'OPERACIÓN DE QUEMAS',
      items: [
        {
          href: '/',
          label: 'Quemas Programadas',
          icon: Flame,
          color: 'text-amber-400',
          activeBg: 'bg-emerald-800 text-white border-l-4 border-amber-400 font-bold shadow-md shadow-emerald-950/40',
          visible: true,
        },
        {
          href: '/quemas-finalizadas',
          label: 'Quemas Finalizadas',
          icon: CheckCircle2,
          color: 'text-emerald-400',
          activeBg: 'bg-emerald-900 text-white border-l-4 border-emerald-400 font-bold shadow-md shadow-emerald-950/40',
          visible: true,
        },
        {
          href: '/quemas-criminales',
          label: 'Quemas Criminales',
          icon: ShieldAlert,
          color: 'text-rose-400',
          activeBg: 'bg-red-950 text-white border-l-4 border-red-500 font-bold shadow-md shadow-red-950/60',
          visible: true,
        },
      ],
    },
    {
      group: 'SUPERVISIÓN & CONTROL',
      items: [
        {
          href: '/reportes',
          label: isDigitador || isJefatura ? 'Reportes & KPIs' : 'Mis Métricas',
          icon: BarChart3,
          color: 'text-blue-400',
          activeBg: 'bg-union-800 text-white border-l-4 border-blue-400 font-bold',
          visible: true,
        },
        {
          href: '/bitacora',
          label: 'Bitácora de Auditoría',
          icon: ShieldCheck,
          color: 'text-emerald-400',
          activeBg: 'bg-union-800 text-white border-l-4 border-emerald-400 font-bold',
          visible: isDigitador || isJefatura,
        },
      ],
    },
    {
      group: 'ADMINISTRACIÓN & MAESTROS',
      items: [
        {
          href: '/maestros',
          label: 'Catálogos Maestros',
          icon: Layers,
          color: 'text-purple-400',
          activeBg: 'bg-union-800 text-white border-l-4 border-purple-400 font-bold',
          visible: isDigitador,
        },
        {
          href: '/usuarios',
          label: 'Gestión de Usuarios',
          icon: Users,
          color: 'text-indigo-400',
          activeBg: 'bg-union-800 text-white border-l-4 border-indigo-400 font-bold',
          visible: isDigitador,
        },
      ],
    },
  ];

  const handleLogout = async () => {
    await storageService.logout();
    router.push('/login');
  };

  const roleMeta = ROLE_DETAILS[activeUser.role] || {
    label: activeUser.role,
    color: 'bg-gray-100 text-gray-800',
  };

  const getCurrentPageTitle = () => {
    switch (pathname) {
      case '/':
        return { title: 'Quemas Programadas', icon: Flame, color: 'text-amber-400' };
      case '/quemas-finalizadas':
        return { title: 'Quemas Finalizadas', icon: CheckCircle2, color: 'text-emerald-400' };
      case '/quemas-criminales':
        return { title: 'Quemas Criminales (Atención de Emergencia)', icon: ShieldAlert, color: 'text-rose-400' };
      case '/reportes':
        return { title: 'Reportes y Métricas Operativas', icon: BarChart3, color: 'text-blue-400' };
      case '/bitacora':
        return { title: 'Bitácora Inmutable de Auditoría', icon: ShieldCheck, color: 'text-emerald-400' };
      case '/maestros':
        return { title: 'Administración de Catálogos Maestros', icon: Layers, color: 'text-purple-400' };
      case '/usuarios':
        return { title: 'Gestión de Usuarios y Credenciales', icon: Users, color: 'text-indigo-400' };
      default:
        return { title: 'Control de Quemas', icon: Flame, color: 'text-amber-400' };
    }
  };

  const currentInfo = getCurrentPageTitle();
  const CurrentIcon = currentInfo.icon;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. BARRA LATERAL FIJA (DESKTOP SIDEBAR)                                    */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-union-950 text-white border-r border-union-800 shadow-2xl z-40">
        
        {/* Brand Header */}
        <div className="p-4 border-b border-union-800/80 bg-union-900/50">
          <div className="flex items-center space-x-3">
            <FlameLogo size={42} className="shrink-0" />
            <div>
              <span className="font-black text-sm tracking-tight text-white block">
                INGENIO LA UNIÓN
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                <span>Control de Quemas</span>
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menus */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navigationGroups.map((grp) => {
            const visibleItems = grp.items.filter((item) => item.visible);
            if (visibleItems.length === 0) return null;

            return (
              <div key={grp.group} className="space-y-1.5">
                <div className="px-3 text-[10px] font-black uppercase tracking-wider text-union-300/70">
                  {grp.group}
                </div>
                <nav className="space-y-1">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition group cursor-pointer ${
                          isActive
                            ? item.activeBg
                            : 'text-union-200 hover:bg-union-900/80 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon
                            className={`w-4 h-4 ${
                              isActive ? 'text-white' : `${item.color} group-hover:scale-110 transition-transform`
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-union-300" />}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </div>

        {/* Live Status & Sidebar Bottom Profile Card */}
        <div className="p-3.5 border-t border-union-800/80 bg-union-900/40 space-y-2.5">
          {/* Live indicator badge */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>TIEMPO REAL</span>
            </span>
            <span className="text-[10px] text-emerald-300/80 font-mono">SUPABASE LIVE</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-union-900/90 border border-union-700/60 shadow-sm">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {activeUser.full_name}
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold truncate">
                  {roleMeta.label}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-rose-300 hover:text-white hover:bg-rose-900/60 rounded-lg transition cursor-pointer"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. CINTA SUPERIOR (TOP HEADER BAR)                                         */}
      {/* ========================================================================= */}
      <header className="lg:pl-64 sticky top-0 z-30 bg-union-900 text-white border-b border-union-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Mobile Toggle & Current Section Indicator */}
            <div className="flex items-center space-x-3">
              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-union-200 hover:text-white hover:bg-union-800 rounded-lg transition cursor-pointer"
                aria-label="Abrir menú"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Current Section Breadcrumb */}
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-union-800/80 border border-union-700 hidden sm:flex items-center justify-center">
                  <CurrentIcon className={`w-4 h-4 ${currentInfo.color}`} />
                </div>
                <div>
                  <div className="text-xs text-union-300 font-semibold uppercase tracking-wider hidden sm:block">
                    Módulo Activo
                  </div>
                  <div className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                    <span>{currentInfo.title}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Live Sync Badge & User Pill */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">Sincronización en Vivo</span>
                <span className="sm:hidden">EN VIVO</span>
              </div>

              {/* Desktop quick user badge */}
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-union-700 text-xs">
                <div className="text-right">
                  <div className="font-bold text-white truncate max-w-[140px]">{activeUser.full_name}</div>
                  <div className="text-[10px] text-emerald-400">{roleMeta.label}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. MOBILE SLIDEOVER DRAWER (PARA PANTALLAS PEQUEÑAS)                       */}
      {/* ========================================================================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-union-950 text-white flex flex-col p-4 shadow-2xl border-r border-union-800 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-union-800">
              <div className="flex items-center space-x-2.5">
                <FlameLogo size={36} className="shrink-0" />
                <div>
                  <span className="font-extrabold text-sm text-white">INGENIO LA UNIÓN</span>
                  <span className="text-[10px] text-emerald-400 block font-medium">Control de Quemas</span>
                </div>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-union-300 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Navigation List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-5">
              {navigationGroups.map((grp) => {
                const visibleItems = grp.items.filter((item) => item.visible);
                if (visibleItems.length === 0) return null;

                return (
                  <div key={grp.group} className="space-y-1">
                    <div className="text-[10px] font-black uppercase text-union-300/70 tracking-wider px-2">
                      {grp.group}
                    </div>
                    {visibleItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                            isActive
                              ? item.activeBg
                              : 'text-union-200 hover:bg-union-900 hover:text-white'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.color}`} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Mobile Drawer Footer User */}
            <div className="pt-3 border-t border-union-800">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-union-900 border border-union-700">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{activeUser.full_name}</div>
                  <div className="text-[10px] text-emerald-400 font-medium">{roleMeta.label}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-rose-300 hover:text-rose-100 cursor-pointer"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
