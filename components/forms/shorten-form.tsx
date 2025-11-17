"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import QRCode from "react-qr-code";
import { ArrowRight, Link2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { createShortLinkAction } from "@/app/actions";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { emitLinksRefresh } from "@/hooks/use-links";
import { buildShortUrl, isUrl } from "@/lib/utils";
import { initialShortenState } from "@/lib/action-state";

export function ShortenForm() {
  const [state, formAction, isPending] = useActionState(createShortLinkAction, initialShortenState);
  const [customSlugEnabled, setCustomSlugEnabled] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [formErrors, setFormErrors] = useState<string | null>(null);
  const [slugValue, setSlugValue] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (state.status === "success" && state.link) {
      toast.success("Link đã được tạo ✨");
      emitLinksRefresh();
    } else if (state.status === "error" && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  const shortUrl = useMemo(
    () => (state.link ? buildShortUrl(state.link.shortCode) : ""),
    [state.link],
  );

  return (
    <div className="glass-panel space-y-8 rounded-[32px] border border-white/70 bg-white px-8 py-10 text-slate-900 shadow-glass">
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary px-4 py-1 text-xs uppercase tracking-[0.35em] text-primary">
          <Sparkles className="h-4 w-4" /> NovaLink
        </div>
        <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
          Rút gọn link, theo dõi realtime, chia sẻ thông minh
        </h1>
        <p className="text-base text-slate-600">
          Sử dụng Server Actions, analytics và QR code để tạo trải nghiệm chia sẻ link hiện đại chỉ trong vài giây.
        </p>
      </div>

      <form
        action={(formData) => {
          setFormErrors(null);
          const urlValue = String(formData.get("originalUrl") ?? "").trim();
          if (!isUrl(urlValue)) {
            setIsValidUrl(false);
            setFormErrors("Vui lòng nhập URL hợp lệ bắt đầu bằng http hoặc https");
            return;
          }
          setIsValidUrl(true);
          startTransition(() => formAction(formData));
        }}
        className="space-y-6"
      >
        <div className="space-y-3">
          <Label htmlFor="originalUrl" className="text-slate-600">
            URL gốc
          </Label>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Link2 className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 text-primary/60 md:block" />
              <Input
                id="originalUrl"
                name="originalUrl"
                placeholder="https://your-amazing-product.com"
                className="h-14 rounded-2xl border-border bg-white pl-4 text-base text-slate-900 placeholder:text-slate-400 md:pl-12"
                onChange={(event) => setIsValidUrl(isUrl(event.target.value))}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="h-14 gap-2 rounded-2xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-lg shadow-[rgba(31,122,140,0.25)] disabled:opacity-60"
            >
              Rút gọn ngay
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
          {!isValidUrl && <p className="text-sm text-rose-500">{formErrors}</p>}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-700">Slug tuỳ chỉnh</Label>
                <p className="text-xs text-slate-500">Đặt tên dễ nhớ cho chiến dịch của bạn.</p>
              </div>
              <Switch checked={customSlugEnabled} onCheckedChange={setCustomSlugEnabled} />
            </div>
            {customSlugEnabled && (
              <Input
                name="customSlug"
                placeholder="vd: summer-sale"
                value={slugValue}
                onChange={(event) => setSlugValue(event.target.value)}
                className="border-border bg-white"
              />
            )}
          </div>

          <div className="space-y-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
            <Label className="text-slate-700">Thời gian hết hạn (tuỳ chọn)</Label>
            <Input
              type="datetime-local"
              name="expiresAt"
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.target.value)}
              className="border-border bg-white"
            />
            <p className="text-xs text-slate-500">Link sẽ không hoạt động sau thời gian này.</p>
          </div>
        </div>
      </form>

      {state.link ? (
        <div className="grid gap-6 rounded-3xl border border-border bg-white p-6 shadow-inner md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Link đã rút gọn</p>
            <p className="break-all text-2xl font-semibold text-slate-900">{shortUrl}</p>
            <div className="flex flex-wrap gap-3">
              <CopyButton value={shortUrl} />
              <Button
                type="button"
                variant="outline"
                onClick={() => window.open(state.link!.originalUrl, "_blank")}
                className="rounded-2xl border-border text-primary"
              >
                Mở URL gốc
              </Button>
            </div>
            <div className="text-sm text-slate-600">
              Tổng lượt click: <span className="font-semibold text-slate-900">{state.link.clicks}</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-4">
            <p className="mb-2 text-sm text-slate-500">Quét QR để truy cập</p>
            <div className="rounded-3xl bg-white p-5 shadow-inner">
              <QRCode value={shortUrl} size={180} fgColor="#111827" bgColor="#ffffff" />
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-secondary/40 p-6 text-sm text-slate-500">
          Kết quả rút gọn sẽ hiển thị tại đây. Hãy nhập URL phía trên để bắt đầu!
        </div>
      )}
    </div>
  );
}
