CREATE TABLE IF NOT EXISTS public.client_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (client_id, campaign_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_campaigns TO authenticated;
GRANT ALL ON public.client_campaigns TO service_role;

ALTER TABLE public.client_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "client_campaigns_select_auth"
ON public.client_campaigns
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "client_campaigns_admin_modify"
ON public.client_campaigns
FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));

DROP TRIGGER IF EXISTS client_campaigns_updated_at ON public.client_campaigns;
CREATE TRIGGER client_campaigns_updated_at
BEFORE UPDATE ON public.client_campaigns
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE INDEX IF NOT EXISTS client_campaigns_client_idx ON public.client_campaigns(client_id);
CREATE INDEX IF NOT EXISTS client_campaigns_campaign_idx ON public.client_campaigns(campaign_id);