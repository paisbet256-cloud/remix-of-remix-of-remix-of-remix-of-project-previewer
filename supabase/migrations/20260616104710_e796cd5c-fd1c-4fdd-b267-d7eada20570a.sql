DROP POLICY IF EXISTS "webhook_events_admin_select" ON public.meta_webhook_events;
CREATE POLICY "webhook_events_admin_select"
ON public.meta_webhook_events
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles r
    WHERE r.user_id = auth.uid()
      AND r.role = 'admin'::public.app_role
  )
);

REVOKE ALL ON FUNCTION public.get_settings_public() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_settings_public() TO service_role;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO service_role;