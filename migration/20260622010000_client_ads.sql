-- ============================================================
-- Per-ad assignment migration
-- Run this in your Lovable Cloud / Supabase SQL editor BEFORE
-- you ship the code changes below. It is safe to re-run.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.client_ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  ad_id uuid NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NULL,
  UNIQUE (client_id, ad_id)
);

GRANT SELECT, INSERT, DELETE ON public.client_ads TO authenticated;
GRANT ALL ON public.client_ads TO service_role;

ALTER TABLE public.client_ads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth read client_ads" ON public.client_ads;
CREATE POLICY "auth read client_ads"
  ON public.client_ads FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "auth manage client_ads" ON public.client_ads;
CREATE POLICY "auth manage client_ads"
  ON public.client_ads FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_client_ads_client ON public.client_ads(client_id);
CREATE INDEX IF NOT EXISTS idx_client_ads_ad     ON public.client_ads(ad_id);

-- Wipe the old campaign-level assignments (per your instruction) — the new
-- flow is per-ad and you will re-assign from scratch.
DELETE FROM public.client_campaigns;
