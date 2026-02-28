-- Migration: Add rental agreement support (signature + before-photos)
-- Date: 2026-02-28

-- 1. Add driver_signature column to rentals table
ALTER TABLE public.rentals
  ADD COLUMN IF NOT EXISTS driver_signature text NOT NULL DEFAULT '';

-- 2. Create rental_photos table for before/after pictures of vehicles
CREATE TABLE IF NOT EXISTS public.rental_photos (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  rental_id uuid NOT NULL,
  vehicle_id uuid NOT NULL,
  photo_data text NOT NULL,
  photo_type text NOT NULL DEFAULT 'before' CHECK (photo_type IN ('before', 'after')),
  caption text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT rental_photos_pkey PRIMARY KEY (id),
  CONSTRAINT rental_photos_rental_id_fkey FOREIGN KEY (rental_id) REFERENCES public.rentals(id) ON DELETE CASCADE,
  CONSTRAINT rental_photos_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id)
);

-- Index for fast lookup by rental
CREATE INDEX IF NOT EXISTS idx_rental_photos_rental_id ON public.rental_photos(rental_id);
