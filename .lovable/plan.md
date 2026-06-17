# Multiple Business Manager Support — Plan

## এখন কী আছে (বর্তমান অবস্থা)

এখন `app_settings` table-এ **একটাই row** আছে যেখানে রাখা হয়:
- `fb_app_id`
- `fb_app_secret`
- `fb_business_id`
- `fb_system_user_token` (একটাই long-lived token)

এই একটা token দিয়ে যত ad account ওই Business Manager-এ আছে — সব sync হয়। কিন্তু **অন্য BM-এর ad account** এই token দিয়ে access করা যায় না (Meta-র permission model এভাবেই কাজ করে — token সবসময় একটা BM/System User-এর সাথে bound)।

## Meta-র নিয়ম (যেটা মানতেই হবে)

প্রতিটা Business Manager-এর জন্য আলাদা:
- System User (BM Settings → Users → System Users)
- System User Access Token (ওই BM-এর App থেকে generate)
- App ID / App Secret (একই App use করা গেলেও সাধারণত প্রতিটা BM-এ আলাদা App থাকে)

মানে **2টা BM = 2টা আলাদা credential set**। এক token দিয়ে দুই BM cover করার কোনো legal উপায় Meta দেয় না। তাই multiple BM support করতে হলে আমাদের একাধিক credential set store করতে হবে।

এই approach-এ **data mismatch হবে না**, কারণ প্রতিটা ad account তার নিজের BM-এর token দিয়েই Graph API থেকে fetch হবে — ঠিক যেভাবে Ads Manager দেখায়।

## প্রস্তাবিত Plan

### 1. নতুন table: `meta_connections`
এক row = এক Business Manager connection।

Fields:
- `id` (uuid)
- `label` (যেমন "Main BM", "Client X BM" — admin চিনতে পারবে)
- `fb_app_id`
- `fb_app_secret` (encrypted, server-only read)
- `fb_business_id`
- `fb_system_user_token` (server-only read)
- `token_status`, `token_scopes`, `token_user_name`, `token_expires_at`, `token_checked_at`, `token_error` (per-connection health, এখন যেমন `app_settings`-এ আছে)
- `is_active` (boolean)
- `created_at`, `updated_at`

RLS: শুধু `admin` role select/insert/update/delete করতে পারবে। Token/secret কখনো client-এ পাঠানো হবে না — `get_settings_public()`-এর মতো একটা `get_meta_connections_public()` function থাকবে যা শুধু safe field return করবে (`has_token`, `has_secret`, label, business_id, status ইত্যাদি)।

### 2. `ad_accounts` table-এ লিংক
নতুন column `connection_id uuid references meta_connections(id)` যোগ হবে। প্রতিটা ad account জানবে সে কোন BM/token-এর under-এ। Existing row-গুলো migration-এ default connection-এ map হবে।

### 3. `app_settings` থেকে BM-specific field সরানো
- `fb_app_id`, `fb_app_secret`, `fb_business_id`, `fb_system_user_token`, এবং `token_*` field-গুলো `meta_connections`-এ migrate করা হবে (পুরাতন data থেকে প্রথম connection auto-create হবে — কিছু হারাবে না)।
- `app_settings`-এ থাকবে শুধু global preference (sync interval, org info, brand, timezone, currency, language ইত্যাদি)।

### 4. Sync logic update (`sync.server.ts`)
এখন code একটা global token নেয়। নতুন flow:
```
for each active meta_connections:
    token = connection.fb_system_user_token
    accounts = fb.listAdAccounts(token, connection.fb_business_id)
    for each account:
        upsert ad_account with connection_id = connection.id
        sync campaigns / adsets / ads / insights using THIS token
```
প্রতিটা account সবসময় তার own connection-এর token দিয়েই query হবে → **Ads Manager-এর সাথে 1:1 match**।

### 5. Admin UI পরিবর্তন (`/facebook-marketing-api`)
- "Connected" section টা list-style হবে: প্রতিটা BM card আকারে দেখাবে (label, business id, token status, account count, last sync, "Remove" button)।
- উপরে "+ Add Business Manager" button → একটা form/modal যেখানে label, App ID, App Secret, Business ID, System User Token দেওয়া হবে। Save করলে validate (token check + list ad accounts probe) হয়ে নতুন `meta_connections` row তৈরি হবে।
- প্রতিটা connection আলাদা ভাবে "Test" / "Sync now" / "Disable" করা যাবে।

### 6. Client creation flow (`/clients/new`)
ad account dropdown-এ এখন সব BM-এর সব account এক list-এ দেখাবে, সাথে badge হিসেবে BM label (যাতে duplicate name confuse না করে)। Save করলে account-এর সাথে already-known `connection_id` automatically যাবে।

### 7. Portal / Dashboard
কোনো logic পরিবর্তন **লাগবে না** — portal data ad_account → campaigns/adsets/ads/insights table থেকেই আসে, যেগুলো sync ইতিমধ্যে correct token দিয়ে populate করে রাখবে। মানে client portal হুবহু আগের মতো কাজ করবে, কোনো mismatch ছাড়াই।

### 8. Migration safety
- পুরাতন `app_settings`-এর BM field থেকে auto-seed হবে প্রথম `meta_connections` row (label: "Default")।
- পুরাতন সব `ad_accounts.connection_id` ওই default connection-এ point করবে।
- কিছু re-sync করতে হবে না, কোনো history হারাবে না।

## Data mismatch কেন হবে না (Guarantee)
1. প্রতিটা account নিজের BM-এর token দিয়ে fetch — অন্য BM-এর token দিয়ে কখনো call হবে না।
2. Insights API call একই attribution param দিয়ে হয় (আগে যেমন) → number Ads Manager-এর সাথে match।
3. Commission markup শুধু **display layer**-এ apply হয় — raw spend DB-তে untouched থাকে।

## Technical Section (developer reference)

Files যে গুলো changed হবে:
- `supabase/migrations/*` — new `meta_connections` table + RLS + GRANT + `get_meta_connections_public()` + migrate existing `app_settings` data + add `ad_accounts.connection_id`.
- `src/lib/fb/admin.functions.ts` — `addConnection`, `updateConnection`, `removeConnection`, `listConnections`, `testConnection` server fns।
- `src/lib/fb/sync.server.ts` — loop over connections, per-connection token usage।
- `src/lib/fb/permissions.server.ts` — per-connection probe।
- `src/routes/_authenticated/facebook-marketing-api.tsx` — multi-connection UI।
- `src/routes/_authenticated/clients_.new.tsx` — ad account dropdown grouped by BM।

কোনো file delete হবে না, existing client portal untouched।

## আপনার সিদ্ধান্ত
এই plan-এ যান কিনা জানান। অথবা পরিবর্তন বলেন (যেমন: token UI আরো secure চান, BM-wise sync schedule আলাদা চান, ইত্যাদি)। Approve করলে আমি migration + code change এক batch-এ করে দেব।
