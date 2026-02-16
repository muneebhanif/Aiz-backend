import type { Request, Response, NextFunction } from 'express';
import { verifyJwt, type JwtPayload } from '../auth/jwt.js';
import { UnauthorizedError } from '../utils/errors.js';

/**
 * Extend Express Request to carry verified user identity.
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Authentication middleware.
 * Extracts Bearer token from Authorization header, verifies it,
 * and attaches the decoded payload to req.user.
 *
 * Deny-by-default: no token = no access.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    next(new UnauthorizedError('Missing or malformed Authorization header'));
    return;
  }

  const token = header.slice(7);

  if (!token || token.length < 10) {
    next(new UnauthorizedError('Invalid token format'));
    return;
  }

  verifyJwt(token)
    .then((payload) => {
      req.user = payload;
      next();
    })
    .catch(next);
}

/**
 * Role-based access control middleware factory.
 * Only allows requests from users whose Supabase role is in the allowed list.
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError());
      return;
    }
    const userRole = req.user.role || '';
    if (!allowedRoles.includes(userRole)) {
      next(new UnauthorizedError('Insufficient role privileges'));
      return;
    }
    next();
  };
}
