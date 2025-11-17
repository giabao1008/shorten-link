import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function buildShortUrl(shortCode: string) {
  return `${getBaseUrl()}/${shortCode}`;
}

export function formatDate(date: string | Date) {
  const dt = typeof date === "string" ? new Date(date) : date;
  return dt.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelative(date: string | Date) {
  const dt = typeof date === "string" ? new Date(date) : date;
  return dt.toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  });
}

export function generateRandomCode(length = 6) {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const max = length + Math.floor(Math.random() * 3); // 6-8 chars
  let result = "";

  while (result.length < max) {
    const idx = Math.floor(Math.random() * characters.length);
    result += characters[idx];
  }

  return result.toLowerCase();
}

export function isUrl(value: string) {
  try {
    const url = new URL(value);
    return Boolean(url.protocol.startsWith("http"));
  } catch {
    return false;
  }
}
