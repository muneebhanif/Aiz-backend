import { z } from 'zod';

export const todoIdParam = z.object({
  id: z.string().uuid('Invalid todo ID'),
});

export const createTodoBody = z.object({
  title: z.string().min(1, 'Title required').max(500).trim(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  completed: z.boolean().default(false),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
});

export const updateTodoBody = createTodoBody.partial();
