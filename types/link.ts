export interface ClickHistoryItem {
  date: string; // ISO date string (yyyy-mm-dd)
  count: number;
}

export interface LinkRecord {
  id: string;
  originalUrl: string;
  shortCode: string;
  customSlug?: string;
  clicks: number;
  createdAt: string;
  expiresAt?: string | null;
  clickHistory: ClickHistoryItem[];
}

export interface LinkPayload {
  originalUrl: string;
  customSlug?: string;
  expiresAt?: string | null;
}
