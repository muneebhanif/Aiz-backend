import { rentalPhotosRepository, type RentalPhotoRow } from '../repositories/rental-photos.repository.js';
import { rentalsRepository } from '../repositories/rentals.repository.js';
import { BadRequestError } from '../utils/errors.js';

interface CreatePhotoInput {
  rental_id: string;
  vehicle_id: string;
  photo_data: string;
  photo_type: 'before' | 'after';
  caption: string;
}

export const rentalPhotosService = {
  async getByRentalId(rentalId: string): Promise<RentalPhotoRow[]> {
    // Verify rental exists
    await rentalsRepository.findById(rentalId);
    return rentalPhotosRepository.findByRentalId(rentalId);
  },

  async createMany(rentalId: string, photos: Omit<CreatePhotoInput, 'rental_id'>[]): Promise<RentalPhotoRow[]> {
    // Verify rental exists
    const rental = await rentalsRepository.findById(rentalId);

    if (photos.length > 10) {
      throw new BadRequestError('Maximum 10 photos per upload');
    }

    const inserts = photos.map(p => ({
      rental_id: rentalId,
      vehicle_id: rental.vehicle_id,
      photo_data: p.photo_data,
      photo_type: p.photo_type,
      caption: p.caption,
    }));

    return rentalPhotosRepository.createMany(inserts);
  },

  async delete(id: string): Promise<void> {
    return rentalPhotosRepository.delete(id);
  },

  async deleteByRentalId(rentalId: string): Promise<void> {
    return rentalPhotosRepository.deleteByRentalId(rentalId);
  },
};
