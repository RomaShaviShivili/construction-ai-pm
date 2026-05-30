export function formatCurrency(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

export function parseRiskPercent(value) {
  if (!value) return 0;
  const n = parseInt(String(value).replace('%', ''), 10);
  return Number.isNaN(n) ? 0 : n;
}

export function riskLevel(percent) {
  if (percent >= 60) return 'high';
  if (percent >= 35) return 'medium';
  return 'low';
}

export const riskColors = {
  high: { bg: 'bg-red-500/20', text: 'text-red-400', ring: 'ring-red-500/40', dot: 'bg-red-500' },
  medium: { bg: 'bg-amber-500/20', text: 'text-amber-400', ring: 'ring-amber-500/40', dot: 'bg-amber-500' },
  low: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', ring: 'ring-emerald-500/40', dot: 'bg-emerald-500' },
};

export function daysUntil(deadline) {
  const d = new Date(deadline);
  const now = new Date();
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
}
