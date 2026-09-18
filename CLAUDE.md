# Control de Quemas - Ingenio La Unión

Eres el desarrollador senior a cargo de continuar el desarrollo de esta aplicación web.

## 1. Contexto y Propósito

- **Organización:** Ingenio La Unión (Guatemala), industria azucarera.
- **Objetivo:** App web operativa en tiempo real para gestión, solicitud, despacho y liquidación de quemas de caña de azúcar durante la zafra.
- **Ruta local:** `/Users/oscarmorales/Documents/APP WEB QUEMAS`
- **Producción:** `https://quemas.launioncat.com` (desplegado en Vercel, auto-deploy al hacer push a `main` en GitHub: `digitadorr11-stack/App-web-quemas`)
- **Backend:** Supabase (Auth, Postgres, Realtime) en `https://xmuoddhzagswylzcheui.supabase.co`
- El usuario dueño del proyecto (Oscar) **no tiene experiencia de programación** — explica los pasos en lenguaje simple, evita jerga sin contexto, y da comandos de terminal listos para copiar/pegar cuando haga falta.

## 2. Reglas Críticas e Inviolables

1. **Prohibición estricta SICA:** nunca toques, modifiques ni leas archivos de proyectos externos como SICA u otros sistemas en carpetas hermanas. Trabaja únicamente dentro de este directorio.
2. **Política de roles pura (cero correos quemados):** el control de acceso (admin u otros permisos) NUNCA se evalúa comparando `user.email === '...'`. Toda la lógica de RBAC, componentes y triggers de base de datos se basa estrictamente en el campo `rol` del perfil (`perfiles_usuarios.rol`).
3. **Cero secretos en local:** no debe existir `.env.local` con credenciales reales en el repo. Las variables de entorno de Supabase se gestionan en Vercel. La compilación local se valida con `npm run build` (ver nota de rendimiento abajo).
4. **Migraciones de base de datos son aditivas:** `supabase_schema.sql` empieza con `DROP TABLE` (solo sirve para una instalación nueva desde cero). Cualquier cambio a producción debe ir en un archivo de migración nuevo, idempotente y no destructivo (ver `supabase_migration_fase4.sql` como ejemplo), nunca ejecutando `supabase_schema.sql` completo sobre la base de datos real.

## 3. Stack y Convenciones

- Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React, cliente de Supabase con suscripciones Realtime (`postgres_changes`).
- Diseño oscuro (dark mode, tonos slate-900/#070C14, acentos esmeralda/naranja/azul/ámbar/rosa según módulo), alta usabilidad móvil.
- Patrón de página estándar (ver `app/constantes/page.tsx`, `app/fincas/page.tsx` como referencia): `'use client'`, guardia de sesión con `authService.getCurrentUserProfile()` + validación de rol + `router.push`, suscripción Realtime por tabla con cleanup en `useEffect`, toast simple con `setTimeout`.
- Toda la lógica de negocio del ciclo operativo de quemas vive en funciones RPC de Postgres `SECURITY DEFINER` (no en el cliente), para validar rol/estado y sincronizar catálogo de patrullas + bitácora de auditoría de forma atómica. Ver `lib/quemasService.ts` y `supabase_migration_fase4.sql`.

## 4. Estado Actual (lo que ya está 100% listo y desplegado)

- `/login`: autenticación Supabase. Primer usuario se promueve automáticamente a Administrador; el resto queda pendiente.
- `/`: dashboard con accesos rápidos según rol.
- `/usuarios`: gestión de perfiles RBAC (`admin`, `digitador`, `jefatura`, `supervisor_quemas`, `supervisor_frente`, `patrulla`, `pendiente`), asignación de Frente/Patrulla, modal de edición completa.
- `/constantes`: catálogo de Frentes de Cosecha y Patrullas de Quema.
- `/fincas`: catálogo agronómico de Fincas y Lotes (buscador, KPIs de Hectáreas, importación masiva Excel/CSV, exportación CSV).
- **Fase 4 (flujo operativo en tiempo real) — implementada en esta sesión, pendiente de confirmar que el commit/push a producción se completó:**
  - `/quemas/nueva`: Supervisor de Frente (y admin/digitador/supervisor_quemas) crea una solicitud de quema (finca/lote con autocompletado de área y variedad, tipo de cosecha, hora planificada, prioridad, observaciones).
  - `/quemas`: Tablero de despacho en tiempo real (Pendientes → En Camino → En Frente/Revisión → En Quema → Finalizadas), asignación de patrulla, cancelación, indicador de tiempo de respuesta.
  - `/campo`: vista móvil para el rol `patrulla` con botones grandes por etapa (Llegada al Frente → En Espera (motivo) → Revisión técnica con checklist → Iniciar Quema → Finalizar Quema). Libera la patrulla a `DISPONIBLE` automáticamente al finalizar.
  - `lib/quemasService.ts`: envuelve las funciones RPC del ciclo operativo.
  - `supabase_migration_fase4.sql`: **ya fue ejecutado por el usuario en el SQL Editor de Supabase** (agrega columnas `observaciones_solicitud`, `prioridad`, `tipo_cosecha` a `solicitudes_quemas`; numeración automática `QM-YYYY-0001`; RPCs `despachar_patrulla`, `registrar_llegada_frente`, `registrar_espera`, `iniciar_revision`, `completar_revision`, `iniciar_quema`, `finalizar_quema`, `cancelar_solicitud`).
  - `supabase_schema.sql` maestro actualizado en paralelo para reflejar el esquema completo (solo referencia para instalación nueva, no se ejecuta sobre producción).
  - **Pendiente al momento de crear este archivo:** el commit y `git push` de estos cambios todavía no se había confirmado como exitoso (hubo un `.git/index.lock` trabado). Verifica con `git log --oneline -5` si el commit "Fase 4: flujo operativo en tiempo real..." ya existe; si no, hay que hacer `git add` de los archivos nuevos/modificados, `git commit` y `git push`.

## 5. Próximos Pasos / Pendientes

- Confirmar que el push de la Fase 4 llegó a producción y que Vercel desplegó bien.
- Probar el flujo completo de punta a punta con usuarios reales de cada rol.
- Módulo de quemas criminales (`quema criminal`): aún no está diseñado, es el siguiente módulo grande a definir.
- Nota de entorno: `npm run build` puede tardar varios minutos o parecer "colgado" en máquinas/entornos con recursos limitados — no es necesariamente un error de código; si tarda mucho, valida primero con `npx tsc --noEmit` (rápido, detecta errores de TypeScript) y confirma el build completo por separado.

## 6. Metodología de Trabajo

1. Antes de tocar nada, revisa `lib/types.ts`, `supabase_schema.sql` y los archivos de migración (`supabase_migration_*.sql`) para entender el estado real de la base de datos — no asumas que el schema maestro es lo que hay en producción, revisa qué migraciones ya se aplicaron.
2. Valida sintaxis y tipos con `npx tsc --noEmit` (rápido) y, cuando el tiempo lo permita, `npm run build` antes de dar cualquier tarea por concluida.
3. Cualquier cambio a la base de datos en producción va en un script de migración nuevo, aditivo e idempotente — nunca reescribas ni vuelvas a correr `supabase_schema.sql` sobre datos reales.
4. Procede paso a paso, manteniendo el diseño oscuro y la convención de roles/patrones ya establecida en el resto del proyecto.
