import React, { useState } from 'react';
import { Camera, Mail, Shield, User, Calendar, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Separator } from '~/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { useUserStore } from '~/hooks/use-user';
import LoadingScreen from '~/components/loading-screen';
import ConfirmEmailChangeDialog from '~/components/confirm-email-change-dialog';
import { updateAuthUser } from '~/api/http-requests';
import ProfileTab from '~/components/settings-tabs/profile-tab';
import SecurityTab from '~/components/settings-tabs/security-tab';

export type SettingsTabProps = {
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AccountSettings() {
  const { user } = useUserStore();

  if (!user) {
    return <LoadingScreen />
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: "bg-red-500 hover:bg-red-600",
      manager: "bg-blue-500 hover:bg-blue-600",
      client: "bg-green-500 hover:bg-green-600"
    };
    return colors[role as keyof typeof colors] || "bg-gray-500";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

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

        <Card>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {user.email}
                {user.email_verified_at && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Camera className="h-4 w-4 mr-2" />
              Change Photo
            </Button>
          </CardHeader>
        </Card>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="account">Account Info</TabsTrigger>
          </TabsList>

          <ProfileTab />
          <SecurityTab />

          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>View your account information and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-4 w-4" />
                      User ID
                    </div>
                    <p className="font-medium">{user.id}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Shield className="h-4 w-4" />
                      Role
                    </div>
                    <p className="font-medium capitalize">{user.role}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      Member Since
                    </div>
                    <p className="font-medium">{formatDate(user.created_at)}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle2 className="h-4 w-4" />
                      Email Verified
                    </div>
                    <p className="font-medium">{formatDate(user.email_verified_at)}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle2 className="h-4 w-4" />
                      Approved At
                    </div>
                    <p className="font-medium">{formatDate(user.approved_at)}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      Last Updated
                    </div>
                    <p className="font-medium">{formatDate(user.updated_at)}</p>
                  </div>
                  {user.address_id && (
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Address ID</div>
                      <p className="font-medium">{user.address_id}</p>
                    </div>
                  )}
                  {user.client_code_id && (
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Client Code ID</div>
                      <p className="font-medium">{user.client_code_id}</p>
                    </div>
                  )}
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}