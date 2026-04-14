import { AppShell } from '@/components/shell/app-shell';
import { loadAppConfig, loadNavSections, loadLocaleOverrides } from '@/lib/config-loader';
import { MnLocaleProvider } from '@/lib/i18n';
import { MnA11yFab } from '@/components/maranello';

/* Register all built-in Maranello block types for the PageRenderer */
import '@/lib/block-registrations';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const appConfig = loadAppConfig();
  const sections = loadNavSections();
  const localeOverrides = loadLocaleOverrides();

  return (
    <MnLocaleProvider messages={localeOverrides}>
      <AppShell
        sections={sections}
        brandName={appConfig.name}
        brandLogo={appConfig.logo}
        a11ySlot={<MnA11yFab />}
      >
        {children}
      </AppShell>
    </MnLocaleProvider>
  );
}
