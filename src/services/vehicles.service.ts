import { vehiclesRepository, type VehicleRow } from '../repositories/vehicles.repository.js';
import { BadRequestError } from '../utils/errors.js';

type CreateVehicleInput = Omit<VehicleRow, 'id' | 'created_at' | 'updated_at'>;
type UpdateVehicleInput = Partial<CreateVehicleInput>;

export const vehiclesService = {
  async getAll(): Promise<VehicleRow[]> {
    return vehiclesRepository.findAll();
  },

  async getById(id: string): Promise<VehicleRow> {
    return vehiclesRepository.findById(id);
  },

  async create(input: CreateVehicleInput): Promise<VehicleRow> {
    // Business rule: registration must be uppercase and trimmed
    const normalized = {
      ...input,
      registration: input.registration.toUpperCase().trim(),
    };

    return vehiclesRepository.create(normalized);
  },

  async update(id: string, input: UpdateVehicleInput): Promise<VehicleRow> {
    const normalized = { ...input };
    if (normalized.registration) {
      normalized.registration = normalized.registration.toUpperCase().trim();
    }

    // Business rule: cannot change status to 'available' if there's an active rental
    // (that should be done through endRental flow)
    // But we allow direct status changes for admin flexibility

    return vehiclesRepository.update(id, normalized);
  },

  async delete(id: string): Promise<void> {
    // Business rule: cannot delete a rented vehicle
    const vehicle = await vehiclesRepository.findById(id);
    if (vehicle.status === 'rented') {
      throw new BadRequestError('Cannot delete a vehicle that is currently rented');
    }

    return vehiclesRepository.delete(id);
  },
};
