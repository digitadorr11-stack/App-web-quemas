-- ====================================================================
-- ESQUEMA MAESTRO SUPABASE V2.0: CONTROL DE QUEMAS - INGENIO LA UNIÓN
-- SEGURIDAD RIGUROSA: ROW LEVEL SECURITY (RLS) + SUPABASE AUTH NATIVO
-- ====================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. LIMPIEZA DE TRIGGERS Y FUNCIONES PREVIAS
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.gestionar_nuevo_usuario_auth() CASCADE;
DROP FUNCTION IF EXISTS public.current_user_role() CASCADE;
DROP FUNCTION IF EXISTS public.is_user_active() CASCADE;

-- 3. TABLA: PERFILES DE USUARIOS (VINCULADA 1:1 CON auth.users)
-- REGLA CRÍTICA DE SEGURIDAD:
-- NO almacena contraseñas. Supabase Auth cifra y resguarda los passwords en auth.users con Bcrypt/Argon2.
CREATE TABLE IF NOT EXISTS public.perfiles_usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    correo TEXT UNIQUE NOT NULL,
    nombre_completo TEXT NOT NULL,
    rol TEXT NOT NULL DEFAULT 'pendiente' CHECK (
        rol IN ('admin', 'digitador', 'jefatura', 'supervisor_quemas', 'supervisor_frente', 'patrulla', 'pendiente')
    ),
    telefono TEXT,
    frente_asignado TEXT,
    turno_actual TEXT,
    activo BOOLEAN NOT NULL DEFAULT FALSE, -- Inactivo por defecto hasta que un admin lo active
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA: CATÁLOGO DE FRENTES DE COSECHA
CREATE TABLE IF NOT EXISTS public.catalogo_frentes (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    codigo TEXT,
    tipo_cosecha TEXT NOT NULL DEFAULT 'Mecanizada' CHECK (tipo_cosecha IN ('Mecanizada', 'Manual', 'Mixta')),
    supervisor_turno_a TEXT,
    supervisor_turno_b TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA: CATÁLOGO DE PATRULLAS DE QUEMA
CREATE TABLE IF NOT EXISTS public.catalogo_patrullas (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    nombre_lider TEXT NOT NULL,
    telefono TEXT NOT NULL,
    codigo_vehiculo TEXT,
    estado TEXT NOT NULL DEFAULT 'DISPONIBLE' CHECK (estado IN ('DISPONIBLE', 'EN_FRENTE', 'EN_QUEMA')),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLA: CATÁLOGO DE FINCAS
CREATE TABLE IF NOT EXISTS public.catalogo_fincas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL UNIQUE,
    codigo TEXT,
    zona TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABLA: SOLICITUDES Y CONTROL OPERATIVO DE QUEMAS
CREATE TABLE IF NOT EXISTS public.solicitudes_quemas (
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
    hora_programada TIMESTAMPTZ NOT NULL,
    hora_solicitud TIMESTAMPTZ DEFAULT NOW(),
    creado_por_usuario_id UUID NOT NULL REFERENCES auth.users(id),
    creado_por_nombre TEXT NOT NULL,
    
    -- Estado Operativo
    estado TEXT NOT NULL DEFAULT 'SOLICITADA' CHECK (
        estado IN ('SOLICITADA', 'PATRULLA_ASIGNADA', 'EN_REVISION', 'REVISION_COMPLETADA', 'VALIDADA', 'EN_QUEMA', 'FINALIZADA', 'CANCELADA')
    ),
    
    -- Asignación de Patrulla
    patrulla_asignada_id TEXT,
    nombre_patrulla_asignada TEXT,
    lider_patrulla_asignada TEXT,
    hora_asignacion_patrulla TIMESTAMPTZ,
    hora_confirmacion_patrulla TIMESTAMPTZ,
    hora_llegada_patrulla TIMESTAMPTZ,
    
    -- Inspección de Campo
    duracion_revision_minutos NUMERIC(5,1),
    hora_fin_revision TIMESTAMPTZ,
    checklist_revision JSONB,
    observaciones_revision TEXT,
    
    -- Validación
    validado_por_usuario_id UUID REFERENCES auth.users(id),
    nombre_validador TEXT,
    hora_validacion TIMESTAMPTZ,
    observaciones_validacion TEXT,
    
    -- Ejecución
    hora_inicio_quema TIMESTAMPTZ,
    hora_fin_quema TIMESTAMPTZ,
    duracion_quema_minutos NUMERIC(5,1),
    
    -- Cancelación
    motivo_cancelacion TEXT,
    cancelado_por_nombre TEXT,
    rol_cancelador TEXT,
    hora_cancelacion TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABLA: BITÁCORA FORENSE DE AUDITORÍA
CREATE TABLE IF NOT EXISTS public.bitacora_auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitud_quema_id UUID REFERENCES public.solicitudes_quemas(id) ON DELETE SET NULL,
    numero_quema TEXT,
    usuario_id UUID NOT NULL REFERENCES auth.users(id),
    nombre_usuario TEXT NOT NULL,
    rol_usuario TEXT NOT NULL,
    tipo_accion TEXT NOT NULL,
    nombre_campo TEXT,
    valor_anterior TEXT,
    valor_nuevo TEXT,
    motivo_cambio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- FUNCIONES HELPER PARA RLS (SECURITY DEFINER)
-- ====================================================================

-- Obtener rol del usuario autenticado
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT rol FROM public.perfiles_usuarios WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Verificar si el usuario está activo y aprobado
CREATE OR REPLACE FUNCTION public.is_user_active()
RETURNS BOOLEAN AS $$
  SELECT COALESCE((SELECT activo FROM public.perfiles_usuarios WHERE id = auth.uid()), FALSE);
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ====================================================================
-- HABILITACIÓN DE ROW LEVEL SECURITY (RLS) EN TODAS LAS TABLAS
-- ====================================================================

ALTER TABLE public.perfiles_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogo_frentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogo_patrullas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogo_fincas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitudes_quemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bitacora_auditoria ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- POLÍTICAS RLS: PERFILES DE USUARIOS (public.perfiles_usuarios)
-- REGLA: NADIE PÚBLICO (anon) PUEDE VER INFORMACIÓN DE USUARIOS
-- ====================================================================

DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON public.perfiles_usuarios;
CREATE POLICY "Usuarios pueden ver su propio perfil"
ON public.perfiles_usuarios
FOR SELECT
TO authenticated
USING (
    auth.uid() = id OR public.current_user_role() IN ('admin', 'digitador')
);

DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil basico" ON public.perfiles_usuarios;
CREATE POLICY "Usuarios pueden actualizar su propio perfil basico"
ON public.perfiles_usuarios
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
    -- Un usuario normal NO puede elevar su rol ni activarse a sí mismo
    (auth.uid() = id AND rol = (SELECT rol FROM public.perfiles_usuarios WHERE id = auth.uid()) AND activo = (SELECT activo FROM public.perfiles_usuarios WHERE id = auth.uid()))
    OR public.current_user_role() = 'admin'
);

DROP POLICY IF EXISTS "Solo administradores pueden insertar perfiles manualmente" ON public.perfiles_usuarios;
CREATE POLICY "Solo administradores pueden insertar perfiles manualmente"
ON public.perfiles_usuarios
FOR INSERT
TO authenticated
WITH CHECK (public.current_user_role() = 'admin');

-- ====================================================================
-- POLÍTICAS RLS: CATÁLOGOS (Frentes, Patrullas, Fincas)
-- REGLA: SOLO USUARIOS AUTENTICADOS Y ACTIVOS PUEDEN LEER
--        SOLO ADMIN O DIGITADOR PUEDEN MODIFICAR
-- ====================================================================

-- FRENTES
DROP POLICY IF EXISTS "Lectura de frentes para usuarios activos" ON public.catalogo_frentes;
CREATE POLICY "Lectura de frentes para usuarios activos"
ON public.catalogo_frentes
FOR SELECT
TO authenticated
USING (public.is_user_active() = TRUE);

DROP POLICY IF EXISTS "Gestion de frentes por admin y digitador" ON public.catalogo_frentes;
CREATE POLICY "Gestion de frentes por admin y digitador"
ON public.catalogo_frentes
FOR ALL
TO authenticated
USING (public.current_user_role() IN ('admin', 'digitador'))
WITH CHECK (public.current_user_role() IN ('admin', 'digitador'));

-- PATRULLAS
DROP POLICY IF EXISTS "Lectura de patrullas para usuarios activos" ON public.catalogo_patrullas;
CREATE POLICY "Lectura de patrullas para usuarios activos"
ON public.catalogo_patrullas
FOR SELECT
TO authenticated
USING (public.is_user_active() = TRUE);

DROP POLICY IF EXISTS "Gestion de patrullas por admin y digitador" ON public.catalogo_patrullas;
CREATE POLICY "Gestion de patrullas por admin y digitador"
ON public.catalogo_patrullas
FOR ALL
TO authenticated
USING (public.current_user_role() IN ('admin', 'digitador'))
WITH CHECK (public.current_user_role() IN ('admin', 'digitador'));

-- FINCAS
DROP POLICY IF EXISTS "Lectura de fincas para usuarios activos" ON public.catalogo_fincas;
CREATE POLICY "Lectura de fincas para usuarios activos"
ON public.catalogo_fincas
FOR SELECT
TO authenticated
USING (public.is_user_active() = TRUE);

DROP POLICY IF EXISTS "Gestion de fincas por admin y digitador" ON public.catalogo_fincas;
CREATE POLICY "Gestion de fincas por admin y digitador"
ON public.catalogo_fincas
FOR ALL
TO authenticated
USING (public.current_user_role() IN ('admin', 'digitador'))
WITH CHECK (public.current_user_role() IN ('admin', 'digitador'));

-- ====================================================================
-- POLÍTICAS RLS: SOLICITUDES DE QUEMAS (public.solicitudes_quemas)
-- ====================================================================

DROP POLICY IF EXISTS "Usuarios activos pueden ver solicitudes" ON public.solicitudes_quemas;
CREATE POLICY "Usuarios activos pueden ver solicitudes"
ON public.solicitudes_quemas
FOR SELECT
TO authenticated
USING (public.is_user_active() = TRUE);

DROP POLICY IF EXISTS "Supervisores y digitadores pueden crear solicitudes" ON public.solicitudes_quemas;
CREATE POLICY "Supervisores y digitadores pueden crear solicitudes"
ON public.solicitudes_quemas
FOR INSERT
TO authenticated
WITH CHECK (
    public.is_user_active() = TRUE 
    AND public.current_user_role() IN ('supervisor_frente', 'supervisor_quemas', 'digitador', 'admin')
    AND auth.uid() = creado_por_usuario_id
);

DROP POLICY IF EXISTS "Roles autorizados pueden actualizar solicitudes" ON public.solicitudes_quemas;
CREATE POLICY "Roles autorizados pueden actualizar solicitudes"
ON public.solicitudes_quemas
FOR UPDATE
TO authenticated
USING (
    public.is_user_active() = TRUE 
    AND public.current_user_role() IN ('supervisor_frente', 'supervisor_quemas', 'patrulla', 'digitador', 'admin')
);

-- ====================================================================
-- POLÍTICAS RLS: BITÁCORA DE AUDITORÍA (INMUTABLE)
-- ====================================================================

DROP POLICY IF EXISTS "Lectura de bitacora restringida a jefatura y administracion" ON public.bitacora_auditoria;
CREATE POLICY "Lectura de bitacora restringida a jefatura y administracion"
ON public.bitacora_auditoria
FOR SELECT
TO authenticated
USING (
    public.is_user_active() = TRUE 
    AND public.current_user_role() IN ('admin', 'digitador', 'jefatura')
);

DROP POLICY IF EXISTS "Insercion de auditoria para usuarios autenticados" ON public.bitacora_auditoria;
CREATE POLICY "Insercion de auditoria para usuarios autenticados"
ON public.bitacora_auditoria
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = usuario_id);

-- BLOQUEO ESTRICTO: Nadie puede modificar ni borrar registros de auditoría
-- (No se crean políticas de UPDATE ni DELETE para bitacora_auditoria)

-- ====================================================================
-- TRIGGER AUTOMÁTICO: REGISTRO SEGURO DE USUARIO DESDE auth.users
-- ====================================================================
CREATE OR REPLACE FUNCTION public.gestionar_nuevo_usuario_auth()
RETURNS TRIGGER AS $$
DECLARE
    correo_clean TEXT;
    nombre_clean TEXT;
BEGIN
    correo_clean := LOWER(TRIM(NEW.email));
    nombre_clean := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(correo_clean, '@', 1)
    );

    -- Los administradores principales quedan activos automáticamente si coinciden con los correos oficiales
    INSERT INTO public.perfiles_usuarios (
        id,
        correo,
        nombre_completo,
        rol,
        activo
    ) VALUES (
        NEW.id,
        correo_clean,
        nombre_clean,
        CASE 
            WHEN correo_clean IN ('digitadorr11@gmail.com', 'oscmo76@gmail.com') THEN 'admin'
            ELSE 'pendiente'
        END,
        CASE 
            WHEN correo_clean IN ('digitadorr11@gmail.com', 'oscmo76@gmail.com') THEN TRUE
            ELSE FALSE
        END
    )
    ON CONFLICT (id) DO UPDATE
    SET correo = EXCLUDED.correo,
        nombre_completo = COALESCE(perfiles_usuarios.nombre_completo, EXCLUDED.nombre_completo),
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.gestionar_nuevo_usuario_auth();

-- ====================================================================
-- DATOS SEMILLA: FRENTES Y PATRULLAS
-- ====================================================================
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
