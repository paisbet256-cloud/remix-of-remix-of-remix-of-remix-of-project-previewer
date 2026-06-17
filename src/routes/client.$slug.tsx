import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { PortalDashboard } from "./portal.$slug";

const searchSchema = z.object({ token: z.string().optional() });

export const Route = createFileRoute("/client/$slug")({
  validateSearch: (s: Record<string, unknown>) => searchSchema.parse(s),
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Live Ads Dashboard` },
      { name: "description", content: `Live Facebook Ads performance dashboard for client ${params.slug}.` },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ClientPortalPage,
});

function ClientPortalPage() {
  const { slug } = Route.useParams();
  const { token } = Route.useSearch();
  return <PortalDashboard slug={slug} token={token} />;
}