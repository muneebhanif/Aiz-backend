-- Settings table: key-value store for app-wide configuration
CREATE TABLE IF NOT EXISTS public.settings (
  key   text NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT settings_pkey PRIMARY KEY (key)
);

-- Seed the company rep signature setting
INSERT INTO public.settings (key, value)
VALUES ('company_rep_signature', '')
ON CONFLICT (key) DO NOTHING;
