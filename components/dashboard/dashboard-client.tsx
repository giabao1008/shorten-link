"use client";

import axios from "axios";
import { useMemo, useState } from "react";
import Link from "next/link";
import { BarChart3, Download, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ClicksChart } from "@/components/dashboard/clicks-chart";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { emitLinksRefresh, useLinks } from "@/hooks/use-links";
import { linksToCsv } from "@/lib/csv";
import { buildShortUrl, formatDate } from "@/lib/utils";
import type { LinkRecord } from "@/types/link";

interface DashboardClientProps {
  initialLinks: LinkRecord[];
}

export function DashboardClient({ initialLinks }: DashboardClientProps) {
  const { links, setLinks, loading } = useLinks(initialLinks);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all");
  const [dialogLink, setDialogLink] = useState<LinkRecord | null>(null);

  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      const matchesQuery =
        link.originalUrl.toLowerCase().includes(query.toLowerCase()) ||
        link.shortCode.toLowerCase().includes(query.toLowerCase());
      const isExpired = link.expiresAt ? new Date(link.expiresAt) <= new Date() : false;
      const matchesFilter =
        filter === "all" || (filter === "expired" ? isExpired : !isExpired);

      return matchesQuery && matchesFilter;
    });
  }, [links, query, filter]);

  async function handleDelete(id: string) {
    try {
      const response = await axios.delete<{ data: LinkRecord[] }>(`/api/links/${id}`);
      const nextLinks: LinkRecord[] = response.data?.data ?? [];
      setLinks(nextLinks);
      emitLinksRefresh();
      toast.success("Đã xoá link");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đã có lỗi xảy ra");
    } finally {
      setDialogLink(null);
    }
  }

  function handleExport() {
    if (filteredLinks.length === 0) {
      toast.info("Không có dữ liệu để export");
      return;
    }

    const csv = linksToCsv(filteredLinks);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `novalink-export-${Date.now()}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8 bg-gradient-to-b from-slate-50 via-white to-white py-10">
      <div className="container space-y-10">
        <header className="flex flex-col gap-4 rounded-3xl border border-border bg-white/95 p-6 shadow-xl md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-slate-800">
            <p className="text-sm uppercase tracking-[0.4em] text-primary">Dashboard</p>
            <h1 className="text-4xl font-semibold">Quản lý links & analytics</h1>
            <p className="text-slate-500">Theo dõi hiệu suất chiến dịch theo thời gian thực.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleExport} className="gap-2 rounded-2xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-lg shadow-[rgba(31,122,140,0.25)] hover:bg-primary/90">
              <Download className="h-4 w-4" /> Export CSV
            </Button>
            <LogoutButton />
          </div>
        </header>

        <section className="rounded-3xl border border-border bg-white p-6 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" />
              <Input
                placeholder="Tìm theo URL hoặc slug"
                className="h-12 rounded-2xl border-border bg-white pl-12 text-slate-800"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value as typeof filter)}
              className="h-12 rounded-2xl border border-border bg-white px-4 text-sm text-slate-700"
            >
              <option value="all">Tất cả links</option>
              <option value="active">Đang hoạt động</option>
              <option value="expired">Đã hết hạn</option>
            </select>
          </div>

          <div className="mt-6">
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : filteredLinks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-muted p-6 text-center text-slate-500">
                Không tìm thấy link nào phù hợp.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Original URL</TableHead>
                    <TableHead>Short Link</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLinks.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell className="max-w-[220px] truncate text-slate-600">
                        {link.originalUrl}
                      </TableCell>
                      <TableCell className="text-slate-900">
                        <div className="flex flex-col gap-1">
                          <Link href={`/${link.shortCode}`} target="_blank" className="text-primary">
                            {buildShortUrl(link.shortCode)}
                          </Link>
                          <div className="flex items-center gap-2">
                            <CopyButton value={buildShortUrl(link.shortCode)} />
                            <Badge variant={link.expiresAt ? "warning" : "success"}>
                              {link.expiresAt ? "Expired" : "Active"}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{link.clicks}</TableCell>
                      <TableCell>{formatDate(link.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-2"
                          onClick={() => setDialogLink(link)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Xoá
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Clicks over time</h2>
          </div>
          <ClicksChart links={links} loading={loading} />
        </section>
      </div>

      <Dialog open={Boolean(dialogLink)} onOpenChange={() => setDialogLink(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xoá link</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Bạn chắc chắn muốn xoá link {dialogLink?.shortCode}? Hành động này không thể hoàn tác.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="ghost">Huỷ</Button>
            </DialogClose>
            {dialogLink && (
              <Button variant="destructive" onClick={() => handleDelete(dialogLink.id)}>
                Xoá ngay
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
