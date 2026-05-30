import { useState } from 'react';
import {
  Building2,
  Calendar,
  Loader2,
  Sparkles,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { analyzeProject } from '../api';
import { formatCurrency, daysUntil, parseRiskPercent, riskLevel, riskColors } from '../utils';
import RiskBadge from './RiskBadge';
import BudgetChart from './BudgetChart';
import ProgressChart from './ProgressChart';
import { ka } from '../i18n/ka';

export default function ProjectCard({ project, onAnalyzed }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const spentPct = Math.round((project.spent / project.budget) * 100);
  const daysLeft = daysUntil(project.deadline);

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeProject(project.id);
      setAnalysis(result);
      onAnalyzed?.(project.id, result);
    } catch {
      setError(ka.analysisError);
    } finally {
      setLoading(false);
    }
  }

  const delayPct = analysis ? parseRiskPercent(analysis.delay_risk) : null;
  const overallRisk = delayPct != null ? riskLevel(delayPct) : null;
  const borderAccent =
    overallRisk === 'high'
      ? 'border-red-500/30'
      : overallRisk === 'medium'
        ? 'border-amber-500/30'
        : overallRisk === 'low'
          ? 'border-emerald-500/30'
          : 'border-slate-700/50';

  return (
    <article
      className={`glass rounded-2xl p-5 shadow-card hover:shadow-glow transition-shadow border ${borderAccent}`}
    >
      <header className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-white">{project.project_name}</h3>
            <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(project.deadline).toLocaleDateString('ka-GE', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
              <span className="text-slate-600">·</span>
              <span className={daysLeft < 90 ? 'text-amber-400' : ''}>{ka.daysLeft(daysLeft)}</span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-display font-bold text-brand-400">{project.progress}%</p>
          <p className="text-xs text-slate-500">{ka.complete}</p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="rounded-lg bg-slate-900/60 px-3 py-2">
          <p className="text-slate-500 text-xs">{ka.budget}</p>
          <p className="font-medium text-slate-200">{formatCurrency(project.budget)}</p>
        </div>
        <div className="rounded-lg bg-slate-900/60 px-3 py-2">
          <p className="text-slate-500 text-xs">{ka.spentPct(spentPct)}</p>
          <p className="font-medium text-slate-200">{formatCurrency(project.spent)}</p>
        </div>
      </div>

      <div className="mb-3">
        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {project.issues?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.issues.map((issue) => (
            <span
              key={issue}
              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20"
            >
              <AlertTriangle className="h-3 w-3" />
              {issue}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-xs text-slate-500 mb-1">{ka.chartBudgetVsSpent}</p>
          <BudgetChart budget={project.budget} spent={project.spent} />
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">{ka.chartProgressOverTime}</p>
          <ProgressChart history={project.progress_history} />
        </div>
      </div>

      {!analysis && (
        <button
          type="button"
          onClick={runAnalysis}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium py-2.5 transition-colors disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {loading ? ka.analyzing : ka.runAnalysis}
        </button>
      )}

      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

      {analysis && (
        <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <TrendingUp className="h-4 w-4 text-brand-400" />
            {ka.aiRiskTitle}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <RiskBadge label={ka.delayRisk} value={analysis.delay_risk} />
            <RiskBadge label={ka.budgetRisk} value={analysis.budget_risk} />
          </div>
          <div className="rounded-lg bg-slate-900/80 p-3 text-sm space-y-2">
            <p>
              <span className="text-slate-500">{ka.prediction}: </span>
              <span className="text-slate-200">{analysis.prediction}</span>
            </p>
            {analysis.estimated_completion && (
              <p>
                <span className="text-slate-500">{ka.estCompletion}: </span>
                <span className="text-slate-200">{analysis.estimated_completion}</span>
              </p>
            )}
            {analysis.on_time_likelihood && (
              <p>
                <span className="text-slate-500">{ka.onTimeLikelihood}: </span>
                <span
                  className={
                    riskColors[riskLevel(100 - parseRiskPercent(analysis.on_time_likelihood))].text
                  }
                >
                  {analysis.on_time_likelihood}
                </span>
              </p>
            )}
          </div>
          {analysis.issues?.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 uppercase mb-1">{ka.keyIssues}</p>
              <ul className="text-sm text-slate-300 list-disc list-inside space-y-0.5">
                {analysis.issues.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {analysis.recommendations?.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 uppercase mb-1">{ka.recommendations}</p>
              <ul className="text-sm text-slate-300 space-y-1">
                {analysis.recommendations.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-brand-400">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
