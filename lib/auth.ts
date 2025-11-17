import { cookies } from "next/headers";

import { supabaseAdmin } from "@/lib/supabase-server";

const ADMIN_SESSION_COOKIE = "novalink-admin-session";
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? "novalink-admin-token";

export async function authenticateAdmin(email: string, password: string) {
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? "Thông tin đăng nhập không chính xác");
  }

  return data.user;
}

export async function createAdminSession() {
  const store = await cookies();
  await store.set(ADMIN_SESSION_COOKIE, ADMIN_SESSION_SECRET, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  await store.delete(ADMIN_SESSION_COOKIE);
}

export async function hasActiveAdminSession() {
  const store = await cookies();
  return store.get(ADMIN_SESSION_COOKIE)?.value === ADMIN_SESSION_SECRET;
}
