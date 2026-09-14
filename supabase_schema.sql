-- ====================================================================
-- ESQUEMA MAESTRO SUPABASE V2.0: CONTROL DE QUEMAS - INGENIO LA UNIÓN
-- TRAZABILIDAD OPERATIVA EN TIEMPO REAL, CRONOLOGÍA UNIFICADA Y RLS
-- ====================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. LIMPIEZA PREVIA TOTAL DE TABLAS, TRIGGERS Y FUNCIONES
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.gestionar_nuevo_usuario_auth() CASCADE;
DROP FUNCTION IF EXISTS public.current_user_role() CASCADE;
DROP FUNCTION IF EXISTS public.is_user_active() CASCADE;

DROP TABLE IF EXISTS public.bitacora_auditoria CASCADE;
DROP TABLE IF EXISTS public.solicitudes_quemas CASCADE;
DROP TABLE IF EXISTS public.catalogo_patrullas CASCADE;
DROP TABLE IF EXISTS public.catalogo_frentes CASCADE;
DROP TABLE IF EXISTS public.catalogo_fincas_lotes CASCADE;
DROP TABLE IF EXISTS public.catalogo_fincas CASCADE;
DROP TABLE IF EXISTS public.perfiles_usuarios CASCADE;

-- 3. TABLA: CATÁLOGO DE FRENTES DE COSECHA (CONSTANTES)
CREATE TABLE public.catalogo_frentes (
    nombre TEXT PRIMARY KEY, -- "Frente 14", "Frente 15", etc.
    tipo_cosecha TEXT NOT NULL DEFAULT 'Mecanizada' CHECK (tipo_cosecha IN ('Mecanizada', 'Manual', 'Mixta')),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA: CATÁLOGO DE PATRULLAS DE QUEMA (CONSTANTES)
CREATE TABLE public.catalogo_patrullas (
    nombre TEXT PRIMARY KEY, -- "Patrulla Alfa", "Patrulla Beta", etc.
    codigo_vehiculo TEXT,
    estado TEXT NOT NULL DEFAULT 'DISPONIBLE' CHECK (estado IN ('DISPONIBLE', 'EN_FRENTE', 'EN_QUEMA')),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA: PERFILES DE USUARIOS (VINCULADA 1:1 CON auth.users)
CREATE TABLE public.perfiles_usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    correo TEXT UNIQUE NOT NULL,
    nombre_completo TEXT NOT NULL,
    rol TEXT NOT NULL DEFAULT 'pendiente' CHECK (
        rol IN ('admin', 'digitador', 'jefatura', 'supervisor_quemas', 'supervisor_frente', 'patrulla', 'pendiente')
    ),
    frente_asignado TEXT REFERENCES public.catalogo_frentes(nombre) ON DELETE SET NULL,
    patrulla_asignada TEXT REFERENCES public.catalogo_patrullas(nombre) ON DELETE SET NULL,
    activo BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLA: CATÁLOGO DE FINCAS Y LOTES
CREATE TABLE public.catalogo_fincas_lotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    finca TEXT NOT NULL,
    lote TEXT NOT NULL,
    area_ha NUMERIC(10,2) NOT NULL DEFAULT 0,
    area_mz NUMERIC(10,2) NOT NULL DEFAULT 0,
    variedad TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (finca, lote)
);

CREATE INDEX IF NOT EXISTS idx_fincas_lotes_finca ON public.catalogo_fincas_lotes(finca);
CREATE INDEX IF NOT EXISTS idx_fincas_lotes_lote ON public.catalogo_fincas_lotes(lote);
CREATE INDEX IF NOT EXISTS idx_fincas_lotes_activo ON public.catalogo_fincas_lotes(activo);

-- 7. TABLA MAESTRA: SOLICITUDES Y CRONOLOGÍA DE QUEMAS
CREATE TABLE public.solicitudes_quemas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_quema TEXT NOT NULL UNIQUE,
    
    -- Ubicación y Agronomía
    numero_frente TEXT NOT NULL REFERENCES public.catalogo_frentes(nombre),
    nombre_finca TEXT NOT NULL,
    lote_um TEXT NOT NULL,
    area_hectareas NUMERIC(10,2) NOT NULL DEFAULT 0,
    area_manzanas NUMERIC(10,2) NOT NULL DEFAULT 0,
    variedad_cana TEXT,
    tonelaje_estimado NUMERIC(10,2) DEFAULT 0,

    -- 1. Solicitud y Planificación
    hora_solicitud TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    hora_planificada TIMESTAMPTZ NOT NULL,
    creado_por_usuario_id UUID NOT NULL REFERENCES auth.users(id),
    nombre_supervisor_frente TEXT NOT NULL,

    -- 2. Despacho / Asignación (Efectividad de Respuesta)
    hora_asignacion TIMESTAMPTZ,
    nombre_patrulla_asignada TEXT REFERENCES public.catalogo_patrullas(nombre),
    lider_patrulla TEXT,

    -- 3. Llegada al Frente y Espera
    hora_llegada_frente TIMESTAMPTZ,
    tiempo_espera_minutos NUMERIC(6,1) DEFAULT 0,
    motivo_espera TEXT,

    -- 4. Revisión Técnica de Seguridad (Hora Inicio y Hora Fin)
    hora_inicio_revision TIMESTAMPTZ,
    hora_fin_revision TIMESTAMPTZ,
    duracion_revision_minutos NUMERIC(6,1) DEFAULT 0,
    checklist_revision JSONB,
    observaciones_revision TEXT,

    -- 5. Quema Activa y Cierre
    hora_inicio_quema TIMESTAMPTZ,
    hora_fin_quema TIMESTAMPTZ,
    duracion_quema_minutos NUMERIC(6,1) DEFAULT 0,
    tiempo_total_minutos NUMERIC(6,1) DEFAULT 0,

    -- Estado del Ciclo Operativo
    estado TEXT NOT NULL DEFAULT 'SOLICITADA' CHECK (
        estado IN ('SOLICITADA', 'PATRULLA_ASIGNADA', 'EN_FRENTE', 'EN_REVISION', 'EN_QUEMA', 'FINALIZADA', 'CANCELADA')
    ),

    -- Suspensión / Cancelación
    etapa_cancelacion TEXT,
    motivo_cancelacion TEXT,
    cancelado_por_nombre TEXT,
    hora_cancelacion TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABLA: BITÁCORA FORENSE DE AUDITORÍA (INMUTABLE)
CREATE TABLE public.bitacora_auditoria (
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
-- FUNCIONES DE SEGURIDAD (SECURITY DEFINER)
-- ====================================================================

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT rol FROM public.perfiles_usuarios WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_user_active()
RETURNS BOOLEAN AS $$
  SELECT COALESCE((SELECT activo FROM public.perfiles_usuarios WHERE id = auth.uid()), FALSE);
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) EN TODAS LAS TABLAS
-- ====================================================================

ALTER TABLE public.perfiles_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogo_frentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogo_patrullas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogo_fincas_lotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitudes_quemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bitacora_auditoria ENABLE ROW LEVEL SECURITY;

-- 1. Políticas: perfiles_usuarios
DROP POLICY IF EXISTS "Lectura de perfiles autorizada" ON public.perfiles_usuarios;
CREATE POLICY "Lectura de perfiles autorizada"
ON public.perfiles_usuarios
FOR SELECT
TO authenticated
USING (
    auth.uid() = id OR public.current_user_role() IN ('admin', 'digitador')
);

DROP POLICY IF EXISTS "Actualizar perfil propio" ON public.perfiles_usuarios;
CREATE POLICY "Actualizar perfil propio"
ON public.perfiles_usuarios
FOR UPDATE
TO authenticated
USING (auth.uid() = id OR public.current_user_role() IN ('admin', 'digitador'))
WITH CHECK (
    (auth.uid() = id AND rol = (SELECT rol FROM public.perfiles_usuarios WHERE id = auth.uid()) AND activo = (SELECT activo FROM public.perfiles_usuarios WHERE id = auth.uid()))
    OR public.current_user_role() IN ('admin', 'digitador')
);

-- 2. Políticas: Catálogos (Frentes, Patrullas, Fincas y Lotes)
DROP POLICY IF EXISTS "Lectura frentes" ON public.catalogo_frentes;
CREATE POLICY "Lectura frentes" ON public.catalogo_frentes FOR SELECT TO authenticated
USING (public.is_user_active() = TRUE);

DROP POLICY IF EXISTS "Gestion frentes" ON public.catalogo_frentes;
CREATE POLICY "Gestion frentes" ON public.catalogo_frentes FOR ALL TO authenticated
USING (public.current_user_role() IN ('admin', 'digitador'))
WITH CHECK (public.current_user_role() IN ('admin', 'digitador'));

DROP POLICY IF EXISTS "Lectura patrullas" ON public.catalogo_patrullas;
CREATE POLICY "Lectura patrullas" ON public.catalogo_patrullas FOR SELECT TO authenticated
USING (public.is_user_active() = TRUE);

DROP POLICY IF EXISTS "Gestion patrullas" ON public.catalogo_patrullas;
CREATE POLICY "Gestion patrullas" ON public.catalogo_patrullas FOR ALL TO authenticated
USING (public.current_user_role() IN ('admin', 'digitador'))
WITH CHECK (public.current_user_role() IN ('admin', 'digitador'));

DROP POLICY IF EXISTS "Lectura fincas y lotes" ON public.catalogo_fincas_lotes;
CREATE POLICY "Lectura fincas y lotes" ON public.catalogo_fincas_lotes FOR SELECT TO authenticated
USING (public.is_user_active() = TRUE);

DROP POLICY IF EXISTS "Gestion fincas y lotes" ON public.catalogo_fincas_lotes;
CREATE POLICY "Gestion fincas y lotes" ON public.catalogo_fincas_lotes FOR ALL TO authenticated
USING (public.current_user_role() IN ('admin', 'digitador'))
WITH CHECK (public.current_user_role() IN ('admin', 'digitador'));

-- 3. Políticas: solicitudes_quemas
DROP POLICY IF EXISTS "Lectura solicitudes para usuarios activos" ON public.solicitudes_quemas;
CREATE POLICY "Lectura solicitudes para usuarios activos"
ON public.solicitudes_quemas
FOR SELECT
TO authenticated
USING (public.is_user_active() = TRUE);

DROP POLICY IF EXISTS "Crear solicitud de quema" ON public.solicitudes_quemas;
CREATE POLICY "Crear solicitud de quema"
ON public.solicitudes_quemas
FOR INSERT
TO authenticated
WITH CHECK (
    public.is_user_active() = TRUE 
    AND public.current_user_role() IN ('supervisor_frente', 'supervisor_quemas', 'digitador', 'admin')
    AND auth.uid() = creado_por_usuario_id
);

DROP POLICY IF EXISTS "Actualizar estado operativo de quema" ON public.solicitudes_quemas;
CREATE POLICY "Actualizar estado operativo de quema"
ON public.solicitudes_quemas
FOR UPDATE
TO authenticated
USING (
    public.is_user_active() = TRUE 
    AND public.current_user_role() IN ('supervisor_frente', 'supervisor_quemas', 'patrulla', 'digitador', 'admin')
);

-- 4. Políticas: bitacora_auditoria (Inmutable)
DROP POLICY IF EXISTS "Lectura bitacora jefatura y administracion" ON public.bitacora_auditoria;
CREATE POLICY "Lectura bitacora jefatura y administracion"
ON public.bitacora_auditoria
FOR SELECT
TO authenticated
USING (
    public.is_user_active() = TRUE 
    AND public.current_user_role() IN ('admin', 'digitador', 'jefatura')
);

DROP POLICY IF EXISTS "Insertar log de auditoria" ON public.bitacora_auditoria;
CREATE POLICY "Insertar log de auditoria"
ON public.bitacora_auditoria
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = usuario_id);

