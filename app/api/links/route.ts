import { NextResponse } from "next/server";

import { hasActiveAdminSession } from "@/lib/auth";
import { getAllLinks } from "@/lib/link-service";

export async function GET() {
  if (!(await hasActiveAdminSession())) {
    return NextResponse.json({ error: "Bạn cần đăng nhập" }, { status: 401 });
  }

  try {
    const links = await getAllLinks();
    return NextResponse.json({ data: links });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Đã có lỗi xảy ra";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
