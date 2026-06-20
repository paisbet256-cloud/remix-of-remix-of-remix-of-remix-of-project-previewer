//#region node_modules/.nitro/vite/services/ssr/assets/csv-LdasEXPS.js
function toCsv(rows, columns) {
	if (!rows.length) return columns ? columns.join(",") : "";
	const cols = columns ?? Object.keys(rows[0]);
	const esc = (v) => {
		if (v == null) return "";
		const s = typeof v === "object" ? JSON.stringify(v) : String(v);
		return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, "\"\"")}"` : s;
	};
	return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}
function downloadCsv(filename, csv) {
	const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}
//#endregion
export { toCsv as n, downloadCsv as t };
