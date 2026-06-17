CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

DO $$ BEGIN CREATE TYPE public.app_role AS ENUM ('admin', 'member'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.client_status AS ENUM ('active', 'paused', 'archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.entity_status AS ENUM ('ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED', 'PENDING_REVIEW', 'DISAPPROVED', 'PREAPPROVED', 'PENDING_BILLING_INFO', 'CAMPAIGN_PAUSED', 'ADSET_PAUSED', 'IN_PROCESS', 'WITH_ISSUES'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.insight_level AS ENUM ('account', 'campaign', 'adset', 'ad'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.alert_severity AS ENUM ('info', 'warning', 'critical'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.sync_status AS ENUM ('running', 'success', 'failed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT, email TEXT, avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select_authenticated" ON public.profiles;
CREATE POLICY "profiles_select_authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_roles_select_own" ON public.user_roles;
CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'admin');
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  IF (SELECT count(*) FROM public.profiles) = 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'member');
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE IF NOT EXISTS public.app_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  fb_system_user_token TEXT,
  fb_app_id TEXT,
  fb_business_id TEXT,
  sync_interval_minutes INT NOT NULL DEFAULT 5,
  auto_sync_enabled BOOLEAN NOT NULL DEFAULT true,
  fb_verify_token TEXT,
  fb_app_secret TEXT,
  token_status TEXT,
  token_scopes TEXT[],
  token_missing_scopes TEXT[],
  token_user_name TEXT,
  token_expires_at TIMESTAMPTZ,
  token_checked_at TIMESTAMPTZ,
  token_error TEXT,
  updated_by UUID REFERENCES auth.users,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.app_settings TO service_role;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "app_settings_no_direct_access" ON public.app_settings;
CREATE POLICY "app_settings_no_direct_access" ON public.app_settings FOR ALL TO authenticated USING (false) WITH CHECK (false);
INSERT INTO public.app_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  contact_email TEXT, contact_phone TEXT, company TEXT, notes TEXT,
  status public.client_status NOT NULL DEFAULT 'active',
  monthly_budget NUMERIC(14,2) DEFAULT 0,
  logo_url TEXT, brand_color TEXT, portal_password TEXT, portal_token TEXT,
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "clients_select_authenticated" ON public.clients;
CREATE POLICY "clients_select_authenticated" ON public.clients FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "clients_admin_modify" ON public.clients;
CREATE POLICY "clients_admin_modify" ON public.clients FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));
DROP TRIGGER IF EXISTS clients_updated_at ON public.clients;
CREATE TRIGGER clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX IF NOT EXISTS clients_slug_idx ON public.clients(slug);
CREATE UNIQUE INDEX IF NOT EXISTS clients_portal_token_unique ON public.clients(portal_token) WHERE portal_token IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.ad_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients ON DELETE CASCADE,
  fb_account_id TEXT NOT NULL UNIQUE,
  account_name TEXT, currency TEXT, timezone_name TEXT,
  account_status INT, business_name TEXT,
  total_spend NUMERIC(14,2) DEFAULT 0,
  total_reach BIGINT DEFAULT 0,
  total_impressions BIGINT DEFAULT 0,
  total_clicks BIGINT DEFAULT 0,
  total_results BIGINT DEFAULT 0,
  active_campaigns INT DEFAULT 0,
  last_sync_at TIMESTAMPTZ,
  last_sync_status public.sync_status,
  last_sync_error TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ad_accounts TO authenticated;
GRANT ALL ON public.ad_accounts TO service_role;
ALTER TABLE public.ad_accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ad_accounts_select_auth" ON public.ad_accounts;
CREATE POLICY "ad_accounts_select_auth" ON public.ad_accounts FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "ad_accounts_admin_modify" ON public.ad_accounts;
CREATE POLICY "ad_accounts_admin_modify" ON public.ad_accounts FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));
DROP TRIGGER IF EXISTS ad_accounts_updated_at ON public.ad_accounts;
CREATE TRIGGER ad_accounts_updated_at BEFORE UPDATE ON public.ad_accounts FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX IF NOT EXISTS ad_accounts_client_idx ON public.ad_accounts(client_id);

CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_account_id UUID NOT NULL REFERENCES public.ad_accounts ON DELETE CASCADE,
  fb_campaign_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL, objective TEXT,
  status public.entity_status, effective_status public.entity_status,
  daily_budget NUMERIC(14,2), lifetime_budget NUMERIC(14,2),
  buying_type TEXT, start_time TIMESTAMPTZ, stop_time TIMESTAMPTZ,
  spend NUMERIC(14,2) DEFAULT 0, reach BIGINT DEFAULT 0,
  impressions BIGINT DEFAULT 0, clicks BIGINT DEFAULT 0,
  ctr NUMERIC(8,4) DEFAULT 0, cpc NUMERIC(10,4) DEFAULT 0, cpm NUMERIC(10,4) DEFAULT 0,
  results BIGINT DEFAULT 0, frequency NUMERIC(8,4) DEFAULT 0,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaigns TO authenticated;
GRANT ALL ON public.campaigns TO service_role;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "campaigns_select_auth" ON public.campaigns;
CREATE POLICY "campaigns_select_auth" ON public.campaigns FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "campaigns_admin_modify" ON public.campaigns;
CREATE POLICY "campaigns_admin_modify" ON public.campaigns FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));
DROP TRIGGER IF EXISTS campaigns_updated_at ON public.campaigns;
CREATE TRIGGER campaigns_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX IF NOT EXISTS campaigns_account_idx ON public.campaigns(ad_account_id);

CREATE TABLE IF NOT EXISTS public.ad_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns ON DELETE CASCADE,
  ad_account_id UUID NOT NULL REFERENCES public.ad_accounts ON DELETE CASCADE,
  fb_adset_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  status public.entity_status, effective_status public.entity_status,
  daily_budget NUMERIC(14,2), lifetime_budget NUMERIC(14,2),
  optimization_goal TEXT, billing_event TEXT, bid_amount NUMERIC(14,2),
  start_time TIMESTAMPTZ, end_time TIMESTAMPTZ,
  spend NUMERIC(14,2) DEFAULT 0, reach BIGINT DEFAULT 0,
  impressions BIGINT DEFAULT 0, clicks BIGINT DEFAULT 0,
  ctr NUMERIC(8,4) DEFAULT 0, cpc NUMERIC(10,4) DEFAULT 0, cpm NUMERIC(10,4) DEFAULT 0,
  results BIGINT DEFAULT 0, frequency NUMERIC(8,4) DEFAULT 0,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ad_sets TO authenticated;
GRANT ALL ON public.ad_sets TO service_role;
ALTER TABLE public.ad_sets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "adsets_select_auth" ON public.ad_sets;
CREATE POLICY "adsets_select_auth" ON public.ad_sets FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "adsets_admin_modify" ON public.ad_sets;
CREATE POLICY "adsets_admin_modify" ON public.ad_sets FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));
DROP TRIGGER IF EXISTS ad_sets_updated_at ON public.ad_sets;
CREATE TRIGGER ad_sets_updated_at BEFORE UPDATE ON public.ad_sets FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX IF NOT EXISTS ad_sets_campaign_idx ON public.ad_sets(campaign_id);

CREATE TABLE IF NOT EXISTS public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_set_id UUID NOT NULL REFERENCES public.ad_sets ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES public.campaigns ON DELETE CASCADE,
  ad_account_id UUID NOT NULL REFERENCES public.ad_accounts ON DELETE CASCADE,
  fb_ad_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  status public.entity_status, effective_status public.entity_status,
  creative_thumbnail TEXT, creative_id TEXT,
  spend NUMERIC(14,2) DEFAULT 0, reach BIGINT DEFAULT 0,
  impressions BIGINT DEFAULT 0, clicks BIGINT DEFAULT 0,
  ctr NUMERIC(8,4) DEFAULT 0, cpc NUMERIC(10,4) DEFAULT 0, cpm NUMERIC(10,4) DEFAULT 0,
  results BIGINT DEFAULT 0, frequency NUMERIC(8,4) DEFAULT 0,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ads TO authenticated;
GRANT ALL ON public.ads TO service_role;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ads_select_auth" ON public.ads;
CREATE POLICY "ads_select_auth" ON public.ads FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "ads_admin_modify" ON public.ads;
CREATE POLICY "ads_admin_modify" ON public.ads FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));
DROP TRIGGER IF EXISTS ads_updated_at ON public.ads;
CREATE TRIGGER ads_updated_at BEFORE UPDATE ON public.ads FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX IF NOT EXISTS ads_adset_idx ON public.ads(ad_set_id);
CREATE INDEX IF NOT EXISTS ads_account_idx ON public.ads(ad_account_id);

