-- Update weekly_payments method check constraint to include new payment methods
-- Adds: 'counting-up-rizzy' and 'natwest-momby'

ALTER TABLE public.weekly_payments
  DROP CONSTRAINT IF EXISTS weekly_payments_method_check;

ALTER TABLE public.weekly_payments
  ADD CONSTRAINT weekly_payments_method_check
  CHECK (method = ANY (ARRAY[
    ''::text,
    'cash'::text,
    'aiz-account'::text,
    'tide-account'::text,
    'counting-up-rizzy'::text,
    'natwest-momby'::text,
    'personal-other'::text,
    'other-account'::text
  ]));
