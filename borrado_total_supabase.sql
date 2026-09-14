-- ====================================================================
-- SCRIPT DE LIMPIEZA Y REINICIO TOTAL (WIPE COMPLETO) - SUPABASE
-- ESTE SCRIPT BORRA TODO EN EL ESQUEMA PUBLIC PARA EMPEZAR DE CERO
-- ====================================================================

-- 1. Desactivar y borrar triggers en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.gestionar_nuevo_usuario_auth() CASCADE;
DROP FUNCTION IF EXISTS public.vincular_usuario_google() CASCADE;
DROP FUNCTION IF EXISTS public.current_user_role() CASCADE;
DROP FUNCTION IF EXISTS public.is_user_active() CASCADE;

-- 2. Eliminar todas las tablas de la aplicación en public
DROP TABLE IF EXISTS public.bitacora_auditoria CASCADE;
DROP TABLE IF EXISTS public.solicitudes_quemas CASCADE;
DROP TABLE IF EXISTS public.catalogo_patrullas CASCADE;
DROP TABLE IF EXISTS public.catalogo_frentes CASCADE;
DROP TABLE IF EXISTS public.catalogo_fincas CASCADE;
DROP TABLE IF EXISTS public.perfiles_usuarios CASCADE;

-- 3. (OPCIONAL) Si deseas eliminar usuarios de prueba registrados en auth.users:
-- DELETE FROM auth.users WHERE email NOT IN ('digitadorr11@gmail.com', 'oscmo76@gmail.com');
-- O para borrar absolutamente todos los usuarios de auth:
-- DELETE FROM auth.users;

-- ====================================================================
-- ¡LISTO! Tu base de datos en Supabase queda 100% limpia y desde cero.
-- ====================================================================
