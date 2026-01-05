import { MapPin, Phone } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";

export function ShippingAddress({ address }: { address: Address }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    Delivery Address
                </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
                <p className="font-bold text-base">{address.fullname}</p>
                <div className="text-muted-foreground leading-relaxed">
                    <p>{address.line1}</p>
                    {address.line2 && <p>{address.line2}</p>}
                    {address.line3 && <p>{address.line3}</p>}
                </div>
                <div className="flex items-center gap-2 pt-2 text-foreground/80">
                    <Phone className="w-3.5 h-3.5" />
                    {address.phone_number}
                </div>
            </CardContent>
        </Card>
    );
}