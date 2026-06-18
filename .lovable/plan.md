## লক্ষ্য

পুরো GrowVibe Ads Solution অ্যাপটিকে একটি **সম্পূর্ণ স্বয়ংসম্পূর্ণ (self-contained) WordPress** সংস্করণে রূপান্তর করা — যেখানে:

- কোনো Lovable Cloud / external backend নেই, আমার কোনো access নেই
- সব data WordPress-এর নিজস্ব MySQL ডাটাবেজে থাকবে
- সব page, auth, Meta (Facebook) Marketing API sync — সব PHP-তে নতুন করে লেখা
- শুধু একটা `.zip` install করলেই WordPress-এ পুরো অ্যাপ চলবে

## গুরুত্বপূর্ণ বাস্তবতা (আগে পড়ুন)

বর্তমান অ্যাপটি React + ক্লাউড ডাটাবেজ (১৪টি টেবিল) + Meta Marketing API দিয়ে তৈরি। WordPress-এ এটিকে নেটিভভাবে আনতে হলে কোডটা **নতুন করে PHP-তে লিখতে হবে** — এটা কোনো "ফাইল কনভার্ট" নয়, পুরো পুনর্নির্মাণ। তাই:

- WordPress **theme** শুধু চেহারা/পেজ দেখায়; ডাটাবেজ, sync, auth-এর মতো লজিক একটা **plugin**-এ থাকতে হয়। তাই ডেলিভারি হবে দুটো অংশে এক zip-এ: একটি theme + একটি companion plugin (একসাথে কাজ করবে)।
- "Same to same" চেহারা ও ফিচার রাখব, কিন্তু এটি ধাপে ধাপে বানাতে হবে — একবারে নিখুঁত পুরোটা সম্ভব নয়, প্রতিটি ধাপ আপনি পরীক্ষা করতে পারবেন।

## আর্কিটেকচার

```text
growvibe-wp.zip
├── theme/growvibe-ads/        (চেহারা, লেআউট, পেজ টেমপ্লেট)
│   ├── style.css, functions.php
│   ├── header.php, footer.php, sidebar nav
│   └── page templates: dashboard, clients, campaigns, ...
└── plugin/growvibe-core/      (লজিক + ডাটা)
    ├── growvibe-core.php       (activation: টেবিল তৈরি)
    ├── includes/db/            (১৪টি টেবিলের schema + CRUD)
    ├── includes/auth/          (WP user + role: admin/member)
    ├── includes/meta-api/      (Facebook Graph API sync, PHP)
    ├── includes/rest/          (client portal endpoints)
    └── assets/                 (JS charts, i18n EN/বাংলা, CSS)
```

## ডাটাবেজ (MySQL টেবিল, plugin activation-এ তৈরি)

বর্তমান ১৪টি টেবিল `wp_growvibe_*` প্রিফিক্সে নতুন করে তৈরি হবে:
clients, ad_accounts, campaigns, ad_sets, ads, client_campaigns, insights_snapshots, alerts, sync_logs, meta_connections, meta_webhook_events, app_settings, profiles, user_roles। access নিয়ন্ত্রণ WordPress user + role দিয়ে (RLS-এর বদলে PHP চেক)।

## ধাপসমূহ (প্রতিটি ধাপ আলাদাভাবে যাচাইযোগ্য)

1. **ভিত্তি**: theme + plugin কাঠামো, activation hook, ১৪টি টেবিল তৈরি, admin/member role, লগইন।
2. **লেআউট ও নেভিগেশন**: sidebar, header, LiveClock, ভাষা টগল (English/বাংলা), থিম/রঙ — বর্তমান চেহারা মিলিয়ে।
3. **Settings ও Facebook Marketing API config**: App ID/Secret/Business ID/System User Token সংরক্ষণ ও টোকেন যাচাই (PHP-তে Graph API কল)।
4. **Meta sync engine (PHP)**: ad accounts, campaigns, ad sets, ads, insights টেনে আনা; sync logs; auto-sync (wp-cron)।
5. **মূল পেজগুলো**: Dashboard, Clients (+নতুন/রিপোর্ট), Campaigns, Ad Sets, Ads, Insights, Reports, Alerts, Budget Tracker, Sync Activity — সব ডেটাসহ।
6. **Client Portal**: `portal/<slug>` ও `client/<slug>` পাবলিক পেজ, CSV export।
7. **চার্ট ও পলিশ**: CandlestickChart ও অন্যান্য গ্রাফ JS-এ, রেসপনসিভ, চূড়ান্ত QA।
8. **প্যাকেজিং**: পুরোটা একটি `.zip`-এ — WordPress-এ Themes ও Plugins-এ আপলোড করে Activate করলেই চলবে; ইনস্টল গাইডসহ।

## টেকনিক্যাল নোট

- Facebook Graph API কল হবে PHP `wp_remote_get/post` দিয়ে; টোকেন WP options-এ এনক্রিপ্টেড সংরক্ষণ।
- Auto-sync হবে `wp-cron` দিয়ে।
- Charts: হালকা JS (Chart.js/কাস্টম canvas) — বর্তমান candlestick লুক মিলিয়ে।
- i18n: PHP gettext নয়, বর্তমান অ্যাপের মতো কাস্টম EN/বাংলা স্ট্রিং ম্যাপ।

## ডেলিভারি

প্রতিটি বড় ধাপ শেষে অগ্রগতি জানাবো; সব শেষে একটি ডাউনলোডযোগ্য `growvibe-wp.zip` দেব ইনস্টল নির্দেশনাসহ।

## আপনার কাছে একটাই নিশ্চিতকরণ দরকার

এটা বড় কাজ, ধাপে ধাপে হবে। আমি **ধাপ ১ (ভিত্তি: theme+plugin+ডাটাবেজ+লগইন)** দিয়ে এখনই শুরু করব — ঠিক আছে?