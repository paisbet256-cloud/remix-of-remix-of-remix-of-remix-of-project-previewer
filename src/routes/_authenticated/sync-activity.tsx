import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { verifyCampaignMapping, syncAllAccountsNow, refreshAllData, retestAndReimport } from "@/lib/fb/admin.functions";
import { toast } from "sonner";
import { Activity, RefreshCw, Loader2, CheckCircle2, XCircle, AlertCircle, ShieldCheck, Trash2, ListChecks } from "lucide-react";

export const Route = createFileRoute("/_authenticated/sync-activity")({
  head: () => ({ meta: [{ title: "Sync Activity — GrowVibe Ads Solution" }] }),
  component: SyncActivityPage,
});

function SyncActivityPage() {
  const qc = useQueryClient();
  const verifyFn = useServerFn(verifyCampaignMapping);
  const syncFn = useServerFn(syncAllAccountsNow);
  const refreshFn = useServerFn(refreshAllData);
  const retestFn = useServerFn(retestAndReimport);

  const [verifying, setVerifying] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [retesting, setRetesting] = useState(false);
  const [report, setReport] = useState<any | null>(null);

  const { data: accounts } = useQuery({
    queryKey: ["sa-accounts"],
    queryFn: async () => {
      const { data } = await supabase.from("ad_accounts")
        .select("id,fb_account_id,account_name,last_sync_at,last_sync_status,last_sync_error,total_spend,total_results, client:clients(name)")
        .order("last_sync_at", { ascending: false, nullsFirst: false });
      return data ?? [];
    },
  });

  const { data: logs } = useQuery({
    queryKey: ["sa-logs"],
    queryFn: async () => {
      const { data } = await supabase.from("sync_logs")
        .select("*, ad_account:ad_accounts(account_name,fb_account_id)")
        .order("started_at", { ascending: false }).limit(100);
      return data ?? [];
    },
  });

  const onSync = async () => {
    setSyncing(true);
    try {
      const r: any = await syncFn({ data: undefined as any });
      if (r.skipped) toast.error(r.tokenHealth?.error ?? "Token check failed.");
      else toast.success(`Synced ${r.count} accounts`);
      qc.invalidateQueries();
    } catch (e: any) { toast.error(e?.message ?? "Sync failed"); }
    finally { setSyncing(false); }
  };

  const onRefresh = async () => {
    if (!confirm("This wipes cached campaigns/ad sets/ads/insights and runs a full re-sync from Facebook. Continue?")) return;
    setRefreshing(true);
    try {
      const r: any = await refreshFn({ data: undefined as any });
      toast.success(`Cleared cache · synced ${r.count ?? 0} accounts`);
      qc.invalidateQueries();
    } catch (e: any) { toast.error(e?.message ?? "Refresh failed"); }
    finally { setRefreshing(false); }
  };

  const onRetest = async () => {
    setRetesting(true);
    try {
      const r: any = await retestFn({ data: undefined as any });
      if (!r.ok) toast.error(r.error ?? "Retest failed");
      else toast.success(`Re-imported ${r.imported} accounts`);
      qc.invalidateQueries();
    } catch (e: any) { toast.error(e?.message ?? "Retest failed"); }
    finally { setRetesting(false); }
  };

  const onVerify = async () => {
    setVerifying(true);
    setReport(null);
    try {
      const r: any = await verifyFn({ data: undefined as any });
      setReport(r);
      const total = (r.report ?? []).reduce((s: number, x: any) => s + x.missing_in_db.length + x.stale_in_db.length + x.diffs.length, 0);
      toast[total ? "warning" : "success"](total ? `${total} mismatch(es) detected` : "All campaigns match Ads Manager ✓");
    } catch (e: any) { toast.error(e?.message ?? "Verify failed"); }
    finally { setVerifying(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Activity className="size-6 text-primary" /> Sync Activity & Mapping</h1>
          <p className="text-sm text-muted-foreground">Verify every ad account synced correctly and that campaign IDs match Facebook Ads Manager.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onSync} disabled={syncing} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-3.5 py-2 text-sm font-semibold disabled:opacity-50">
            {syncing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />} Sync Now
          </button>
          <button onClick={onRetest} disabled={retesting} className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-semibold hover:bg-surface-elevated disabled:opacity-50">
            {retesting ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />} Re-test & Re-import
          </button>
          <button onClick={onRefresh} disabled={refreshing} className="inline-flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive px-3.5 py-2 text-sm font-semibold hover:bg-destructive/20 disabled:opacity-50">
            {refreshing ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />} Refresh all data
          </button>
        </div>
      </div>

      {/* Per-account sync status */}
      <div className="glass-card p-5">
        <div className="font-semibold mb-3 flex items-center gap-2"><ListChecks className="size-4 text-primary" /> Per-account sync status</div>
        {(accounts ?? []).length === 0 ? (
          <div className="text-sm text-muted-foreground">No ad accounts yet. <Link to="/facebook-marketing-api" className="text-primary underline">Configure token →</Link></div>
        ) : (
          <div className="rounded-md border border-border/50 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface/60 text-muted-foreground text-xs">
                <tr>
                  <th className="text-left px-3 py-2 font-medium">Account</th>
                  <th className="text-left px-3 py-2 font-medium">FB ID</th>
                  <th className="text-left px-3 py-2 font-medium">Last sync</th>
                  <th className="text-left px-3 py-2 font-medium">Status</th>
                  <th className="text-right px-3 py-2 font-medium">Spend</th>
                  <th className="text-left px-3 py-2 font-medium">Error</th>
                </tr>
              </thead>
              <tbody>
                {(accounts ?? []).map((a: any) => (
                  <tr key={a.id} className="border-t border-border/40 align-top">
                    <td className="px-3 py-2"><div className="font-medium">{a.account_name ?? "—"}</div><div className="text-xs text-muted-foreground">{a.client?.name ?? "—"}</div></td>
                    <td className="px-3 py-2 font-mono text-xs">{a.fb_account_id}</td>
                    <td className="px-3 py-2 text-xs">{a.last_sync_at ? new Date(a.last_sync_at).toLocaleString() : <span className="text-muted-foreground">never</span>}</td>
                    <td className="px-3 py-2">
                      {a.last_sync_status === "success" ? <span className="inline-flex items-center gap-1 text-success text-xs"><CheckCircle2 className="size-3" />success</span>
                        : a.last_sync_status === "failed" ? <span className="inline-flex items-center gap-1 text-destructive text-xs"><XCircle className="size-3" />failed</span>
                        : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-xs">${Number(a.total_spend || 0).toFixed(2)}</td>
                    <td className="px-3 py-2 text-xs text-destructive max-w-xs truncate" title={a.last_sync_error ?? ""}>{a.last_sync_error ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mapping verification */}
      <div className="glass-card p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="font-semibold flex items-center gap-2"><ShieldCheck className="size-4 text-accent" /> Campaign mapping verification</div>
            <p className="text-xs text-muted-foreground mt-0.5">Live-pulls campaign IDs from Facebook and diffs them against what's stored locally.</p>
          </div>
          <button onClick={onVerify} disabled={verifying} className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-semibold hover:bg-surface-elevated disabled:opacity-50">
            {verifying ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />} Verify mapping
          </button>
        </div>
        {!report ? (
          <div className="text-sm text-muted-foreground">Click <strong>Verify mapping</strong> to compare each account.</div>
        ) : (
          <div className="space-y-3">
            {(report.report ?? []).map((row: any) => {
              const total = row.missing_in_db.length + row.stale_in_db.length + row.diffs.length;
              return (
                <div key={row.ad_account_id} className="rounded-md border border-border/50 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">{row.account_name ?? row.fb_account_id} <code className="text-xs text-muted-foreground ml-1">{row.fb_account_id}</code></div>
                    <div className="text-xs">{row.error ? <span className="text-destructive">⚠ {row.error}</span>
                      : total === 0 ? <span className="text-success inline-flex items-center gap-1"><CheckCircle2 className="size-3" /> matched {row.matched}/{row.fb_count}</span>
                      : <span className="text-warning">{total} issue(s) · {row.fb_count} on FB · {row.db_count} in DB</span>}</div>
                  </div>
                  {row.missing_in_db.length > 0 && (
                    <details className="text-xs mb-1" open><summary className="cursor-pointer text-warning">Missing in your DB ({row.missing_in_db.length}) — Sync Now to import</summary>
                      <ul className="mt-1 space-y-0.5 pl-3">{row.missing_in_db.slice(0, 20).map((c: any) => <li key={c.id}><code>{c.id}</code> — {c.name} <span className="text-muted-foreground">[{c.status}]</span></li>)}</ul>
                    </details>
                  )}
                  {row.stale_in_db.length > 0 && (
                    <details className="text-xs mb-1"><summary className="cursor-pointer text-warning">Stale in DB ({row.stale_in_db.length}) — deleted on Facebook</summary>
                      <ul className="mt-1 space-y-0.5 pl-3">{row.stale_in_db.slice(0, 20).map((c: any) => <li key={c.id}><code>{c.id}</code> — {c.name ?? "(no name)"}</li>)}</ul>
                    </details>
                  )}
                  {row.diffs.length > 0 && (
                    <details className="text-xs"><summary className="cursor-pointer text-warning">Field mismatches ({row.diffs.length})</summary>
                      <ul className="mt-1 space-y-0.5 pl-3">{row.diffs.slice(0, 30).map((d: any, i: number) => <li key={i}><code>{d.id}</code> · {d.field}: FB="{d.fb}" vs DB="{d.db}"</li>)}</ul>
                    </details>
                  )}
                </div>
              );
            })}
            <div className="text-[10px] text-muted-foreground">Generated {new Date(report.generated_at).toLocaleString()}</div>
          </div>
        )}
      </div>

      {/* Full sync log */}
      <div className="glass-card p-5">
        <div className="font-semibold mb-3 flex items-center gap-2"><Activity className="size-4 text-primary" /> Recent sync runs (last 100)</div>
        {(logs ?? []).length === 0 ? (
          <div className="text-sm text-muted-foreground flex items-center gap-2"><AlertCircle className="size-4" /> No sync runs yet.</div>
        ) : (
          <div className="rounded-md border border-border/50 overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-surface/60 text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2 font-medium">Started</th>
                  <th className="text-left px-3 py-2 font-medium">Account</th>
                  <th className="text-left px-3 py-2 font-medium">Status</th>
                  <th className="text-right px-3 py-2 font-medium">Items</th>
                  <th className="text-right px-3 py-2 font-medium">Duration</th>
                  <th className="text-left px-3 py-2 font-medium">Error</th>
                </tr>
              </thead>
              <tbody>
                {(logs ?? []).map((l: any) => (
                  <tr key={l.id} className="border-t border-border/40">
                    <td className="px-3 py-2">{new Date(l.started_at).toLocaleString()}</td>
                    <td className="px-3 py-2">{l.ad_account?.account_name ?? l.ad_account?.fb_account_id ?? "—"}</td>
                    <td className="px-3 py-2">{l.status === "success" ? <span className="text-success">success</span> : l.status === "failed" ? <span className="text-destructive">failed</span> : <span className="text-warning">{l.status}</span>}</td>
                    <td className="px-3 py-2 text-right font-mono">{l.items_synced ?? 0}</td>
                    <td className="px-3 py-2 text-right font-mono">{l.duration_ms ?? 0}ms</td>
                    <td className="px-3 py-2 text-destructive max-w-xs truncate" title={l.error ?? ""}>{l.error ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
