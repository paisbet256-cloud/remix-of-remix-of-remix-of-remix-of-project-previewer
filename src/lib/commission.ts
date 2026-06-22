// Shared commission markup helper.
// When an admin enables commission and sets pct%, the real Meta budget is
// reduced by that pct. The CLIENT-FACING views must show the gross spend
// (real / (1 - pct/100)) so the client never sees the commission cut.
// Per spec, ONLY spend and cost-per-result are marked up. Reach,
// impressions, clicks, CTR, CPM, CPC, results stay raw.

export function getMarkup(commissionEnabled: unknown, commissionPercent: unknown): number {
  const pct = Number(commissionPercent) || 0;
  const on = !!commissionEnabled && pct > 0 && pct < 100;
  return on ? 1 / (1 - pct / 100) : 1;
}

export function applyMarkup(value: unknown, commissionEnabled: unknown, commissionPercent: unknown): number {
  return (Number(value) || 0) * getMarkup(commissionEnabled, commissionPercent);
}
