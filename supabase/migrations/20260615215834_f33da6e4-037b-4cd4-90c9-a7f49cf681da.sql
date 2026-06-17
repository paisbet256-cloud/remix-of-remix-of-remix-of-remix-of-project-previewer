REVOKE EXECUTE ON FUNCTION public.get_settings_public() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_settings_public() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_settings_public() TO authenticated;