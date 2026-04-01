import type { AppConfig } from "@/types";

export const appConfig: AppConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "Convergio",
  description: "Operational product shell",
  defaultTheme: "navy",
};
