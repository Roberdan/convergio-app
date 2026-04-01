"use server";

import { z } from "zod";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function safeAction<T>(
  fn: () => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

export async function updateProfile(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
  };
  const result = profileSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }
  try {
    const { api } = await import("@/lib/api");
    await api.put("/api/profile", result.data);
  } catch (err) {
    const { ApiError } = await import("@/lib/api");
    if (err instanceof ApiError) {
      return { success: false, error: err.message };
    }
    // Network / connection error — backend unavailable (starter mode).
    console.warn("[profile] Backend unavailable:", err instanceof Error ? err.message : err);
  }
  return { success: true, data: undefined };
}
