import { getSupabase } from '../database/supabase.js';
import { InternalError, NotFoundError } from '../utils/errors.js';

export interface SavingsAccountRow {
  id: string;
  name: string;
  opening_balance: number;
  created_at: string;
  updated_at: string;
}

export interface SavingsEntryRow {
  id: string;
  account_id: string;
  entry_type: 'income' | 'expense';
  amount: number;
  note: string;
  entry_date: string;
  created_at: string;
  updated_at: string;
}

type SavingsAccountInsert = Omit<SavingsAccountRow, 'id' | 'created_at' | 'updated_at'>;
type SavingsAccountUpdate = Partial<Pick<SavingsAccountRow, 'name' | 'opening_balance'>>;
type SavingsEntryInsert = Omit<SavingsEntryRow, 'id' | 'created_at' | 'updated_at'>;
type SavingsEntryUpdate = Partial<Pick<SavingsEntryRow, 'entry_type' | 'amount' | 'note' | 'entry_date'>>;

const ACCOUNTS_TABLE = 'savings_accounts';
const ENTRIES_TABLE = 'savings_entries';

export const savingsRepository = {
  async findAllAccounts(): Promise<SavingsAccountRow[]> {
    const { data, error } = await getSupabase().from(ACCOUNTS_TABLE).select('*').order('created_at', { ascending: true });
    if (error) throw new InternalError(`Failed to fetch savings accounts: ${error.message}`);
    return (data ?? []) as SavingsAccountRow[];
  },

  async findAccountById(id: string): Promise<SavingsAccountRow> {
    const { data, error } = await getSupabase().from(ACCOUNTS_TABLE).select('*').eq('id', id).single();
    if (error || !data) throw new NotFoundError('Savings account');
    return data as SavingsAccountRow;
  },

  async createAccount(input: SavingsAccountInsert): Promise<SavingsAccountRow> {
    const { data, error } = await getSupabase().from(ACCOUNTS_TABLE).insert(input).select().single();
    if (error) throw new InternalError(`Failed to create savings account: ${error.message}`);
    return data as SavingsAccountRow;
  },

  async updateAccount(id: string, input: SavingsAccountUpdate): Promise<SavingsAccountRow> {
    await this.findAccountById(id);
    const { data, error } = await getSupabase().from(ACCOUNTS_TABLE).update(input).eq('id', id).select().single();
    if (error) throw new InternalError(`Failed to update savings account: ${error.message}`);
    return data as SavingsAccountRow;
  },

  async deleteAccount(id: string): Promise<void> {
    await this.findAccountById(id);
    const { error } = await getSupabase().from(ACCOUNTS_TABLE).delete().eq('id', id);
    if (error) throw new InternalError(`Failed to delete savings account: ${error.message}`);
  },

  async findAllEntries(): Promise<SavingsEntryRow[]> {
    const { data, error } = await getSupabase().from(ENTRIES_TABLE).select('*').order('entry_date', { ascending: false });
    if (error) throw new InternalError(`Failed to fetch savings entries: ${error.message}`);
    return (data ?? []) as SavingsEntryRow[];
  },

  async findEntryById(id: string): Promise<SavingsEntryRow> {
    const { data, error } = await getSupabase().from(ENTRIES_TABLE).select('*').eq('id', id).single();
    if (error || !data) throw new NotFoundError('Savings entry');
    return data as SavingsEntryRow;
  },

  async createEntry(input: SavingsEntryInsert): Promise<SavingsEntryRow> {
    const { data, error } = await getSupabase().from(ENTRIES_TABLE).insert(input).select().single();
    if (error) throw new InternalError(`Failed to create savings entry: ${error.message}`);
    return data as SavingsEntryRow;
  },

  async updateEntry(id: string, input: SavingsEntryUpdate): Promise<SavingsEntryRow> {
    await this.findEntryById(id);
    const { data, error } = await getSupabase().from(ENTRIES_TABLE).update(input).eq('id', id).select().single();
    if (error) throw new InternalError(`Failed to update savings entry: ${error.message}`);
    return data as SavingsEntryRow;
  },

  async deleteEntry(id: string): Promise<void> {
    await this.findEntryById(id);
    const { error } = await getSupabase().from(ENTRIES_TABLE).delete().eq('id', id);
    if (error) throw new InternalError(`Failed to delete savings entry: ${error.message}`);
  },
};
