import { vehiclesRepository } from '../repositories/vehicles.repository.js';
import { rentalsRepository } from '../repositories/rentals.repository.js';
import { paymentsRepository } from '../repositories/payments.repository.js';
import { maintenanceRepository } from '../repositories/maintenance.repository.js';

export interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  rentedVehicles: number;
  totalWeeklyRevenue: number;
  totalOutstandingBalance: number;
  totalMaintenanceCost: number;
  complianceAlerts: number;
  endedRentalsWithBalance: number;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    // Fetch all data in parallel
    const [vehicles, rentals, payments, maintenanceRecords] = await Promise.all([
      vehiclesRepository.findAll(),
      rentalsRepository.findAll(),
      paymentsRepository.findAll({}),
      maintenanceRepository.findAll(),
    ]);

    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter((v) => v.status === 'available').length;
    const rentedVehicles = vehicles.filter((v) => v.status === 'rented').length;

    // Weekly revenue: sum of weekly_rent for active rentals
    const activeRentals = rentals.filter((r) => r.status === 'active');
    const totalWeeklyRevenue = activeRentals.reduce((sum, r) => sum + r.weekly_rent, 0);

    // Outstanding balance: sum of unpaid/partial amounts
    const totalOutstandingBalance = payments
      .filter((p) => p.status === 'unpaid' || p.status === 'partial')
      .reduce((sum, p) => {
        const netDue = p.amount_due - p.deduction;
        return sum + (netDue - p.amount_paid);
      }, 0);

    // Total maintenance cost
    const totalMaintenanceCost = maintenanceRecords.reduce((sum, m) => sum + m.cost, 0);

    // Compliance alerts: vehicles with expired MOT, insurance, or road tax
    const today = new Date().toISOString().split('T')[0]!;
    const complianceAlerts = vehicles.filter((v) => {
      return (
        (v.mot_expiry && v.mot_expiry < today) ||
        (v.taxi_plate_expiry && v.taxi_plate_expiry < today) ||
        (v.road_tax_expiry && v.road_tax_expiry < today)
      );
    }).length;

    // Ended rentals with remaining balance
    const endedRentals = rentals.filter((r) => r.status === 'ended');
    const endedRentalIds = new Set(endedRentals.map((r) => r.id));
    const endedRentalPayments = payments.filter((p) => endedRentalIds.has(p.rental_id));
    const endedRentalsWithBalance = endedRentals.filter((rental) => {
      const rentalPayments = endedRentalPayments.filter((p) => p.rental_id === rental.id);
      const owed = rentalPayments.reduce((sum, p) => {
        const netDue = p.amount_due - p.deduction;
        return sum + (netDue - p.amount_paid);
      }, 0);
      return owed > 0;
    }).length;

    return {
      totalVehicles,
      availableVehicles,
      rentedVehicles,
      totalWeeklyRevenue,
      totalOutstandingBalance,
      totalMaintenanceCost,
      complianceAlerts,
      endedRentalsWithBalance,
    };
  },
};
