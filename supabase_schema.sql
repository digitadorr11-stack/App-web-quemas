-- ====================================================================
-- ESQUEMA MAESTRO 100% EN ESPAÑOL: CONTROL DE QUEMAS - INGENIO LA UNIÓN
-- (TABLAS Y COLUMNAS TOTALMENTE EN ESPAÑOL + GOOGLE AUTH + REALTIME)
-- ====================================================================

-- 1. LIMPIEZA ABSOLUTA DE TABLAS ANTERIORES
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.fronts CASCADE;
DROP TABLE IF EXISTS public.patrols CASCADE;
DROP TABLE IF EXISTS public.users_app CASCADE;
DROP TABLE IF EXISTS public.burn_audit_logs CASCADE;
DROP TABLE IF EXISTS public.burn_requests CASCADE;
DROP TABLE IF EXISTS public.patrols_catalog CASCADE;
DROP TABLE IF EXISTS public.fronts_catalog CASCADE;
DROP TABLE IF EXISTS public.farms_catalog CASCADE;
DROP TABLE IF EXISTS public.users_profiles CASCADE;

DROP TABLE IF EXISTS public.bitacora_auditoria CASCADE;
DROP TABLE IF EXISTS public.solicitudes_quemas CASCADE;
DROP TABLE IF EXISTS public.catalogo_patrullas CASCADE;
DROP TABLE IF EXISTS public.catalogo_frentes CASCADE;
DROP TABLE IF EXISTS public.catalogo_fincas CASCADE;
DROP TABLE IF EXISTS public.perfiles_usuarios CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: PERFILES DE USUARIOS (CREDENCIALES Y GOOGLE AUTH)
CREATE TABLE public.perfiles_usuarios (
    id TEXT PRIMARY KEY,
    auth_id UUID, -- Vinculación automática con auth.users de Google
    nombre_usuario TEXT UNIQUE,
    password TEXT DEFAULT 'frente123',
    pin TEXT DEFAULT '1234',
    correo TEXT UNIQUE,
    nombre_completo TEXT NOT NULL,
    rol TEXT NOT NULL CHECK (rol IN ('supervisor_frente', 'supervisor_quemas', 'patrulla', 'digitador', 'jefatura', 'admin')),
    telefono TEXT,
    avatar_url TEXT,
    frente_asignado TEXT,
    turno_actual TEXT,
    es_supervisor_descanso BOOLEAN DEFAULT FALSE,
    patrulla_asignada_id TEXT,
    nombre_patrulla_asignada TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA: CATÁLOGO DE FRENTES DE COSECHA
CREATE TABLE public.catalogo_frentes (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    codigo TEXT,
    tipo_cosecha TEXT NOT NULL DEFAULT 'Mecanizada' CHECK (tipo_cosecha IN ('Mecanizada', 'Manual', 'Mixta')),
    supervisor_turno_a TEXT,
    supervisor_turno_b TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLA: CATÁLOGO DE PATRULLAS DE QUEMA
CREATE TABLE public.catalogo_patrullas (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    nombre_lider TEXT NOT NULL,
    telefono TEXT NOT NULL,
    codigo_vehiculo TEXT,
    estado TEXT NOT NULL DEFAULT 'DISPONIBLE' CHECK (estado IN ('DISPONIBLE', 'EN_FRENTE', 'EN_QUEMA')),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABLA: CATÁLOGO DE FINCAS Y ZONAS
CREATE TABLE public.catalogo_fincas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL UNIQUE,
    codigo TEXT,
    zona TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABLA: SOLICITUDES Y CONTROL OPERATIVO DE QUEMAS
CREATE TABLE public.solicitudes_quemas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_quema TEXT NOT NULL UNIQUE,
    tipo_quema TEXT NOT NULL DEFAULT 'PROGRAMADA' CHECK (tipo_quema IN ('PROGRAMADA', 'CRIMINAL')),
    numero_frente TEXT NOT NULL,
    nombre_turno TEXT,
    nombre_supervisor_frente TEXT NOT NULL,
    nombre_finca TEXT NOT NULL,
    lote_um TEXT,
    area_hectareas NUMERIC(10,2) NOT NULL DEFAULT 0,
    area_manzanas NUMERIC(10,2) NOT NULL DEFAULT 0,
    tonelaje_estimado NUMERIC(10,2) NOT NULL DEFAULT 0,
    hora_programada TIMESTAMP WITH TIME ZONE NOT NULL,
    hora_solicitud TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Creador
    creado_por_usuario_id TEXT NOT NULL,
    creado_por_nombre TEXT NOT NULL,
    
    -- Estado
    estado TEXT NOT NULL DEFAULT 'SOLICITADA' CHECK (
        estado IN (
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
    
    -- Asignación de Patrulla y Tiempos
    patrulla_asignada_id TEXT,
    nombre_patrulla_asignada TEXT,
    lider_patrulla_asignada TEXT,
    hora_asignacion_patrulla TIMESTAMP WITH TIME ZONE,
    hora_confirmacion_patrulla TIMESTAMP WITH TIME ZONE,
    hora_llegada_patrulla TIMESTAMP WITH TIME ZONE,
    duracion_revision_minutos INTEGER,
    hora_fin_revision TIMESTAMP WITH TIME ZONE,
    checklist_revision JSONB DEFAULT '{
        "firebreak_verified": false,
        "wind_conditions_favorable": false,
        "neighboring_crops_safe": false,
        "water_tank_ready": false,
        "personnel_equipped": false
    }'::jsonb,
    observaciones_revision TEXT,
    
    -- Validación Técnica por Digitador
    validado_por_usuario_id TEXT,
    nombre_validador TEXT,
    hora_validacion TIMESTAMP WITH TIME ZONE,
    observaciones_validacion TEXT,
    
    -- Quema en Campo y Liquidación
    hora_inicio_quema TIMESTAMP WITH TIME ZONE,
    hora_fin_quema TIMESTAMP WITH TIME ZONE,
    duracion_quema_minutos INTEGER,
    
    -- Cancelación
    motivo_cancelacion TEXT,
    cancelado_por_nombre TEXT,
    rol_cancelador TEXT,
    hora_cancelacion TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABLA: BITÁCORA DE AUDITORÍA
CREATE TABLE public.bitacora_auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitud_quema_id UUID REFERENCES public.solicitudes_quemas(id) ON DELETE CASCADE,
    numero_quema TEXT,
    usuario_id TEXT NOT NULL,
    nombre_usuario TEXT NOT NULL,
    rol_usuario TEXT NOT NULL,
    tipo_accion TEXT NOT NULL,
    campo_modificado TEXT,
    valor_anterior TEXT,
    valor_nuevo TEXT,
    motivo_cambio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. POLÍTICAS DE ACCESO (RLS)
ALTER TABLE public.catalogo_frentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogo_patrullas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogo_fincas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfiles_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitudes_quemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bitacora_auditoria ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acceso a catalogo_frentes" ON public.catalogo_frentes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acceso a catalogo_patrullas" ON public.catalogo_patrullas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acceso a catalogo_fincas" ON public.catalogo_fincas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acceso a perfiles_usuarios" ON public.perfiles_usuarios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acceso a solicitudes_quemas" ON public.solicitudes_quemas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acceso a bitacora_auditoria" ON public.bitacora_auditoria FOR ALL USING (true) WITH CHECK (true);

-- 9. ACTIVACIÓN DE WEBSOCKETS EN TIEMPO REAL
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.solicitudes_quemas;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.bitacora_auditoria;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.catalogo_patrullas;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.catalogo_frentes;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.catalogo_fincas;
    EXCEPTION WHEN duplicate_object THEN NULL; END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.perfiles_usuarios;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;

-- 10. TRIGGER PARA GOOGLE AUTH (VINCULACIÓN AUTOMÁTICA EN ESPAÑOL)
CREATE OR REPLACE FUNCTION public.vincular_usuario_google()
RETURNS TRIGGER AS $$
DECLARE
    perfil_existente_id TEXT;
    correo_usuario TEXT;
    nombre_usuario TEXT;
    avatar_usuario TEXT;
BEGIN
    correo_usuario := NEW.email;
    nombre_usuario := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(correo_usuario, '@', 1));
    avatar_usuario := NEW.raw_user_meta_data->>'avatar_url';

    SELECT id INTO perfil_existente_id FROM public.perfiles_usuarios WHERE correo = correo_usuario LIMIT 1;

    IF perfil_existente_id IS NOT NULL THEN
        UPDATE public.perfiles_usuarios
        SET auth_id = NEW.id,
            avatar_url = COALESCE(avatar_usuario, avatar_url),
            updated_at = NOW()
        WHERE id = perfil_existente_id;
    ELSE
        INSERT INTO public.perfiles_usuarios (
            id,
            auth_id,
            nombre_usuario,
            correo,
            nombre_completo,
            rol,
            avatar_url,
            activo
        ) VALUES (
            'usr-' || substr(NEW.id::text, 1, 8),
            NEW.id,
            split_part(correo_usuario, '@', 1),
            correo_usuario,
            nombre_usuario,
            'supervisor_frente',
            avatar_usuario,
            TRUE
        )
        ON CONFLICT (correo) DO UPDATE
        SET auth_id = NEW.id,
            avatar_url = EXCLUDED.avatar_url;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.vincular_usuario_google();

-- 11. DATOS SEMILLA EN ESPAÑOL (FRENTES, PATRULLAS, USUARIOS)
INSERT INTO public.catalogo_frentes (id, nombre, codigo, tipo_cosecha, supervisor_turno_a, supervisor_turno_b) VALUES
('fr-15', 'Frente 15', 'FR-15', 'Mecanizada', 'Christian Josue Perez Car', 'Oscar Geovany Villalobos Ixcal'),
('fr-16', 'Frente 16', 'FR-16', 'Mecanizada', 'Moises Elizardo Argueta', 'Marvin Castillo'),
('fr-17', 'Frente 17', 'FR-17', 'Manual', 'Angel Leonardo Ortega', 'Elio Omar Noguera'),
('fr-19', 'Frente 19', 'FR-19', 'Manual', 'Leidy Johana Nij Velasquez', 'Marlon Jehu Colorado'),
('fr-23', 'Frente 23', 'FR-23', 'Mixta', 'Wendy Fabiola Aguirre', 'Rosa Lopez'),
('fr-25', 'Frente 25', 'FR-25', 'Mecanizada', 'Oslin Corina Mazariegos', 'Milton Pineda Ovalle')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.catalogo_patrullas (id, nombre, nombre_lider, telefono, codigo_vehiculo, estado) VALUES
('pat-1', 'Patrulla Alfa', 'Juan Pérez', '+502 5555-0301', 'UNI-401', 'DISPONIBLE'),
('pat-2', 'Patrulla Beta', 'Luis Morales', '+502 5555-0302', 'UNI-402', 'DISPONIBLE'),
('pat-3', 'Patrulla Gamma', 'Pedro Ruiz', '+502 5555-0303', 'UNI-403', 'DISPONIBLE'),
('pat-4', 'Patrulla Delta', 'Hugo Estrada', '+502 5555-0304', 'UNI-404', 'DISPONIBLE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.perfiles_usuarios (id, nombre_usuario, password, pin, nombre_completo, correo, rol, telefono, frente_asignado, turno_actual, es_supervisor_descanso) VALUES
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
