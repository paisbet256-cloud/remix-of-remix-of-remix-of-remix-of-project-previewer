// Shared per-row "Assign to client" popover used on the admin Ads, Ad Sets
// and Campaigns pages. Always operates on a concrete list of ad UUIDs:
// - on the Ads page the list is `[adId]`
// - on the Ad Sets page it's every ad inside the row's ad set
// - on the Campaigns page it's every ad inside the row's campaign
//
// Clicking a client toggles assignment for the WHOLE set: if every ad in the
// set is currently assigned to that client → unassign all; otherwise assign
// every ad. The popover shows a check on rows where ALL ads are assigned and
// a dash on rows where SOME are assigned, so partial state is visible.

import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserPlus, Loader2, Check, Minus } from "lucide-react";
import {
  listClientsForPicker,
  assignAdsToClient,
  unassignAdsFromClient,
  getClientAdIdsForAds,
} from "@/lib/fb/admin.functions";

type Props = {
  adIds: string[];
  label?: string;
};

export function AssignClientPopover({ adIds, label = "Assign" }: Props) {
  const [open, setOpen] = useState(false);
  const [busyClientId, setBusyClientId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const qc = useQueryClient();

  const listClientsFn = useServerFn(listClientsForPicker);
  const assignFn = useServerFn(assignAdsToClient);
  const unassignFn = useServerFn(unassignAdsFromClient);
  const lookupFn = useServerFn(getClientAdIdsForAds);

  const { data: clients } = useQuery({
    queryKey: ["clients-picker"],
    queryFn: () => listClientsFn({ data: undefined as any }),
    staleTime: 60_000,
  });

  // For each client, count how many of our adIds are already assigned.
  const { data: counts, refetch: refetchCounts } = useQuery({
    queryKey: ["client-ads-counts", adIds.slice().sort().join(",")],
    enabled: open && adIds.length > 0,
    queryFn: async () => {
      const res = await lookupFn({ data: { ad_ids: adIds } });
      // res = { client_id -> count_of_ads_assigned }
      return res as Record<string, number>;
    },
  });

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = async (clientId: string, clientName: string) => {
    if (adIds.length === 0) {
      toast.error("No ads in this row");
      return;
    }
    setBusyClientId(clientId);
    try {
      const assignedCount = counts?.[clientId] ?? 0;
      const allAssigned = assignedCount === adIds.length;
      if (allAssigned) {
        await unassignFn({ data: { client_id: clientId, ad_ids: adIds } });
        toast.success(`Removed ${adIds.length} ad${adIds.length !== 1 ? "s" : ""} from ${clientName}`);
      } else {
        await assignFn({ data: { client_id: clientId, ad_ids: adIds } });
        toast.success(`Assigned ${adIds.length} ad${adIds.length !== 1 ? "s" : ""} to ${clientName}`);
      }
      await refetchCounts();
      qc.invalidateQueries({ queryKey: ["client-report"] });
      qc.invalidateQueries({ queryKey: ["clients"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to update assignment");
    } finally {
      setBusyClientId(null);
    }
  };

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-surface-elevated px-2 py-1 text-[11px] font-semibold"
        title={`Assign ${adIds.length} ad${adIds.length !== 1 ? "s" : ""} to a client`}
      >
        <UserPlus className="size-3.5" /> {label}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-64 max-h-80 overflow-y-auto rounded-lg border border-border bg-popover text-popover-foreground shadow-2xl z-50">
          <div className="px-3 py-2 border-b border-border/60 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            Assign {adIds.length} ad{adIds.length !== 1 ? "s" : ""} to…
          </div>
          {(clients ?? []).length === 0 ? (
            <div className="px-3 py-6 text-xs text-muted-foreground text-center">No clients yet</div>
          ) : (
            <ul className="py-1">
              {(clients ?? []).map((c: any) => {
                const n = counts?.[c.id] ?? 0;
                const total = adIds.length;
                const all = n === total && total > 0;
                const some = n > 0 && n < total;
                const busy = busyClientId === c.id;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => toggle(c.id, c.name)}
                      className="w-full flex items-center justify-between gap-2 px-3 py-1.5 text-sm hover:bg-surface-elevated text-left disabled:opacity-50"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-medium">{c.name}</div>
                        {c.company && <div className="text-[10px] text-muted-foreground truncate">{c.company}</div>}
                      </div>
                      <span className="shrink-0 size-5 rounded grid place-items-center border border-border">
                        {busy ? <Loader2 className="size-3 animate-spin" />
                          : all ? <Check className="size-3.5 text-emerald-400" />
                          : some ? <Minus className="size-3.5 text-amber-400" />
                          : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
