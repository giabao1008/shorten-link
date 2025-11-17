"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";

import { logoutAdminAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      className="gap-2 rounded-2xl border-border text-slate-600 hover:text-slate-800"
      disabled={pending}
      onClick={() => startTransition(() => logoutAdminAction())}
    >
      <LogOut className="h-4 w-4" />
      {pending ? "Đang đăng xuất" : "Đăng xuất"}
    </Button>
  );
}
