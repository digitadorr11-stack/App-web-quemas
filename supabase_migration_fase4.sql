-- ====================================================================
-- MIGRACIÓN NO DESTRUCTIVA — FASE 4: FLUJO OPERATIVO EN TIEMPO REAL
-- CONTROL DE QUEMAS - INGENIO LA UNIÓN
--
-- IMPORTANTE: Este script es aditivo e idempotente (usa IF NOT EXISTS /
-- OR REPLACE / DROP ... IF EXISTS solo sobre triggers y funciones, NUNCA
-- sobre tablas con datos). Es seguro ejecutarlo en producción sin perder
-- información existente. NO reemplaza a supabase_schema.sql (ese archivo
-- es solo para una instalación nueva desde cero, ya que empieza con
-- DROP TABLE).
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. NUEVAS COLUMNAS EN solicitudes_quemas (Solicitud y Planificación)
-- --------------------------------------------------------------------
ALTER TABLE public.solicitudes_quemas
    ADD COLUMN IF NOT EXISTS observaciones_solicitud TEXT;

ALTER TABLE public.solicitudes_quemas
    ADD COLUMN IF NOT EXISTS prioridad TEXT NOT NULL DEFAULT 'NORMAL';

ALTER TABLE public.solicitudes_quemas
    ADD COLUMN IF NOT EXISTS tipo_cosecha TEXT NOT NULL DEFAULT 'Mecanizada';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'solicitudes_quemas_prioridad_check'
    ) THEN
        ALTER TABLE public.solicitudes_quemas
            ADD CONSTRAINT solicitudes_quemas_prioridad_check
            CHECK (prioridad IN ('NORMAL', 'ALTA', 'URGENTE'));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'solicitudes_quemas_tipo_cosecha_check'
    ) THEN
        ALTER TABLE public.solicitudes_quemas
            ADD CONSTRAINT solicitudes_quemas_tipo_cosecha_check
            CHECK (tipo_cosecha IN ('Mecanizada', 'Manual', 'Mixta'));
    END IF;
END $$;

-- --------------------------------------------------------------------
-- 2. NUMERACIÓN AUTOMÁTICA DE SOLICITUDES (QM-YYYY-0001)
-- --------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.seq_numero_quema START 1;

