REVOKE EXECUTE ON FUNCTION public.tg_set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin(UUID) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_settings_public() FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_settings_public() TO authenticated;
GRANT EXECUTE ON FUNCTION public.tg_set_updated_at() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;