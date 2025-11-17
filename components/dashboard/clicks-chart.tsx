"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { LinkRecord } from "@/types/link";
import { Skeleton } from "@/components/ui/skeleton";

interface ClicksChartProps {
  links: LinkRecord[];
  loading: boolean;
}

export function ClicksChart({ links, loading }: ClicksChartProps) {
  const data = aggregateClicks(links);

  if (loading) {
    return <Skeleton className="h-72 w-full" />;
  }

  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-3xl border border-dashed border-border bg-muted text-slate-500">
        Chưa có dữ liệu click nào. Hãy chia sẻ link của bạn!
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-gradient-to-b from-card to-secondary/60 p-6 shadow-lg shadow-[rgba(31,122,140,0.12)]">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1f7a8c" stopOpacity={0.85} />
              <stop offset="95%" stopColor="#1f7a8c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(31,122,140,0.12)" />
          <XAxis dataKey="date" stroke="#7b8b96" tickLine={false} axisLine={false} />
          <YAxis stroke="#7b8b96" tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderRadius: 16,
              border: "1px solid rgba(31,122,140,0.25)",
              color: "white",
            }}
          />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="#1f7a8c"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorClicks)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function aggregateClicks(links: LinkRecord[]) {
  const map = new Map<string, number>();
  links.forEach((link) => {
    link.clickHistory?.forEach((entry) => {
      map.set(entry.date, (map.get(entry.date) ?? 0) + entry.count);
    });
  });

  return Array.from(map.entries())
    .map(([date, clicks]) => ({ date, clicks }))
    .sort((a, b) => (a.date > b.date ? 1 : -1));
}
