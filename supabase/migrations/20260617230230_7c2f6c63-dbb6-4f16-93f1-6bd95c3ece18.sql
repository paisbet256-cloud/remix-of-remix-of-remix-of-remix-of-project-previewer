REVOKE EXECUTE ON FUNCTION public.get_meta_connections_public() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_clear_all_data(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_meta_connections_public() TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_clear_all_data(uuid) TO service_role;

REVOKE EXECUTE ON FUNCTION public.generate_client_code() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.generate_client_code() TO service_role;