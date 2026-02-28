import type { Request, Response } from 'express';
import { rentalPhotosService } from '../services/rental-photos.service.js';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response.js';
import type { RentalPhotoRow } from '../repositories/rental-photos.repository.js';

function toApiPhoto(row: RentalPhotoRow) {
  return {
    id: row.id,
    rentalId: row.rental_id,
    vehicleId: row.vehicle_id,
    photoData: row.photo_data,
    photoType: row.photo_type,
    caption: row.caption,
    createdAt: row.created_at,
  };
}

export const rentalPhotosController = {
  async getByRentalId(req: Request, res: Response): Promise<void> {
    const photos = await rentalPhotosService.getByRentalId(req.params.rentalId as string);
    sendSuccess(res, photos.map(toApiPhoto));
  },

  async create(req: Request, res: Response): Promise<void> {
    const photos = await rentalPhotosService.createMany(
      req.params.rentalId as string,
      (req.body.photos as Array<{ photoData: string; photoType: string; caption: string }>).map(p => ({
        vehicle_id: '',  // Will be set from rental in service
        photo_data: p.photoData,
        photo_type: p.photoType as 'before' | 'after',
        caption: p.caption || '',
      })),
    );
    sendCreated(res, photos.map(toApiPhoto));
  },

  async delete(req: Request, res: Response): Promise<void> {
    await rentalPhotosService.delete(req.params.photoId as string);
    sendNoContent(res);
  },
};
