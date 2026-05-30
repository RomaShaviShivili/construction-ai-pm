import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { ka } from '../i18n/ka';

export default function ProgressChart({ history }) {
  if (!history?.length) return null;

  const data = history.map((h) => ({
    ...h,
    label: new Date(h.date).toLocaleDateString('ka-GE', { month: 'short', year: '2-digit' }),
  }));

  return (
    <ResponsiveContainer width="100%" height={120}>
      <LineChart data={data} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 10 }} />
        <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} width={28} />
        <Tooltip
          formatter={(v) => [`${v}%`, ka.chartProgress]}
          contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
        />
        <Line
          type="monotone"
          dataKey="progress"
          stroke="#0ea5e9"
          strokeWidth={2}
          dot={{ fill: '#0ea5e9', r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
