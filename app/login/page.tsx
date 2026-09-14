'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Flame, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-[#070C14] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-[420px] bg-[#0B121E] border border-slate-800/80 rounded-3xl p-7 sm:p-9 shadow-2xl relative z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 border border-emerald-400/30 shadow-lg shadow-emerald-900/50">
            <Flame className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Ingenio La Unión
            </h1>
            <p className="text-xs uppercase tracking-widest font-extrabold text-emerald-400 mt-1">
              CONTROL DE QUEMAS
            </p>
          </div>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Plataforma operativa base limpia
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
              CORREO ELECTRÓNICO
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@launion.com"
                className="w-full bg-[#EDF2F7] hover:bg-white focus:bg-white text-slate-900 border-none rounded-2xl pl-11 pr-4 py-3.5 text-sm font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner transition"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
              CONTRASEÑA
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#EDF2F7] hover:bg-white focus:bg-white text-slate-900 border-none rounded-2xl pl-11 pr-11 py-3.5 text-sm font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner transition"
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
            className="w-full bg-[#108A58] hover:bg-[#0E7A4E] text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition duration-200 mt-2 cursor-pointer"
          >
            <span>Iniciar Sesión</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-slate-400 hover:text-emerald-400 underline">
            Volver a la página principal
          </Link>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500 font-medium tracking-wide">
            Ingenio La Unión · Reinicio Limpio
          </p>
        </div>
      </div>
    </div>
  );
}
