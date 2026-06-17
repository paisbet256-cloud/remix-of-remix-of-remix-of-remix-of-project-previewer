CREATE OR REPLACE FUNCTION public.generate_client_code()
RETURNS text
LANGUAGE plpgsql
VOLATILE
SET search_path = public
AS $$
DECLARE
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text;
  i integer;
BEGIN
  LOOP
    result := '';
    FOR i IN 1..8 LOOP
      result := result || substr(chars, 1 + floor(random() * length(chars))::integer, 1);
    END LOOP;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.clients WHERE client_code = result);
  END LOOP;
  RETURN result;
END;
$$;

ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS client_code text;
ALTER TABLE public.clients ALTER COLUMN client_code SET DEFAULT public.generate_client_code();
UPDATE public.clients
SET client_code = public.generate_client_code()
WHERE client_code IS NULL OR client_code = '';
ALTER TABLE public.clients ALTER COLUMN client_code SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS clients_client_code_unique ON public.clients(client_code);