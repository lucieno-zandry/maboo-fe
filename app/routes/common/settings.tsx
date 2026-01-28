import React from 'react';
import { Camera, Mail, Shield, User, Calendar, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Separator } from '~/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useUserStore } from '~/hooks/use-user';
import LoadingScreen from '~/components/loading-screen';
import ProfileTab from '~/components/settings-tabs/profile-tab';
import SecurityTab from '~/components/settings-tabs/security-tab';
import AccountDetailsTab from '~/components/settings-tabs/account-details-tab';
import getRoleBadgeColor from '~/lib/get-role-badge-color';
import getInitials from '~/lib/get-initials';
import AccountCard from '~/components/settings/account-card';
import { PartnerCodeSettings } from '~/components/settings/partner-code-card';

export type SettingsTabProps = {
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AccountSettings() {
  const { user } = useUserStore();

  if (!user) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-500 mt-1">Manage your account preferences and security</p>
          </div>
          <Badge className={getRoleBadgeColor(user.role)}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Badge>
        </div>

        <AccountCard />

        <PartnerCodeSettings />

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="account">Account Info</TabsTrigger>
          </TabsList>

          <ProfileTab />
          <SecurityTab />
          <AccountDetailsTab />
        </Tabs>
      </div>
    </div>
  );
}