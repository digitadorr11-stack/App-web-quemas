import { UserProfile, UserRole } from './types';
import { supabase } from './supabaseClient';

export const authService = {
  // Iniciar sesión con Google OAuth
  async loginWithGoogle(): Promise<void> {
    if (!supabase) throw new Error('Supabase no está configurado');
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/login`,
      },
    });
    if (error) throw new Error(error.message);
  },

  // Iniciar sesión con Correo y Contraseña oficial
  async loginWithEmail(correo: string, password: string): Promise<UserProfile> {
    if (!supabase) throw new Error('Supabase no está configurado');

    const cleanEmail = correo.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error || !data.user) {
      throw new Error(error?.message || 'Credenciales inválidas o usuario no encontrado');
    }

    return await this.fetchUserProfile(data.user.id);
  },

  // Registro de nuevo usuario (solicitud de acceso)
  async registerUser(params: {
    nombre_completo: string;
    correo: string;
    password: string;
  }): Promise<void> {
    if (!supabase) throw new Error('Supabase no está configurado');

    const { nombre_completo, correo, password } = params;
    const cleanEmail = correo.trim().toLowerCase();

    const { error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: nombre_completo.trim(),
        },
      },
    });

    if (error) throw new Error(error.message);
  },

  // Cerrar sesión
  async logout(): Promise<void> {
    if (supabase) {
      await supabase.auth.signOut();
    }
  },

  // Obtener perfil del usuario actualmente autenticado
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    if (!supabase) return null;

    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) return null;

    try {
      return await this.fetchUserProfile(data.session.user.id);
    } catch (e) {
      console.warn('Error obteniendo perfil:', e);
      return null;
    }
  },

  // Consultar tabla perfiles_usuarios con RLS
  async fetchUserProfile(userId: string): Promise<UserProfile> {
    if (!supabase) throw new Error('Supabase no disponible');

    const { data: profile, error } = await supabase
      .from('perfiles_usuarios')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      throw new Error('Perfil de usuario no encontrado o acceso restringido');
    }

    return {
      id: profile.id,
      correo: profile.correo,
      nombre_completo: profile.nombre_completo,
      rol: profile.rol as UserRole,
      frente_asignado: profile.frente_asignado,
      patrulla_asignada: profile.patrulla_asignada,
      activo: profile.activo,
      created_at: profile.created_at,
    };
  },
};
