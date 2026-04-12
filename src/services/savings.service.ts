import { savingsRepository, type SavingsAccountRow, type SavingsEntryRow } from '../repositories/savings.repository.js';

type CreateSavingsAccountInput = Omit<SavingsAccountRow, 'id' | 'created_at' | 'updated_at'>;
type UpdateSavingsAccountInput = Partial<Pick<SavingsAccountRow, 'name' | 'opening_balance'>>;
type CreateSavingsEntryInput = Omit<SavingsEntryRow, 'id' | 'created_at' | 'updated_at'>;
type UpdateSavingsEntryInput = Partial<Pick<SavingsEntryRow, 'entry_type' | 'amount' | 'note' | 'entry_date'>>;

export const savingsService = {
  async getAllAccounts(): Promise<SavingsAccountRow[]> {
    return savingsRepository.findAllAccounts();
  },

  async getAccountById(id: string): Promise<SavingsAccountRow> {
    return savingsRepository.findAccountById(id);
  },

  async createAccount(input: CreateSavingsAccountInput): Promise<SavingsAccountRow> {
    return savingsRepository.createAccount(input);
  },

  async updateAccount(id: string, input: UpdateSavingsAccountInput): Promise<SavingsAccountRow> {
    await savingsRepository.findAccountById(id);
    return savingsRepository.updateAccount(id, input);
  },

  async deleteAccount(id: string): Promise<void> {
    await savingsRepository.findAccountById(id);
    return savingsRepository.deleteAccount(id);
  },

  async getAllEntries(): Promise<SavingsEntryRow[]> {
    return savingsRepository.findAllEntries();
  },

  async getEntryById(id: string): Promise<SavingsEntryRow> {
    return savingsRepository.findEntryById(id);
  },

  async createEntry(input: CreateSavingsEntryInput): Promise<SavingsEntryRow> {
    await savingsRepository.findAccountById(input.account_id);
    return savingsRepository.createEntry(input);
  },

  async updateEntry(id: string, input: UpdateSavingsEntryInput): Promise<SavingsEntryRow> {
    await savingsRepository.findEntryById(id);
    return savingsRepository.updateEntry(id, input);
  },

  async deleteEntry(id: string): Promise<void> {
    await savingsRepository.findEntryById(id);
    return savingsRepository.deleteEntry(id);
  },
};