-- ====================================================================
-- TIEMPO REAL (REALTIME WEBSOCKETS)
-- ====================================================================
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.solicitudes_quemas;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.catalogo_patrullas;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;

-- ====================================================================
-- TRIGGER AUTOMÁTICO: ALTA DE USUARIOS DESDE auth.users
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
-- DATOS MAESTROS SEMILLA: FRENTES Y PATRULLAS (CONSTANTES OPERATIVAS)
-- ====================================================================
INSERT INTO public.catalogo_frentes (nombre, tipo_cosecha) VALUES
('Frente 14', 'Manual'),
('Frente 15', 'Mecanizada'),
('Frente 16', 'Mecanizada'),
('Frente 17', 'Manual'),
('Frente 19', 'Manual'),
('Frente 23', 'Mixta'),
('Frente 25', 'Mecanizada')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO public.catalogo_patrullas (nombre, codigo_vehiculo, estado) VALUES
('Patrulla Alfa', 'UNI-401', 'DISPONIBLE'),
('Patrulla Beta', 'UNI-402', 'DISPONIBLE'),
('Patrulla Gamma', 'UNI-403', 'DISPONIBLE'),
('Patrulla Delta', 'UNI-404', 'DISPONIBLE')
ON CONFLICT (nombre) DO NOTHING;

