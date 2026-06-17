
-- 1. meta_connections table
CREATE TABLE IF NOT EXISTS public.meta_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  fb_app_id text,
  fb_app_secret text,
  fb_business_id text,
  fb_system_user_token text,
  token_status text,
  token_scopes text[],
  token_missing_scopes text[],
  token_user_name text,
  token_expires_at timestamptz,
  token_checked_at timestamptz,
  token_error text,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.meta_connections TO authenticated;
GRANT ALL ON public.meta_connections TO service_role;

ALTER TABLE public.meta_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage meta connections"
  ON public.meta_connections FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER meta_connections_updated_at
  BEFORE UPDATE ON public.meta_connections
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 2. ad_accounts.connection_id
ALTER TABLE public.ad_accounts
  ADD COLUMN IF NOT EXISTS connection_id uuid REFERENCES public.meta_connections(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS ad_accounts_connection_id_idx ON public.ad_accounts(connection_id);

-- 3. Seed default connection from existing app_settings (if token exists) and link existing ad_accounts.
DO $$
DECLARE
  v_settings RECORD;
  v_conn_id uuid;
BEGIN
  SELECT * INTO v_settings FROM public.app_settings WHERE id = 1;
  IF v_settings.fb_system_user_token IS NOT NULL AND length(v_settings.fb_system_user_token) > 0 THEN
    -- Avoid duplicating if migration runs again
    SELECT id INTO v_conn_id FROM public.meta_connections WHERE label = 'Default' LIMIT 1;
    IF v_conn_id IS NULL THEN
      INSERT INTO public.meta_connections (
        label, fb_app_id, fb_app_secret, fb_business_id, fb_system_user_token,
        token_status, token_scopes, token_missing_scopes, token_user_name,
        token_expires_at, token_checked_at, token_error, is_active
      ) VALUES (
        'Default',
        v_settings.fb_app_id,
        v_settings.fb_app_secret,
        v_settings.fb_business_id,
        v_settings.fb_system_user_token,
        v_settings.token_status,
        v_settings.token_scopes,
        v_settings.token_missing_scopes,
        v_settings.token_user_name,
        v_settings.token_expires_at,
        v_settings.token_checked_at,
        v_settings.token_error,
        true
      ) RETURNING id INTO v_conn_id;
    END IF;
    UPDATE public.ad_accounts SET connection_id = v_conn_id WHERE connection_id IS NULL;
  END IF;
END $$;

-- 4. Public (safe) view function for admin UI listing
CREATE OR REPLACE FUNCTION public.get_meta_connections_public()
RETURNS TABLE(
  id uuid,
  label text,
  fb_app_id text,
  fb_business_id text,
  has_token boolean,
  has_app_secret boolean,
  token_status text,
  token_scopes text[],
  token_missing_scopes text[],
  token_user_name text,
  token_expires_at timestamptz,
  token_checked_at timestamptz,
  token_error text,
  is_active boolean,
  account_count bigint,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    mc.id, mc.label, mc.fb_app_id, mc.fb_business_id,
    (mc.fb_system_user_token IS NOT NULL AND length(mc.fb_system_user_token) > 0) AS has_token,
    (mc.fb_app_secret IS NOT NULL AND length(mc.fb_app_secret) > 0) AS has_app_secret,
    mc.token_status, mc.token_scopes, mc.token_missing_scopes,
    mc.token_user_name, mc.token_expires_at, mc.token_checked_at, mc.token_error,
    mc.is_active,
    (SELECT count(*) FROM public.ad_accounts a WHERE a.connection_id = mc.id) AS account_count,
    mc.created_at, mc.updated_at
  FROM public.meta_connections mc
  WHERE public.has_role(auth.uid(), 'admin'::app_role)
  ORDER BY mc.created_at ASC;
$$;
