import { z } from 'zod';

export const rentalIdParam = z.object({
  rentalId: z.string().uuid('Invalid rental ID'),
});

export const photoIdParam = z.object({
  rentalId: z.string().uuid('Invalid rental ID'),
  photoId: z.string().uuid('Invalid photo ID'),
});

export const createPhotosBody = z.object({
  photos: z.array(z.object({
    photoData: z.string().min(1, 'Photo data is required'),
    photoType: z.enum(['before', 'after']).default('before'),
    caption: z.string().max(200).trim().default(''),
  })).min(1, 'At least one photo required').max(10, 'Maximum 10 photos'),
});