-- DATOS SEMILLA: FINCAS Y LOTES DE EJEMPLO
INSERT INTO public.catalogo_fincas_lotes (finca, lote, area_ha, area_mz, variedad) VALUES
('Finca El Baúl', 'Lote 101', 12.50, 17.88, 'CP-72-2086'),
('Finca El Baúl', 'Lote 102', 15.20, 21.75, 'CG-96-01'),
('Finca Los Diamantes', 'Lote 01', 8.40, 12.02, 'CP-88-1165'),
('Finca Los Diamantes', 'Lote 02', 14.00, 20.03, 'CP-72-2086'),
('Finca San Antonio', 'Lote 05', 18.75, 26.83, 'CG-02-163')
ON CONFLICT (finca, lote) DO NOTHING;

-- ====================================================================
-- SINCRONIZAR ADMINISTRADORES EXISTENTES DESDE auth.users
-- ====================================================================
INSERT INTO public.perfiles_usuarios (id, correo, nombre_completo, rol, activo)
SELECT 
    id,
    LOWER(TRIM(email)),
    COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1)),
    'admin',
    TRUE
FROM auth.users
WHERE LOWER(TRIM(email)) IN ('digitadorr11@gmail.com', 'oscmo76@gmail.com')
ON CONFLICT (id) DO UPDATE
SET rol = 'admin',
    activo = TRUE;
