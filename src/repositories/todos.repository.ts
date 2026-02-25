import { getSupabase } from '../database/supabase.js';
import { InternalError, NotFoundError } from '../utils/errors.js';

export interface TodoRow {
  id: string;
  title: string;
  due_date: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  created_at: string;
  updated_at: string;
}

type TodoInsert = Omit<TodoRow, 'id' | 'created_at' | 'updated_at'>;
type TodoUpdate = Partial<TodoInsert>;

const TABLE = 'todos';

export const todosRepository = {
  async findAll(): Promise<TodoRow[]> {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .select('*')
      .order('due_date', { ascending: true });

    if (error) throw new InternalError(`Failed to fetch todos: ${error.message}`);
    return (data ?? []) as TodoRow[];
  },

  async findById(id: string): Promise<TodoRow> {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Todo');
    return data as TodoRow;
  },

  async create(input: TodoInsert): Promise<TodoRow> {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .insert(input)
      .select()
      .single();

    if (error) throw new InternalError(`Failed to create todo: ${error.message}`);
    return data as TodoRow;
  },

  async update(id: string, input: TodoUpdate): Promise<TodoRow> {
    await this.findById(id);

    const { data, error } = await getSupabase()
      .from(TABLE)
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalError(`Failed to update todo: ${error.message}`);
    return data as TodoRow;
  },

  async delete(id: string): Promise<void> {
    await this.findById(id);

    const { error } = await getSupabase()
      .from(TABLE)
      .delete()
      .eq('id', id);

    if (error) throw new InternalError(`Failed to delete todo: ${error.message}`);
  },
};
