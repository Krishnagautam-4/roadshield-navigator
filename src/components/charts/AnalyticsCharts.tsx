import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, BarChart3, CalendarRange, Car, PieChart as PieIcon, Route } from "lucide-react";
import { ChartCard, chartAxisProps, chartTooltipStyle } from "@/components/charts/ChartCard";
import type { Analytics } from "@/lib/roadshield";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];

const SEVERITY_COLORS: Record<string, string> = {
  Minor: "var(--risk-low)",
  Major: "var(--risk-high)",
  Fatal: "var(--risk-critical)",
};

export function AnalyticsCharts({ analytics }: { analytics: Analytics }) {
  const vehicleData = Object.entries(analytics.vehicleType).map(([name, value]) => ({ name, value }));
  const severityData = Object.entries(analytics.severity).map(([name, value]) => ({ name, value }));
  const roadData = Object.entries(analytics.roadType).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <ChartCard title="Accidents by Vehicle Type" icon={Car} index={0}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={vehicleData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" {...chartAxisProps} />
            <YAxis {...chartAxisProps} />
            <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: "var(--muted)" }} />
            <Bar dataKey="value" name="Accidents" radius={[6, 6, 0, 0]} isAnimationActive>
              {vehicleData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Accident Severity Split" icon={PieIcon} index={1}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={severityData} dataKey="value" nameKey="name" outerRadius="80%" isAnimationActive>
              {severityData.map((d, i) => (
                <Cell key={i} fill={SEVERITY_COLORS[d.name] ?? CHART_COLORS[i]} stroke="var(--card)" />
              ))}
            </Pie>
            <Tooltip contentStyle={chartTooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Year-wise Accident Trends" icon={Activity} index={2}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={analytics.yearly} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="year" {...chartAxisProps} />
            <YAxis {...chartAxisProps} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="accidents" name="Accidents" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="fatalities" name="Fatalities" stroke="var(--chart-5)" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Monthly Accident Trends" icon={CalendarRange} index={3}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={analytics.monthly} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="monthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.55} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" {...chartAxisProps} interval={1} />
            <YAxis {...chartAxisProps} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Area type="monotone" dataKey="accidents" name="Accidents" stroke="var(--chart-2)" strokeWidth={2.5} fill="url(#monthGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top Dangerous Districts" icon={BarChart3} index={4}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={analytics.topDistricts.slice(0, 7)}
            layout="vertical"
            margin={{ top: 4, right: 12, left: 8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
            <XAxis type="number" {...chartAxisProps} />
            <YAxis
              type="category"
              dataKey="district"
              width={120}
              {...chartAxisProps}
              tickFormatter={(v: string) => (v.length > 16 ? `${v.slice(0, 15)}…` : v)}
            />
            <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: "var(--muted)" }} />
            <Bar dataKey="accidents" name="Accidents" fill="var(--chart-1)" radius={[0, 6, 6, 0]} isAnimationActive />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Road Type Distribution" icon={Route} index={5}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={roadData}
              dataKey="value"
              nameKey="name"
              innerRadius="52%"
              outerRadius="80%"
              paddingAngle={3}
              isAnimationActive
            >
              {roadData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke="var(--card)" />
              ))}
            </Pie>
            <Tooltip contentStyle={chartTooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
