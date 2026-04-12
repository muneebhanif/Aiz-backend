-- Savings accounts and entries
CREATE TABLE public.savings_accounts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  opening_balance numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT savings_accounts_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX idx_savings_accounts_name_unique ON public.savings_accounts (lower(name));

CREATE TABLE public.savings_entries (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  account_id uuid NOT NULL REFERENCES public.savings_accounts(id) ON DELETE CASCADE,
  entry_type text NOT NULL CHECK (entry_type = ANY (ARRAY['income'::text, 'expense'::text])),
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  note text NOT NULL DEFAULT '',
  entry_date date NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT savings_entries_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_savings_entries_account_date ON public.savings_entries (account_id, entry_date DESC);

-- Driver owes entries
CREATE TABLE public.owes_entries (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  rental_id uuid NOT NULL REFERENCES public.rentals(id) ON DELETE CASCADE,
  driver_name text NOT NULL,
  registration text NOT NULL,
  entry_type text NOT NULL CHECK (entry_type = ANY (ARRAY['increase'::text, 'decrease'::text])),
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  note text NOT NULL DEFAULT '',
  entry_date date NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT owes_entries_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_owes_entries_rental_date ON public.owes_entries (rental_id, entry_date DESC);
