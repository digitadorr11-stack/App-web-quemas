-- ====================================================================
-- ESQUEMA LIMPIO DE BASE DE DATOS MAESTRA: CONTROL DE QUEMAS
-- INGENIO LA UNIÓN (100% TIEMPO REAL + GOOGLE AUTH + AUDITORÍA)
-- ====================================================================

-- 1. LIMPIEZA TOTAL (DROP TABLES CON CASCADE PARA EMPEZAR DE CERO)
DROP TABLE IF EXISTS public.burn_audit_logs CASCADE;
DROP TABLE IF EXISTS public.burn_requests CASCADE;
DROP TABLE IF EXISTS public.patrols_catalog CASCADE;
DROP TABLE IF EXISTS public.fronts_catalog CASCADE;
DROP TABLE IF EXISTS public.farms_catalog CASCADE;
DROP TABLE IF EXISTS public.users_profiles CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: PERFILES DE USUARIO Y CREDENCIALES
CREATE TABLE public.users_profiles (
    id TEXT PRIMARY KEY,
    auth_id UUID, -- Vinculación con auth.users de Supabase (Google OAuth)
    username TEXT UNIQUE,
    password TEXT DEFAULT 'frente123',
    pin TEXT DEFAULT '1234',
    email TEXT UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('supervisor_frente', 'supervisor_quemas', 'patrulla', 'digitador', 'jefatura', 'admin')),
    phone TEXT,
    avatar_url TEXT,
    assigned_front TEXT,
    current_shift TEXT,
    is_relief_supervisor BOOLEAN DEFAULT FALSE,
    assigned_patrol_id TEXT,
    assigned_patrol_name TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA: CATÁLOGO DE FRENTES DE COSECHA