CREATE OR REPLACE FUNCTION public.asignar_numero_quema()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.numero_quema IS NULL OR TRIM(NEW.numero_quema) = '' THEN
        NEW.numero_quema := 'QM-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
            LPAD(nextval('public.seq_numero_quema')::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS before_insert_solicitud_numero ON public.solicitudes_quemas;
CREATE TRIGGER before_insert_solicitud_numero
    BEFORE INSERT ON public.solicitudes_quemas
    FOR EACH ROW EXECUTE FUNCTION public.asignar_numero_quema();

-- --------------------------------------------------------------------
-- 3. updated_at AUTOMÁTICO
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS before_update_solicitud_timestamp ON public.solicitudes_quemas;
CREATE TRIGGER before_update_solicitud_timestamp
    BEFORE UPDATE ON public.solicitudes_quemas
    FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();

-- --------------------------------------------------------------------
-- 4. FUNCIÓN AUXILIAR: PERFIL DEL USUARIO AUTENTICADO
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._perfil_actual()
RETURNS public.perfiles_usuarios AS $$
    SELECT * FROM public.perfiles_usuarios WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- --------------------------------------------------------------------
-- 5. RPCs DEL CICLO OPERATIVO (SECURITY DEFINER: bypass RLS de forma
--    controlada, validando rol y estado manualmente, y sincronizando
--    el estado de la patrulla + bitácora de auditoría en una sola
--    transacción atómica)
-- --------------------------------------------------------------------

-- 5.1 DESPACHAR / ASIGNAR PATRULLA
CREATE OR REPLACE FUNCTION public.despachar_patrulla(
    p_solicitud_id UUID,
    p_patrulla TEXT,
    p_lider TEXT DEFAULT NULL
)
RETURNS public.solicitudes_quemas AS $$
DECLARE
    v_perfil public.perfiles_usuarios;
    v_solicitud public.solicitudes_quemas;
    v_patrulla_activa BOOLEAN;
BEGIN
    v_perfil := public._perfil_actual();
    IF v_perfil.id IS NULL OR v_perfil.activo IS NOT TRUE THEN
        RAISE EXCEPTION 'Usuario no autenticado o inactivo';
    END IF;
    IF v_perfil.rol NOT IN ('supervisor_quemas', 'digitador', 'admin') THEN
        RAISE EXCEPTION 'No tiene permisos para despachar patrullas';
    END IF;

    SELECT (estado = 'DISPONIBLE' AND activo) INTO v_patrulla_activa
    FROM public.catalogo_patrullas WHERE nombre = p_patrulla;

    IF v_patrulla_activa IS NOT TRUE THEN
        RAISE EXCEPTION 'La patrulla "%" no está disponible', p_patrulla;
    END IF;

    UPDATE public.solicitudes_quemas
    SET estado = 'PATRULLA_ASIGNADA',
        hora_asignacion = NOW(),
        nombre_patrulla_asignada = p_patrulla,
        lider_patrulla = p_lider
    WHERE id = p_solicitud_id AND estado = 'SOLICITADA'
    RETURNING * INTO v_solicitud;

    IF v_solicitud.id IS NULL THEN
        RAISE EXCEPTION 'La solicitud ya no está pendiente de despacho';
    END IF;

    UPDATE public.catalogo_patrullas SET estado = 'EN_FRENTE' WHERE nombre = p_patrulla;

    INSERT INTO public.bitacora_auditoria
        (solicitud_quema_id, numero_quema, usuario_id, nombre_usuario, rol_usuario, tipo_accion, nombre_campo, valor_nuevo)
    VALUES
        (v_solicitud.id, v_solicitud.numero_quema, v_perfil.id, v_perfil.nombre_completo, v_perfil.rol,
         'DESPACHO_PATRULLA', 'nombre_patrulla_asignada', p_patrulla);

    RETURN v_solicitud;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5.2 REGISTRAR LLEGADA AL FRENTE
CREATE OR REPLACE FUNCTION public.registrar_llegada_frente(p_solicitud_id UUID)
RETURNS public.solicitudes_quemas AS $$
DECLARE
    v_perfil public.perfiles_usuarios;
    v_solicitud public.solicitudes_quemas;
BEGIN
    v_perfil := public._perfil_actual();
    IF v_perfil.id IS NULL OR v_perfil.activo IS NOT TRUE THEN
        RAISE EXCEPTION 'Usuario no autenticado o inactivo';
    END IF;
    IF v_perfil.rol NOT IN ('patrulla', 'supervisor_quemas', 'digitador', 'admin') THEN
        RAISE EXCEPTION 'No tiene permisos para registrar la llegada';
    END IF;

    UPDATE public.solicitudes_quemas
    SET estado = 'EN_FRENTE',
        hora_llegada_frente = NOW()
    WHERE id = p_solicitud_id
      AND estado = 'PATRULLA_ASIGNADA'
      AND (v_perfil.rol != 'patrulla' OR nombre_patrulla_asignada = v_perfil.patrulla_asignada)
    RETURNING * INTO v_solicitud;

    IF v_solicitud.id IS NULL THEN
        RAISE EXCEPTION 'No se pudo registrar la llegada (verifique estado y patrulla asignada)';
    END IF;

    INSERT INTO public.bitacora_auditoria
        (solicitud_quema_id, numero_quema, usuario_id, nombre_usuario, rol_usuario, tipo_accion)
    VALUES
        (v_solicitud.id, v_solicitud.numero_quema, v_perfil.id, v_perfil.nombre_completo, v_perfil.rol, 'LLEGADA_FRENTE');

    RETURN v_solicitud;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5.3 REGISTRAR ESPERA (no cambia de estado, deja constancia del motivo)
CREATE OR REPLACE FUNCTION public.registrar_espera(p_solicitud_id UUID, p_motivo TEXT)
RETURNS public.solicitudes_quemas AS $$
DECLARE
    v_perfil public.perfiles_usuarios;
    v_solicitud public.solicitudes_quemas;
BEGIN
    v_perfil := public._perfil_actual();
    IF v_perfil.id IS NULL OR v_perfil.activo IS NOT TRUE THEN
        RAISE EXCEPTION 'Usuario no autenticado o inactivo';
    END IF;
    IF v_perfil.rol NOT IN ('patrulla', 'supervisor_quemas', 'digitador', 'admin') THEN
        RAISE EXCEPTION 'No tiene permisos para registrar espera';
    END IF;

    UPDATE public.solicitudes_quemas
    SET motivo_espera = p_motivo
    WHERE id = p_solicitud_id
      AND estado IN ('EN_FRENTE', 'EN_REVISION')
      AND (v_perfil.rol != 'patrulla' OR nombre_patrulla_asignada = v_perfil.patrulla_asignada)
    RETURNING * INTO v_solicitud;

    IF v_solicitud.id IS NULL THEN
        RAISE EXCEPTION 'No se pudo registrar la espera';
    END IF;

    INSERT INTO public.bitacora_auditoria
        (solicitud_quema_id, numero_quema, usuario_id, nombre_usuario, rol_usuario, tipo_accion, nombre_campo, valor_nuevo)
    VALUES
        (v_solicitud.id, v_solicitud.numero_quema, v_perfil.id, v_perfil.nombre_completo, v_perfil.rol, 'REGISTRO_ESPERA', 'motivo_espera', p_motivo);

    RETURN v_solicitud;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5.4 INICIAR REVISIÓN TÉCNICA DE SEGURIDAD
CREATE OR REPLACE FUNCTION public.iniciar_revision(p_solicitud_id UUID)
RETURNS public.solicitudes_quemas AS $$
DECLARE
    v_perfil public.perfiles_usuarios;
    v_solicitud public.solicitudes_quemas;
BEGIN
    v_perfil := public._perfil_actual();
    IF v_perfil.id IS NULL OR v_perfil.activo IS NOT TRUE THEN
        RAISE EXCEPTION 'Usuario no autenticado o inactivo';
    END IF;
    IF v_perfil.rol NOT IN ('patrulla', 'supervisor_quemas', 'digitador', 'admin') THEN
        RAISE EXCEPTION 'No tiene permisos para iniciar la revisión';
    END IF;

    UPDATE public.solicitudes_quemas
    SET estado = 'EN_REVISION',
        hora_inicio_revision = NOW(),
        tiempo_espera_minutos = ROUND(EXTRACT(EPOCH FROM (NOW() - hora_llegada_frente)) / 60.0, 1)
    WHERE id = p_solicitud_id
      AND estado = 'EN_FRENTE'
      AND (v_perfil.rol != 'patrulla' OR nombre_patrulla_asignada = v_perfil.patrulla_asignada)
    RETURNING * INTO v_solicitud;

    IF v_solicitud.id IS NULL THEN
        RAISE EXCEPTION 'No se pudo iniciar la revisión';
    END IF;

    INSERT INTO public.bitacora_auditoria
        (solicitud_quema_id, numero_quema, usuario_id, nombre_usuario, rol_usuario, tipo_accion)
    VALUES
        (v_solicitud.id, v_solicitud.numero_quema, v_perfil.id, v_perfil.nombre_completo, v_perfil.rol, 'INICIO_REVISION');

    RETURN v_solicitud;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5.5 COMPLETAR CHECKLIST DE REVISIÓN
CREATE OR REPLACE FUNCTION public.completar_revision(
    p_solicitud_id UUID,
    p_checklist JSONB,
    p_observaciones TEXT DEFAULT NULL
)
RETURNS public.solicitudes_quemas AS $$
DECLARE
    v_perfil public.perfiles_usuarios;
    v_solicitud public.solicitudes_quemas;
BEGIN
    v_perfil := public._perfil_actual();
    IF v_perfil.id IS NULL OR v_perfil.activo IS NOT TRUE THEN
        RAISE EXCEPTION 'Usuario no autenticado o inactivo';
    END IF;
    IF v_perfil.rol NOT IN ('patrulla', 'supervisor_quemas', 'digitador', 'admin') THEN
        RAISE EXCEPTION 'No tiene permisos para completar la revisión';
    END IF;

    UPDATE public.solicitudes_quemas
    SET checklist_revision = p_checklist,
        observaciones_revision = p_observaciones,
        hora_fin_revision = NOW(),
        duracion_revision_minutos = ROUND(EXTRACT(EPOCH FROM (NOW() - hora_inicio_revision)) / 60.0, 1)
    WHERE id = p_solicitud_id
      AND estado = 'EN_REVISION'
      AND (v_perfil.rol != 'patrulla' OR nombre_patrulla_asignada = v_perfil.patrulla_asignada)
    RETURNING * INTO v_solicitud;

    IF v_solicitud.id IS NULL THEN
        RAISE EXCEPTION 'No se pudo completar la revisión';
    END IF;

    INSERT INTO public.bitacora_auditoria
        (solicitud_quema_id, numero_quema, usuario_id, nombre_usuario, rol_usuario, tipo_accion)
    VALUES
        (v_solicitud.id, v_solicitud.numero_quema, v_perfil.id, v_perfil.nombre_completo, v_perfil.rol, 'REVISION_COMPLETADA');

    RETURN v_solicitud;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5.6 INICIAR QUEMA
CREATE OR REPLACE FUNCTION public.iniciar_quema(p_solicitud_id UUID)
RETURNS public.solicitudes_quemas AS $$
DECLARE
    v_perfil public.perfiles_usuarios;
    v_solicitud public.solicitudes_quemas;
BEGIN
    v_perfil := public._perfil_actual();
    IF v_perfil.id IS NULL OR v_perfil.activo IS NOT TRUE THEN
        RAISE EXCEPTION 'Usuario no autenticado o inactivo';
    END IF;
    IF v_perfil.rol NOT IN ('patrulla', 'supervisor_quemas', 'digitador', 'admin') THEN
        RAISE EXCEPTION 'No tiene permisos para iniciar la quema';
    END IF;

    UPDATE public.solicitudes_quemas
    SET estado = 'EN_QUEMA',
        hora_inicio_quema = NOW()
    WHERE id = p_solicitud_id
      AND estado = 'EN_REVISION'
      AND hora_fin_revision IS NOT NULL
      AND (v_perfil.rol != 'patrulla' OR nombre_patrulla_asignada = v_perfil.patrulla_asignada)
    RETURNING * INTO v_solicitud;

    IF v_solicitud.id IS NULL THEN
        RAISE EXCEPTION 'No se pudo iniciar la quema (revisión incompleta o estado inválido)';
    END IF;

    IF v_solicitud.nombre_patrulla_asignada IS NOT NULL THEN
        UPDATE public.catalogo_patrullas SET estado = 'EN_QUEMA' WHERE nombre = v_solicitud.nombre_patrulla_asignada;
    END IF;

    INSERT INTO public.bitacora_auditoria
        (solicitud_quema_id, numero_quema, usuario_id, nombre_usuario, rol_usuario, tipo_accion)
    VALUES
        (v_solicitud.id, v_solicitud.numero_quema, v_perfil.id, v_perfil.nombre_completo, v_perfil.rol, 'INICIO_QUEMA');

    RETURN v_solicitud;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5.7 FINALIZAR QUEMA
CREATE OR REPLACE FUNCTION public.finalizar_quema(p_solicitud_id UUID, p_observaciones TEXT DEFAULT NULL)
RETURNS public.solicitudes_quemas AS $$
DECLARE
    v_perfil public.perfiles_usuarios;
    v_solicitud public.solicitudes_quemas;
BEGIN
    v_perfil := public._perfil_actual();
    IF v_perfil.id IS NULL OR v_perfil.activo IS NOT TRUE THEN
        RAISE EXCEPTION 'Usuario no autenticado o inactivo';
    END IF;
    IF v_perfil.rol NOT IN ('patrulla', 'supervisor_quemas', 'digitador', 'admin') THEN
        RAISE EXCEPTION 'No tiene permisos para finalizar la quema';
    END IF;

    UPDATE public.solicitudes_quemas
    SET estado = 'FINALIZADA',
        hora_fin_quema = NOW(),
        duracion_quema_minutos = ROUND(EXTRACT(EPOCH FROM (NOW() - hora_inicio_quema)) / 60.0, 1),
        tiempo_total_minutos = ROUND(EXTRACT(EPOCH FROM (NOW() - hora_solicitud)) / 60.0, 1),
        observaciones_revision = COALESCE(p_observaciones, observaciones_revision)
    WHERE id = p_solicitud_id
      AND estado = 'EN_QUEMA'
      AND (v_perfil.rol != 'patrulla' OR nombre_patrulla_asignada = v_perfil.patrulla_asignada)
    RETURNING * INTO v_solicitud;

    IF v_solicitud.id IS NULL THEN
        RAISE EXCEPTION 'No se pudo finalizar la quema';
    END IF;

    IF v_solicitud.nombre_patrulla_asignada IS NOT NULL THEN
        UPDATE public.catalogo_patrullas SET estado = 'DISPONIBLE' WHERE nombre = v_solicitud.nombre_patrulla_asignada;
    END IF;

    INSERT INTO public.bitacora_auditoria
        (solicitud_quema_id, numero_quema, usuario_id, nombre_usuario, rol_usuario, tipo_accion)
    VALUES
        (v_solicitud.id, v_solicitud.numero_quema, v_perfil.id, v_perfil.nombre_completo, v_perfil.rol, 'QUEMA_FINALIZADA');

    RETURN v_solicitud;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5.8 CANCELAR SOLICITUD (en cualquier etapa previa a FINALIZADA)
CREATE OR REPLACE FUNCTION public.cancelar_solicitud(p_solicitud_id UUID, p_motivo TEXT)
RETURNS public.solicitudes_quemas AS $$
DECLARE
    v_perfil public.perfiles_usuarios;
    v_solicitud public.solicitudes_quemas;
    v_estado_previo TEXT;
BEGIN
    v_perfil := public._perfil_actual();
    IF v_perfil.id IS NULL OR v_perfil.activo IS NOT TRUE THEN
        RAISE EXCEPTION 'Usuario no autenticado o inactivo';
    END IF;
    IF v_perfil.rol NOT IN ('supervisor_frente', 'supervisor_quemas', 'digitador', 'admin') THEN
        RAISE EXCEPTION 'No tiene permisos para cancelar la solicitud';
    END IF;

    SELECT estado INTO v_estado_previo
    FROM public.solicitudes_quemas WHERE id = p_solicitud_id;

    UPDATE public.solicitudes_quemas
    SET estado = 'CANCELADA',
        etapa_cancelacion = v_estado_previo,
        motivo_cancelacion = p_motivo,
        cancelado_por_nombre = v_perfil.nombre_completo,
        hora_cancelacion = NOW()
    WHERE id = p_solicitud_id
      AND estado NOT IN ('FINALIZADA', 'CANCELADA')
      AND (v_perfil.rol != 'supervisor_frente' OR creado_por_usuario_id = v_perfil.id)
    RETURNING * INTO v_solicitud;

    IF v_solicitud.id IS NULL THEN
        RAISE EXCEPTION 'No se pudo cancelar la solicitud';
    END IF;

    IF v_solicitud.nombre_patrulla_asignada IS NOT NULL THEN
        UPDATE public.catalogo_patrullas SET estado = 'DISPONIBLE' WHERE nombre = v_solicitud.nombre_patrulla_asignada;
    END IF;

    INSERT INTO public.bitacora_auditoria
        (solicitud_quema_id, numero_quema, usuario_id, nombre_usuario, rol_usuario, tipo_accion, valor_anterior, motivo_cambio)
    VALUES
        (v_solicitud.id, v_solicitud.numero_quema, v_perfil.id, v_perfil.nombre_completo, v_perfil.rol, 'CANCELACION', v_estado_previo, p_motivo);

    RETURN v_solicitud;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- --------------------------------------------------------------------
-- 6. PERMISOS DE EJECUCIÓN
-- --------------------------------------------------------------------
GRANT EXECUTE ON FUNCTION public.despachar_patrulla(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.registrar_llegada_frente(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.registrar_espera(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.iniciar_revision(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.completar_revision(UUID, JSONB, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.iniciar_quema(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.finalizar_quema(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancelar_solicitud(UUID, TEXT) TO authenticated;

-- ====================================================================
-- FIN DE LA MIGRACIÓN FASE 4
-- ====================================================================
