import { NextResponse } from "next/server";

import { trackLinkClick } from "@/lib/link-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const shortCode = String(body.shortCode ?? "");

    if (!shortCode) {
      return NextResponse.json({ error: "Thiếu shortCode" }, { status: 400 });
    }

    const link = await trackLinkClick(shortCode);

    if (!link) {
      return NextResponse.json({ error: "Không tìm thấy link" }, { status: 404 });
    }

    return NextResponse.json({ data: link });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Đã có lỗi xảy ra";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
