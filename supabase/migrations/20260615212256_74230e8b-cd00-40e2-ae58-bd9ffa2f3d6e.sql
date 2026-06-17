
ALTER TABLE public.app_settings
  ADD COLUMN IF NOT EXISTS fb_verify_token TEXT,
  ADD COLUMN IF NOT EXISTS fb_app_secret TEXT,
  ADD COLUMN IF NOT EXISTS token_status TEXT,
  ADD COLUMN IF NOT EXISTS token_scopes TEXT[],
  ADD COLUMN IF NOT EXISTS token_missing_scopes TEXT[],
  ADD COLUMN IF NOT EXISTS token_user_name TEXT,
  ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS token_checked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS token_error TEXT;

ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS portal_token TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS clients_portal_token_unique ON public.clients(portal_token) WHERE portal_token IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.meta_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  object TEXT,
  field TEXT,
  fb_account_id TEXT,
  ad_account_id UUID REFERENCES public.ad_accounts ON DELETE SET NULL,
  payload JSONB NOT NULL,
  signature_valid BOOLEAN NOT NULL DEFAULT false,
  processed BOOLEAN NOT NULL DEFAULT false,
  error TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.meta_webhook_events TO authenticated;
GRANT ALL ON public.meta_webhook_events TO service_role;
ALTER TABLE public.meta_webhook_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "webhook_events_admin_select" ON public.meta_webhook_events;
CREATE POLICY "webhook_events_admin_select" ON public.meta_webhook_events FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE INDEX IF NOT EXISTS meta_webhook_events_received_idx ON public.meta_webhook_events(received_at DESC);

DROP FUNCTION IF EXISTS public.get_settings_public();
CREATE OR REPLACE FUNCTION public.get_settings_public()
RETURNS TABLE (
  has_token BOOLEAN,
  fb_app_id TEXT,
  fb_business_id TEXT,
  sync_interval_minutes INT,
  auto_sync_enabled BOOLEAN,
  updated_at TIMESTAMPTZ,
  has_verify_token BOOLEAN,
  has_app_secret BOOLEAN,
  token_status TEXT,
  token_scopes TEXT[],
  token_missing_scopes TEXT[],
  token_user_name TEXT,
  token_expires_at TIMESTAMPTZ,
  token_checked_at TIMESTAMPTZ,
  token_error TEXT
) LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT (fb_system_user_token IS NOT NULL AND length(fb_system_user_token) > 0) AS has_token,
         fb_app_id, fb_business_id, sync_interval_minutes, auto_sync_enabled, updated_at,
         (fb_verify_token IS NOT NULL AND length(fb_verify_token) > 0) AS has_verify_token,
         (fb_app_secret IS NOT NULL AND length(fb_app_secret) > 0) AS has_app_secret,
         token_status, token_scopes, token_missing_scopes, token_user_name,
         token_expires_at, token_checked_at, token_error
  FROM public.app_settings WHERE id = 1;
$$;
GRANT EXECUTE ON FUNCTION public.get_settings_public() TO authenticated;
