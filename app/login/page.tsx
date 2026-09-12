'use client';

import React, { useState, useEffect } from 'react';
import { storageService } from '@/lib/storageService';
import { UserProfile, Front, ShiftType, UserRole } from '@/lib/types';
import {
  Flame,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Layers,
  CheckCircle2,
  HelpCircle,
  X,
  Phone,
  UserPlus,
  Mail,
  ShieldAlert,
} from 'lucide-react';

export default function LoginPage() {
  const [fronts, setFronts] = useState<Front[]>([]);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Form Mode: Login vs Registro Directo
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Shift & Front Configuration Modal for Supervisors
  const [configuringSupervisor, setConfiguringSupervisor] = useState<UserProfile | null>(null);
  const [selectedFront, setSelectedFront] = useState('Frente 15');
  const [selectedShift, setSelectedShift] = useState<ShiftType>('Turno Día (06:00 - 18:00)');
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    // 1. Cargar catálogo de frentes
    storageService.getFronts().then((fList) => {
      setFronts(fList);
      if (fList.length > 0) {
        setSelectedFront(fList[0].name);
      }
    });

    // 2. Verificar sesión de Google OAuth
    const checkAuthSession = async () => {
      try {
        const user = await storageService.handleAuthSession();
        if (user) {
          if (user.active === false) {
            setErrorMsg(`Hola ${user.full_name}, tu cuenta (${user.email}) ha sido registrada y está pendiente de aprobación. Comunícate con el Administrador o Digitador para que te habilite y te asigne tu rol en el Maestro de Usuarios.`);
            return;
          }
          if (user.role === 'supervisor_frente' && !user.assigned_front) {
            setConfiguringSupervisor(user);
          } else if (user.role) {
            window.location.href = '/';
          }
        }
      } catch (e: any) {
        console.warn('Error checking session', e);
        setErrorMsg(e.message || 'Error al validar sesión');
      }
    };

    checkAuthSession();
  }, []);

  // Iniciar sesión con Google (Supabase Auth)
  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      setErrorMsg('');
      await storageService.loginWithGoogle();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al conectar con Google Auth');
      setIsGoogleLoading(false);
    }
  };

  // Form Submit Login con Correo / Credenciales
  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Por favor ingrese su correo o usuario y contraseña.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg('');
      const user = await storageService.login(identifier, password);

      if (user) {
        if (user.active === false) {
          setErrorMsg(`Su cuenta (${user.email || user.username}) está pendiente de aprobación. El Administrador debe asignarle rol y activarla en el Maestro de Usuarios.`);
          return;
        }
        if (user.role === 'supervisor_frente') {
          setConfiguringSupervisor(user);
          setSelectedFront(user.assigned_front || 'Frente 15');
          setSelectedShift(
            user.current_shift ||
              (user.is_relief_supervisor
                ? 'Relevo / Cobertura de Descanso'
                : 'Turno Día (06:00 - 18:00)')
          );
        } else {
          window.location.href = '/';
        }
      } else {
        setErrorMsg('Credenciales incorrectas. Verifique su correo y contraseña.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  // Form Submit Registro de Nuevo Usuario Directo en Tarjeta
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg('Por favor complete todos los campos obligatorios (*).');
      return;
    }

    try {
      setIsRegistering(true);
      setErrorMsg('');
      setSuccessMsg('');

      await storageService.registerUser({
        full_name: regFullName.trim(),
        email: regEmail.trim(),
        password: regPassword.trim(),
        phone: regPhone.trim() || undefined,
        role: 'supervisor_frente',
      });

      setIdentifier(regEmail.trim());
      setPassword(regPassword.trim());
      setIsRegisterMode(false);
      setSuccessMsg(`¡Solicitud enviada! Su cuenta (${regEmail.trim()}) ha sido registrada. El Administrador o Digitador le asignará su rol y permisos en el Maestro de Usuarios para darte acceso.`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al procesar el registro.');
    } finally {
      setIsRegistering(false);
    }
  };

  // Confirm Front and Shift for Supervisor
  const handleConfirmShiftAndEnter = () => {
    if (!configuringSupervisor) return;
    setIsLoading(true);

    const updatedUser: UserProfile = {
      ...configuringSupervisor,
      assigned_front: selectedFront,
      current_shift: selectedShift,
    };

    storageService.setActiveUser(updatedUser);
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#070C14] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login / Register Card - Exact Match to Reference Design */}
      <div className="w-full max-w-[420px] bg-[#0B121E] border border-slate-800/80 rounded-3xl p-7 sm:p-9 shadow-2xl relative z-10 space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 border border-emerald-400/30 shadow-lg shadow-emerald-900/50">
            <Flame className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Ingenio La Unión
            </h1>
            <p className="text-xs uppercase tracking-widest font-extrabold text-emerald-400 mt-1">
              {isRegisterMode ? 'SOLICITUD DE REGISTRO' : 'CONTROL DE QUEMAS PROGRAMADAS'}
            </p>
          </div>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            {isRegisterMode
              ? 'Complete sus datos para solicitar acceso. El Administrador asignará su rol en el sistema.'
              : 'Acceso seguro en tiempo real a la plataforma operativa.'}
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-950/70 border border-rose-500/40 rounded-2xl text-rose-300 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert Box */}
        {successMsg && (
          <div className="p-3.5 bg-emerald-950/70 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMULARIO DINÁMICO: LOGIN O REGISTRO EN LA MISMA TARJETA                */}
        {/* ========================================================================= */}
        {!isRegisterMode ? (
          /* MODO LOGIN */
          <form onSubmit={handleFormLogin} className="space-y-4">
            
            {/* Campo: Correo Electrónico */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                CORREO ELECTRÓNICO
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="oscar.morales o correo"
                  className="w-full bg-[#EDF2F7] hover:bg-white focus:bg-white text-slate-900 border-none rounded-2xl pl-11 pr-4 py-3.5 text-sm font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner transition"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Campo: Contraseña */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  CONTRASEÑA
                </label>
                <button
                  type="button"
                  onClick={() => setShowHelpModal(true)}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
                >
                  ¿Olvidó su clave?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-[#EDF2F7] hover:bg-white focus:bg-white text-slate-900 border-none rounded-2xl pl-11 pr-11 py-3.5 text-sm font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner transition"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Botón Principal: Iniciar con Credenciales */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#108A58] hover:bg-[#0E7A4E] text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition duration-200 mt-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span>Validando acceso...</span>
              ) : (
                <>
                  <span>Iniciar con Credenciales</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* MODO REGISTRO EN LA MISMA TARJETA */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 animate-in fade-in duration-200">
            
            {/* Campo: Nombre Completo */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                NOMBRE COMPLETO *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="Ej. Oscar Morales"
                  className="w-full bg-[#EDF2F7] hover:bg-white focus:bg-white text-slate-900 border-none rounded-2xl pl-11 pr-4 py-3 text-sm font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner transition"
                  required
                />
              </div>
            </div>

            {/* Campo: Correo Electrónico */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                CORREO ELECTRÓNICO *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="nombre@launion.com o gmail"
                  className="w-full bg-[#EDF2F7] hover:bg-white focus:bg-white text-slate-900 border-none rounded-2xl pl-11 pr-4 py-3 text-sm font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner transition"
                  required
                />
              </div>
            </div>

            {/* Campo: Contraseña Deseada */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                CONTRASEÑA DESEADA *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#EDF2F7] hover:bg-white focus:bg-white text-slate-900 border-none rounded-2xl pl-11 pr-11 py-3 text-sm font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Campo: Teléfono Móvil (Opcional) */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                TELÉFONO MÓVIL (OPCIONAL)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+502 ..."
                  className="w-full bg-[#EDF2F7] hover:bg-white focus:bg-white text-slate-900 border-none rounded-2xl pl-11 pr-4 py-3 text-sm font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner transition"
                />
              </div>
            </div>

            {/* Botón Principal: Enviar Solicitud de Registro */}
            <button
              type="submit"
              disabled={isRegistering}
              className="w-full bg-[#108A58] hover:bg-[#0E7A4E] text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition duration-200 mt-2 disabled:opacity-50 cursor-pointer"
            >
              {isRegistering ? (
                <span>Enviando solicitud...</span>
              ) : (
                <>
                  <span>Enviar Solicitud de Registro</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Separador: O CONTINUAR CON */}
        <div className="flex items-center gap-3 my-3">
          <div className="h-[1px] bg-slate-800/90 flex-1" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
            O CONTINUAR CON
          </span>
          <div className="h-[1px] bg-slate-800/90 flex-1" />
        </div>

        {/* Botón Oficial: Continuar con Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-2xl shadow-md flex items-center justify-center gap-3 transition duration-200 border border-slate-200 cursor-pointer disabled:opacity-60"
        >
          {isGoogleLoading ? (
            <span>Conectando con Google...</span>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuar con Google</span>
            </>
          )}
        </button>

        {/* Toggle Footer: Login <-> Registro */}
        <div className="text-center pt-2">
          {!isRegisterMode ? (
            <p className="text-xs text-slate-400 font-medium">
              ¿No tiene cuenta?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setSuccessMsg('');
                  setIsRegisterMode(true);
                }}
                className="text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-4 cursor-pointer"
              >
                Regístrese aquí
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-400 font-medium">
              ¿Ya tiene una cuenta?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setSuccessMsg('');
                  setIsRegisterMode(false);
                }}
                className="text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-4 cursor-pointer"
              >
                Iniciar sesión aquí
              </button>
            </p>
          )}
        </div>

        {/* Footer Institucional */}
        <div className="pt-3 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500 font-medium tracking-wide">
            Desarrollado por CAT · Ingenio La Unión
          </p>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL CONFIGURACIÓN DE FRENTE Y TURNO (SUPERVISORES DE FRENTE)            */}
      {/* ========================================================================= */}
      {configuringSupervisor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0B121E] border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5">
            
            <div className="text-center space-y-1.5 pb-2 border-b border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto mb-2">
                <Layers className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-black text-white">
                Configurar Frente y Turno de Hoy
              </h2>
              <p className="text-xs text-slate-400">
                Supervisor: <strong className="text-white">{configuringSupervisor.full_name}</strong>
              </p>
            </div>

            <div className="space-y-4">
              
              {/* Frente de Cosecha */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Frente Asignado para Hoy
                </label>
                <select
                  value={selectedFront}
                  onChange={(e) => setSelectedFront(e.target.value)}
                  className="w-full bg-[#EDF2F7] text-slate-900 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-blue-500"
                >
                  {fronts.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name} ({f.harvest_type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Turno */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Turno Activo
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { val: 'Turno Día (06:00 - 18:00)', label: '☀️ Turno Día (06:00 - 18:00)' },
                    { val: 'Turno Noche (18:00 - 06:00)', label: '🌙 Turno Noche (18:00 - 06:00)' },
                    { val: 'Relevo / Cobertura de Descanso', label: '🔄 Relevo / Cobertura de Descanso' },
                  ].map((t) => (
                    <button
                      key={t.val}
                      type="button"
                      onClick={() => setSelectedShift(t.val as ShiftType)}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between cursor-pointer ${
                        selectedShift === t.val
                          ? 'bg-blue-600/20 border-blue-500 text-blue-200 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{t.label}</span>
                      {selectedShift === t.val && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfiguringSupervisor(null)}
                className="px-4 py-2.5 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmShiftAndEnter}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Confirmar e Ingresar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL AYUDA / RESTABLECER CONTRASEÑA                                     */}
      {/* ========================================================================= */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0B121E] border border-slate-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400">
                <HelpCircle className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">Restablecer Credenciales</h3>
              </div>
              <button onClick={() => setShowHelpModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Por protocolo de seguridad del <strong>Ingenio La Unión</strong>, el restablecimiento de contraseñas y códigos de usuario es administrado exclusivamente por el <strong>Digitador de Turno</strong> o la <strong>Jefatura de Cosecha</strong>.
            </p>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs">
              <p className="font-bold text-white">Digitador Autorizado:</p>
              <p className="text-slate-400">Oscar Josue Morales Herrera</p>
              <p className="text-slate-400 flex items-center gap-1 mt-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ext. Central Quemas: #402</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
