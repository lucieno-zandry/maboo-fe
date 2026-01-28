import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { CheckCircle, TicketPercent, ArrowRight } from "lucide-react";
import { useUserStore } from "~/hooks/use-user";
import useClientCodeDialogStore from "~/hooks/use-client-code-dialog-store";


export function PartnerCodeSettings() {
    const { user } = useUserStore();
    const { setIsOpen } = useClientCodeDialogStore();

    const onOpenDialog = () => {
        setIsOpen(true);
    }

    // 1. Logic for Active Partner
    if (user?.permissions?.can_use_special_prices && user.client_code) {
        return (
            <Card className="border-green-100 bg-green-50/30">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Partner Access Active</CardTitle>
                        <CardDescription>
                            Your account is linked to code: <span className="font-mono font-bold text-green-700">{user.client_code.code}</span>
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-green-600 font-medium italic">
                        Exclusive member pricing is currently applied to all eligible products.
                    </p>
                </CardContent>
            </Card>
        );
    }

    // 2. Logic for Non-Partner (The Toggle/Trigger)
    return (
        <Card className="overflow-hidden border-dashed border-2">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <TicketPercent className="h-5 w-5" />
                </div>
                <div className="flex-1">
                    <CardTitle>Partner Program</CardTitle>
                    <CardDescription>
                        Unlock wholesale and partner-exclusive pricing.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <Button
                    variant="outline"
                    onClick={onOpenDialog}
                    className="w-full group hover:border-primary hover:text-primary transition-all"
                >
                    Enter Partner Code
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </CardContent>
        </Card>
    );
}