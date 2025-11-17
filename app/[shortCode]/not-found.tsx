import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ShortCodeNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#051621] via-[#0b2531] to-[#051621] p-6 text-center text-slate-100">
      <div className="max-w-lg space-y-5 rounded-[32px] border border-white/10 bg-[#0f2f3a]/90 px-10 py-12 shadow-[0_25px_90px_rgba(5,22,33,0.45)]">
        <h1 className="text-4xl font-semibold text-white">Link không tồn tại</h1>
        <p className="text-slate-300">
          Có thể link đã hết hạn hoặc slug không chính xác. Hãy quay trở lại trang chủ để tạo link
          mới.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-4 rounded-2xl border-none bg-primary px-8 text-base text-primary-foreground shadow-lg shadow-[rgba(31,122,140,0.35)] hover:bg-primary/90"
        >
          <Link href="/">Quay lại trang chủ</Link>
        </Button>
      </div>
    </div>
  );
}
