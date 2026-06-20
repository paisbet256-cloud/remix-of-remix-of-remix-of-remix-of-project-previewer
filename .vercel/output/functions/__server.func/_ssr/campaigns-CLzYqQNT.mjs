import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { c as lazyRouteComponent, l as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/campaigns-CLzYqQNT.js
var import_jsx_runtime = require_jsx_runtime();
var $$splitComponentImporter = () => import("./campaigns-C5yXvDbv.mjs");
var Route = createFileRoute("/_authenticated/campaigns")({
	head: () => ({ meta: [{ title: "Campaigns — GrowVibe Ads Solution" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
function StatusBadge({ status }) {
	if (!status) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-xs text-muted-foreground",
		children: "—"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `text-[10px] font-semibold uppercase rounded-full px-2 py-0.5 ${{
			ACTIVE: "bg-success/15 text-success",
			PAUSED: "bg-warning/15 text-warning",
			DELETED: "bg-destructive/15 text-destructive",
			ARCHIVED: "bg-muted text-muted-foreground"
		}[status] ?? "bg-surface text-muted-foreground"}`,
		children: status.replace(/_/g, " ")
	});
}
//#endregion
export { StatusBadge as n, Route as t };
