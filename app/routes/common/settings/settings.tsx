import React from 'react';
import { Badge } from '~/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useUserStore } from '~/hooks/use-user';
import LoadingScreen from './components/loading-screen';
import ProfileTab from '~/routes/common/settings/components/tabs/profile-tab';
import SecurityTab from '~/routes/common/settings/components/tabs/security-tab';
import AccountDetailsTab from '~/routes/common/settings/components/tabs/account-details-tab';
import getRoleBadgeColor from '~/lib/get-role-badge-color';
import AccountCard from './components/account-card';
import { PartnerCodeSettings } from './components/partner-code-card';
import { useTranslation } from 'react-i18next';
import NotFoundErrorPage from '../not-found-error-page';

export type SettingsTabProps = {
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AccountSettings() {
  const { user, authStatus } = useUserStore();
  const { t } = useTranslation("settings");

  if (!user || !user.permissions?.can_use_settings) {
    if (authStatus === 'unknown')
      return <LoadingScreen />

    return <NotFoundErrorPage />
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('settings:accountSettings')}</h1>
            <p className="text-muted-foreground mt-1">{t('settings:accountSettingsDescription')}</p>
          </div>
          <Badge className={getRoleBadgeColor(user.role)}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Badge>
        </div>

        <AccountCard />

        <PartnerCodeSettings />

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">{t('settings:profile')}</TabsTrigger>
            <TabsTrigger value="security">{t('settings:security')}</TabsTrigger>
            <TabsTrigger value="account">{t('settings:accountInfo')}</TabsTrigger>
          </TabsList>

          <ProfileTab />
          <SecurityTab />
          <AccountDetailsTab />
        </Tabs>
      </div>
    </div>
  );
}