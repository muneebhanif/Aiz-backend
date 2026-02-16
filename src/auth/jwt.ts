import * as jose from 'jose';
import { authConfig } from '../config/index.js';
import { UnauthorizedError } from '../utils/errors.js';

export interface JwtPayload {
  sub: string;          // Supabase user id
  email?: string;
  role?: string;        // Supabase user role (e.g. 'authenticated')
  aud?: string;
  iat?: number;
  exp?: number;
}

/**
 * Remote JWKS key set — fetches and caches public keys from Supabase.
 * This automatically handles key rotation and supports both HS256 and ES256.
 */
const JWKS = jose.createRemoteJWKSet(
  new URL(`${authConfig.supabaseUrl}/auth/v1/.well-known/jwks.json`)
);

/**
 * Verifies a Supabase-issued JWT using the project's JWKS endpoint.
 * Supports ECC (P-256 / ES256) and legacy HS256 keys automatically.
 * Rejects expired, tampered, or malformed tokens.
 */
export async function verifyJwt(token: string): Promise<JwtPayload> {
  try {
    const { payload } = await jose.jwtVerify(token, JWKS);

    if (!payload.sub) {
      throw new UnauthorizedError('Token missing subject claim');
    }

    return {
      sub: payload.sub,
      email: payload['email'] as string | undefined,
      role: payload['role'] as string | undefined,
      aud: payload.aud as string | undefined,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error;

    if (error instanceof jose.errors.JWTExpired) {
      throw new UnauthorizedError('Token expired');
    }
    if (error instanceof jose.errors.JWTClaimValidationFailed) {
      throw new UnauthorizedError('Token claim validation failed');
    }
    if (error instanceof jose.errors.JWSSignatureVerificationFailed) {
      throw new UnauthorizedError('Token signature invalid');
    }

    console.error('[JWT] Verification failed:', error);
    throw new UnauthorizedError('Invalid token');
  }
}
