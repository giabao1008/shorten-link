import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Đăng nhập quản trị | MakeShorten",
  description: "Truy cập dashboard MakeShorten để quản lý URL rút gọn và analytics.",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#eef6f9] via-white to-white py-16">
      <div className="absolute inset-0 -z-10 bg-hero-grid opacity-40" />
      <div className="container flex flex-col items-center gap-10">
        <div className="flex w-full items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-primary">
            ← Quay lại trang chủ
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-2xl border-border text-primary"
            )}
          >
            Dashboard
          </Link>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
