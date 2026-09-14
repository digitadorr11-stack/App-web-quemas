'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, ArrowRight, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#070C14] text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800/80 px-6 py-4 flex items-center justify-between bg-[#0B121E]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 border border-emerald-400/30 flex items-center justify-center shadow-lg shadow-emerald-950/50">
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white leading-tight">
              Ingenio La Unión
            </h1>
            <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              Control de Quemas
            </p>
          </div>
        </div>

        <Link
          href="/login"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md"
        >
          <span>Iniciar Sesión</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-[#0B121E] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Sistema Reiniciado
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              La base del proyecto está completamente limpia y lista para comenzar la nueva arquitectura desde cero.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition"
            >
              <span>Ir al Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
