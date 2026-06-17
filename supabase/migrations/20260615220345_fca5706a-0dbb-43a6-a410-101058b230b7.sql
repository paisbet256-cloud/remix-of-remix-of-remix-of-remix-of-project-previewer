DROP POLICY IF EXISTS "app_settings_no_direct_access" ON public.app_settings;
CREATE POLICY "app_settings_no_direct_access" ON public.app_settings
FOR ALL TO authenticated
USING (false)
WITH CHECK (false);