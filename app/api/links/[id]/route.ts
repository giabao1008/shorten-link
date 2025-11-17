import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { deleteLinkById } from "@/lib/link-service";
import { hasActiveAdminSession } from "@/lib/auth";

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "Thiếu id" }, { status: 400 });
  }

  if (!(await hasActiveAdminSession())) {
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
