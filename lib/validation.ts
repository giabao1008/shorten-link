import { z } from "zod";

export const ShortenSchema = z.object({
  originalUrl: z
    .string()
    .trim()
    .url("Vui lòng nhập URL hợp lệ")
    .refine((value) => /^https?:\/\//.test(value), {
      message: "URL phải bắt đầu bằng http hoặc https",
    }),
  customSlug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug chỉ gồm chữ, số, dấu gạch nối",
    })
    .min(3, "Slug tối thiểu 3 ký tự")
    .max(32, "Slug tối đa 32 ký tự")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value === "" ? undefined : value)),
  expiresAt: z
    .string()
    .datetime()
    .optional()
    .or(z.literal(""))
    .transform((value) => (value === "" ? undefined : value)),
});

export type ShortenInput = z.infer<typeof ShortenSchema>;
