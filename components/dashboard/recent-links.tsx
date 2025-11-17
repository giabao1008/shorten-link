"use client";

import { MousePointerClick, QrCode } from "lucide-react";
import { buildShortUrl, formatRelative } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useLinks } from "@/hooks/use-links";

interface RecentLinksProps {
  limit?: number;
}

export function RecentLinks({ limit = 5 }: RecentLinksProps) {
  const { links, loading } = useLinks(undefined, { scope: "public" });
  const items = links.slice(0, limit);

  if (loading) {
    return <Skeleton className="h-56 w-full" />;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-muted p-6 text-slate-500">
        Chưa có link nào. Hãy rút gọn ngay ở phía trên!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-3xl border border-border/70 bg-white/95 p-6 shadow-[0_15px_40px_rgba(4,33,44,0.08)]"
        >
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
              <MousePointerClick className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/${item.shortCode}`}
                  target="_blank"
                  className="text-lg font-semibold text-slate-900 hover:text-primary"
                >
                  {buildShortUrl(item.shortCode)}
                </Link>
                <Badge variant={item.expiresAt ? "warning" : "success"}>
                  {item.expiresAt ? "Hữu hạn" : "Đang hoạt động"}
                </Badge>
              </div>
              <p className="text-sm text-slate-500">{item.originalUrl}</p>
              <p className="text-xs text-slate-400">
                Tạo lúc: {formatRelative(item.createdAt)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 text-right text-sm">
              <div className="flex items-center gap-2 rounded-2xl bg-secondary/60 px-3 py-1 text-slate-700">
                <span className="text-xs uppercase tracking-wide text-slate-500">
                  Clicks
                </span>
                <span className="text-base font-semibold text-slate-900">
                  {item.clicks}
                </span>
              </div>
              <div className="flex gap-3">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="gap-2 rounded-2xl border-border text-primary"
                >
                  <Link href={`/${item.shortCode}`} target="_blank">
                    <QrCode className="h-4 w-4" />
                    Mở
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
