import { getLinkByCode, trackLinkClick } from "@/lib/link-service";
import { notFound, redirect } from "next/navigation";

import type { Metadata } from "next";

type RedirectPageProps = {
  params: { shortCode: string };
};

export async function generateMetadata({
  params,
}: RedirectPageProps): Promise<Metadata> {
  const link = await getLinkByCode(params.shortCode);

  if (!link) {
    return {
      title: "Link không tồn tại | MakeShorten",
      description: "Slug bạn nhập không tồn tại hoặc đã bị xóa.",
    };
  }

  return {
    title: `Chuyển hướng ${link.shortCode} | MakeShorten`,
    description: `Bạn sẽ được chuyển tới ${link.originalUrl}.`,
  };
}

export default async function RedirectPage({ params }: RedirectPageProps) {
  const link = await getLinkByCode(params.shortCode);

  if (!link) {
    notFound();
  }

  if (link.expiresAt && new Date(link.expiresAt) <= new Date()) {
    notFound();
  }

  await trackLinkClick(params.shortCode);
  redirect(link.originalUrl);
}
