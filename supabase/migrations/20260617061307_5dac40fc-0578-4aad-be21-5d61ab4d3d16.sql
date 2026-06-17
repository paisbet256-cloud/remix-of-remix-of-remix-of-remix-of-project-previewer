ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS deposit_amount numeric(14,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deposit_currency text NOT NULL DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS bdt_rate numeric(10,4),
  ADD COLUMN IF NOT EXISTS commission_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS commission_percent numeric(6,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS commission_notes text;