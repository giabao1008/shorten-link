"use client";

import { loginAdminAction, logoutAdminAction } from "@/app/actions";
import { useActionState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";
import { initialLoginState } from "@/lib/action-state";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    loginAdminAction,
    initialLoginState
  );

  useEffect(() => {
    if (state.status === "success") {
      router.replace("/dashboard");
    }
  }, [state.status, router]);

  return (
    <div className="glass-panel mx-auto w-full max-w-md space-y-6 rounded-3xl border border-white/40 bg-white/90 p-8 text-slate-800 shadow-2xl">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-primary">
            MakeShorten Admin
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Đăng nhập quản trị
          </h1>
          <p className="text-sm text-slate-500">
            Nhập thông tin được cấp để tiếp tục quản lý URL.
          </p>
        </div>
      </div>

      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-600">
            Email quản trị
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="admin@example.com"
            required
            className="h-12 rounded-2xl border-border bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-600">
            Mật khẩu
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            className="h-12 rounded-2xl border-border bg-white"
          />
        </div>
        {state.status === "error" && (
          <p className="text-sm text-rose-500">{state.message}</p>
        )}
        <Button
          type="submit"
          disabled={pending}
          className="h-12 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-lg shadow-[rgba(31,122,140,0.25)] disabled:opacity-60"
        >
          {pending ? "Đang xác thực..." : "Đăng nhập"}
        </Button>
      </form>
      <form action={logoutAdminAction}>
        <Button variant="ghost" className="w-full text-slate-500" type="submit">
          Đăng xuất phiên hiện tại
        </Button>
      </form>
    </div>
  );
}
