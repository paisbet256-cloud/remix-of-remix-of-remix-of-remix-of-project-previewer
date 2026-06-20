import { i as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as CartesianGrid, i as XAxis, l as ResponsiveContainer, o as Bar, r as YAxis, t as ComposedChart, u as Tooltip } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CandlestickChart-D6pbie1f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Build OHLC candles from a single-value daily series.
*  open = previous day's value, close = current day's value.
*  high/low borrow a fraction of the adjacent volatility so the wicks read
*  naturally on a smoothed dataset. */
function toCandles(values) {
	return values.map((d, i) => {
		const prev = values[i - 1]?.value ?? d.value;
		const next = values[i + 1]?.value ?? d.value;
		const open = prev;
		const close = d.value;
		const swing = Math.max(Math.abs(close - open), Math.abs(next - close), Math.abs(prev - open));
		const mid = (open + close) / 2;
		const high = Math.max(open, close, mid + swing * .45);
		const low = Math.min(open, close, mid - swing * .45);
		return {
			date: d.date,
			open,
			close,
			high,
			low,
			bullish: close >= open,
			range: [low, high]
		};
	});
}
function CandleShape(props) {
	const { x, y, width, height, payload, index, fill, upColor, downColor } = props;
	if (!payload || width <= 0) return null;
	const { open, close, high, low, bullish } = payload;
	const range = high - low || 1;
	const bodyTopVal = Math.max(open, close);
	const bodyBotVal = Math.min(open, close);
	const bodyTop = y + (high - bodyTopVal) / range * height;
	const bodyBottom = y + (high - bodyBotVal) / range * height;
	const bodyHeight = Math.max(2, bodyBottom - bodyTop);
	const color = bullish ? upColor : downColor;
	const wickX = x + width / 2;
	const bodyWidth = Math.max(3, width * .62);
	const bodyX = x + (width - bodyWidth) / 2;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		className: "gv-candle",
		style: {
			animationDelay: `${(index ?? 0) * 28}ms`,
			transformOrigin: `${wickX}px ${y + height}px`
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: wickX,
				x2: wickX,
				y1: y,
				y2: y + height,
				stroke: color,
				strokeWidth: 1.2,
				opacity: .55
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: bodyX,
				y: bodyTop,
				width: bodyWidth,
				height: bodyHeight,
				fill: color,
				rx: 2,
				style: { filter: `drop-shadow(0 0 6px color-mix(in oklab, ${color} 45%, transparent))` }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: bodyX,
				y: bodyTop,
				width: bodyWidth,
				height: bodyHeight,
				rx: 2,
				fill: "none",
				stroke: color,
				strokeOpacity: .95,
				strokeWidth: 1
			})
		]
	});
}
function CandleTooltip({ active, payload, format }) {
	if (!active || !payload || !payload.length) return null;
	const p = payload[0].payload;
	const fmt = (n) => format ? format(n) : n.toLocaleString();
	const change = p.close - p.open;
	const changePct = p.open ? change / Math.abs(p.open) * 100 : 0;
	const up = p.bullish;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border/70 bg-background/95 backdrop-blur px-3 py-2 text-xs shadow-2xl",
		style: { minWidth: 150 },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "font-semibold text-foreground mb-1.5 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "size-1.5 rounded-full",
					style: { background: up ? "oklch(0.78 0.18 165)" : "oklch(0.66 0.22 25)" }
				}), p.date]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-x-3 gap-y-0.5 tabular-nums",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "Open"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right font-medium",
						children: fmt(p.open)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "High"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right font-medium text-emerald-300",
						children: fmt(p.high)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "Low"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right font-medium text-rose-300",
						children: fmt(p.low)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "Close"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right font-semibold",
						children: fmt(p.close)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1.5 pt-1.5 border-t border-border/60 flex items-center justify-between text-[11px]",
				style: { color: up ? "oklch(0.82 0.16 165)" : "oklch(0.72 0.2 25)" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					up ? "▲" : "▼",
					" ",
					fmt(Math.abs(change))
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					change >= 0 ? "+" : "",
					changePct.toFixed(1),
					"%"
				] })]
			})
		]
	});
}
function CandlestickChart({ data, series, height = 280, defaultSeries, hideTabs, active, onChange }) {
	const [internal, setInternal] = (0, import_react.useState)(defaultSeries ?? series[0]?.key);
	const current = active ?? internal;
	const activeSeries = series.find((s) => s.key === current) ?? series[0];
	const candles = (0, import_react.useMemo)(() => {
		return toCandles((data ?? []).map((d) => ({
			date: String(d.date),
			value: Number(d[activeSeries.key] ?? 0)
		})));
	}, [data, activeSeries.key]);
	const fmt = activeSeries.format ?? ((v) => v.toLocaleString());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full",
		children: [
			!hideTabs && series.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 inline-flex rounded-lg border border-border bg-surface/60 p-0.5",
				children: series.map((s) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setInternal(s.key);
							onChange?.(s.key);
						},
						className: `px-3 py-1.5 text-xs font-semibold rounded-md transition ${s.key === current ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-block size-1.5 rounded-full mr-1.5 align-middle",
							style: { background: s.upColor }
						}), s.label]
					}, s.key);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: { height },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
					data: candles,
					margin: {
						top: 8,
						right: 12,
						left: 0,
						bottom: 4
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
							id: `gv-bg-${activeSeries.key}`,
							x1: "0",
							y1: "0",
							x2: "0",
							y2: "1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0",
								stopColor: activeSeries.upColor,
								stopOpacity: .06
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "1",
								stopColor: activeSeries.upColor,
								stopOpacity: 0
							})]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							stroke: "oklch(0.55 0.04 260 / 0.18)",
							strokeDasharray: "2 4",
							vertical: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "date",
							stroke: "oklch(0.6 0.025 255)",
							fontSize: 10,
							tickLine: false,
							axisLine: false,
							tickFormatter: (v) => v?.slice(5),
							interval: "preserveStartEnd"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							stroke: "oklch(0.6 0.025 255)",
							fontSize: 10,
							tickLine: false,
							axisLine: false,
							width: 42,
							tickFormatter: (v) => v >= 1e3 ? `${(v / 1e3).toFixed(1)}k` : String(v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							cursor: {
								stroke: "oklch(0.7 0.04 260 / 0.4)",
								strokeWidth: 1,
								strokeDasharray: "3 4"
							},
							content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandleTooltip, { format: fmt })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "range",
							isAnimationActive: false,
							shape: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandleShape, {
								...p,
								upColor: activeSeries.upColor,
								downColor: activeSeries.downColor
							})
						})
					]
				}) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .gv-candle { animation: gvRise 0.55s cubic-bezier(.2,.8,.2,1) both; transform-box: fill-box; }
        .gv-candle rect { transition: filter 0.2s ease; }
        .gv-candle:hover rect { filter: drop-shadow(0 0 10px color-mix(in oklab, currentColor 65%, transparent)) brightness(1.1); }
        @keyframes gvRise {
          0%   { transform: scaleY(0); opacity: 0; }
          60%  { transform: scaleY(1.06); opacity: 1; }
          100% { transform: scaleY(1); opacity: 1; }
        }
      ` })
		]
	});
}
//#endregion
export { CandlestickChart as t };
