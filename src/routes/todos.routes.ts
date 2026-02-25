import { Router } from 'express';
import { todosController } from '../controllers/todos.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  todoIdParam,
  createTodoBody,
  updateTodoBody,
} from '../validators/todos.validator.js';

const router = Router();

// All todos routes require authentication
router.use(authenticate);

// GET /api/v1/todos
router.get('/', todosController.getAll);

// GET /api/v1/todos/:id
router.get(
  '/:id',
  validate({ params: todoIdParam }),
  todosController.getById,
);

// POST /api/v1/todos
router.post(
  '/',
  validate({ body: createTodoBody }),
  todosController.create,
);

// PATCH /api/v1/todos/:id
router.patch(
  '/:id',
  validate({ params: todoIdParam, body: updateTodoBody }),
  todosController.update,
);

// DELETE /api/v1/todos/:id
router.delete(
  '/:id',
  validate({ params: todoIdParam }),
  todosController.delete,
);

export default router;
