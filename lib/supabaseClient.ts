import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://xmuoddhzagswylzcheui.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdW9kZGh6YWdzd3lsemNoZXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1OTc0MzMsImV4cCI6MjEwMzE3MzQzM30.sIEdP4DMw8RHy-lZR91Eng635eezcfm8e0pDoz_e9Sc';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('tu-proyecto')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
