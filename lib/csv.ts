import { LinkRecord } from "@/types/link";
import { buildShortUrl } from "@/lib/utils";

export function linksToCsv(links: LinkRecord[]) {
  const headers = [
    "ID",
    "Original URL",
    "Short URL",
    "Clicks",
    "Created At",
    "Expires At",
  ];

  const rows = links.map((link) => [
    link.id,
    link.originalUrl,
    buildShortUrl(link.shortCode),
    link.clicks.toString(),
    link.createdAt,
    link.expiresAt ?? "",
  ]);

  const csv = [headers, ...rows]
    .map((columns) =>
      columns
        .map((value) => {
          const safe = value.replaceAll('"', '""');
          return `"${safe}"`;
        })
        .join(",")
    )
    .join("\n");

  return csv;
}
