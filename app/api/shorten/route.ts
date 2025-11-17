import { NextResponse } from "next/server";

import { createLink } from "@/lib/link-service";
import { ShortenSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = ShortenSchema.parse(body);
    const link = await createLink(payload);

    return NextResponse.json({ data: link });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Đã có lỗi xảy ra";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
