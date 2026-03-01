-- Add issuedBy column to rentals table
-- Tracks which company member handed the car to the driver
ALTER TABLE rentals ADD COLUMN IF NOT EXISTS issued_by text DEFAULT NULL;
