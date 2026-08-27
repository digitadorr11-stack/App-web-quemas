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
} from 'lucide-react';

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
          color: 'text-cyan-400',
          activeBg: 'bg-union-800 text-white border-l-4 border-cyan-400 font-bold',
          visible: isDigitador,
        },
      ],
    },
  ];

  const handleLogout = () => {
    storageService.logout();
    router.push('/login');
  };

  const roleMeta = ROLE_DETAILS[activeUser.role] || ROLE_DETAILS['digitador'];

  // Current Active Page Title for Top Bar
  const getCurrentPageTitle = () => {
    if (pathname === '/') return { title: 'Quemas Programadas (En Proceso)', icon: Flame, color: 'text-amber-400' };
    if (pathname === '/quemas-finalizadas') return { title: 'Registro de Quemas Finalizadas', icon: CheckCircle2, color: 'text-emerald-400' };
    if (pathname === '/quemas-criminales') return { title: 'Quemas Criminales', icon: ShieldAlert, color: 'text-red-400' };
    if (pathname === '/reportes') return { title: 'Reportes & KPIs', icon: BarChart3, color: 'text-blue-400' };
    if (pathname === '/bitacora') return { title: 'Bitácora de Auditoría', icon: ShieldCheck, color: 'text-emerald-400' };
    if (pathname === '/maestros') return { title: 'Catálogos Maestros', icon: Layers, color: 'text-purple-400' };
    if (pathname === '/usuarios') return { title: 'Gestión de Usuarios', icon: Users, color: 'text-cyan-400' };
    return { title: 'Ingenio La Unión', icon: Flame, color: 'text-emerald-400' };
  };

  const currentInfo = getCurrentPageTitle();
  const CurrentIcon = currentInfo.icon;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. CINTA DE OPCIONES A LADO IZQUIERDO (SIDEBAR DESKTOP) */}
      {/* ========================================================================= */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-union-950 text-white border-r border-union-800 hidden lg:flex flex-col shadow-2xl">
        
        {/* Brand & Logo Header */}
        <div className="p-5 border-b border-union-800/80">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 border border-emerald-500/30 flex items-center justify-center shadow-md shadow-emerald-950/40 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                INGENIO LA UNIÓN
              </span>
              <p className="text-[10px] text-union-300 font-medium">
                Control Operativo de Quemas
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Options List */}
        <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto custom-scrollbar">
          {navigationGroups.map((group, gIdx) => {
            const visibleItems = group.items.filter((item) => item.visible);
            if (visibleItems.length === 0) return null;

            return (
              <div key={gIdx} className="space-y-1.5">
                <div className="px-3 text-[10px] font-black uppercase tracking-wider text-union-400">
                  {group.group}
                </div>

                <nav className="space-y-1">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-150 group ${
                          isActive
                            ? item.activeBg
                            : 'text-union-200 hover:bg-union-900/90 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon
                            className={`w-4 h-4 ${
                              isActive ? 'text-white' : item.color
                            } group-hover:scale-110 transition-transform`}
                          />
                          <span className={isActive ? 'font-black tracking-tight' : 'font-medium'}>
                            {item.label}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </div>

        {/* Sidebar Bottom Profile Card */}
        <div className="p-3.5 border-t border-union-800/80 bg-union-900/40">
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
              className="p-1.5 text-rose-300 hover:text-white hover:bg-rose-900/60 rounded-lg transition"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. CINTA SUPERIOR (TOP HEADER BAR) */}
      {/* ========================================================================= */}
      <header className="lg:pl-64 sticky top-0 z-30 bg-union-900 text-white border-b border-union-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Mobile Toggle & Current Section Indicator */}
            <div className="flex items-center space-x-3">
              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-union-200 hover:text-white hover:bg-union-800 rounded-lg transition"
                aria-label="Abrir menú"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Current Section Breadcrumb / Badge */}
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
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. MOBILE SLIDEOVER DRAWER (PARA PANTALLAS PEQUEÑAS) */}
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
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <span className="font-extrabold text-sm text-white">INGENIO LA UNIÓN</span>
                  <span className="text-[10px] text-emerald-400 block font-medium">Control de Quemas</span>
                </div>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-union-300 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Links */}
            <div className="flex-1 py-4 space-y-6 overflow-y-auto">
              {navigationGroups.map((group, gIdx) => {
                const visibleItems = group.items.filter((item) => item.visible);
                if (visibleItems.length === 0) return null;

                return (
                  <div key={gIdx} className="space-y-1.5">
                    <div className="px-2 text-[10px] font-black uppercase text-union-400">
                      {group.group}
                    </div>
                    <div className="space-y-1">
                      {visibleItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs ${
                              isActive
                                ? item.activeBg
                                : 'text-union-200 hover:bg-union-900 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.color}`} />
                              <span className="font-bold">{item.label}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Drawer Footer */}
            <div className="pt-3 border-t border-union-800">
              <button
                onClick={handleLogout}
                className="w-full py-2 bg-rose-900/60 hover:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
