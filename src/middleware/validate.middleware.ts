import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema, ZodIssue } from 'zod';
import { ValidationError } from '../utils/errors.js';

/**
 * Schema-based request validation middleware factory.
 * Validates body, params, and/or query against Zod schemas.
 *
 * Rejects malformed or unsafe input before it reaches the controller.
 */
export function validate(schemas: {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const errors: Array<{ field: string; message: string }> = [];

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        errors.push(...formatIssues('body', result.error.issues));
      } else {
        req.body = result.data;
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        errors.push(...formatIssues('params', result.error.issues));
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        errors.push(...formatIssues('query', result.error.issues));
      }
      // Note: Express 5 makes req.query read-only, so we don't reassign it.
      // Controllers read from req.query directly.
    }

    if (errors.length > 0) {
      next(new ValidationError(errors));
      return;
    }

    next();
  };
}

function formatIssues(source: string, issues: ZodIssue[]): Array<{ field: string; message: string }> {
  return issues.map(issue => ({
    field: `${source}.${issue.path.join('.')}`,
    message: issue.message,
  }));
}
