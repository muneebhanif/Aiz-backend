import { todosRepository, type TodoRow } from '../repositories/todos.repository.js';

type CreateTodoInput = Omit<TodoRow, 'id' | 'created_at' | 'updated_at'>;
type UpdateTodoInput = Partial<Pick<TodoRow, 'title' | 'due_date' | 'completed' | 'priority'>>;

export const todosService = {
  async getAll(): Promise<TodoRow[]> {
    return todosRepository.findAll();
  },

  async getById(id: string): Promise<TodoRow> {
    return todosRepository.findById(id);
  },

  async create(input: CreateTodoInput): Promise<TodoRow> {
    return todosRepository.create(input);
  },

  async update(id: string, input: UpdateTodoInput): Promise<TodoRow> {
    // Ensure record exists (will throw NotFoundError if not)
    await todosRepository.findById(id);
    return todosRepository.update(id, input);
  },

  async delete(id: string): Promise<void> {
    // Ensure record exists
    await todosRepository.findById(id);
    return todosRepository.delete(id);
  },
};
