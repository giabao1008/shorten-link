import { redirect } from "next/navigation";

import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { hasActiveAdminSession } from "@/lib/auth";
import { getAllLinks } from "@/lib/link-service";

export const metadata = {
  title: "MakeShorten Dashboard | Quản lý links",
  description:
    "Theo dõi chuyển đổi, xuất CSV, xóa link và xem biểu đồ clicks theo thời gian thực với NovaLink Dashboard.",
};

export default async function DashboardPage() {
  if (!(await hasActiveAdminSession())) {
    redirect("/login");
  }

  const links = await getAllLinks();
  return <DashboardClient initialLinks={links} />;
}
