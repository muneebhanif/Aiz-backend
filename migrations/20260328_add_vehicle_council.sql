-- Add council classification for vehicles
ALTER TABLE public.vehicles
  ADD COLUMN IF NOT EXISTS council text NOT NULL DEFAULT 'other';

-- Add constraint (drop/recreate to keep idempotent deploys easy)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'vehicles_council_check'
      AND conrelid = 'public.vehicles'::regclass
  ) THEN
    ALTER TABLE public.vehicles DROP CONSTRAINT vehicles_council_check;
  END IF;
END $$;

ALTER TABLE public.vehicles
  ADD CONSTRAINT vehicles_council_check
  CHECK (council IN ('bradford', 'kirklees', 'leeds', 'calderdale', 'other'));

-- Optional: index for council filtering/search screens
CREATE INDEX IF NOT EXISTS idx_vehicles_council ON public.vehicles(council);
