import { c as createServerFn } from "./esm-I6x-3bX5.mjs";
import { t as createServerRpc } from "./createServerRpc-BWrlMzYt.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bcxi9eKV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-bootstrap.functions-7hahKB7-.js
var ensureBootstrapAdmin_createServerFn_handler = createServerRpc({
	id: "94b83918aaca2733c568f73b7a7671bd63ecfca89e1fba55a4460c3262b3279a",
	name: "ensureBootstrapAdmin",
	filename: "src/lib/auth-bootstrap.functions.ts"
}, (opts) => ensureBootstrapAdmin.__executeServer(opts));
var ensureBootstrapAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(ensureBootstrapAdmin_createServerFn_handler, async ({ context }) => {
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.mjs");
	const { data: authUser, error: userError } = await supabaseAdmin.auth.admin.getUserById(context.userId);
	if (userError) throw new Error(userError.message);
	const user = authUser.user;
	const email = user?.email ?? "";
	const fullName = user?.user_metadata?.full_name || email || "Admin";
	const profile = {
		id: context.userId,
		email,
		full_name: fullName,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	await supabaseAdmin.from("profiles").upsert(profile, { onConflict: "id" });
	const { data: ownRoles, error: ownRoleError } = await supabaseAdmin.from("user_roles").select("id,role").eq("user_id", context.userId);
	if (ownRoleError) throw new Error(ownRoleError.message);
	if (ownRoles?.some((role) => role.role === "admin")) return {
		isAdmin: true,
		bootstrapped: false
	};
	const { count, error: countError } = await supabaseAdmin.from("user_roles").select("id", {
		count: "exact",
		head: true
	}).eq("role", "admin");
	if (countError) throw new Error(countError.message);
	if ((count ?? 0) === 0) {
		const adminRole = {
			user_id: context.userId,
			role: "admin"
		};
		const { error: insertError } = await supabaseAdmin.from("user_roles").upsert(adminRole, { onConflict: "user_id,role" });
		if (insertError) throw new Error(insertError.message);
		return {
			isAdmin: true,
			bootstrapped: true
		};
	}
	return {
		isAdmin: false,
		bootstrapped: false
	};
});
//#endregion
export { ensureBootstrapAdmin_createServerFn_handler };
