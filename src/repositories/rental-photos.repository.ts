import { getSupabase } from '../database/supabase.js';
import { InternalError, NotFoundError } from '../utils/errors.js';

export interface RentalPhotoRow {
  id: string;
  rental_id: string;
  vehicle_id: string;
  photo_data: string;
  photo_type: 'before' | 'after';
  caption: string;
  created_at: string;
}

type RentalPhotoInsert = Omit<RentalPhotoRow, 'id' | 'created_at'>;

const TABLE = 'rental_photos';

export const rentalPhotosRepository = {
  async findByRentalId(rentalId: string): Promise<RentalPhotoRow[]> {
    const { data, error } = await getSupabase()
      .from(TABLE).select('*').eq('rental_id', rentalId).order('created_at', { ascending: true });
    if (error) throw new InternalError(`Failed to fetch rental photos: ${error.message}`);
    return (data ?? []) as RentalPhotoRow[];
  },

  async findById(id: string): Promise<RentalPhotoRow> {
    const { data, error } = await getSupabase()
      .from(TABLE).select('*').eq('id', id).single();
    if (error || !data) throw new NotFoundError('Rental photo');
    return data as RentalPhotoRow;
  },

  async createMany(photos: RentalPhotoInsert[]): Promise<RentalPhotoRow[]> {
    if (photos.length === 0) return [];
    const { data, error } = await getSupabase()
      .from(TABLE).insert(photos).select();
    if (error) throw new InternalError(`Failed to save rental photos: ${error.message}`);
    return (data ?? []) as RentalPhotoRow[];
  },

  async delete(id: string): Promise<void> {
    await this.findById(id);
    const { error } = await getSupabase().from(TABLE).delete().eq('id', id);
    if (error) throw new InternalError(`Failed to delete rental photo: ${error.message}`);
  },

  async deleteByRentalId(rentalId: string): Promise<void> {
    const { error } = await getSupabase().from(TABLE).delete().eq('rental_id', rentalId);
    if (error) throw new InternalError(`Failed to delete rental photos: ${error.message}`);
  },
};
