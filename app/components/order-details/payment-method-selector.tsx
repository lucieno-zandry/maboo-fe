import { CreditCard, Wallet } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";

interface PaymentMethodProps {
    currentMethod: Transaction['method'];
    onMethodChange: (value: Transaction['method']) => void;
}

export default function PaymentMethodSelector({ currentMethod, onMethodChange }: PaymentMethodProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-muted-foreground" />
                    Payment Method
                </CardTitle>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    defaultValue={currentMethod}
                    onValueChange={onMethodChange}
                    className="grid gap-4"
                >
                    {/* Card Option */}
                    <div>
                        <RadioGroupItem value="CARD" id="card" className="peer sr-only" />
                        <Label
                            htmlFor="card"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                            <CreditCard className="mb-3 h-6 w-6" />
                            <span className="text-sm font-medium">Credit Card</span>
                        </Label>
                    </div>

                    {/* PayPal Option */}
                    <div>
                        <RadioGroupItem value="PAYPAL" id="paypal" className="peer sr-only" />
                        <Label
                            htmlFor="paypal"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                            <div className="font-bold italic text-blue-600 mb-3">PayPal</div>
                            <span className="text-sm font-medium">PayPal Checkout</span>
                        </Label>
                    </div>
                </RadioGroup>
            </CardContent>
        </Card>
    );
}