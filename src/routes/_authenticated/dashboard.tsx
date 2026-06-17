import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { syncAllAccountsNow, getSettingsPublic, retestAndReimport, refreshAllData } from "@/lib/fb/admin.functions";
import { toast } from "sonner";
import { DollarSign, Users, CheckSquare, Megaphone, Activity, Eye, ArrowUpRight, RefreshCw, Plus, Sparkles, AlertCircle, Wallet, Loader2, ShieldCheck, Trash2, Clock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import CandlestickChart from "@/components/CandlestickChart";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — GrowVibe Ads Solution" }] }),
  component: Dashboard,
});

function Dashboard() {
  const qc = useQueryClient();
  const getSettings = useServerFn(getSettingsPublic);
  const syncFn = useServerFn(syncAllAccountsNow);
  const retestFn = useServerFn(retestAndReimport);
  const refreshFn = useServerFn(refreshAllData);

  const [datePreset, setDatePreset] = useState("Last 7 days");
  const [autoSync, setAutoSync] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [retesting, setRetesting] = useState(false);
  const [refreshingAll, setRefreshingAll] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(null);

  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: () => getSettings({ data: undefined as any }) });

  const { data: accounts } = useQuery({
    queryKey: ["dashboard-accounts"],
    queryFn: async () => {
      const { data } = await supabase.from("ad_accounts").select("*, client:clients(id,name,slug)").eq("is_active", true).order("total_spend", { ascending: false });
      return data ?? [];
    },
  });

  const { data: timeSeries } = useQuery({
    queryKey: ["dashboard-timeseries", datePreset],
    queryFn: async () => {
      const days = datePreset === "Today" || datePreset === "Yesterday" ? 1 : datePreset === "Last 14 days" ? 14 : datePreset === "Last 30 days" ? 30 : 7;
      const cutoff = new Date();
      if (datePreset === "Yesterday") cutoff.setDate(cutoff.getDate() - 1);
      else cutoff.setDate(cutoff.getDate() - (days - 1));
      const cutoffStr = cutoff.toISOString().slice(0, 10);
      let query = supabase.from("insights_snapshots").select("date_start,spend,results,reach,impressions").eq("level", "account").gte("date_start", cutoffStr).order("date_start");
      if (datePreset === "Today" || datePreset === "Yesterday") query = query.lte("date_start", cutoffStr);
      const { data } = await query;
      // Aggregate by date across accounts
      const grouped: Record<string, { date: string; spend: number; results: number; reach: number; impressions: number }> = {};
      (data ?? []).forEach((r: any) => {
        const k = r.date_start;
        grouped[k] = grouped[k] ?? { date: k, spend: 0, results: 0, reach: 0, impressions: 0 };
        grouped[k].spend += Number(r.spend) || 0;
        grouped[k].results += Number(r.results) || 0;
        grouped[k].reach += Number(r.reach) || 0;
        grouped[k].impressions += Number(r.impressions) || 0;
      });
      return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
    },
  });

  const { data: campaignsByObjective } = useQuery({
    queryKey: ["dashboard-by-objective"],
    queryFn: async () => {
      const { data } = await supabase.from("campaigns").select("objective, spend");
      const grouped: Record<string, number> = {};
      (data ?? []).forEach((c: any) => {
        const key = c.objective ?? "OTHER";
        grouped[key] = (grouped[key] ?? 0) + (Number(c.spend) || 0);
      });
      return Object.entries(grouped).map(([name, value]) => ({ name, value })).filter(x => x.value > 0);
    },
  });

  const { data: recentLogs } = useQuery({
    queryKey: ["dashboard-logs"],
    queryFn: async () => {
      const { data } = await supabase.from("sync_logs").select("*, ad_account:ad_accounts(account_name,fb_account_id, client:clients(name))").order("started_at", { ascending: false }).limit(8);
      return data ?? [];
    },
  });

  useEffect(() => {
    if (settings?.auto_sync_enabled !== undefined) setAutoSync(settings.auto_sync_enabled);
  }, [settings?.auto_sync_enabled]);

  useEffect(() => {
    if (!autoSync || !settings?.has_token) return;
    const minutes = Math.max(1, Number(settings.sync_interval_minutes) || 5);
    const timer = window.setInterval(async () => {
      if (syncing) return;
      try {
        const res = await syncFn({ data: undefined as any });
        if (!res.skipped) qc.invalidateQueries();
      } catch (e) {
        console.error("[dashboard auto-sync] failed", e);
      }
    }, minutes * 60_000);
    return () => window.clearInterval(timer);
  }, [autoSync, settings?.has_token, settings?.sync_interval_minutes, syncing, syncFn, qc]);

  // Realtime
  useEffect(() => {
    const ch = supabase
      .channel("dashboard-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "ad_accounts" }, () => qc.invalidateQueries({ queryKey: ["dashboard-accounts"] }))
      .on("postgres_changes", { event: "*", schema: "public", table: "sync_logs" }, () => qc.invalidateQueries({ queryKey: ["dashboard-logs"] }))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  const totals = useMemo(() => {
    const acc = accounts ?? [];
    const rangeTotals = (timeSeries ?? []).reduce((s: any, r: any) => ({
      spend: s.spend + (Number(r.spend) || 0),
      reach: s.reach + (Number(r.reach) || 0),
      results: s.results + (Number(r.results) || 0),
    }), { spend: 0, reach: 0, results: 0 });
    return {
      spend: rangeTotals.spend,
      reach: rangeTotals.reach,
      results: rangeTotals.results,
      activeCampaigns: acc.reduce((s, a: any) => s + (Number(a.active_campaigns) || 0), 0),
      accounts: acc.length,
    };
  }, [accounts, timeSeries]);

  const onSync = async () => {
    if (!settings?.has_token) { toast.error("Add your Facebook System User token in Settings first"); return; }
    setSyncing(true);
    try {
      const res = await syncFn({ data: undefined as any });
      if (res.skipped) {
        toast.error(res.tokenHealth?.error ?? "Token check failed. Fix Settings first.");
      } else if (res.count === 0) {
        toast.warning("No ad accounts synced. Go to Settings → Test connection → Import visible accounts.");
      } else {
        const failed = (res.results ?? []).filter((r: any) => !r.ok);
        toast[failed.length ? "warning" : "success"](`Synced ${res.count} accounts${failed.length ? ` · ${failed.length} failed` : ""}`);
      }
      setLastSyncAt(Date.now());
      qc.invalidateQueries();
    } catch (e: any) { toast.error(e?.message ?? "Sync failed"); }
    finally { setSyncing(false); }
  };

  const onRetest = async () => {
    setRetesting(true);
    try {
      const r: any = await retestFn({ data: undefined as any });
      if (!r.ok) toast.error(r.error ?? "Retest failed");
      else toast.success(`Re-imported ${r.imported} accounts`);
      setLastSyncAt(Date.now());
      qc.invalidateQueries();
    } catch (e: any) { toast.error(e?.message ?? "Retest failed"); }
    finally { setRetesting(false); }
  };

  const onRefreshAll = async () => {
    if (!confirm("This will wipe all cached campaigns/ad sets/ads/insights and run a full re-sync. Continue?")) return;
    setRefreshingAll(true);
    try {
      const r: any = await refreshFn({ data: undefined as any });
      toast.success(`Cleared cache · synced ${r.count ?? 0} accounts`);
      setLastSyncAt(Date.now());
      qc.invalidateQueries();
    } catch (e: any) { toast.error(e?.message ?? "Refresh failed"); }
    finally { setRefreshingAll(false); }
  };

  const intervalMin = Math.max(1, Number(settings?.sync_interval_minutes) || 5);
  const nextSyncLabel = autoSync && settings?.has_token
    ? new Date((lastSyncAt ?? Date.now()) + intervalMin * 60_000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "—";
  const intervalLabel = intervalMin >= 1440 ? `${Math.round(intervalMin / 1440)}d` : intervalMin >= 60 ? `${Math.round(intervalMin / 60)}h` : `${intervalMin}m`;

  const PIE_COLORS = ["oklch(0.78 0.18 165)", "oklch(0.66 0.22 295)", "oklch(0.83 0.16 85)", "oklch(0.70 0.20 30)", "oklch(0.62 0.18 220)"];

  return (
    <div className="space-y-6 gv-fade-up">
      {/* Hero */}
      <div className="hero-panel gv-border-glow p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute -top-32 -right-20 size-72 rounded-full bg-primary/15 blur-3xl gv-float pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 size-72 rounded-full bg-accent/15 blur-3xl gv-float pointer-events-none" style={{ animationDelay: "1.5s" }} />

        <div className="relative z-10 flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-primary"><span>🌅</span> Good Day, {" "}<span className="text-foreground">Welcome back</span> ✨</div>
            <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold">Welcome to your <span className="gradient-text">Command Center</span></h1>
            <p className="mt-2 text-muted-foreground">Track every campaign, every client, every dollar — all in real time.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={onSync} disabled={syncing} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                {syncing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />} Sync All Accounts
              </button>
              <button onClick={onRetest} disabled={retesting} title="Re-test Facebook token + re-import visible ad accounts" className="inline-flex items-center gap-2 rounded-xl bg-surface-elevated border border-border px-4 py-2.5 text-sm font-medium hover:bg-surface disabled:opacity-50">
                {retesting ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />} Re-test & Re-import
              </button>
              <button onClick={onRefreshAll} disabled={refreshingAll} title="Wipe cached metrics and force a full re-sync" className="inline-flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/40 text-destructive px-4 py-2.5 text-sm font-medium hover:bg-destructive/20 disabled:opacity-50">
                {refreshingAll ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />} Refresh all data
              </button>
              <Link to="/sync-activity" className="inline-flex items-center gap-2 rounded-xl bg-surface-elevated border border-border px-4 py-2.5 text-sm font-medium hover:bg-surface"><Activity className="size-4" /> Sync Activity</Link>
              <Link to="/clients" className="inline-flex items-center gap-2 rounded-xl bg-surface-elevated border border-border px-4 py-2.5 text-sm font-medium hover:bg-surface"><Eye className="size-4" /> Client View</Link>
            </div>
          </div>
          <div className="lg:w-72 space-y-3">
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2"><label className="text-xs font-medium">📅 Date preset</label></div>
              <select value={datePreset} onChange={(e) => setDatePreset(e.target.value)} className="w-full rounded-lg bg-input border border-border px-3 py-2 text-sm">
                {["Last 7 days", "Last 14 days", "Last 30 days", "Today", "Yesterday"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="glass-card p-4">
              <label className="flex items-center justify-between mb-2 text-xs font-medium">Auto-sync <input type="checkbox" checked={autoSync} onChange={(e) => setAutoSync(e.target.checked)} className="size-4 accent-primary" /></label>
              <div className="text-sm">Every {intervalLabel}</div>
              <div className="text-[11px] text-muted-foreground mt-1 inline-flex items-center gap-1"><Clock className="size-3" /> Next sync ~{nextSyncLabel}</div>
            </div>
          </div>
        </div>
      </div>

      {!settings?.has_token && (
        <div className="glass-card p-4 flex items-center gap-3 border-warning/30">
          <AlertCircle className="size-5 text-warning shrink-0" />
          <div className="flex-1 text-sm">
            <strong>No Facebook token configured.</strong> Add your System User access token in <Link to="/facebook-marketing-api" className="text-primary underline">Settings</Link> to start syncing real-time data.
          </div>
        </div>
      )}

      {settings?.has_token && (accounts ?? []).length === 0 && (
        <div className="glass-card p-4 flex items-center gap-3 border-warning/30">
          <AlertCircle className="size-5 text-warning shrink-0" />
          <div className="flex-1 text-sm">
            <strong>No ad accounts imported yet.</strong> Open <Link to="/facebook-marketing-api" className="text-primary underline">Settings</Link>, run Test connection, then click Import visible accounts to load the exact Ads Manager accounts.
          </div>
        </div>
      )}

      {/* Connection Status */}
      {settings?.has_token && (accounts ?? []).length > 0 && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 font-semibold"><Activity className="size-4 text-primary" /> Connection Status</div>
            <div className="text-xs text-muted-foreground">
              Token: {settings.token_status === "ok" ? <span className="text-success">healthy</span>
                : settings.token_status === "missing_scopes" ? <span className="text-warning">missing scopes</span>
                : settings.token_status === "invalid" ? <span className="text-destructive">invalid</span>
                : <span className="text-muted-foreground">not checked</span>}
              {settings.token_missing_scopes && settings.token_missing_scopes.length > 0 && (
                <Link to="/facebook-marketing-api" className="text-primary underline ml-2">Fix in Settings</Link>
              )}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {(accounts ?? []).map((a: any) => {
              const ok = a.last_sync_status === "success";
              const failed = a.last_sync_status === "failed";
              return (
                <div key={a.id} className="rounded-lg bg-surface/60 border border-border/50 px-3 py-2.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium truncate">{a.client?.name ?? a.account_name}</div>
                    <span className={`size-2 rounded-full ${ok ? "bg-success" : failed ? "bg-destructive" : "bg-muted-foreground"}`} />
                  </div>
                  <div className="text-muted-foreground truncate">{a.account_name ?? a.fb_account_id}</div>
                  <div className="text-[10px] mt-1 text-muted-foreground">
                    {a.last_sync_at ? `Synced ${new Date(a.last_sync_at).toLocaleTimeString()}` : "Awaiting first sync"}
                  </div>
                  {failed && a.last_sync_error && (
                    <div className="text-[10px] mt-1 text-destructive truncate" title={a.last_sync_error}>⚠ {a.last_sync_error}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 gv-stagger">
        <KpiCard icon={DollarSign} label="Total Spend" value={`$${totals.spend.toFixed(2)}`} accent="from-primary to-primary-glow" />
        <KpiCard icon={Users} label="Total Reach" value={totals.reach.toLocaleString()} accent="from-accent to-primary" />
        <KpiCard icon={CheckSquare} label="Results" value={totals.results.toLocaleString()} accent="from-warning to-primary-glow" />
        <KpiCard icon={Megaphone} label="Active Campaigns" value={String(totals.activeCampaigns)} accent="from-destructive to-accent" />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3 gv-stagger">

        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2 font-semibold">
              <Activity className="size-4 text-primary" /> Performance Overview (7 Days)
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold ml-1 rounded-md bg-primary/10 text-primary px-1.5 py-0.5">
                Candlestick
              </span>
            </div>
          </div>
          <CandlestickChart
            data={(timeSeries ?? []) as any}
            height={260}
            series={[
              {
                key: "spend",
                label: "Spend",
                upColor: "oklch(0.78 0.18 165)",
                downColor: "oklch(0.66 0.22 25)",
                format: (v) => `$${v.toFixed(2)}`,
              },
              {
                key: "results",
                label: "Results",
                upColor: "oklch(0.72 0.19 295)",
                downColor: "oklch(0.66 0.22 25)",
                format: (v) => v.toLocaleString(),
              },
              {
                key: "clicks",
                label: "Clicks",
                upColor: "oklch(0.83 0.16 85)",
                downColor: "oklch(0.66 0.22 25)",
                format: (v) => v.toLocaleString(),
              },
            ]}
          />
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-2 font-semibold mb-3"><Sparkles className="size-4 text-accent" /> Spend by Objective</div>
          {(campaignsByObjective ?? []).length === 0 ? (
            <div className="h-64 grid place-items-center text-sm text-muted-foreground text-center">
              <div>
                <div className="size-24 mx-auto rounded-full bg-gradient-to-br from-accent/30 to-primary/30 grid place-items-center mb-3"><span className="text-2xl font-bold">$0</span></div>
                No spend data yet
              </div>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={campaignsByObjective} dataKey="value" innerRadius={48} outerRadius={80} paddingAngle={3}>
                    {(campaignsByObjective ?? []).map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "oklch(0.22 0.04 262)", border: "1px solid oklch(0.30 0.04 263)", borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 font-semibold mb-3"><Wallet className="size-4 text-primary" /> Quick Actions</div>
          <div className="space-y-2">
            <Link to="/clients" className="flex items-center justify-between rounded-lg bg-surface border border-border px-4 py-3 hover:bg-surface-elevated text-sm"><span className="flex items-center gap-2"><Plus className="size-4" /> Add New Client</span><ArrowUpRight className="size-4 opacity-50" /></Link>
            <Link to="/budget-tracker" className="flex items-center justify-between rounded-lg bg-surface border border-border px-4 py-3 hover:bg-surface-elevated text-sm"><span className="flex items-center gap-2">💰 Budget Overview</span><ArrowUpRight className="size-4 opacity-50" /></Link>
            <Link to="/clients" className="flex items-center justify-between rounded-lg bg-surface border border-border px-4 py-3 hover:bg-surface-elevated text-sm"><span className="flex items-center gap-2"><Eye className="size-4" /> Preview Client Portal</span><ArrowUpRight className="size-4 opacity-50" /></Link>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-2 font-semibold mb-3"><Activity className="size-4 text-accent" /> Live Activity Feed</div>
          {(recentLogs ?? []).length === 0 ? (
            <div className="h-44 grid place-items-center text-center text-sm text-muted-foreground">
              <div>
                <Activity className="size-10 mx-auto text-muted-foreground/40 mb-2" />
                <div className="font-medium text-foreground">No activity yet</div>
                <div className="text-xs">Activity will appear here when you add campaigns or clients</div>
              </div>
            </div>
          ) : (
            <ul className="space-y-2 max-h-72 overflow-y-auto">
              {(recentLogs ?? []).map((l: any) => (
                <li key={l.id} className="flex items-center gap-3 rounded-lg bg-surface/60 px-3 py-2 text-sm">
                  <span className={`size-2 rounded-full ${l.status === "success" ? "bg-success" : l.status === "failed" ? "bg-destructive" : "bg-warning"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{l.ad_account?.client?.name ?? "—"} · {l.ad_account?.account_name ?? l.ad_account?.fb_account_id}</div>
                    <div className="text-xs text-muted-foreground">{l.items_synced} items · {l.duration_ms}ms · {new Date(l.started_at).toLocaleTimeString()}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent: string }) {
  return (
    <div className="glass-card gv-lift gv-shimmer p-5 relative overflow-hidden">
      <div className={`absolute -top-8 -right-8 size-32 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-2xl`} />
      <div className="flex items-start justify-between relative">
        <div className={`size-10 rounded-xl bg-gradient-to-br ${accent} grid place-items-center text-primary-foreground shadow-lg`}><Icon className="size-5" /></div>
        <span className="text-xs font-semibold text-success bg-success/10 rounded-full px-2 py-0.5 inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-success gv-pulse-dot" /> live
        </span>
      </div>
      <div className="mt-4 text-[11px] font-semibold tracking-[0.14em] uppercase text-muted-foreground">{label}</div>
      <div key={value} className="mt-1 text-2xl sm:text-3xl font-bold gv-count tabular-nums truncate">{value}</div>
    </div>
  );
}

