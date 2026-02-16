import { rentalsRepository, type RentalRow } from '../repositories/rentals.repository.js';
import { vehiclesRepository } from '../repositories/vehicles.repository.js';
import { BadRequestError } from '../utils/errors.js';

type CreateRentalInput = {
  vehicle_id: string;
  driver_name: string;
  driver_phone: string;
  driver_email: string;
  driver_license: string;
  driver_address: string;
  weekly_rent: number;
  deposit: number;
  start_date: string;
  notes: string;
};

type UpdateRentalInput = Partial<Omit<CreateRentalInput, 'vehicle_id'>>;

export const rentalsService = {
  async getAll(): Promise<RentalRow[]> {
    return rentalsRepository.findAll();
  },

  async getById(id: string): Promise<RentalRow> {
    return rentalsRepository.findById(id);
  },

  async getByVehicleId(vehicleId: string): Promise<RentalRow[]> {
    return rentalsRepository.findByVehicleId(vehicleId);
  },

  async create(input: CreateRentalInput): Promise<RentalRow> {
    // Business rule: vehicle must exist and be available
    const vehicle = await vehiclesRepository.findById(input.vehicle_id);
    if (vehicle.status === 'rented') {
      throw new BadRequestError('Vehicle is already rented');
    }

    // Business rule: weekly rent must be positive
    if (input.weekly_rent <= 0) {
      throw new BadRequestError('Weekly rent must be positive');
    }

    // Create the rental
    const rental = await rentalsRepository.create(input);

    // Mark vehicle as rented (transactional intent — service coordinates)
    await vehiclesRepository.updateStatus(input.vehicle_id, 'rented');

    return rental;
  },

  async update(id: string, input: UpdateRentalInput): Promise<RentalRow> {
    const rental = await rentalsRepository.findById(id);

    // Business rule: cannot update an ended rental's core terms
    if (rental.status === 'ended' && (input.weekly_rent || input.deposit || input.start_date)) {
      throw new BadRequestError('Cannot modify financial terms of an ended rental');
    }

    return rentalsRepository.update(id, input);
  },

  async endRental(id: string, endDate?: string): Promise<RentalRow> {
    const rental = await rentalsRepository.findById(id);

    const effectiveEndDate = endDate || new Date().toISOString().split('T')[0]!;

    // Business rule: end date cannot be before start date
    if (effectiveEndDate < rental.start_date) {
      throw new BadRequestError('End date cannot be before start date');
    }

    // End the rental
    const ended = await rentalsRepository.endRental(id, effectiveEndDate);

    // Mark vehicle as available
    await vehiclesRepository.updateStatus(rental.vehicle_id, 'available');

    return ended;
  },
};
