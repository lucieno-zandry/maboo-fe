import getInitials from "~/lib/get-initials";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Camera, CheckCircle2, Mail } from "lucide-react";
import Button from "../custom-components/button";
import { useUserStore } from "~/hooks/use-user";

export default function AccountCard() {
    const user = useUserStore((state) => state.user!);
    
    return <Card>
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
}