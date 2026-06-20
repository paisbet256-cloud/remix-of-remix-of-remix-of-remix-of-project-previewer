import { t as supabase } from "./client-rgEw8wDd.mjs";
import { i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { vt as CheckCheck, xt as BellRing } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alerts-B7NDXslR.js
var import_jsx_runtime = require_jsx_runtime();
function AlertsPage() {
	const qc = useQueryClient();
	const { data: alerts } = useQuery({
		queryKey: ["alerts"],
		queryFn: async () => {
			const { data } = await supabase.from("alerts").select("*, client:clients(name)").order("created_at", { ascending: false }).limit(100);
			return data ?? [];
		}
	});
	const markAll = async () => {
		await supabase.from("alerts").update({ is_read: true }).eq("is_read", false);
		toast.success("All marked as read");
		qc.invalidateQueries({ queryKey: ["alerts"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between flex-wrap gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold",
					children: "Alerts"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground text-sm",
					children: "Budget, performance, and sync notifications."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: markAll,
				className: "inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:bg-surface-elevated shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "size-4" }), " Mark all read"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: (alerts ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card p-12 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "size-10 mx-auto opacity-30 mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-foreground",
					children: "No alerts yet"
				})]
			}) : (alerts ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `glass-card p-4 flex items-start gap-3 ${!a.is_read ? "border-primary/30" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `size-9 rounded-lg grid place-items-center text-sm ${a.severity === "critical" ? "bg-destructive/15 text-destructive" : a.severity === "warning" ? "bg-warning/15 text-warning" : "bg-primary/15 text-primary"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "size-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-sm truncate",
								children: a.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground",
								children: new Date(a.created_at).toLocaleString()
							})]
						}),
						a.message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: a.message
						}),
						a.client?.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase tracking-wider text-muted-foreground mt-1",
							children: a.client.name
						})
					]
				})]
			}, a.id))
		})]
	});
}
//#endregion
export { AlertsPage as component };
