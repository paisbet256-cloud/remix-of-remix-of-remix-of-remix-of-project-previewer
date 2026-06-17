
ALTER TABLE public.app_settings
  ADD COLUMN IF NOT EXISTS org_name text,
  ADD COLUMN IF NOT EXISTS org_email text,
  ADD COLUMN IF NOT EXISTS org_phone text,
  ADD COLUMN IF NOT EXISTS org_address text,
  ADD COLUMN IF NOT EXISTS brand_logo_url text,
  ADD COLUMN IF NOT EXISTS brand_primary_color text DEFAULT '#1F2240',
  ADD COLUMN IF NOT EXISTS brand_secondary_color text DEFAULT '#8B5CF6',
  ADD COLUMN IF NOT EXISTS pref_timezone text DEFAULT 'Asia/Dhaka',
  ADD COLUMN IF NOT EXISTS pref_currency text DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS pref_language text DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS pref_attribution_window text DEFAULT '28d_click';

INSERT INTO public.app_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

DROP FUNCTION IF EXISTS public.get_settings_public();

CREATE FUNCTION public.get_settings_public()
RETURNS TABLE(
  has_token boolean, fb_app_id text, fb_business_id text,
  sync_interval_minutes integer, auto_sync_enabled boolean, updated_at timestamp with time zone,
  has_verify_token boolean, has_app_secret boolean,
  token_status text, token_scopes text[], token_missing_scopes text[],
  token_user_name text, token_expires_at timestamp with time zone,
  token_checked_at timestamp with time zone, token_error text,
  org_name text, org_email text, org_phone text, org_address text,
  brand_logo_url text, brand_primary_color text, brand_secondary_color text,
  pref_timezone text, pref_currency text, pref_language text, pref_attribution_window text
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT (fb_system_user_token IS NOT NULL AND length(fb_system_user_token) > 0) AS has_token,
         fb_app_id, fb_business_id, sync_interval_minutes, auto_sync_enabled, updated_at,
         (fb_verify_token IS NOT NULL AND length(fb_verify_token) > 0) AS has_verify_token,
         (fb_app_secret IS NOT NULL AND length(fb_app_secret) > 0) AS has_app_secret,
         token_status, token_scopes, token_missing_scopes, token_user_name,
         token_expires_at, token_checked_at, token_error,
         org_name, org_email, org_phone, org_address,
         brand_logo_url, brand_primary_color, brand_secondary_color,
         pref_timezone, pref_currency, pref_language, pref_attribution_window
  FROM public.app_settings WHERE id = 1;
$$;

CREATE OR REPLACE FUNCTION public.admin_clear_all_data(_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  v_is_admin boolean;
BEGIN
  SELECT public.has_role(_user_id, 'admin'::app_role) INTO v_is_admin;
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Forbidden: admin role required';
  END IF;

  DELETE FROM public.insights_snapshots;
  DELETE FROM public.alerts;
  DELETE FROM public.sync_logs;
  DELETE FROM public.meta_webhook_events;
  DELETE FROM public.ads;
  DELETE FROM public.ad_sets;
  DELETE FROM public.campaigns;
  DELETE FROM public.ad_accounts;
  DELETE FROM public.clients;

  RETURN jsonb_build_object('cleared_at', now(), 'cleared_by', _user_id);
END;
$$;

REVOKE ALL ON FUNCTION public.admin_clear_all_data(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_clear_all_data(uuid) TO authenticated;
