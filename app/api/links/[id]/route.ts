import { NextResponse } from "next/server";

import { hasActiveAdminSession } from "@/lib/auth";
import { deleteLinkById } from "@/lib/link-service";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Thiếu id" }, { status: 400 });
  }

  if (!hasActiveAdminSession()) {
    return NextResponse.json({ error: "Bạn cần đăng nhập" }, { status: 401 });
  }

  try {
    const links = await deleteLinkById(id);
    return NextResponse.json({ data: links });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Đã có lỗi xảy ra";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