CREATE TABLE IF NOT EXISTS public.insights_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_account_id UUID NOT NULL REFERENCES public.ad_accounts ON DELETE CASCADE,
  level public.insight_level NOT NULL,
  entity_id TEXT NOT NULL,
  date_start DATE NOT NULL, date_stop DATE NOT NULL,
  spend NUMERIC(14,2) DEFAULT 0, reach BIGINT DEFAULT 0,
  impressions BIGINT DEFAULT 0, clicks BIGINT DEFAULT 0,
  ctr NUMERIC(8,4) DEFAULT 0, cpc NUMERIC(10,4) DEFAULT 0, cpm NUMERIC(10,4) DEFAULT 0,
  results BIGINT DEFAULT 0, frequency NUMERIC(8,4) DEFAULT 0,
  raw JSONB, captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(ad_account_id, level, entity_id, date_start, date_stop)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.insights_snapshots TO authenticated;
GRANT ALL ON public.insights_snapshots TO service_role;
ALTER TABLE public.insights_snapshots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "insights_select_auth" ON public.insights_snapshots;
CREATE POLICY "insights_select_auth" ON public.insights_snapshots FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "insights_admin_modify" ON public.insights_snapshots;
CREATE POLICY "insights_admin_modify" ON public.insights_snapshots FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));
CREATE INDEX IF NOT EXISTS insights_account_date_idx ON public.insights_snapshots(ad_account_id, date_start DESC);
CREATE INDEX IF NOT EXISTS insights_entity_idx ON public.insights_snapshots(level, entity_id);

CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients ON DELETE CASCADE,
  ad_account_id UUID REFERENCES public.ad_accounts ON DELETE CASCADE,
  type TEXT NOT NULL,
  severity public.alert_severity NOT NULL DEFAULT 'info',
  title TEXT NOT NULL, message TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alerts TO authenticated;
GRANT ALL ON public.alerts TO service_role;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "alerts_select_auth" ON public.alerts;
CREATE POLICY "alerts_select_auth" ON public.alerts FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "alerts_admin_modify" ON public.alerts;
CREATE POLICY "alerts_admin_modify" ON public.alerts FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));
CREATE INDEX IF NOT EXISTS alerts_client_idx ON public.alerts(client_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_account_id UUID REFERENCES public.ad_accounts ON DELETE CASCADE,
  status public.sync_status NOT NULL,
  items_synced INT DEFAULT 0,
  error TEXT, duration_ms INT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE ON public.sync_logs TO authenticated;
GRANT ALL ON public.sync_logs TO service_role;
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "sync_logs_select_auth" ON public.sync_logs;
CREATE POLICY "sync_logs_select_auth" ON public.sync_logs FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "sync_logs_admin_modify" ON public.sync_logs;
CREATE POLICY "sync_logs_admin_modify" ON public.sync_logs FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));
CREATE INDEX IF NOT EXISTS sync_logs_account_idx ON public.sync_logs(ad_account_id, started_at DESC);

CREATE TABLE IF NOT EXISTS public.meta_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  object TEXT, field TEXT, fb_account_id TEXT,
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
CREATE POLICY "webhook_events_admin_select" ON public.meta_webhook_events FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));
CREATE INDEX IF NOT EXISTS meta_webhook_events_received_idx ON public.meta_webhook_events(received_at DESC);

DROP FUNCTION IF EXISTS public.get_settings_public();
CREATE OR REPLACE FUNCTION public.get_settings_public()
RETURNS TABLE (
  has_token BOOLEAN, fb_app_id TEXT, fb_business_id TEXT,
  sync_interval_minutes INT, auto_sync_enabled BOOLEAN, updated_at TIMESTAMPTZ,
  has_verify_token BOOLEAN, has_app_secret BOOLEAN,
  token_status TEXT, token_scopes TEXT[], token_missing_scopes TEXT[],
  token_user_name TEXT, token_expires_at TIMESTAMPTZ,
  token_checked_at TIMESTAMPTZ, token_error TEXT
) LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT (fb_system_user_token IS NOT NULL AND length(fb_system_user_token) > 0),
    fb_app_id, fb_business_id, sync_interval_minutes, auto_sync_enabled, updated_at,
    (fb_verify_token IS NOT NULL AND length(fb_verify_token) > 0),
    (fb_app_secret IS NOT NULL AND length(fb_app_secret) > 0),
    token_status, token_scopes, token_missing_scopes, token_user_name,
    token_expires_at, token_checked_at, token_error
  FROM public.app_settings WHERE id = 1;
$$;
REVOKE EXECUTE ON FUNCTION public.get_settings_public() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_settings_public() TO service_role;

DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.ad_accounts; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.campaigns; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.sync_logs; EXCEPTION WHEN duplicate_object THEN NULL; END $$;