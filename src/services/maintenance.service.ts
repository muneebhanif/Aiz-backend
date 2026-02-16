import { maintenanceRepository, type MaintenanceRow } from '../repositories/maintenance.repository.js';
import { vehiclesRepository } from '../repositories/vehicles.repository.js';

type CreateMaintenanceInput = Omit<MaintenanceRow, 'id' | 'created_at' | 'updated_at'>;
type UpdateMaintenanceInput = Partial<Pick<MaintenanceRow, 'description' | 'cost' | 'date' | 'garage' | 'remarks'>>;

export const maintenanceService = {
  async getAll(vehicleId?: string): Promise<MaintenanceRow[]> {
    return maintenanceRepository.findAll(vehicleId);
  },

  async getById(id: string): Promise<MaintenanceRow> {
    return maintenanceRepository.findById(id);
  },

  async create(input: CreateMaintenanceInput): Promise<MaintenanceRow> {
    // Validate vehicle exists
    await vehiclesRepository.findById(input.vehicle_id);

    return maintenanceRepository.create(input);
  },

  async update(id: string, input: UpdateMaintenanceInput): Promise<MaintenanceRow> {
    // Ensure record exists (will throw NotFoundError if not)
    await maintenanceRepository.findById(id);
    return maintenanceRepository.update(id, input);
  },

  async delete(id: string): Promise<void> {
    // Ensure record exists
    await maintenanceRepository.findById(id);
    return maintenanceRepository.delete(id);
  },
};
