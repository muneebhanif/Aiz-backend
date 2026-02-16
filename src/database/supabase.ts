import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { dbConfig } from '../config/index.js';

/**
 * Server-side Supabase client using the service_role key.
 * This bypasses RLS — all access control is enforced by our middleware/services.
 * NEVER expose this client or its key to the frontend.
 */
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_client) {
    _client = createClient(dbConfig.supabaseUrl, dbConfig.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }
  return _client;
}

/**
 * Anon-key Supabase client for auth operations (login, refresh).
 * Uses the publishable anon key so Supabase Auth works correctly
 * for regular user authentication flows.
 */
let _anonClient: SupabaseClient | null = null;

export function getSupabaseAuth(): SupabaseClient {
  if (!_anonClient) {
    _anonClient = createClient(dbConfig.supabaseUrl, dbConfig.supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }
  return _anonClient;
}
