// Public client portal — shareable link at /client/:code
// Example: /client/GROW-AB12  (CODE = clients.client_code, uppercase)
//
// Implementation note: we reuse the existing PortalDashboard component
// exported from ./portal.$slug so this is a pure URL change with zero
// duplication of UI logic. The portal server fns already accept either
// `client_code` (uppercase) or legacy `slug` — see loadClientWithAuth()
// in src/lib/fb/portal.functions.ts. So passing `code` here as the
// `slug` argument works for both old and new clients.
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { PortalDashboard } from "./portal.$slug";

const tokenSearch = z.object({ token: z.string().min(4).max(128).optional() });

export const Route = createFileRoute("/client/$code")({
  validateSearch: (s) => tokenSearch.parse(s),
  head: ({ params }) => ({
    meta: [
      { title: `${params.code} — Live Ads Dashboard` },
      { name: "description", content: `Live Facebook Ads performance dashboard for ${params.code}.` },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ClientPortalRoute,
});

function ClientPortalRoute() {
  const { code } = Route.useParams();
  const { token } = Route.useSearch();
  // Server fns look up by client_code first (uppercased), so the CODE
  // segment in the URL flows straight through as the `slug` argument.
  return <PortalDashboard slug={code} token={token} />;
}
