import { DollarSign, Layers, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils';
import { ka } from '../i18n/ka';

export default function PortfolioStats({ projects }) {
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0);
  const avgProgress = Math.round(
    projects.reduce((s, p) => s + p.progress, 0) / (projects.length || 1)
  );
  const atRisk = projects.filter((p) => p.spent / p.budget > 0.65 && p.progress < 70).length;

  const stats = [
    {
      label: ka.statsTotalPortfolio,
      value: formatCurrency(totalBudget),
      sub: ka.statsDeployed(formatCurrency(totalSpent)),
      icon: DollarSign,
      color: 'text-brand-400',
    },
    {
      label: ka.statsActiveProjects,
      value: projects.length,
      sub: ka.statsAvgProgress(avgProgress),
      icon: Layers,
      color: 'text-violet-400',
    },
    {
      label: ka.statsBudgetWatch,
      value: atRisk,
      sub: ka.statsOverSpend,
      icon: AlertCircle,
      color: atRisk > 0 ? 'text-amber-400' : 'text-emerald-400',
    },
    {
      label: ka.statsOnTrack,
      value: projects.filter((p) => p.progress >= 50).length,
      sub: ka.statsAboveHalf,
      icon: CheckCircle2,
      color: 'text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map(({ label, value, sub, icon: Icon, color }) => (
        <div key={label} className="glass rounded-xl p-4 border border-slate-700/40">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <p className="font-display text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-slate-500 mt-1">{sub}</p>
        </div>
      ))}
    </div>
  );
}
