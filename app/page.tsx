'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/authService';
import { UserProfile, ROLES_CONFIG } from '@/lib/types';
import { Flame, LogOut, User, Sparkles, Shield, Clock, CheckCircle2, ChevronRight, Activity, Users, Layers, MapPin, Truck, FilePlus2, Smartphone } from 'lucide-react';

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
        <div className="flex items-center gap-3">
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            {['supervisor_frente', 'supervisor_quemas', 'digitador', 'admin'].includes(currentUser.rol) && (
              <Link
                href="/quemas/nueva"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-orange-300 hover:bg-orange-950/60 transition"
              >
                <FilePlus2 className="w-3.5 h-3.5" />
                <span>Nueva Solicitud</span>
              </Link>
            )}
            {['supervisor_quemas', 'digitador', 'admin', 'jefatura', 'supervisor_frente'].includes(currentUser.rol) && (
              <Link
                href="/quemas"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 hover:bg-amber-950/60 transition"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Despacho</span>
              </Link>
            )}
            {['patrulla', 'supervisor_quemas', 'digitador', 'admin'].includes(currentUser.rol) && (
              <Link
                href="/campo"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 hover:bg-rose-950/60 transition"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Campo</span>
              </Link>
            )}
            {(currentUser.rol === 'admin' || currentUser.rol === 'digitador') && (
              <>
                <Link
                  href="/usuarios"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-300 hover:bg-purple-950/60 transition"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Usuarios</span>
                </Link>
                <Link
                  href="/constantes"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 hover:bg-emerald-950/60 transition"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Constantes</span>
                </Link>
                <Link
                  href="/fincas"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-300 hover:bg-blue-950/60 transition"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Fincas & Lotes</span>
                </Link>
              </>
            )}
          </nav>

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
              <span>Control Operativo de Zafra · Ingenio La Unión</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Bienvenido, {currentUser.nombre_completo}
            </h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Plataforma en tiempo real para la trazabilidad forense, despacho de patrullas, cronología unificada y medición exacta de tiempos de quema de caña.
            </p>
          </div>
        </div>

        {/* Operación en Tiempo Real de Zafra */}
        {(['supervisor_frente', 'supervisor_quemas', 'digitador', 'admin', 'jefatura', 'patrulla'].includes(currentUser.rol)) && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Operación en Tiempo Real
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['supervisor_frente', 'supervisor_quemas', 'digitador', 'admin'].includes(currentUser.rol) && (
                <Link
                  href="/quemas/nueva"
                  className="bg-[#0B121E] hover:bg-slate-900/60 border border-slate-800 hover:border-orange-500/50 rounded-3xl p-6 transition flex flex-col justify-between group shadow-xl"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center group-hover:scale-105 transition">
                        <FilePlus2 className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-800">
                        Solicitud
                      </span>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-orange-300 transition">
                        Nueva Solicitud de Quema
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Registro de solicitud de quema con finca, lote, hora planificada y prioridad.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-orange-400">
                    <span>Solicitar Quema</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </Link>
              )}

              {['supervisor_quemas', 'digitador', 'admin', 'jefatura', 'supervisor_frente'].includes(currentUser.rol) && (
                <Link
                  href="/quemas"
                  className="bg-[#0B121E] hover:bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 transition flex flex-col justify-between group shadow-xl"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center group-hover:scale-105 transition">
                        <Truck className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                        Despacho
                      </span>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                        Tablero de Despacho
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Monitoreo en tiempo real, asignación de patrullas y tiempos de respuesta.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400">
                    <span>Ver Tablero</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </Link>
              )}

              {['patrulla', 'supervisor_quemas', 'digitador', 'admin'].includes(currentUser.rol) && (
                <Link
                  href="/campo"
                  className="bg-[#0B121E] hover:bg-slate-900/60 border border-slate-800 hover:border-rose-500/50 rounded-3xl p-6 transition flex flex-col justify-between group shadow-xl"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center group-hover:scale-105 transition">
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                        Campo
                      </span>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-rose-300 transition">
                        Vista de Campo
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Ejecución móvil: llegada, espera, revisión y cierre de la quema asignada.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-rose-400">
                    <span>Abrir Vista de Campo</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Cuadrícula de Módulos Operativos y Administrativos */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Módulos del Sistema
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tarjeta 1: Gestión de Usuarios */}
            <Link
              href="/usuarios"
              className="bg-[#0B121E] hover:bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 rounded-3xl p-6 transition flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center group-hover:scale-105 transition">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    Accesos & Roles
                  </span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition">
                    Gestión de Usuarios
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Aprobación de cuentas, asignación de roles y vinculación directa con su Frente o Patrulla.
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-purple-400">
                <span>Administrar Usuarios</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>

            {/* Tarjeta 2: Constantes Operativas */}
            <Link
              href="/constantes"
              className="bg-[#0B121E] hover:bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 transition flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition">
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Configuración
                  </span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                    Constantes Operativas
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Catálogo ágil de Frentes de cosecha (mecanizada/manual) y Patrullas de quema con vehículos y estado.
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>Gestionar Frentes y Patrullas</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>

            {/* Tarjeta 3: Catálogo de Fincas y Lotes */}
            <Link
              href="/fincas"
              className="bg-[#0B121E] hover:bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-6 transition flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center group-hover:scale-105 transition">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    Agronomía
                  </span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-blue-300 transition">
                    Catálogo de Fincas & Lotes
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Base de datos agronómica de alto volumen: búsqueda por lote, áreas (Ha/Mz), variedades y carga masiva desde Excel.
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-400">
                <span>Explorar Fincas y Lotes</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          </div>
        </div>

        {/* Tarjeta de Estado del Usuario */}
        <div className="bg-[#0B121E] border border-slate-800 rounded-3xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">{currentUser.nombre_completo}</p>
                <p className="text-[11px] text-slate-400 font-mono">{currentUser.correo}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1 rounded-full font-bold border ${roleInfo.badgeColor}`}>
                {roleInfo.label}
              </span>
              {currentUser.frente_asignado && (
                <span className="text-xs px-3 py-1 rounded-full font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  {currentUser.frente_asignado}
                </span>
              )}
              {currentUser.patrulla_asignada && (
                <span className="text-xs px-3 py-1 rounded-full font-bold bg-orange-950 text-orange-300 border border-orange-800">
                  {currentUser.patrulla_asignada}
                </span>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
