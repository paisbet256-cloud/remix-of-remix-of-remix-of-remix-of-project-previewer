
-- 1. Attach trigger on auth.users (was missing — profiles/roles never got created)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Backfill profiles for existing auth users
INSERT INTO public.profiles (id, email, full_name)
SELECT u.id, u.email, COALESCE(u.raw_user_meta_data->>'full_name', u.email)
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- 3. Backfill roles: earliest existing user without a role becomes admin, rest become member
WITH ordered AS (
  SELECT u.id, ROW_NUMBER() OVER (ORDER BY u.created_at) AS rn
  FROM auth.users u
  LEFT JOIN public.user_roles r ON r.user_id = u.id
  WHERE r.user_id IS NULL
)
INSERT INTO public.user_roles (user_id, role)
SELECT id,
  CASE
    WHEN rn = 1 AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
    THEN 'admin'::app_role
    ELSE 'member'::app_role
  END
FROM ordered;
