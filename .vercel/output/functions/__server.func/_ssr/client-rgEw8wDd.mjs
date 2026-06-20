import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-rgEw8wDd.js
function createSupabaseClient() {
	return createClient("https://odpeegjbfehdntzqbhgv.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kcGVlZ2piZmVoZG50enFiaGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NzY0NTMsImV4cCI6MjA5NzM1MjQ1M30.U4L333Jjz7gGNgM_pagq0jBvZvcm_9egO6Eaf9D6ARw", { auth: {
		storage: typeof window !== "undefined" ? localStorage : void 0,
		persistSession: true,
		autoRefreshToken: true
	} });
}
var _supabase;
var supabase = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabase) _supabase = createSupabaseClient();
	return Reflect.get(_supabase, prop, receiver);
} });
//#endregion
export { supabase as t };
