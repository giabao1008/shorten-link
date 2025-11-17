"use client";

import { MousePointerClick, Radar, Waves } from "lucide-react";

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLinks } from "@/hooks/use-links";

const cards = [
  {
    id: "total-links",
    label: "Total Links",
    key: "totalLinks",
    icon: Waves,
    formatter: (value: number) => value.toString().padStart(2, "0"),
  },
  {
    id: "total-clicks",
    label: "Total Clicks",
    key: "totalClicks",
    icon: MousePointerClick,
    formatter: (value: number) => value.toLocaleString(),
  },
  {
    id: "active-links",
    label: "Active Links",
    key: "activeLinks",
    icon: Radar,
    formatter: (value: number) => value.toString().padStart(2, "0"),
  },
] as const;

export function StatsGrid() {
  const { stats, loading } = useLinks(undefined, { scope: "public" });

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <Skeleton key={card.id} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = stats[card.key as keyof typeof stats] ?? 0;
        return (
          <Card key={card.id} className="border-border bg-white shadow-lg shadow-[rgba(31,122,140,0.15)] dark:bg-slate-900">
            <CardContent className="flex items-center justify-between">
              <div className="space-y-3">
                <CardDescription className="uppercase tracking-[0.3em] text-primary">
                  {card.label}
                </CardDescription>
                <CardTitle className="text-4xl text-slate-900 dark:text-white">
                  {card.formatter(value ?? 0)}
                </CardTitle>
              </div>
              <div className="rounded-2xl bg-secondary/50 p-4 text-primary">
                <Icon className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
