import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import {
  createClient,
  updateClient,
  listAvailableAdAccounts,
  listAvailableAdsForPicker,
  getAssignedAdIds,
  syncAllAccountsNow,
} from "@/lib/fb/admin.functions";
import { toast } from "sonner";
import { ArrowLeft, Search, Lock, ShieldCheck, ChevronDown, Loader2, Check, RefreshCw, Clock, ImageIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/clients_/new")({
  validateSearch: (s: Record<string, unknown>) => z.object({ edit: z.string().uuid().optional() }).parse(s),
  head: () => ({ meta: [{ title: "Add New Partner — GrowVibe Ads Solution" }] }),
  component: AddPartnerPage,
});

type AdRow = {
  id: string;
  name: string;
  fb_ad_id: string | null;
  status: string | null;
  spend: number;
  thumbnail: string | null;
  campaign_id: string | null;
  campaign_name: string;
  ad_set_id: string | null;
  ad_set_name: string;
  account_id: string | null;
  account_name: string;
  currency: string | null;
};

function AddPartnerPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { edit: editId } = Route.useSearch();
  const isEdit = !!editId;
  const createFn = useServerFn(createClient);
  const updateFn = useServerFn(updateClient);
  const listAccountsFn = useServerFn(listAvailableAdAccounts);
  const listAdsFn = useServerFn(listAvailableAdsForPicker);
  const getAssignedFn = useServerFn(getAssignedAdIds);
  const syncNowFn = useServerFn(syncAllAccountsNow);

  // Profile fields
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [depositAmount, setDepositAmount] = useState<string>("");

  // BDT→USD converter
  const [showConverter, setShowConverter] = useState(false);
  const [bdtAmount, setBdtAmount] = useState<string>("");
  const [bdtRate, setBdtRate] = useState<string>("");

  // Commission
  const [commissionEnabled, setCommissionEnabled] = useState(false);
  const [commissionPct, setCommissionPct] = useState<string>("");
  const [commissionNotes, setCommissionNotes] = useState("");

  // Ad picker
  const [ads, setAds] = useState<AdRow[]>([]);
  const [loadingAds, setLoadingAds] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [lastLoadedAt, setLastLoadedAt] = useState<Date | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadAds = async () => {
    setLoadingAds(true);
    setLoadError(null);
    try {
      // listAccountsFn is fired in parallel just to keep the ad-account
      // bucket warm — its returned data isn't needed here directly.
      const [, adRows] = await Promise.all([
        listAccountsFn({ data: undefined as any }).catch(() => null),
        listAdsFn({ data: undefined as any }),
      ]);
      setAds((adRows ?? []) as AdRow[]);
      setLastLoadedAt(new Date());
    } catch (e: any) {
      setLoadError(e?.message ?? "Could not load ads");
    } finally {
      setLoadingAds(false);
    }
  };

  useEffect(() => { loadAds(); }, []);

  // Edit mode — prefill profile + existing assignments.
  useEffect(() => {
    if (!editId) return;
    let cancelled = false;
    (async () => {
      const [{ data, error }, assignedIds] = await Promise.all([
        supabase
          .from("clients")
          .select("name,company,contact_email,contact_phone,website,address,deposit_amount,deposit_currency,bdt_rate,commission_enabled,commission_percent,commission_notes")
          .eq("id", editId)
          .maybeSingle(),
        getAssignedFn({ data: { client_id: editId } }).catch(() => [] as string[]),
      ]);
      if (cancelled) return;
      if (error || !data) {
        toast.error(error?.message ?? "Client not found");
        return;
      }
      setName(data.name ?? "");
      setCompany(data.company ?? "");
      setEmail(data.contact_email ?? "");
      setPhone(data.contact_phone ?? "");
      setWebsite(data.website ?? "");
      setAddress(data.address ?? "");
      setDepositAmount(data.deposit_amount != null ? String(data.deposit_amount) : "");
      if (data.bdt_rate != null) {
        setBdtRate(String(data.bdt_rate));
        setShowConverter(true);
      }
      setCommissionEnabled(!!data.commission_enabled);
      setCommissionPct(data.commission_percent != null ? String(data.commission_percent) : "");
      setCommissionNotes(data.commission_notes ?? "");
      setSelected(new Set(assignedIds as string[]));
    })();
    return () => { cancelled = true; };
  }, [editId]);

  const runSyncNow = async () => {
    setSyncing(true);
    const tId = toast.loading("Refreshing ads from Meta…");
    try {
      const res: any = await syncNowFn({ data: undefined as any });
      toast.dismiss(tId);
      if (res?.ok === false) toast.error(res.error ?? "Sync failed");
      else toast.success(`Synced ${res?.synced ?? 0} accounts`);
      await loadAds();
    } catch (e: any) {
      toast.dismiss(tId);
      toast.error(e?.message ?? "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const applyConverter = () => {
    const amt = Number(bdtAmount);
    const rate = Number(bdtRate);
    if (!amt || !rate) { toast.error("Enter BDT amount and rate"); return; }
    const usd = amt / rate;
    setDepositAmount(usd.toFixed(2));
    toast.success(`Converted ৳${amt.toLocaleString()} → $${usd.toFixed(2)}`);
  };

  const toggleAd = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ads.filter((a) => {
      if (statusFilter !== "all" && (a.status ?? "").toUpperCase() !== statusFilter) return false;
      if (!q) return true;
      const hay = `${a.name} ${a.ad_set_name} ${a.campaign_name} ${a.account_name} ${a.fb_ad_id ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [ads, search, statusFilter]);

  // Group: account → campaign → ad set → ads
  const grouped = useMemo(() => {
    type AdSetGroup = { ad_set_id: string; ad_set_name: string; items: AdRow[] };
    type CampaignGroup = { campaign_id: string; campaign_name: string; adSets: AdSetGroup[] };
    type AcctGroup = { account_id: string; account_name: string; currency: string | null; campaigns: CampaignGroup[]; count: number };

    const accts = new Map<string, AcctGroup>();
    for (const a of filtered) {
      const acctKey = a.account_id ?? "_";
      let acct = accts.get(acctKey);
      if (!acct) {
        acct = { account_id: acctKey, account_name: a.account_name, currency: a.currency, campaigns: [], count: 0 };
        accts.set(acctKey, acct);
      }
      let camp = acct.campaigns.find((c) => c.campaign_id === a.campaign_id);
      if (!camp) {
        camp = { campaign_id: a.campaign_id ?? "_", campaign_name: a.campaign_name, adSets: [] };
        acct.campaigns.push(camp);
      }
      let set = camp.adSets.find((s) => s.ad_set_id === a.ad_set_id);
      if (!set) {
        set = { ad_set_id: a.ad_set_id ?? "_", ad_set_name: a.ad_set_name, items: [] };
        camp.adSets.push(set);
      }
      set.items.push(a);
      acct.count += 1;
    }
    return Array.from(accts.values()).sort((a, b) => b.count - a.count || a.account_name.localeCompare(b.account_name));
  }, [filtered]);

  const onSave = async () => {
    if (!name.trim()) { toast.error("Client name is required"); return; }
    setSaving(true);
    try {
      const selectedIds = Array.from(selected);
      // Derive distinct account UUIDs from the picked ads so the ad accounts
      // remain linked to the client (used by triggerClientSync etc).
      const accountIds = Array.from(new Set(
        ads.filter((a) => selected.has(a.id) && a.account_id).map((a) => a.account_id as string)
      ));

      if (isEdit && editId) {
        await updateFn({
          data: {
            id: editId,
            name: name.trim(),
            company: company || undefined,
            contact_email: email || undefined,
            contact_phone: phone || undefined,
            website: website || undefined,
            address: address || undefined,
            deposit_amount: Number(depositAmount) || 0,
            deposit_currency: bdtRate && Number(bdtRate) > 0 ? "BDT" : "USD",
            bdt_rate: bdtRate ? Number(bdtRate) : null,
            commission_enabled: commissionEnabled,
            commission_percent: Number(commissionPct) || 0,
            commission_notes: commissionNotes || undefined,
            ad_ids: selectedIds,
          },
        });
        toast.success("Partner updated");
      } else {
        await createFn({
          data: {
            name: name.trim(),
            company: company || undefined,
            contact_email: email || undefined,
            contact_phone: phone || undefined,
            website: website || undefined,
            address: address || undefined,
            deposit_amount: Number(depositAmount) || 0,
            deposit_currency: bdtRate && Number(bdtRate) > 0 ? "BDT" : "USD",
            bdt_rate: bdtRate ? Number(bdtRate) : null,
            commission_enabled: commissionEnabled,
            commission_percent: Number(commissionPct) || 0,
            commission_notes: commissionNotes || undefined,
            ad_account_ids: accountIds,
            ad_ids: selectedIds,
          },
        });
        toast.success("Partner saved");
      }
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["client-report"] });
      navigate({ to: "/clients" });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{isEdit ? "Edit Partner" : "Add New Partner"}</h1>
          <p className="text-muted-foreground text-sm mt-1">{isEdit ? "Update profile, deposit, commission and the exact ads this client sees." : "Create a client profile and pick the exact ads they will see in their portal."}</p>
        </div>
        <Link to="/clients" className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface hover:bg-surface-elevated px-4 py-2 text-sm font-semibold">
          <ArrowLeft className="size-4" /> Back to Clients
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* LEFT — Profile */}
        <div className="space-y-5">
          <section className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-7 rounded-lg bg-emerald-500/15 text-emerald-400 grid place-items-center text-xs font-bold">P</div>
              <h2 className="font-semibold">Profile Details</h2>
            </div>
            <div className="space-y-4">
              <Field label="Client Name *"><input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="e.g. Jamie Doe" /></Field>
              <Field label="Company Name"><input value={company} onChange={(e) => setCompany(e.target.value)} className="input" placeholder="Acme Enterprises" /></Field>
              <Field label="Email Address"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="client@example.com" /></Field>
              <Field label="Phone Number"><input value={phone} onChange={(e) => setPhone(e.target.value)} className="input" placeholder="+1 (555) 000-0000" /></Field>
              <Field label="Website"><input value={website} onChange={(e) => setWebsite(e.target.value)} className="input" placeholder="example.com" /></Field>
              <Field label="Address"><input value={address} onChange={(e) => setAddress(e.target.value)} className="input" placeholder="Street, City, Country" /></Field>
              <Field label="Deposit Amount ($ USD) *"><input type="number" step="0.01" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className="input" placeholder="e.g. 1000" /></Field>

              <div className="rounded-xl border border-border/60 bg-surface/40 p-3">
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <input type="checkbox" checked={showConverter} onChange={(e) => setShowConverter(e.target.checked)} className="rounded accent-emerald-500" />
                  BDT → USD CONVERTER <span className="text-[11px] text-muted-foreground font-normal">Optional helper</span>
                </label>
                {showConverter && (
                  <>
                    <div className="grid grid-cols-[1fr_1fr_auto] gap-2 mt-3 items-end">
                      <div>
                        <div className="text-[10px] uppercase text-muted-foreground mb-1">Amount (BDT)</div>
                        <input type="number" value={bdtAmount} onChange={(e) => setBdtAmount(e.target.value)} className="input" placeholder="e.g. 50000" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-muted-foreground mb-1">Rate</div>
                        <input type="number" step="0.01" value={bdtRate} onChange={(e) => setBdtRate(e.target.value)} className="input" placeholder="120" />
                      </div>
                      <button type="button" onClick={applyConverter} className="rounded-lg bg-emerald-500 text-white px-4 py-2 text-sm font-semibold">Apply →</button>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-2">Enter BDT amount &amp; rate to auto-fill USD deposit.</p>
                  </>
                )}
              </div>

              <div className="rounded-xl border border-border/60 bg-surface/40 p-3 space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <input type="checkbox" checked={commissionEnabled} onChange={(e) => setCommissionEnabled(e.target.checked)} className="rounded accent-emerald-500" />
                  Enable Commission
                </label>
                {commissionEnabled && (
                  <>
                    <Field label="Commission (%) — Custom — Agency markup hidden from client">
                      <input type="number" step="0.01" min="0" max="100" value={commissionPct} onChange={(e) => setCommissionPct(e.target.value)} className="input" placeholder="Enter any % e.g. 25, 30, 42.5" />
                    </Field>
                    <p className="text-[11px] text-muted-foreground -mt-2">
                      The agency reduces Meta ad budget by this %, but the client portal still shows the original budget the client paid for.
                    </p>
                    <textarea value={commissionNotes} onChange={(e) => setCommissionNotes(e.target.value)} placeholder="Internal commission notes (not shown to client)" className="input min-h-[80px] resize-y" />
                  </>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl p-5 border border-purple-500/30 bg-gradient-to-br from-purple-600/20 via-indigo-600/15 to-blue-600/20 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-7 rounded-lg bg-white/10 grid place-items-center"><Lock className="size-3.5" /></div>
              <h3 className="font-semibold">Secure Access</h3>
            </div>
            <p className="text-xs text-muted-foreground">The client receives a unique secure access link. They view their dashboard instantly without a password.</p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-300">
              <ShieldCheck className="size-3.5" /> Protected with encryption
            </div>
          </section>
        </div>

        {/* RIGHT — Ad Picker */}
        <div>
          <section className="glass-card p-5 sticky top-20">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-blue-500/15 text-blue-400 grid place-items-center text-xs font-bold">A</div>
                <h2 className="font-semibold">Ad Assignment</h2>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Step 2 of 2</span>
            </div>

            <div className="flex items-center justify-between gap-2 mb-3 rounded-lg border border-border/60 bg-surface/40 px-3 py-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-muted-foreground flex items-center gap-1 shrink-0">
                  <Clock className="size-3" />
                  {lastLoadedAt ? `Updated ${lastLoadedAt.toLocaleTimeString()}` : "—"}
                </span>
              </div>
              <button type="button" onClick={runSyncNow} disabled={syncing || loadingAds} className="inline-flex items-center gap-1.5 rounded-md bg-primary/15 hover:bg-primary/25 text-primary px-2.5 py-1 font-semibold disabled:opacity-60">
                <RefreshCw className={`size-3.5 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Syncing…" : "Sync now"}
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ad, ad set, campaign or account…" className="w-full rounded-lg bg-surface border border-border pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div className="relative">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="appearance-none rounded-lg bg-surface border border-border pl-3 pr-9 py-2 text-sm">
                  <option value="all">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="PAUSED">Paused</option>
                  <option value="ADSET_PAUSED">Ad set paused</option>
                  <option value="CAMPAIGN_PAUSED">Campaign paused</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {loadingAds ? (
              <div className="py-12 grid place-items-center"><Loader2 className="size-6 animate-spin text-primary" /></div>
            ) : loadError ? (
              <div className="py-12 text-center text-sm space-y-3 text-muted-foreground">
                <div className="font-semibold text-foreground">Could not load ads</div>
                <p>{loadError}</p>
                <button type="button" onClick={runSyncNow} className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold">
                  <RefreshCw className="size-3.5" /> Retry / Sync now
                </button>
              </div>
            ) : grouped.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground space-y-2">
                <div>No ads match. Try a different search, or click <b>Sync now</b>.</div>
              </div>
            ) : (
              <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1">
                {grouped.map((acct) => (
                  <div key={acct.account_id} className="rounded-xl border border-border/60 bg-surface/40 overflow-hidden">
                    <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border/40 bg-surface/60">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">{acct.account_name}</div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {acct.currency ? <>{acct.currency} · </> : null}{acct.count} ad{acct.count !== 1 ? "s" : ""}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const ids = acct.campaigns.flatMap((c) => c.adSets.flatMap((s) => s.items.map((i) => i.id)));
                          const allSel = ids.every((id) => selected.has(id));
                          setSelected((prev) => {
                            const next = new Set(prev);
                            if (allSel) ids.forEach((id) => next.delete(id));
                            else ids.forEach((id) => next.add(id));
                            return next;
                          });
                        }}
                        className="text-[11px] rounded-md bg-primary/15 hover:bg-primary/25 text-primary px-2 py-1 font-semibold shrink-0"
                      >
                        Toggle account
                      </button>
                    </div>
                    <div className="p-3 space-y-3">
                      {acct.campaigns.map((camp) => (
                        <div key={camp.campaign_id} className="rounded-lg border border-border/40">
                          <div className="px-3 py-1.5 text-xs font-semibold border-b border-border/40 bg-surface/40 truncate">{camp.campaign_name}</div>
                          <div className="p-2 space-y-2">
                            {camp.adSets.map((set) => (
                              <div key={set.ad_set_id} className="rounded-md bg-surface/30">
                                <div className="flex items-center justify-between gap-2 px-2 py-1 text-[11px] text-muted-foreground">
                                  <span className="truncate">{set.ad_set_name}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const ids = set.items.map((i) => i.id);
                                      const allSel = ids.every((id) => selected.has(id));
                                      setSelected((prev) => {
                                        const next = new Set(prev);
                                        if (allSel) ids.forEach((id) => next.delete(id));
                                        else ids.forEach((id) => next.add(id));
                                        return next;
                                      });
                                    }}
                                    className="text-[10px] underline hover:text-foreground shrink-0"
                                  >
                                    Toggle set
                                  </button>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-1.5 p-1">
                                  {set.items.map((a) => {
                                    const checked = selected.has(a.id);
                                    const status = (a.status || "").toUpperCase();
                                    const statusColor =
                                      status === "ACTIVE" ? "text-emerald-300 bg-emerald-500/15"
                                      : status === "PAUSED" || status === "CAMPAIGN_PAUSED" || status === "ADSET_PAUSED" ? "text-amber-300 bg-amber-500/15"
                                      : status === "ARCHIVED" ? "text-muted-foreground bg-muted/30"
                                      : "text-foreground/70 bg-surface";
                                    return (
                                      <button
                                        key={a.id}
                                        type="button"
                                        onClick={() => toggleAd(a.id)}
                                        className={`text-left rounded-lg border p-2 transition flex items-start gap-2 ${checked ? "border-emerald-500/60 bg-emerald-500/10" : "border-border bg-surface hover:bg-surface-elevated"}`}
                                      >
                                        <div className={`mt-0.5 size-4 rounded border grid place-items-center shrink-0 ${checked ? "bg-emerald-500 border-emerald-500" : "border-border"}`}>
                                          {checked && <Check className="size-3 text-white" />}
                                        </div>
                                        <div className="size-9 rounded-md overflow-hidden bg-surface-elevated shrink-0 grid place-items-center">
                                          {a.thumbnail ? <img src={a.thumbnail} alt="" loading="lazy" className="size-full object-cover" /> : <ImageIcon className="size-3.5 opacity-40" />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="text-[12px] font-medium leading-tight truncate" title={a.name}>{a.name}</div>
                                          <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                            <span>${(Number(a.spend) || 0).toFixed(2)}</span>
                                            <span className={`uppercase tracking-wide rounded px-1 py-0.5 font-semibold ${statusColor}`}>
                                              {status.replace(/_/g, " ") || "—"}
                                            </span>
                                          </div>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-border/40 text-xs text-muted-foreground flex items-center justify-between gap-2 flex-wrap">
              <span>
                {selected.size > 0
                  ? `${selected.size} ad${selected.size !== 1 ? "s" : ""} selected`
                  : `${ads.length} ad${ads.length !== 1 ? "s" : ""} available — none selected`}
              </span>
              {selected.size > 0 && (
                <button type="button" onClick={() => setSelected(new Set())} className="text-[11px] underline text-muted-foreground hover:text-foreground">Clear selection</button>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 -mx-4 lg:-mx-6 mt-6 px-4 lg:px-6 py-3 bg-background/80 backdrop-blur-md border-t border-border/60 flex items-center justify-end gap-3">
        <Link to="/clients" className="rounded-lg border border-border bg-surface hover:bg-surface-elevated px-5 py-2.5 text-sm font-semibold">Cancel</Link>
        <button type="button" onClick={onSave} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2.5 text-sm font-semibold shadow-lg shadow-emerald-500/20 disabled:opacity-60">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
          {isEdit ? "Update Partner" : "Save Partner"}
        </button>
      </div>

      <style>{`.input{width:100%;border-radius:.5rem;background:var(--input);border:1px solid var(--border);padding:.6rem .8rem;font-size:.875rem;outline:none;color:var(--foreground)}.input:focus{box-shadow:0 0 0 2px color-mix(in oklab, var(--primary) 40%, transparent)}.input::placeholder{color:color-mix(in oklab, var(--muted-foreground) 80%, transparent)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">{label}</div>
      {children}
    </label>
  );
}
