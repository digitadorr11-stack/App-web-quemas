import { UserProfile, UserRole } from './types';
import { supabase } from './supabaseClient';

const ACTIVE_SESSION_KEY = 'la_union_active_session_v2';
const isBrowser = typeof window !== 'undefined';

export const storageService = {
  // Obtener usuario activo guardado en memoria local
  getActiveUser(): UserProfile | null {
    if (!isBrowser) return null;
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setActiveUser(user: UserProfile | null) {
    if (!isBrowser) return;
    if (user) {
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
  },

  // Cerrar sesión en Supabase y localmente
  async logout(): Promise<void> {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Error signing out of Supabase:', e);
      }
    }
    this.setActiveUser(null);
  },

  // Iniciar sesión con Google OAuth (Supabase Auth nativo)
  async loginWithGoogle(): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase no está configurado');
    }
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/login`,
      },
    });
    if (error) {
      throw new Error(error.message);
    }
  },

  // Iniciar sesión con Correo y Contraseña oficial de Supabase Auth
  async login(identifier: string, password: string): Promise<UserProfile | null> {
    if (!supabase) {
      throw new Error('Supabase no está configurado');
    }

    const cleanEmail = identifier.trim().toLowerCase();

    // Supabase Auth maneja contraseñas cifradas con bcrypt/argon2
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password,
    });

    if (error || !data.user) {
      throw new Error(error?.message || 'Credenciales incorrectas o usuario no registrado.');
    }

    return await this.fetchOrCreateProfile(data.user);
  },

  // Registrar nuevo usuario
  async registerUser(params: {
    full_name: string;
    email: string;
    password: string;
  }): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase no está configurado');
    }

    const { full_name, email, password } = params;

    // Registrar en auth.users
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: full_name.trim(),
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  },

  // Manejar sesión activa de Supabase (Google OAuth o Cookie de sesión)
  async handleAuthSession(): Promise<UserProfile | null> {
    if (!supabase) return null;

    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) {
      return this.getActiveUser();
    }

    return await this.fetchOrCreateProfile(data.session.user);
  },

  // Obtener perfil desde public.perfiles_usuarios con RLS
  async fetchOrCreateProfile(supabaseUser: any): Promise<UserProfile> {
    if (!supabase) throw new Error('Supabase no disponible');

    const email = supabaseUser.email?.toLowerCase() || '';
    const fullName =
      supabaseUser.user_metadata?.full_name ||
      supabaseUser.user_metadata?.name ||
      email.split('@')[0];

    // Consulta con RLS (el usuario autenticado puede leer su propio id)
    const { data: profile, error } = await supabase
      .from('perfiles_usuarios')
      .select('*')
      .eq('id', supabaseUser.id)
      .maybeSingle();

    if (profile) {
      const user: UserProfile = {
        id: profile.id,
        username: email.split('@')[0],
        email: profile.correo || email,
        full_name: profile.nombre_completo || fullName,
        role: (profile.rol || 'pendiente') as UserRole,
        active: profile.activo ?? false,
        created_at: profile.created_at,
      };
      this.setActiveUser(user);
      return user;
    }

    // Fallback: perfil básico mientras se propaga el trigger
    const defaultUser: UserProfile = {
      id: supabaseUser.id,
      username: email.split('@')[0],
      email: email,
      full_name: fullName,
      role: 'pendiente',
      active: false,
    };
    this.setActiveUser(defaultUser);
    return defaultUser;
  },
};
