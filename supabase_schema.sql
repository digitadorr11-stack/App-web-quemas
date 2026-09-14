-- ====================================================================
-- ESQUEMA MAESTRO V2: CONTROL DE QUEMAS - INGENIO LA UNIÓN
-- REINICIO LIMPIO: SEGURIDAD ESTILO SICA + SUPABASE AUTH NATIVO
-- ====================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. LIMPIEZA TOTAL DE TABLAS ANTERIORES
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.vincular_usuario_google() CASCADE;
DROP FUNCTION IF EXISTS public.gestionar_nuevo_usuario_auth() CASCADE;

DROP TABLE IF EXISTS public.bitacora_auditoria CASCADE;
DROP TABLE IF EXISTS public.solicitudes_quemas CASCADE;
DROP TABLE IF EXISTS public.catalogo_patrullas CASCADE;
DROP TABLE IF EXISTS public.catalogo_frentes CASCADE;
DROP TABLE IF EXISTS public.catalogo_fincas CASCADE;
DROP TABLE IF EXISTS public.perfiles_usuarios CASCADE;

-- 3. TABLA: PERFILES DE USUARIOS (100% VINCULADA A SUPABASE AUTH)
-- NOTA DE SEGURIDAD: NO EXISTE COLUMNA DE PASSWORD EN ESTA TABLA.
-- LAS CREDENCIALES SE GESTIONAN Y CIFRAN DIRECTAMENTE EN auth.users.
CREATE TABLE public.perfiles_usuarios (
    id TEXT PRIMARY KEY,                       -- usr-UUID o auth_id
    auth_id UUID UNIQUE,                       -- Referencia 1:1 a auth.users
    nombre_usuario TEXT,
    correo TEXT UNIQUE NOT NULL,
    nombre_completo TEXT NOT NULL,
    rol TEXT NOT NULL DEFAULT 'pendiente' CHECK (rol IN ('pendiente', 'supervisor_frente', 'supervisor_quemas', 'patrulla', 'digitador', 'jefatura', 'admin')),
    telefono TEXT,
    avatar_url TEXT,
    frente_asignado TEXT,                      -- Ej: "Frente 15"
    turno_actual TEXT,                         -- Ej: "Turno Día (06:00 - 18:00)"
    es_supervisor_descanso BOOLEAN DEFAULT FALSE,
    patrulla_asignada_id TEXT,
    nombre_patrulla_asignada TEXT,
    activo BOOLEAN NOT NULL DEFAULT FALSE,      -- SIEMPRE INACTIVO POR DEFECTO
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLA: CATÁLOGO DE FRENTES DE COSECHA
CREATE TABLE public.catalogo_frentes (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    codigo TEXT,
    tipo_cosecha TEXT NOT NULL DEFAULT 'Mecanizada' CHECK (tipo_cosecha IN ('Mecanizada', 'Manual', 'Mixta')),
    supervisor_turno_a TEXT,
    supervisor_turno_b TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABLA: CATÁLOGO DE PATRULLAS DE QUEMA
CREATE TABLE public.catalogo_patrullas (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    nombre_lider TEXT NOT NULL,
    telefono TEXT NOT NULL,
    codigo_vehiculo TEXT,
    estado TEXT NOT NULL DEFAULT 'DISPONIBLE' CHECK (estado IN ('DISPONIBLE', 'EN_FRENTE', 'EN_QUEMA')),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABLA: CATÁLOGO DE FINCAS
CREATE TABLE public.catalogo_fincas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL UNIQUE,
    codigo TEXT,
    zona TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABLA: SOLICITUDES Y CONTROL OPERATIVO DE QUEMAS
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
    creado_por_usuario_id TEXT NOT NULL,
    creado_por_nombre TEXT NOT NULL,
    
    -- Estado
    estado TEXT NOT NULL DEFAULT 'SOLICITADA' CHECK (
        estado IN ('SOLICITADA', 'PATRULLA_ASIGNADA', 'EN_REVISION', 'REVISION_COMPLETADA', 'VALIDADA', 'EN_QUEMA', 'FINALIZADA', 'CANCELADA')
    ),
    
    -- Asignación de Patrulla
    patrulla_asignada_id TEXT,
    nombre_patrulla_asignada TEXT,
    lider_patrulla_asignada TEXT,
    hora_asignacion_patrulla TIMESTAMP WITH TIME ZONE,
    hora_confirmacion_patrulla TIMESTAMP WITH TIME ZONE,
    hora_llegada_patrulla TIMESTAMP WITH TIME ZONE,
    
    -- Inspección / Revisión en Campo
    duracion_revision_minutos NUMERIC(5,1),
    hora_fin_revision TIMESTAMP WITH TIME ZONE,
    checklist_revision JSONB,
    observaciones_revision TEXT,
    
    -- Validación de Digitador / Supervisor de Quemas
    validado_por_usuario_id TEXT,
    nombre_validador TEXT,
    hora_validacion TIMESTAMP WITH TIME ZONE,
    observaciones_validacion TEXT,
    
    -- Quema Activa
    hora_inicio_quema TIMESTAMP WITH TIME ZONE,
    hora_fin_quema TIMESTAMP WITH TIME ZONE,
    duracion_quema_minutos NUMERIC(5,1),
    
    -- Cancelación
    motivo_cancelacion TEXT,
    cancelado_por_nombre TEXT,
    rol_cancelador TEXT,
    hora_cancelacion TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TABLA: BITÁCORA FORENSE DE AUDITORÍA
CREATE TABLE public.bitacora_auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitud_quema_id TEXT,
    numero_quema TEXT,
    usuario_id TEXT NOT NULL,
    nombre_usuario TEXT NOT NULL,
    rol_usuario TEXT NOT NULL,
    tipo_accion TEXT NOT NULL,
    nombre_campo TEXT,
    valor_anterior TEXT,
    valor_nuevo TEXT,
    motivo_cambio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. HABILITACIÓN DE TIEMPO REAL (REALTIME WEBSOCKETS)
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

-- 10. TRIGGER PARA NUEVOS USUARIOS (GOOGLE O CORREO SUPABASE AUTH)
-- REGLA ESTRICTA: SIEMPRE NACE INACTIVO (activo = FALSE) Y CON ROL 'pendiente'
CREATE OR REPLACE FUNCTION public.gestionar_nuevo_usuario_auth()
RETURNS TRIGGER AS $$
DECLARE
    correo_clean TEXT;
    nombre_clean TEXT;
    avatar_clean TEXT;
BEGIN
    correo_clean := LOWER(TRIM(NEW.email));
    nombre_clean := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(correo_clean, '@', 1)
    );
    avatar_clean := NEW.raw_user_meta_data->>'avatar_url';

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
        split_part(correo_clean, '@', 1),
        correo_clean,
        nombre_clean,
        'pendiente',    -- ROL PENDIENTE: NO PUEDE OPERAR HASTA QUE EL ADMIN ASIGNE SU ROL
        avatar_clean,
        FALSE           -- INACTIVO: REQUIERE APROBACIÓN EXPLÍCITA EN EL PANEL
    )
    ON CONFLICT (correo) DO UPDATE
    SET auth_id = NEW.id,
        avatar_url = COALESCE(avatar_clean, perfiles_usuarios.avatar_url),
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.gestionar_nuevo_usuario_auth();

-- 11. DATOS MAESTROS OFICIALES DE FRENTES DE COSECHA
INSERT INTO public.catalogo_frentes (id, nombre, codigo, tipo_cosecha, supervisor_turno_a, supervisor_turno_b) VALUES
('fr-15', 'Frente 15', 'FR-15', 'Mecanizada', 'Christian Josue Perez Car', 'Oscar Geovany Villalobos Ixcal'),
('fr-16', 'Frente 16', 'FR-16', 'Mecanizada', 'Moises Elizardo Argueta', 'Marvin Castillo'),
('fr-17', 'Frente 17', 'FR-17', 'Manual', 'Angel Leonardo Ortega', 'Elio Omar Noguera'),
('fr-19', 'Frente 19', 'FR-19', 'Manual', 'Leidy Johana Nij Velasquez', 'Marlon Jehu Colorado'),
('fr-23', 'Frente 23', 'FR-23', 'Mixta', 'Wendy Fabiola Aguirre', 'Rosa Lopez'),
('fr-25', 'Frente 25', 'FR-25', 'Mecanizada', 'Oslin Corina Mazariegos', 'Milton Pineda Ovalle')
ON CONFLICT (id) DO NOTHING;

-- 12. DATOS MAESTROS OFICIALES DE PATRULLAS DE QUEMA
INSERT INTO public.catalogo_patrullas (id, nombre, nombre_lider, telefono, codigo_vehiculo, estado) VALUES
('pat-1', 'Patrulla Alfa', 'Juan Pérez', '+502 5555-0301', 'UNI-401', 'DISPONIBLE'),
('pat-2', 'Patrulla Beta', 'Luis Morales', '+502 5555-0302', 'UNI-402', 'DISPONIBLE'),
('pat-3', 'Patrulla Gamma', 'Pedro Ruiz', '+502 5555-0303', 'UNI-403', 'DISPONIBLE'),
('pat-4', 'Patrulla Delta', 'Hugo Estrada', '+502 5555-0304', 'UNI-404', 'DISPONIBLE')
ON CONFLICT (id) DO NOTHING;

-- 13. USUARIO ADMINISTRADOR PRINCIPAL INICIAL
INSERT INTO public.perfiles_usuarios (id, auth_id, nombre_usuario, correo, nombre_completo, rol, activo) VALUES
('usr-admin-principal', NULL, 'admin.quemas', 'digitadorr11@gmail.com', 'Administrador General Quemas', 'admin', TRUE),
('usr-admin-oscar', NULL, 'oscar.morales', 'oscmo76@gmail.com', 'Oscar Josué Morales Herrera', 'admin', TRUE)
ON CONFLICT (correo) DO UPDATE
SET rol = 'admin', activo = TRUE;
