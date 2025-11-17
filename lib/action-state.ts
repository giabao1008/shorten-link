import { LinkRecord } from "@/types/link";

export type ShortenFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  link?: LinkRecord;
};

export const initialShortenState: ShortenFormState = {
  status: "idle",
};

export type LoginFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export const initialLoginState: LoginFormState = {
  status: "idle",
};
