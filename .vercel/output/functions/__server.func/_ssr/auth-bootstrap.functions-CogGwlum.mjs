import { c as createServerFn } from "./esm-I6x-3bX5.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bcxi9eKV.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DZQxRd04.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-bootstrap.functions-CogGwlum.js
var ensureBootstrapAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("94b83918aaca2733c568f73b7a7671bd63ecfca89e1fba55a4460c3262b3279a"));
//#endregion
export { ensureBootstrapAdmin as t };
