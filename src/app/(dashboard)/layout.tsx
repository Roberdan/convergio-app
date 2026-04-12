import { AppShell } from '@/components/shell/app-shell';
import { loadAppConfig, loadNavSections, loadLocaleOverrides } from '@/lib/config-loader';
import { MnLocaleProvider } from '@/lib/i18n';
import { LanguageWrapper } from '@/components/language-wrapper';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const appConfig = loadAppConfig();
  const sections = loadNavSections();
  const localeOverrides = loadLocaleOverrides();

  return (
    <LanguageWrapper fallbackMessages={localeOverrides}>
      <AppShell sections={sections} brandName={appConfig.name} brandLogo={appConfig.logo}>
        {children}
      </AppShell>
    </LanguageWrapper>
  );
}