CREATE TABLE public.fronts_catalog (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    code TEXT,
    harvest_type TEXT NOT NULL DEFAULT 'Mecanizada' CHECK (harvest_type IN ('Mecanizada', 'Manual', 'Mixta')),
    supervisor_turno_a TEXT,
    supervisor_turno_b TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLA: CATÁLOGO DE PATRULLAS DE QUEMA
CREATE TABLE public.patrols_catalog (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    leader_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    vehicle_code TEXT,
    status TEXT NOT NULL DEFAULT 'DISPONIBLE' CHECK (status IN ('DISPONIBLE', 'EN_FRENTE', 'EN_QUEMA')),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABLA: CATÁLOGO DE FINCAS Y ZONAS
CREATE TABLE public.farms_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT,
    zone TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABLA: SOLICITUDES Y CONTROL OPERATIVO DE QUEMAS
CREATE TABLE public.burn_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    burn_number TEXT NOT NULL UNIQUE,
    burn_type TEXT NOT NULL DEFAULT 'PROGRAMADA' CHECK (burn_type IN ('PROGRAMADA', 'CRIMINAL')),
    front_number TEXT NOT NULL,
    shift_name TEXT,
    shift_supervisor_name TEXT NOT NULL,
    farm_name TEXT NOT NULL,
    lote_um TEXT,
    area_hectares NUMERIC(10,2) NOT NULL DEFAULT 0,
    area_manzanas NUMERIC(10,2) NOT NULL DEFAULT 0,
    estimated_tonnage NUMERIC(10,2) NOT NULL DEFAULT 0,
    planned_burn_time TIMESTAMP WITH TIME ZONE NOT NULL,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Creador
    created_by_user_id TEXT NOT NULL,
    created_by_name TEXT NOT NULL,
    
    -- Estado
    status TEXT NOT NULL DEFAULT 'SOLICITADA' CHECK (
        status IN (
            'SOLICITADA',
            'PATRULLA_ASIGNADA',
            'EN_REVISION',
            'REVISION_COMPLETADA',
            'VALIDADA',
            'EN_QUEMA',
            'FINALIZADA',
            'CANCELADA'
        )
    ),
    
    -- Patrulla y Tiempos de Campo
    assigned_patrol_id TEXT,
    assigned_patrol_name TEXT,
    assigned_patrol_leader TEXT,
    patrol_assigned_at TIMESTAMP WITH TIME ZONE,
    patrol_confirmed_at TIMESTAMP WITH TIME ZONE,
    patrol_arrived_at TIMESTAMP WITH TIME ZONE,
    review_duration_minutes INTEGER,
    review_completed_at TIMESTAMP WITH TIME ZONE,
    review_checklist JSONB DEFAULT '{
        "firebreak_verified": false,
        "wind_conditions_favorable": false,
        "neighboring_crops_safe": false,
        "water_tank_ready": false,
        "personnel_equipped": false
    }'::jsonb,
    review_notes TEXT,
    
    -- Validación Técnica (Digitador)
    validated_by_user_id TEXT,
    validated_by_name TEXT,
    validated_at TIMESTAMP WITH TIME ZONE,
    validation_notes TEXT,
    
    -- Quema Activa y Liquidación
    burn_started_at TIMESTAMP WITH TIME ZONE,
    burn_ended_at TIMESTAMP WITH TIME ZONE,
    burn_duration_minutes INTEGER,
    
    -- Cancelación
    cancellation_reason TEXT,
    cancelled_by_name TEXT,
    cancelled_by_role TEXT,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABLA: BITÁCORA / AUDITORÍA INMUTABLE
CREATE TABLE public.burn_audit_logs (
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

-- 8. POLÍTICAS DE SEGURIDAD (RLS)
ALTER TABLE public.fronts_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patrols_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.burn_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.burn_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir todo a anon y authenticated para fronts_catalog" ON public.fronts_catalog FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon y authenticated para patrols_catalog" ON public.patrols_catalog FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon y authenticated para farms_catalog" ON public.farms_catalog FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon y authenticated para users_profiles" ON public.users_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon y authenticated para burn_requests" ON public.burn_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon y authenticated para burn_audit_logs" ON public.burn_audit_logs FOR ALL USING (true) WITH CHECK (true);

-- 9. ACTIVACIÓN DE SUPABASE REALTIME (WEBSOCKETS) EN TODAS LAS TABLAS
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.burn_requests;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.burn_audit_logs;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.patrols_catalog;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.fronts_catalog;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.farms_catalog;
    EXCEPTION WHEN duplicate_object THEN NULL; END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.users_profiles;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;

-- 10. TRIGGER PARA VINCULAR AUTOMÁTICAMENTE GOOGLE AUTH CON USERS_PROFILES
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
    existing_profile_id TEXT;
    user_email TEXT;
    user_full_name TEXT;
    user_avatar TEXT;
BEGIN
    user_email := NEW.email;
    user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(user_email, '@', 1));
    user_avatar := NEW.raw_user_meta_data->>'avatar_url';

    -- Verificar si ya existe un perfil con ese correo electrónico
    SELECT id INTO existing_profile_id FROM public.users_profiles WHERE email = user_email LIMIT 1;

    IF existing_profile_id IS NOT NULL THEN
        -- Actualizar el auth_id y avatar del perfil existente
        UPDATE public.users_profiles
        SET auth_id = NEW.id,
            avatar_url = COALESCE(user_avatar, avatar_url),
            updated_at = NOW()
        WHERE id = existing_profile_id;
    ELSE
        -- Crear un perfil inicial para el nuevo usuario de Google
        INSERT INTO public.users_profiles (
            id,
            auth_id,
            username,
            email,
            full_name,
            role,
            avatar_url,
            active
        ) VALUES (
            'usr-' || substr(NEW.id::text, 1, 8),
            NEW.id,
            split_part(user_email, '@', 1),
            user_email,
            user_full_name,
            'supervisor_frente', -- Rol por defecto inicial (puede ser cambiado por el Digitador/Admin)
            user_avatar,
            TRUE
        )
        ON CONFLICT (email) DO UPDATE
        SET auth_id = NEW.id,
            avatar_url = EXCLUDED.avatar_url;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sobre auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- 11. DATOS SEMILLA OFICIALES (FRENTES, PATRULLAS, USUARIOS)
INSERT INTO public.fronts_catalog (id, name, code, harvest_type, supervisor_turno_a, supervisor_turno_b) VALUES
('fr-15', 'Frente 15', 'FR-15', 'Mecanizada', 'Christian Josue Perez Car', 'Oscar Geovany Villalobos Ixcal'),
('fr-16', 'Frente 16', 'FR-16', 'Mecanizada', 'Moises Elizardo Argueta', 'Marvin Castillo'),
('fr-17', 'Frente 17', 'FR-17', 'Manual', 'Angel Leonardo Ortega', 'Elio Omar Noguera'),
('fr-19', 'Frente 19', 'FR-19', 'Manual', 'Leidy Johana Nij Velasquez', 'Marlon Jehu Colorado'),
('fr-23', 'Frente 23', 'FR-23', 'Mixta', 'Wendy Fabiola Aguirre', 'Rosa Lopez'),
('fr-25', 'Frente 25', 'FR-25', 'Mecanizada', 'Oslin Corina Mazariegos', 'Milton Pineda Ovalle')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.patrols_catalog (id, name, leader_name, phone, vehicle_code, status) VALUES
('pat-1', 'Patrulla Alfa', 'Juan Pérez', '+502 5555-0301', 'UNI-401', 'DISPONIBLE'),
('pat-2', 'Patrulla Beta', 'Luis Morales', '+502 5555-0302', 'UNI-402', 'DISPONIBLE'),
('pat-3', 'Patrulla Gamma', 'Pedro Ruiz', '+502 5555-0303', 'UNI-403', 'DISPONIBLE'),
('pat-4', 'Patrulla Delta', 'Hugo Estrada', '+502 5555-0304', 'UNI-404', 'DISPONIBLE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users_profiles (id, username, password, pin, full_name, email, role, phone, assigned_front, current_shift, is_relief_supervisor) VALUES
('usr-frente-15a', 'christian.perez', 'frente123', '1501', 'Christian Josue Perez Car', 'christian.perez@launion.com', 'supervisor_frente', '+502 5555-1501', 'Frente 15', 'Turno Día (06:00 - 18:00)', false),
('usr-frente-15b', 'oscar.villalobos', 'frente123', '1502', 'Oscar Geovany Villalobos Ixcal', 'oscar.villalobos@launion.com', 'supervisor_frente', '+502 5555-1502', 'Frente 15', 'Turno Noche (18:00 - 06:00)', false),
('usr-frente-16a', 'moises.argueta', 'frente123', '1601', 'Moises Elizardo Argueta', 'moises.argueta@launion.com', 'supervisor_frente', '+502 5555-1601', 'Frente 16', 'Turno Día (06:00 - 18:00)', false),
('usr-frente-16b', 'marvin.castillo', 'frente123', '1602', 'Marvin Castillo', 'marvin.castillo@launion.com', 'supervisor_frente', '+502 5555-1602', 'Frente 16', 'Turno Noche (18:00 - 06:00)', false),
('usr-frente-17a', 'angel.ortega', 'frente123', '1701', 'Angel Leonardo Ortega', 'angel.ortega@launion.com', 'supervisor_frente', '+502 5555-1701', 'Frente 17', 'Turno Día (06:00 - 18:00)', false),
('usr-frente-17b', 'elio.noguera', 'frente123', '1702', 'Elio Omar Noguera', 'elio.noguera@launion.com', 'supervisor_frente', '+502 5555-1702', 'Frente 17', 'Turno Noche (18:00 - 06:00)', false),
('usr-frente-19a', 'leidy.nij', 'frente123', '1901', 'Leidy Johana Nij Velasquez', 'leidy.nij@launion.com', 'supervisor_frente', '+502 5555-1901', 'Frente 19', 'Turno Día (06:00 - 18:00)', false),
('usr-frente-19b', 'marlon.colorado', 'frente123', '1902', 'Marlon Jehu Colorado', 'marlon.colorado@launion.com', 'supervisor_frente', '+502 5555-1902', 'Frente 19', 'Turno Noche (18:00 - 06:00)', false),
('usr-frente-23a', 'wendy.aguirre', 'frente123', '2301', 'Wendy Fabiola Aguirre', 'wendy.aguirre@launion.com', 'supervisor_frente', '+502 5555-2301', 'Frente 23', 'Turno Día (06:00 - 18:00)', false),
('usr-frente-23b', 'rosa.lopez', 'frente123', '2302', 'Rosa Lopez', 'rosa.lopez@launion.com', 'supervisor_frente', '+502 5555-2302', 'Frente 23', 'Turno Noche (18:00 - 06:00)', false),
('usr-frente-25a', 'oslin.mazariegos', 'frente123', '2501', 'Oslin Corina Mazariegos', 'oslin.mazariegos@launion.com', 'supervisor_frente', '+502 5555-2501', 'Frente 25', 'Turno Día (06:00 - 18:00)', false),
('usr-frente-25b', 'milton.pineda', 'frente123', '2502', 'Milton Pineda Ovalle', 'milton.pineda@launion.com', 'supervisor_frente', '+502 5555-2502', 'Frente 25', 'Turno Noche (18:00 - 06:00)', false),
('usr-frente-desc1', 'rodolfo.samayoa', 'frente123', '9001', 'Rodolfo Elvira Samayoa', 'rodolfo.samayoa@launion.com', 'supervisor_frente', '+502 5555-9001', 'Frente 15', 'Relevo / Cobertura de Descanso', true),
('usr-frente-desc2', 'jaqueline.muxin', 'frente123', '9002', 'Jaqueline Viviana Muxin', 'jaqueline.muxin@launion.com', 'supervisor_frente', '+502 5555-9002', 'Frente 16', 'Relevo / Cobertura de Descanso', true),
('usr-quemas-1', 'mario.estrada', 'quemas123', '2001', 'Ing. Mario Estrada', 'mario.estrada@launion.com', 'supervisor_quemas', '+502 5555-0201', NULL, NULL, false),
('usr-patrulla-1', 'patrulla.alfa', 'patrulla123', '3001', 'Patrulla Alfa (Juan Pérez)', 'patrulla.alfa@launion.com', 'patrulla', '+502 5555-0301', NULL, NULL, false),
('usr-patrulla-2', 'patrulla.beta', 'patrulla123', '3002', 'Patrulla Beta (Luis Morales)', 'patrulla.beta@launion.com', 'patrulla', '+502 5555-0302', NULL, NULL, false),
('usr-digitador-1', 'ana.castillo', 'digitador123', '4001', 'Ana Lucía Castillo', 'ana.castillo@launion.com', 'digitador', '+502 5555-0401', NULL, NULL, false),
('usr-jefatura-1', 'fernando.alvarado', 'jefatura123', '5001', 'Lic. Fernando Alvarado', 'fernando.alvarado@launion.com', 'jefatura', '+502 5555-0501', NULL, NULL, false)
ON CONFLICT (id) DO NOTHING;
