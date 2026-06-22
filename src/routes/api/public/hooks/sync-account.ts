// Per-account sync endpoint. Each call runs in its OWN Cloudflare Worker
// invocation, so it gets a fresh 1000-subrequest budget and CPU time.
// Called in parallel by syncAllAccounts() (dispatch pattern).
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/hooks/sync-account")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = request.headers.get("apikey") || request.headers.get("x-api-key");
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!expected || apiKey !== expected) {
          return new Response(JSON.stringify({ error: "unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        let body: { adAccountId?: string } = {};
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "invalid json body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const adAccountId = body.adAccountId;
        if (!adAccountId || typeof adAccountId !== "string") {
          return new Response(JSON.stringify({ error: "adAccountId required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const { syncAdAccount } = await import("@/lib/fb/sync.server");
          const result = await syncAdAccount(adAccountId);
          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (e: any) {
          console.error("[sync-account] failed", adAccountId, e);
          return new Response(JSON.stringify({ ok: false, error: e?.message ?? "Sync failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
