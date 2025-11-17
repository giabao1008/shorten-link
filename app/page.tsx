import { RecentLinks } from "@/components/dashboard/recent-links";
import { ShortenForm } from "@/components/forms/shorten-form";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsGrid } from "@/components/stats/stats-grid";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "MakeShorten | Trang chủ",
  description:
    "Rút gọn URL, tạo QR code và theo dõi analytics ngay tức thì với MakeShorten.",
};

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#eef6f9] via-white to-white" />
      <div className="container space-y-14 py-16">
        <ShortenForm />

        <Suspense
          fallback={
            <div className="grid gap-6 md:grid-cols-3">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          }
        >
          <StatsGrid />
        </Suspense>

        <section className="space-y-6">
          <div className="space-y-2 text-slate-900">
            <p className="text-sm uppercase tracking-[0.4em] text-primary">
              Gần đây
            </p>
            <h2 className="text-3xl font-semibold">Link mới nhất</h2>
            <p className="text-slate-500">
              Theo dõi chiến dịch và chuyển đổi gần đây của bạn.
            </p>
          </div>
          <RecentLinks />
        </section>
      </div>
    </div>
  );
}
