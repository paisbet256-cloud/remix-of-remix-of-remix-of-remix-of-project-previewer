import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Image as ImageIcon } from "lucide-react";
import { StatusBadge } from "./campaigns";

export const Route = createFileRoute("/_authenticated/ads")({
  head: () => ({ meta: [{ title: "Ads — GrowVibe Ads Solution" }] }),
  component: AdsPage,
});

function AdsPage() {
  const { data: items } = useQuery({
    queryKey: ["ads-list"],
    queryFn: async () => {
      const { data } = await supabase.from("ads").select("*, campaign:campaigns(name), ad_set:ad_sets(name), ad_account:ad_accounts(currency, client:clients(name))").order("spend", { ascending: false });
      return data ?? [];
    },
  });
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Ads</h1>
        <p className="text-muted-foreground text-sm">Individual ad creatives across all ad sets.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {(items ?? []).length === 0 ? (
          <div className="glass-card p-12 text-center sm:col-span-2 xl:col-span-3"><ImageIcon className="size-10 mx-auto opacity-30 mb-2" /><div className="text-sm text-muted-foreground">No ads yet</div></div>
        ) : (items ?? []).map((a: any) => (
          <div key={a.id} className="glass-card p-4 flex gap-3">
            <div className="size-20 rounded-lg bg-surface border border-border overflow-hidden grid place-items-center shrink-0">
              {a.creative_thumbnail ? <img src={a.creative_thumbnail} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="size-6 opacity-40" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="font-medium truncate">{a.name}</div>
                <StatusBadge status={a.effective_status ?? a.status} />
              </div>
              <div className="text-xs text-muted-foreground truncate">{a.campaign?.name} · {a.ad_set?.name}</div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                <Stat label="Spend" value={`${a.ad_account?.currency ?? "$"}${Number(a.spend).toFixed(0)}`} />
                <Stat label="CTR" value={`${Number(a.ctr).toFixed(2)}%`} />
                <Stat label="Results" value={Number(a.results).toLocaleString()} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded bg-surface/60 px-2 py-1.5"><div className="text-[10px] text-muted-foreground">{label}</div><div className="font-semibold">{value}</div></div>;
}
