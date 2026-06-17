DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'clients',
    'ad_accounts',
    'campaigns',
    'ad_sets',
    'ads',
    'client_campaigns',
    'insights_snapshots',
    'alerts',
    'sync_logs',
    'profiles',
    'user_roles',
    'meta_connections',
    'meta_webhook_events'
  ]
  LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', tbl);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', tbl);
  END LOOP;
END $$;

GRANT ALL ON public.app_settings TO service_role;

REVOKE ALL ON FUNCTION public.admin_clear_all_data(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_clear_all_data(uuid) TO service_role;

REVOKE ALL ON FUNCTION public.get_meta_connections_public() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_meta_connections_public() TO service_role;

REVOKE ALL ON FUNCTION public.get_settings_public() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_settings_public() TO service_role;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.generate_client_code() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.generate_client_code() TO authenticated, service_role;

GRANT USAGE ON SCHEMA public TO authenticated, service_role;