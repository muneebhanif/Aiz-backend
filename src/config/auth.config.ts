import { env } from './env.js';

export const authConfig = {
  /** Supabase project URL — used to build the JWKS endpoint */
  supabaseUrl: env.SUPABASE_URL,
  /** Supabase issuer format */
  issuer: `${env.SUPABASE_URL}/auth/v1`,
} as const;
