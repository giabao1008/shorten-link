import { LinkRecord } from "@/types/link";
import { ShortenInput } from "@/lib/validation";
import { generateRandomCode } from "@/lib/utils";
import { nanoid } from "nanoid";
import { supabase } from "@/lib/supabase";

const TABLE = "links";

type LinkRow = {
  id: string;
  original_url: string;
  short_code: string;
  custom_slug: string | null;
  clicks: number;
  created_at: string;
  expires_at: string | null;
  click_history: { date: string; count: number }[] | null;
};

function mapLink(row: LinkRow): LinkRecord {
  return {
    id: row.id,
    originalUrl: row.original_url,
    shortCode: row.short_code,
    customSlug: row.custom_slug ?? undefined,
    clicks: row.clicks,
    createdAt: row.created_at,
    expiresAt: row.expires_at ?? undefined,
    clickHistory: row.click_history ?? [],
  };
}

export async function getAllLinks(): Promise<LinkRecord[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Failed to fetch links", error);
    throw new Error("Không thể tải danh sách links");
  }

  return (data as LinkRow[]).map(mapLink);
}

export async function getRecentLinks(limit = 10): Promise<LinkRecord[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch recent links", error);
    throw new Error("Không thể tải link mới nhất");
  }

  return (data as LinkRow[]).map(mapLink);
}

export async function getLinkByCode(shortCode: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("short_code", shortCode)
    .maybeSingle();
  if (error) {
    console.error("Failed to fetch link by code", error);
    throw new Error("Không thể tìm link");
  }

  return data ? mapLink(data as LinkRow) : undefined;
}

export async function deleteLinkById(id: string) {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) {
    console.error("Failed to delete link", error);
    throw new Error("Không thể xoá link");
  }

  return getAllLinks();
}

export async function createLink(payload: ShortenInput) {
  const slug = payload.customSlug?.toLowerCase();

  if (slug) {
    const { count } = await supabase
      .from(TABLE)
      .select("*", { count: "exact", head: true })
      .eq("short_code", slug);
    if ((count ?? 0) > 0) {
      throw new Error("Slug đã được sử dụng, hãy chọn slug khác");
    }
  }

  let shortCode = slug ?? generateRandomCode();
  while (true) {
    const { count } = await supabase
      .from(TABLE)
      .select("*", { count: "exact", head: true })
      .eq("short_code", shortCode);
    if ((count ?? 0) === 0) break;
    shortCode = generateRandomCode();
  }

  const now = new Date().toISOString();
  const insertPayload = {
    id: nanoid(12),
    original_url: payload.originalUrl,
    short_code: shortCode,
    custom_slug: slug ?? null,
    clicks: 0,
    created_at: now,
    expires_at: payload.expiresAt ?? null,
    click_history: [],
  };

  const { data, error } = await supabase
    .from(TABLE)
    .insert(insertPayload)
    .select()
    .single();
  if (error) {
    console.error("Failed to create link", error);
    throw new Error("Không thể tạo link");
  }

  return mapLink(data as LinkRow);
}

export async function trackLinkClick(shortCode: string) {
  console.log("trackLinkClick", shortCode);
  const { data: existing, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("short_code", shortCode)
    .single();
  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Failed to fetch link for tracking", error);
    return null;
  }

  const row = existing as LinkRow;
  const today = new Date().toISOString().split("T")[0];
  const history = row.click_history ?? [];
  const target = history.find((entry) => entry.date === today);
  if (target) {
    target.count += 1;
  } else {
    history.push({ date: today, count: 1 });
  }

  const { data: updated, error: updateError } = await supabase
    .from(TABLE)
    .update({
      clicks: row.clicks + 1,
      click_history: history,
    })
    .eq("id", row.id)
    .select()
    .single();

  if (updateError || !updated) {
    console.warn(
      "Failed to update click count, returning original row",
      updateError
    );
    return mapLink(row);
  }

  return mapLink(updated as LinkRow);
}

export async function upsertLinks() {
  return getAllLinks();
}
