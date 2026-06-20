import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-rgEw8wDd.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { m as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { H as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Logo } from "./Logo-CoFHNc4d.mjs";
import { t as ensureBootstrapAdmin } from "./auth-bootstrap.functions-CogGwlum.mjs";
import { t as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-1vXGV-cE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var lovableAuth = createLovableAuth();
var lovable = { auth: { signInWithOAuth: async (provider, opts) => {
	const result = await lovableAuth.signInWithOAuth(provider, {
		redirect_uri: opts?.redirect_uri,
		extraParams: { ...opts?.extraParams }
	});
	if (result.redirected) return result;
	if (result.error) return result;
	try {
		await supabase.auth.setSession(result.tokens);
	} catch (e) {
		return { error: e instanceof Error ? e : new Error(String(e)) };
	}
	return result;
} } };
function AuthPage() {
	const nav = useNavigate();
	const ensureAdminFn = useServerFn(ensureBootstrapAdmin);
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) ensureAdminFn({ data: void 0 }).finally(() => nav({ to: "/dashboard" }));
		});
	}, [nav]);
	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			if (mode === "signup") {
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						data: { full_name: fullName },
						emailRedirectTo: window.location.origin + "/dashboard"
					}
				});
				if (error) throw error;
				toast.success("Account created — signing in…");
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
			}
			await ensureAdminFn({ data: void 0 });
			nav({ to: "/dashboard" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Authentication failed");
		} finally {
			setLoading(false);
		}
	};
	const onGoogle = async () => {
		setLoading(true);
		const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
		if (res.error) {
			toast.error(res.error.message ?? "Google sign-in failed");
			setLoading(false);
			return;
		}
		if (res.redirected) return;
		nav({ to: "/dashboard" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen grid lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hidden lg:flex flex-col justify-between p-12 hero-panel m-6 rounded-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "h-12 w-auto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display font-bold text-lg",
						children: "GrowVibe Ads Solution"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-4xl font-bold leading-tight",
					children: ["Welcome to your ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "gradient-text",
						children: "Command Center"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground mt-4 max-w-md",
					children: "Track every campaign, every client, every dollar — all in real time."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" GrowVibe Ads Solution"
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md glass-card p-8 gv-fade-up",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center gap-2 mb-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "h-14 w-auto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display font-extrabold text-xl tracking-tight gradient-text",
							children: "GrowVibe Ads Solution"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold text-center",
						children: mode === "signin" ? "Sign in" : "Create account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1 text-center",
						children: mode === "signin" ? "Welcome back to GrowVibe Ads Solution" : "First user becomes admin automatically."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: onGoogle,
						disabled: loading,
						className: "w-full mt-6 flex items-center justify-center gap-2 rounded-lg border border-border bg-surface hover:bg-surface-elevated px-4 py-2.5 text-sm font-medium transition-all hover:shadow-md disabled:opacity-50",
						children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							className: "size-4",
							viewBox: "0 0 24 24",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								fill: "currentColor",
								d: "M21.35 11.1H12v3.8h5.35c-.23 1.23-1.39 3.62-5.35 3.62-3.22 0-5.85-2.67-5.85-5.96s2.63-5.96 5.85-5.96c1.83 0 3.07.78 3.78 1.45l2.58-2.48C16.65 4.07 14.55 3 12 3 7 3 3 7 3 12s4 9 9 9c5.2 0 8.62-3.65 8.62-8.8 0-.6-.07-1.06-.17-1.5Z"
							})
						}), "Continue with Google"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 my-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "or"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "space-y-3",
						children: [
							mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: fullName,
								onChange: (e) => setFullName(e.target.value),
								required: true,
								placeholder: "Full name",
								className: "w-full rounded-lg bg-input border border-border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								required: true,
								placeholder: "Email",
								className: "w-full rounded-lg bg-input border border-border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								required: true,
								minLength: 6,
								placeholder: "Password",
								className: "w-full rounded-lg bg-input border border-border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: loading,
								className: "w-full rounded-lg bg-gradient-to-r from-primary to-primary-glow px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-2",
								children: [
									loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }),
									" ",
									mode === "signin" ? "Sign in" : "Create account"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center text-sm text-muted-foreground mt-5",
						children: mode === "signin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Don't have an account? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMode("signup"),
							className: "text-primary font-medium",
							children: "Sign up"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Already have one? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMode("signin"),
							className: "text-primary font-medium",
							children: "Sign in"
						})] })
					})
				]
			})
		})]
	});
}
//#endregion
export { AuthPage as component };
