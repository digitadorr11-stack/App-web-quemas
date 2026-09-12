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

  // Shift & Front Configuration Modal for Supervisors
  const [configuringSupervisor, setConfiguringSupervisor] = useState<UserProfile | null>(null);
  const [selectedFront, setSelectedFront] = useState('Frente 15');
  const [selectedShift, setSelectedShift] = useState<ShiftType>('Turno Día (06:00 - 18:00)');
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Register Modal State
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('supervisor_frente');
  const [regFront, setRegFront] = useState('Frente 15');
  const [regPhone, setRegPhone] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  useEffect(() => {
    // 1. Cargar catálogo de frentes
    storageService.getFronts().then((fList) => {
      setFronts(fList);
      if (fList.length > 0) {
        setSelectedFront(fList[0].name);
        setRegFront(fList[0].name);
      }
    });

    // 2. Verificar sesión de Google OAuth
    const checkAuthSession = async () => {
      try {
        const user = await storageService.handleAuthSession();
        if (user) {
          if (user.role === 'supervisor_frente' && !user.assigned_front) {
            setConfiguringSupervisor(user);
          } else if (user.role) {
            window.location.href = '/';
          }
        }
      } catch (e) {
        console.warn('Error checking session', e);
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

  // Enviar Solicitud de Registro de Usuario
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg('Complete todos los campos requeridos.');
      return;
    }

    try {
      setIsRegistering(true);
      setErrorMsg('');

      await storageService.registerUser({
        full_name: regFullName.trim(),
        email: regEmail.trim(),
        password: regPassword.trim(),
        role: regRole,
        assigned_front: regRole === 'supervisor_frente' ? regFront : undefined,
        phone: regPhone.trim() || undefined,
        current_shift: regRole === 'supervisor_frente' ? 'Turno Día (06:00 - 18:00)' : undefined,
      });

      setRegisterSuccess(true);
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

      {/* Main Login Card - Exact Match to Reference Design */}
      <div className="w-full max-w-[420px] bg-[#0B121E] border border-slate-800/80 rounded-3xl p-7 sm:p-9 shadow-2xl relative z-10 space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 shadow-lg shadow-emerald-950/60">
            <Flame className="w-7 h-7 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Ingenio La Unión
            </h1>
            <p className="text-xs uppercase tracking-widest font-extrabold text-emerald-400 mt-1">
              CONTROL DE QUEMAS PROGRAMADAS
            </p>
          </div>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Acceso seguro en tiempo real a la plataforma operativa.
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

        {/* Formulario de Inicio con Correo / Credenciales */}
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

        {/* Separador: O CONTINUAR CON */}
        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-[#0B121E] px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest relative">
            O CONTINUAR CON
          </span>
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

        {/* Registro Footer */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-400 font-medium">
            ¿No tiene cuenta?{' '}
            <button
              type="button"
              onClick={() => {
                setErrorMsg('');
                setRegisterSuccess(false);
                setShowRegisterModal(true);
              }}
              className="text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-4 cursor-pointer"
            >
              Regístrese aquí
            </button>
          </p>
        </div>

        {/* Footer Institucional */}
        <div className="pt-3 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500 font-medium tracking-wide">
            Desarrollado por CAT · Ingenio La Unión
          </p>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL: REGISTRO DE NUEVA CUENTA (CON APROBACIÓN DE ADMIN)                 */}
      {/* ========================================================================= */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0B121E] border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Solicitud de Registro</h3>
                  <p className="text-[11px] text-slate-400">Crear cuenta en el sistema de quemas</p>
                </div>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {registerSuccess ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-900/30 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">¡Solicitud Enviada con Éxito!</h4>
                  <p className="text-xs text-slate-300 max-w-xs mx-auto mt-2 leading-relaxed">
                    Su cuenta ha sido registrada y está <strong>pendiente de aprobación</strong>. El Administrador o Digitador de Turno autorizará su acceso a la brevedad.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowRegisterModal(false);
                    setRegisterSuccess(false);
                    setSuccessMsg('Registro enviado. Pendiente de aprobación.');
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Regresar al Inicio
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                
                {/* Banner de Aviso de Aprobación */}
                <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Por seguridad, toda nueva cuenta debe ser <strong>autorizada por el Administrador</strong> antes de poder ingresar.</span>
                </div>

                {/* Nombre Completo */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-300">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Ej. Juan Carlos Morales"
                    className="w-full bg-[#EDF2F7] text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                {/* Correo Electrónico */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-300">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="nombre@launion.com o gmail"
                    className="w-full bg-[#EDF2F7] text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                {/* Contraseña */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-300">
                    Contraseña Deseada *
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Crea una clave segura"
                    className="w-full bg-[#EDF2F7] text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                {/* Rol Solicitado */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-slate-300">
                      Rol Operativo *
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full bg-[#EDF2F7] text-slate-900 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="supervisor_frente">Supervisor de Frente</option>
                      <option value="patrulla">Patrulla de Quema</option>
                      <option value="supervisor_quemas">Supervisor de Quemas</option>
                      <option value="digitador">Digitador</option>
                      <option value="jefatura">Jefatura / Gerencia</option>
                    </select>
                  </div>

                  {/* Frente (si aplica) */}
                  {regRole === 'supervisor_frente' ? (
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase text-slate-300">
                        Frente de Cosecha
                      </label>
                      <select
                        value={regFront}
                        onChange={(e) => setRegFront(e.target.value)}
                        className="w-full bg-[#EDF2F7] text-slate-900 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                      >
                        {fronts.map((f) => (
                          <option key={f.id} value={f.name}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase text-slate-300">
                        Teléfono Móvil
                      </label>
                      <input
                        type="text"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+502 ..."
                        className="w-full bg-[#EDF2F7] text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="px-4 py-2.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isRegistering ? (
                      <span>Registrando...</span>
                    ) : (
                      <>
                        <span>Enviar Solicitud</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

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
