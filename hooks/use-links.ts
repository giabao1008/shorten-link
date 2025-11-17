"use client";

import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { LinkRecord } from "@/types/link";

const STORAGE_KEY = "novalink.links.cache";
const REFRESH_EVENT = "novalink:links-refresh";

type UseLinksOptions = {
  scope?: "private" | "public";
};

export function emitLinksRefresh() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(REFRESH_EVENT));
}

export function useLinks(initialLinks?: LinkRecord[], options: UseLinksOptions = { scope: "private" }) {
  const [links, setLinks] = useState<LinkRecord[]>(initialLinks ?? []);
  const [loading, setLoading] = useState(!initialLinks);
  const endpoint = options.scope === "public" ? "/api/public-links" : "/api/links";
  const storageKey = options.scope === "public" ? `${STORAGE_KEY}.public` : STORAGE_KEY;

  const persist = useCallback((data: LinkRecord[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [storageKey]);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<{ data: LinkRecord[] }>(endpoint, {
        headers: { "Cache-Control": "no-cache" },
      });
      const nextLinks: LinkRecord[] = response.data?.data ?? [];
      setLinks(nextLinks);
      persist(nextLinks);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setLinks([]);
      } else {
        console.error("Không thể tải danh sách links", error);
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, persist]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as LinkRecord[];
        setLinks(parsed);
        setLoading(false);
      } else if (initialLinks) {
        setLinks(initialLinks);
      }
    } catch (error) {
      console.warn("Không thể đọc cache links", error);
    }

    refresh();
  }, [initialLinks, refresh, storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => refresh();
    window.addEventListener(REFRESH_EVENT, handler);
    return () => window.removeEventListener(REFRESH_EVENT, handler);
  }, [refresh]);

  const stats = useMemo(() => {
    const totalLinks = links.length;
    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
    const activeLinks = links.filter((link) => {
      if (!link.expiresAt) return true;
      return new Date(link.expiresAt) > new Date();
    }).length;

    return { totalLinks, totalClicks, activeLinks };
  }, [links]);

  return {
    links,
    setLinks,
    loading,
    refresh,
    stats,
  };
}
