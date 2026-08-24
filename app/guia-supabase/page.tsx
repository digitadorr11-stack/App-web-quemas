'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { UserProfile } from '@/lib/types';
import { storageService } from '@/lib/storageService';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  Database,
  Cloud,
  CheckCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Zap,
  Server,
  Code2,
  FileCode,
} from 'lucide-react';

export default function GuiaSupabasePage() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => storageService.getActiveUser());
  const [copied, setCopied] = useState(false);

  const handleUserChange = (user: UserProfile) => {
    setCurrentUser(user);
    storageService.setActiveUser(user);
  };

  const sqlScriptContent = `-- ====================================================================
-- ESQUEMA DE BASE DE DATOS: CONTROL DE QUEMAS - INGENIO LA UNIÓN
-- ====================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA: CATÁLOGO DE FINCAS
CREATE TABLE IF NOT EXISTS public.farms_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT,
    zone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLA: PERFILES DE USUARIO Y ROLES
CREATE TABLE IF NOT EXISTS public.users_profiles (
    id TEXT PRIMARY KEY,
    email TEXT,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('supervisor_frente', 'supervisor_quemas', 'patrulla', 'digitador', 'jefatura', 'admin')),
    phone TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA: SOLICITUDES Y CONTROL DE QUEMAS
CREATE TABLE IF NOT EXISTS public.burn_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    burn_number TEXT NOT NULL UNIQUE,
    front_number TEXT NOT NULL,
    shift_supervisor_name TEXT NOT NULL,
    farm_name TEXT NOT NULL,
    area_hectares NUMERIC(10,2) NOT NULL,
    estimated_tonnage NUMERIC(10,2) NOT NULL,
    planned_burn_time TIMESTAMP WITH TIME ZONE NOT NULL,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by_user_id TEXT NOT NULL,
    created_by_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'SOLICITADA',
    assigned_patrol_id TEXT,
    assigned_patrol_name TEXT,
    patrol_assigned_at TIMESTAMP WITH TIME ZONE,
    patrol_confirmed_at TIMESTAMP WITH TIME ZONE,
    patrol_arrived_at TIMESTAMP WITH TIME ZONE,
    review_duration_minutes INTEGER,
    review_completed_at TIMESTAMP WITH TIME ZONE,
    review_checklist JSONB DEFAULT '{}'::jsonb,
    review_notes TEXT,
    validated_by_user_id TEXT,
    validated_by_name TEXT,
    validated_at TIMESTAMP WITH TIME ZONE,
    validation_notes TEXT,
    burn_started_at TIMESTAMP WITH TIME ZONE,
    burn_ended_at TIMESTAMP WITH TIME ZONE,
    burn_duration_minutes INTEGER,
    cancellation_reason TEXT,
    cancelled_by_name TEXT,
    cancelled_by_role TEXT,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLA: BITÁCORA DE AUDITORÍA
CREATE TABLE IF NOT EXISTS public.burn_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    burn_request_id UUID REFERENCES public.burn_requests(id) ON DELETE CASCADE,
    burn_number TEXT,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_role TEXT NOT NULL,
    action_type TEXT NOT NULL,
    field_name TEXT,
    old_value TEXT,
    new_value TEXT,
    change_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.farms_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.burn_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.burn_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir todo a anon para farms_catalog" ON public.farms_catalog FOR ALL USING (true);
CREATE POLICY "Permitir todo a anon para users_profiles" ON public.users_profiles FOR ALL USING (true);
CREATE POLICY "Permitir todo a anon para burn_requests" ON public.burn_requests FOR ALL USING (true);
CREATE POLICY "Permitir todo a anon para burn_audit_logs" ON public.burn_audit_logs FOR ALL USING (true);

-- Semillas iniciales
INSERT INTO public.farms_catalog (name, code, zone) VALUES
('Finca Las Palmas', 'F-01', 'Zona Sur'),
('Finca El Trapiche', 'F-02', 'Zona Sur'),
('Finca San Jerónimo', 'F-03', 'Zona Central'),
('Finca La Esperanza', 'F-04', 'Zona Central'),
('Finca Santa Rosa', 'F-05', 'Zona Norte'),
('Finca Los Almendros', 'F-06', 'Zona Norte'),
('Finca San Francisco', 'F-07', 'Zona Oriente'),
('Finca Miramar', 'F-08', 'Zona Costa')
ON CONFLICT (name) DO NOTHING;`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <>
      <Navbar
        currentUser={currentUser}
        onUserChange={handleUserChange}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-union-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg mb-8 border border-union-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-union-800 border border-union-700 flex items-center justify-center">
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Guía Paso a Paso (Sin Complicaciones)
              </span>
              <h1 className="text-2xl sm:text-3xl font-black">
                Configuración de Supabase y Despliegue en Vercel
              </h1>
            </div>
          </div>
          <p className="text-sm text-union-100 max-w-3xl mt-2">
            Esta aplicación está diseñada para funcionar de inmediato tanto en modo local/demo como conectada a tu base de datos en la nube en <strong>Supabase</strong> y desplegada en <strong>Vercel</strong> para que todo el equipo del Ingenio La Unión pueda acceder desde sus celulares o computadoras.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-union-950/80 border border-union-700">
            <span className={`w-2.5 h-2.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span>
              Estado Actual:{' '}
              {isSupabaseConfigured
                ? 'Conexión a Supabase Activa'
                : 'Modo Demo Local Activo (Funcional 100%)'}
            </span>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          
          {/* PASO 1 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-union-900 text-white font-black text-sm flex items-center justify-center">
                1
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Crear Proyecto Gratuito en Supabase
              </h2>
            </div>

            <ol className="list-decimal list-inside text-xs sm:text-sm text-gray-700 space-y-2 ml-2">
              <li>
                Ingresa a{' '}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-union-800 hover:underline inline-flex items-center gap-1"
                >
                  supabase.com <ExternalLink className="w-3.5 h-3.5" />
                </a>{' '}
                y crea una cuenta gratuita.
              </li>
              <li>
                Haz clic en <strong>"New Project"</strong> (Nuevo Proyecto).
              </li>
              <li>
                Escribe un nombre (ej: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-union-900">Ingenio-La-Union-Quemas</code>), define una contraseña para la base de datos y selecciona la región más cercana (ej: <em>Central US</em> o <em>Sao Paulo</em>).
              </li>
              <li>
                Espera aproximadamente 1 minuto a que Supabase termine de aprovisionar tu base de datos PostgreSQL.
              </li>
            </ol>
          </div>

          {/* PASO 2 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-union-900 text-white font-black text-sm flex items-center justify-center">
                  2
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Ejecutar el Script SQL en Supabase (1 Clic)
                </h2>
              </div>

              <button
                onClick={copyToClipboard}
                className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition shadow-sm ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-union-800 hover:bg-union-700 text-white'
                }`}
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '¡Script Copiado!' : 'Copiar Script SQL'}</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 mb-3">
              En tu proyecto de Supabase, en el menú lateral izquierdo haz clic en <strong>"SQL Editor"</strong>, luego en <strong>"New Query"</strong>, pega el siguiente script y presiona el botón verde <strong>"Run"</strong>:
            </p>

            <div className="relative bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs max-h-60 overflow-y-auto border border-slate-800">
              <pre>{sqlScriptContent}</pre>
            </div>
          </div>

          {/* PASO 3 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-union-900 text-white font-black text-sm flex items-center justify-center">
                3
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Obtener las Credenciales de Supabase
              </h2>
            </div>

            <ol className="list-decimal list-inside text-xs sm:text-sm text-gray-700 space-y-2 ml-2">
              <li>
                En Supabase, ve al menú lateral <strong>Project Settings ➔ API</strong>.
              </li>
              <li>
                Copia el <strong>Project URL</strong> (ej: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">https://xyzcompany.supabase.co</code>).
              </li>
              <li>
                Copia la clave <strong>anon / public</strong> (Project API Keys).
              </li>
              <li>
                Pega estos valores en tu archivo <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">.env.local</code> en tu proyecto:
              </li>
            </ol>

            <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 font-mono text-xs text-gray-800">
              <div>NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-publica-aqui</div>
            </div>
          </div>

          {/* PASO 4 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-fire-700 text-white font-black text-sm flex items-center justify-center">
                4
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Desplegar en Vercel (Producción Web & Móvil)
              </h2>
            </div>

            <ol className="list-decimal list-inside text-xs sm:text-sm text-gray-700 space-y-2 ml-2">
              <li>
                Sube tu repositorio a GitHub (o conecta tu cuenta de GitHub en{' '}
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-union-800 hover:underline inline-flex items-center gap-1"
                >
                  vercel.com <ExternalLink className="w-3.5 h-3.5" />
                </a>).
              </li>
              <li>
                En Vercel, presiona <strong>"Add New... ➔ Project"</strong> e importa tu repositorio.
              </li>
              <li>
                En la sección <strong>"Environment Variables"</strong> (Variables de Entorno), agrega:
                <ul className="list-disc list-inside ml-6 mt-1 text-xs text-gray-600">
                  <li><code className="font-mono font-bold">NEXT_PUBLIC_SUPABASE_URL</code> con la URL de tu proyecto.</li>
                  <li><code className="font-mono font-bold">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> con tu clave anon.</li>
                </ul>
              </li>
              <li>
                Haz clic en <strong>"Deploy"</strong>. En menos de 2 minutos tendrás una URL pública y segura (ej: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-xs">https://quemas-la-union.vercel.app</code>) lista para ser usada por todos los frentes, patrullas y supervisores.
              </li>
            </ol>
          </div>

        </div>

      </main>
    </>
  );
}
