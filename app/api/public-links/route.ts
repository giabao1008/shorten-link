import { NextResponse } from "next/server";

import { getRecentLinks } from "@/lib/link-service";

export async function GET() {
  try {
    const links = await getRecentLinks(8);
    return NextResponse.json({ data: links });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Đã có lỗi xảy ra";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
