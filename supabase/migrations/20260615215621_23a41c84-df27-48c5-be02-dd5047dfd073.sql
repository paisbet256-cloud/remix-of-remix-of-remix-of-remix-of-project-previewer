INSERT INTO public.app_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

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