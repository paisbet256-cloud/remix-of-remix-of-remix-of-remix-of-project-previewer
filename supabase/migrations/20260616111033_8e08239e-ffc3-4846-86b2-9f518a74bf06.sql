INSERT INTO public.app_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
      updated_at = now();

  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    CASE
      WHEN NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
      THEN 'admin'::public.app_role
      ELSE 'member'::public.app_role
    END
  )
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

REVOKE ALL ON FUNCTION public.get_settings_public() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_settings_public() TO service_role;

DROP POLICY IF EXISTS "app_settings_no_direct_access" ON public.app_settings;
CREATE POLICY "app_settings_no_direct_access"
ON public.app_settings
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);