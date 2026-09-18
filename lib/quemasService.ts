import { supabase } from './supabaseClient';
import { BurnRequest, ReviewChecklist } from './types';

// ====================================================================
// SERVICIO: CICLO OPERATIVO DE SOLICITUDES DE QUEMA
// Envuelve las funciones RPC (SECURITY DEFINER) definidas en
// supabase_migration_fase4.sql, que validan rol/estado y sincronizan
// de forma atómica el estado de la patrulla y la bitácora de auditoría.
// ====================================================================

function unwrap<T>(data: T | null, error: any): T {
  if (error) {
    throw new Error(error.message || 'Error de comunicación con el servidor');
  }
  if (!data) {
    throw new Error('La operación no devolvió resultado');
  }
  return data;
}

export const quemasService = {
  // Carga todas las solicitudes (uso general en tablero / historial)
  async listarSolicitudes(): Promise<BurnRequest[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('solicitudes_quemas')
      .select('*')
      .order('hora_solicitud', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []) as BurnRequest[];
  },

  // Carga solo las solicitudes activas de una patrulla específica (vista de campo)
  async listarSolicitudesPatrulla(nombrePatrulla: string): Promise<BurnRequest[]> {
    if (!supabase || !nombrePatrulla) return [];
    const { data, error } = await supabase
      .from('solicitudes_quemas')
      .select('*')
      .eq('nombre_patrulla_asignada', nombrePatrulla)
      .not('estado', 'in', '("FINALIZADA","CANCELADA")')
      .order('hora_asignacion', { ascending: true });

    if (error) throw new Error(error.message);
    return (data || []) as BurnRequest[];
  },

  // 1. Crear solicitud (INSERT directo, permitido por RLS)
  async crearSolicitud(payload: {
    numero_frente: string;
    nombre_finca: string;
    lote_um: string;
    area_hectareas: number;
    area_manzanas?: number;
    variedad_cana?: string | null;
    tonelaje_estimado?: number | null;
    hora_planificada: string;
    creado_por_usuario_id: string;
    nombre_supervisor_frente: string;
    tipo_cosecha: string;
    prioridad: string;
    observaciones_solicitud?: string | null;
  }): Promise<BurnRequest> {
    if (!supabase) throw new Error('Supabase no está configurado');
    const { data, error } = await supabase
      .from('solicitudes_quemas')
      .insert({
        ...payload,
        area_manzanas: payload.area_manzanas ?? 0,
      })
      .select('*')
      .single();

    return unwrap(data, error) as BurnRequest;
  },

  // 2. Despachar / asignar patrulla
  async despacharPatrulla(solicitudId: string, patrulla: string, lider?: string | null): Promise<BurnRequest> {
    if (!supabase) throw new Error('Supabase no está configurado');
    const { data, error } = await supabase.rpc('despachar_patrulla', {
      p_solicitud_id: solicitudId,
      p_patrulla: patrulla,
      p_lider: lider || null,
    });
    return unwrap(data, error) as BurnRequest;
  },

  // 3. Registrar llegada al frente
  async registrarLlegada(solicitudId: string): Promise<BurnRequest> {
    if (!supabase) throw new Error('Supabase no está configurado');
    const { data, error } = await supabase.rpc('registrar_llegada_frente', {
      p_solicitud_id: solicitudId,
    });
    return unwrap(data, error) as BurnRequest;
  },

  // 4. Registrar motivo de espera
  async registrarEspera(solicitudId: string, motivo: string): Promise<BurnRequest> {
    if (!supabase) throw new Error('Supabase no está configurado');
    const { data, error } = await supabase.rpc('registrar_espera', {
      p_solicitud_id: solicitudId,
      p_motivo: motivo,
    });
    return unwrap(data, error) as BurnRequest;
  },

  // 5. Iniciar revisión técnica de seguridad
  async iniciarRevision(solicitudId: string): Promise<BurnRequest> {
    if (!supabase) throw new Error('Supabase no está configurado');
    const { data, error } = await supabase.rpc('iniciar_revision', {
      p_solicitud_id: solicitudId,
    });
    return unwrap(data, error) as BurnRequest;
  },

  // 6. Completar checklist de revisión
  async completarRevision(solicitudId: string, checklist: ReviewChecklist, observaciones?: string | null): Promise<BurnRequest> {
    if (!supabase) throw new Error('Supabase no está configurado');
    const { data, error } = await supabase.rpc('completar_revision', {
      p_solicitud_id: solicitudId,
      p_checklist: checklist,
      p_observaciones: observaciones || null,
    });
    return unwrap(data, error) as BurnRequest;
  },

  // 7. Iniciar quema
  async iniciarQuema(solicitudId: string): Promise<BurnRequest> {
    if (!supabase) throw new Error('Supabase no está configurado');
    const { data, error } = await supabase.rpc('iniciar_quema', {
      p_solicitud_id: solicitudId,
    });
    return unwrap(data, error) as BurnRequest;
  },

  // 8. Finalizar quema
  async finalizarQuema(solicitudId: string, observaciones?: string | null): Promise<BurnRequest> {
    if (!supabase) throw new Error('Supabase no está configurado');
    const { data, error } = await supabase.rpc('finalizar_quema', {
      p_solicitud_id: solicitudId,
      p_observaciones: observaciones || null,
    });
    return unwrap(data, error) as BurnRequest;
  },

  // 9. Cancelar solicitud
  async cancelarSolicitud(solicitudId: string, motivo: string): Promise<BurnRequest> {
    if (!supabase) throw new Error('Supabase no está configurado');
    const { data, error } = await supabase.rpc('cancelar_solicitud', {
      p_solicitud_id: solicitudId,
      p_motivo: motivo,
    });
    return unwrap(data, error) as BurnRequest;
  },
};
