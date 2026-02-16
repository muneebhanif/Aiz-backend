import { getSupabase, getSupabaseAuth } from '../database/supabase.js';
import { UnauthorizedError, BadRequestError } from '../utils/errors.js';

/**
 * Auth service — proxies Supabase Auth operations.
 * The frontend never touches Supabase directly.
 */
export const authService = {
  /**
   * Sign in with email/password via Supabase Auth.
   * Uses the anon-key client so Supabase Auth works correctly.
   */
  async login(email: string, password: string) {
    const supabase = getSupabaseAuth();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[Auth] Login error:', error.message);
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!data.session) {
      throw new UnauthorizedError('Authentication failed');
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
      },
    };
  },

  /**
   * Create a new user account via Supabase Auth.
   * Uses service_role client for admin.createUser (auto-confirms email).
   */
  async signup(email: string, password: string) {
    const supabase = getSupabase();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      if (error.message.includes('already registered')) {
        throw new BadRequestError('Email already registered');
      }
      throw new BadRequestError(`Signup failed: ${error.message}`);
    }

    return {
      id: data.user.id,
      email: data.user.email,
      role: data.user.role,
    };
  },

  /**
   * Refresh an expired access token.
   * Uses the anon-key client — service_role key doesn't work for refreshSession.
   */
  async refreshToken(refreshToken: string) {
    const supabase = getSupabaseAuth();

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      console.error('[Auth] Refresh error:', error?.message);
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
      user: {
        id: data.session.user.id,
        email: data.session.user.email,
        role: data.session.user.role,
      },
    };
  },

  /**
   * Sign out — invalidates the session in Supabase.
   */
  async logout(userId: string) {
    const supabase = getSupabase();
    await supabase.auth.admin.signOut(userId);
  },
};
