import { riskLevel, riskColors, parseRiskPercent } from '../utils';

export default function RiskBadge({ label, value }) {
  const pct = parseRiskPercent(value);
  const level = riskLevel(pct);
  const c = riskColors[level];

  return (
    <div className={`rounded-lg px-3 py-2 ring-1 ${c.bg} ${c.ring}`}>
      <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className={`h-2 w-2 rounded-full ${c.dot}`} />
        <span className={`font-display font-semibold text-lg ${c.text}`}>{value}</span>
      </div>
    </div>
  );
}
