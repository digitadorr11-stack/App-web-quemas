'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserProfile, UserRole, ROLE_DETAILS } from '@/lib/types';
import { INITIAL_USERS } from '@/lib/mockData';
import { storageService } from '@/lib/storageService';
import {
  Flame,
  ShieldCheck,
  BarChart3,
  Database,
  Users,
  Layers,
  ChevronDown,
  Check,
  UserCheck,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

interface NavbarProps {
  currentUser: UserProfile;
  onUserChange?: (user: UserProfile) => void;
  onResetDemoData?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, onUserChange, onResetDemoData }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const isDigitador = currentUser.role === 'digitador' || currentUser.role === 'admin';
  const isJefatura = currentUser.role === 'jefatura';

  // Role-based Nav Links
  const navLinks = [
    { href: '/', label: 'Tablero de Control', icon: Flame, visible: true },
    { href: '/reportes', label: isDigitador || isJefatura ? 'Reportes & KPIs Generales' : 'Mis Métricas & Reportes', icon: BarChart3, visible: true },
    { href: '/bitacora', label: 'Bitácora de Auditoría', icon: ShieldCheck, visible: isDigitador || isJefatura },
    { href: '/maestros', label: 'Catálogos Maestros', icon: Layers, visible: isDigitador },
    { href: '/usuarios', label: 'Gestión de Usuarios', icon: Users, visible: isDigitador },
    { href: '/guia-supabase', label: 'Guía Cloud', icon: Database, visible: true },
  ].filter((l) => l.visible);

  const handleLogout = () => {
    storageService.logout();
    router.push('/login');
  };

  const roleMeta = ROLE_DETAILS[currentUser.role];

  return (
    <header className="bg-union-900 text-white shadow-lg sticky top-0 z-40 border-b border-union-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo y Nombre de la Empresa */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fire-500 to-fire-600 flex items-center justify-center shadow-md shadow-fire-600/30 group-hover:scale-105 transition-transform">
                <Flame className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                  INGENIO LA UNIÓN
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-fire-500/20 text-fire-300 border border-fire-500/30 px-1.5 py-0.5 rounded">
                    Quemas
                  </span>
                </span>
                <p className="text-xs text-union-200 hidden sm:block font-medium">
                  Control Operativo y Auditoría de Quemas
                </p>
              </div>
            </Link>
          </div>

          {/* Enlaces de Navegación de Escritorio */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-union-800 text-white shadow-inner border border-union-700'
                      : 'text-union-100 hover:bg-union-800/60 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-fire-400' : 'text-union-300'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Role Switcher */}
          <div className="flex items-center space-x-2.5">
            
            {/* Active User Chip */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center space-x-2 bg-union-800 hover:bg-union-700 border border-union-600/60 px-3 py-1.5 rounded-xl text-sm font-medium transition shadow-sm"
                title="Cambiar de Rol / Usuario de prueba"
              >
                <div className="text-left">
                  <div className="text-[10px] text-union-300 font-semibold uppercase tracking-wider">
                    {currentUser.full_name.split(' ')[0]} {currentUser.full_name.split(' ')[1] || ''}
                  </div>
                  <div className="text-xs font-bold text-white max-w-[130px] truncate flex items-center gap-1">
                    <span>{roleMeta.label}</span>
                    {currentUser.assigned_front && (
                      <span className="text-[10px] bg-blue-500/30 text-blue-200 px-1 rounded">
                        {currentUser.assigned_front}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-union-300 ml-1" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-gray-100 text-gray-800 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Simulador Rápido de Usuarios
                    </p>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Cambia de usuario para probar las vistas aisladas de cada rol.
                    </p>
                  </div>

                  <div className="py-1 max-h-80 overflow-y-auto">
                    {INITIAL_USERS.map((user) => {
                      const isSelected = currentUser.id === user.id;
                      const uMeta = ROLE_DETAILS[user.role];
                      return (
                        <button
                          key={user.id}
                          onClick={() => {
                            if (onUserChange) onUserChange(user);
                            storageService.setActiveUser(user);
                            setShowRoleDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs flex items-start space-x-2.5 transition hover:bg-union-50 ${
                            isSelected ? 'bg-union-50 font-bold' : ''
                          }`}
                        >
                          <div className="mt-0.5">
                            {isSelected ? (
                              <Check className="w-4 h-4 text-union-700" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-gray-300" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900">{user.full_name}</div>
                            <div className="text-[11px] text-union-700 font-semibold">{uMeta.label}</div>
                            {user.assigned_front && (
                              <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                Asignado a {user.assigned_front}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {onResetDemoData && (
                    <div className="border-t border-gray-100 pt-1 px-3">
                      <button
                        onClick={() => {
                          if (confirm('¿Restablecer datos de prueba?')) {
                            onResetDemoData();
                            setShowRoleDropdown(false);
                          }
                        }}
                        className="w-full text-left px-2 py-1.5 text-xs text-gray-600 hover:text-red-600 flex items-center space-x-1.5 rounded"
                      >
                        <span>Restablecer datos de prueba iniciales</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 bg-union-950/70 hover:bg-red-900/80 text-union-200 hover:text-white rounded-xl border border-union-800 transition"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-union-800 text-xs overflow-x-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center py-1 px-2 rounded whitespace-nowrap ${
                  isActive ? 'text-fire-400 font-bold' : 'text-union-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] mt-0.5">{link.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>

      </div>
    </header>
  );
};
