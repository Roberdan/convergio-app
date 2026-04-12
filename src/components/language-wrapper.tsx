"use client";

import type { PartialLocaleMessages } from "@/lib/i18n/types";
import { MnLocaleProvider } from "@/lib/i18n";
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-provider";

function InnerWrapper({
  fallbackMessages,
  children,
}: {
  fallbackMessages?: PartialLocaleMessages;
  children: React.ReactNode;
}) {
  const { messages } = useLanguage();
  return (
    <MnLocaleProvider messages={messages ?? fallbackMessages}>
      {children}
    </MnLocaleProvider>
  );
}

export function LanguageWrapper({
  fallbackMessages,
  children,
}: {
  fallbackMessages?: PartialLocaleMessages;
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <InnerWrapper fallbackMessages={fallbackMessages}>
        {children}
      </InnerWrapper>
    </LanguageProvider>
  );
}
