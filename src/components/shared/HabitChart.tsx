import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ChartDataPoint {
  date: string;
  value: number;
}

interface HabitChartProps {
  data: ChartDataPoint[];
  color?: string;
  label?: string;
}

export function HabitChart({ data, color = '#32769B', label = 'Completion' }: HabitChartProps) {
  if (data.length === 0) {
    return <div style={{ fontSize: 13, color: '#888', textAlign: 'center', padding: 20 }}>No data yet</div>;
  }

  const formatDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    const m = parseInt(parts[1]);
    const d = parseInt(parts[2]);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[m - 1]} ${d}`;
  };

  return (
    <div className="ht-chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: -20 }}>
          <defs>
            <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fill: '#888', fontSize: 10 }}
            axisLine={{ stroke: '#444' }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v: number) => `${v}%`}
            tick={{ fill: '#888', fontSize: 10 }}
            axisLine={{ stroke: '#444' }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#1a1a1f',
              border: '1px solid #333',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelFormatter={(v) => formatDate(String(v))}
            formatter={(value) => [`${value}%`, label]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${color.replace('#', '')})`}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
