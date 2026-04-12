import { owesRepository, type OwesEntryRow } from '../repositories/owes.repository.js';
import { rentalsRepository } from '../repositories/rentals.repository.js';

type CreateOwesEntryInput = Omit<OwesEntryRow, 'id' | 'created_at' | 'updated_at'>;
type UpdateOwesEntryInput = Partial<Pick<OwesEntryRow, 'entry_type' | 'amount' | 'note' | 'entry_date'>>;

export const owesService = {
  async getAll(): Promise<OwesEntryRow[]> {
    return owesRepository.findAll();
  },

  async getById(id: string): Promise<OwesEntryRow> {
    return owesRepository.findById(id);
  },

  async create(input: CreateOwesEntryInput): Promise<OwesEntryRow> {
    await rentalsRepository.findById(input.rental_id);
    return owesRepository.create(input);
  },

  async update(id: string, input: UpdateOwesEntryInput): Promise<OwesEntryRow> {
    await owesRepository.findById(id);
    return owesRepository.update(id, input);
  },

  async delete(id: string): Promise<void> {
    await owesRepository.findById(id);
    return owesRepository.delete(id);
  },
};
