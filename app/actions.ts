"use server";

import { LoginFormState, ShortenFormState } from "@/lib/action-state";
import {
  authenticateAdmin,
  clearAdminSession,
  createAdminSession,
} from "@/lib/auth";

import { ShortenSchema } from "@/lib/validation";
import { createLink } from "@/lib/link-service";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createShortLinkAction(
  previousState: ShortenFormState,
  formData: FormData
): Promise<ShortenFormState> {
  try {
    const expiresRaw = (formData.get("expiresAt") as string) ?? undefined;
    const customSlug = (formData.get("customSlug") as string) ?? undefined;
    const expiresAt = expiresRaw
      ? new Date(expiresRaw).toISOString()
      : undefined;

    const input = {
      originalUrl: String(formData.get("originalUrl") ?? ""),
      customSlug,
      expiresAt,
    };

    const payload = ShortenSchema.parse(input);
    const link = await createLink(payload);

    revalidatePath("/");
    revalidatePath("/dashboard");

    return {
      status: "success",
      message: "Link đã được rút gọn thành công",
      link,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Không thể rút gọn link, thử lại sau";

    return {
      status: "error",
      message,
      link: previousState.link,
    };
  }
}

export async function loginAdminAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      status: "error",
      message: "Vui lòng nhập đầy đủ email và mật khẩu",
    };
  }

  try {
    await authenticateAdmin(email, password);
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Đăng nhập thất bại",
    };
  }

  await createAdminSession();
  revalidatePath("/dashboard");

  return { status: "success" };
}

export async function logoutAdminAction() {
  await clearAdminSession();
  revalidatePath("/dashboard");
  redirect("/login");
}
