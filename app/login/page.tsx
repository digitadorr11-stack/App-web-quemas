'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/authService';
import { Flame, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff, CheckCircle2, Phone, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration form state
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // UI status
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Verificar si ya hay sesión activa al entrar
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const user = await authService.getCurrentUserProfile();
        if (user) {
          if (!user.activo) {
            setErrorMsg(`Hola ${user.nombre_completo}, tu cuenta (${user.correo}) está pendiente de aprobación por el Administrador.`);
            return;
          }
          router.push('/');
        }
      } catch (err) {
        // No hay sesión activa previa
      }
    };
    checkActiveSession();
  }, [router]);

  // Login con Correo y Contraseña
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Por favor complete todos los campos');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg('');
      const user = await authService.loginWithEmail(email, password);

      if (!user.activo) {
        setErrorMsg(`Tu cuenta (${user.correo}) está registrada pero pendiente de activación por el Administrador.`);
        return;
      }

      router.push('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al iniciar sesión. Verifique sus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  // Login con Google
  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      setErrorMsg('');
      await authService.loginWithGoogle();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al conectar con Google Auth');
      setIsGoogleLoading(false);
    }
  };

  // Registro de nuevo usuario
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg('Por favor complete los campos obligatorios (*)');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg('');
      setSuccessMsg('');

      await authService.registerUser({
        nombre_completo: regFullName.trim(),
        correo: regEmail.trim(),
        password: regPassword.trim(),
      });

      setIsRegisterMode(false);
      setEmail(regEmail.trim());
      setSuccessMsg(`¡Solicitud enviada para ${regEmail.trim()}! Una vez aprobada por el Administrador podrás ingresar.`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al enviar la solicitud de registro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4 font-sans">
      {/* Main Login / Register Card */}
      <div className="w-full max-w-[400px] bg-white border border-slate-200 rounded-lg p-7 sm:p-8 shadow-panel space-y-6">

        {/* Header Branding */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-union-800 border border-union-900">
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Ingenio La Unión
            </h1>
            <p className="text-[11px] uppercase tracking-wide font-semibold text-union-700 mt-1">
              Control de Quemas Programadas
            </p>
          </div>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            {isRegisterMode
              ? 'Complete sus datos para solicitar acceso a la plataforma.'
              : 'Acceso al sistema de trazabilidad operativa.'}
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-rose-700 text-xs font-medium flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert Box */}
        {successMsg && (
          <div className="p-3 bg-union-50 border border-union-200 rounded-md text-union-800 text-xs font-medium flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-union-700 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {!isRegisterMode ? (
          /* MODO LOGIN */
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                CORREO ELECTRÓNICO
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@launion.com"
                  className="w-full bg-slate-100 hover:bg-white focus:bg-white text-slate-900 border border-transparent focus:border-union-400 rounded-md pl-11 pr-4 py-3 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-union-500/30 transition"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                CONTRASEÑA
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-100 hover:bg-white focus:bg-white text-slate-900 border border-transparent focus:border-union-400 rounded-md pl-11 pr-11 py-3 text-sm font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-union-500/30 transition"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-union-700 hover:bg-union-800 text-white font-semibold text-sm py-3 px-4 rounded-md flex items-center justify-center gap-2 transition duration-200 mt-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span>Validando acceso...</span>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* MODO REGISTRO */
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                NOMBRE COMPLETO *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="Ej. Oscar Morales"
                  className="w-full bg-slate-100 hover:bg-white focus:bg-white text-slate-900 border border-transparent focus:border-union-400 rounded-md pl-11 pr-4 py-2.5 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-union-500/30 transition"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                CORREO ELECTRÓNICO *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="nombre@launion.com"
                  className="w-full bg-slate-100 hover:bg-white focus:bg-white text-slate-900 border border-transparent focus:border-union-400 rounded-md pl-11 pr-4 py-2.5 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-union-500/30 transition"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                CONTRASEÑA DESEADA *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-100 hover:bg-white focus:bg-white text-slate-900 border border-transparent focus:border-union-400 rounded-md pl-11 pr-11 py-2.5 text-sm font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-union-500/30 transition"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-union-700 hover:bg-union-800 text-white font-semibold text-sm py-3 px-4 rounded-md flex items-center justify-center gap-2 transition duration-200 mt-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
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

        {/* Separador */}
        <div className="flex items-center gap-3 my-3">
          <div className="h-[1px] bg-slate-200 flex-1" />
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
            O CONTINUAR CON
          </span>
          <div className="h-[1px] bg-slate-200 flex-1" />
        </div>

        {/* Botón: Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-md flex items-center justify-center gap-3 transition duration-200 border border-slate-300 cursor-pointer disabled:opacity-60"
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

        {/* Toggle Login <-> Registro */}
        <div className="text-center pt-2">
          {!isRegisterMode ? (
            <p className="text-xs text-slate-500 font-medium">
              ¿No tiene cuenta?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setSuccessMsg('');
                  setIsRegisterMode(true);
                }}
                className="text-union-700 hover:text-union-800 font-semibold underline underline-offset-4 cursor-pointer"
              >
                Regístrese aquí
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-500 font-medium">
              ¿Ya tiene una cuenta?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setSuccessMsg('');
                  setIsRegisterMode(false);
                }}
                className="text-union-700 hover:text-union-800 font-semibold underline underline-offset-4 cursor-pointer"
              >
                Iniciar sesión aquí
              </button>
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-500 font-medium tracking-wide">
            Ingenio La Unión · Sistema Integral de Quemas
          </p>
        </div>
      </div>
    </div>
  );
}
