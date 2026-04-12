"use client";

import { useLanguage, type SupportedLocale } from "@/lib/i18n/language-provider";
import { Languages } from "lucide-react";

const LOCALE_OPTIONS: { value: SupportedLocale; label: string; flag: string }[] = [
  { value: "en", label: "English", flag: "GB" },
  { value: "it", label: "Italiano", flag: "IT" },
  { value: "es", label: "Espanol", flag: "ES" },
  { value: "zh", label: "中文", flag: "CN" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="relative inline-flex items-center">
      <Languages
        size={16}
        style={{ color: "var(--mn-text-muted)", marginRight: 4 }}
        aria-hidden="true"
      />
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as SupportedLocale)}
        aria-label="Switch language"
        style={{
          background: "var(--mn-surface-input)",
          color: "var(--mn-text)",
          border: "1px solid var(--mn-border)",
          borderRadius: 6,
          padding: "4px 8px",
          fontSize: 13,
          cursor: "pointer",
        }}
      >
        {LOCALE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.flag} {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
