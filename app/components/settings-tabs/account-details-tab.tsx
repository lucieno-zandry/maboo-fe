import { Calendar, CheckCircle2, Shield, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { TabsContent } from "../ui/tabs";
import { Separator } from "../ui/separator";
import Button from "../custom-components/button";
import formatDate from "~/lib/format-date";
import { useUserStore } from "~/hooks/use-user";

export default function () {
    const user = useUserStore((state) => state.user!);

    return <TabsContent value="account" className="space-y-4">
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
}