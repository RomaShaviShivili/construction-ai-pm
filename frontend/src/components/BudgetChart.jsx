import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '../utils';
import { ka } from '../i18n/ka';

export default function BudgetChart({ budget, spent }) {
  const data = [
    { name: ka.chartBudget, value: budget, fill: '#334155' },
    { name: ka.chartSpent, value: spent, fill: spent > budget * 0.85 ? '#ef4444' : '#0ea5e9' },
    { name: ka.chartRemaining, value: Math.max(0, budget - spent), fill: '#10b981' },
  ];

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 8, top: 4, bottom: 4 }}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="name" width={88} tick={{ fill: '#94a3b8', fontSize: 11 }} />
        <Tooltip
          formatter={(v) => formatCurrency(v)}
          contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
          labelStyle={{ color: '#94a3b8' }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
