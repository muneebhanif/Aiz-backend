-- Add 'capital-vehicle-rentals' as a valid company for vehicles

ALTER TABLE public.vehicles
  DROP CONSTRAINT IF EXISTS vehicles_company_check;

ALTER TABLE public.vehicles
  ADD CONSTRAINT vehicles_company_check
  CHECK (company = ANY (ARRAY[
    'aiz-cars'::text,
    'fizzys-taxi-hire'::text,
    'capital-vehicle-rentals'::text,
    'other'::text
  ]));
