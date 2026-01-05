import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import Button from "../custom-components/button";
import { CreditCard, Wallet, Lock } from "lucide-react"; // Or use your own icons
import { cn } from "~/lib/utils";
import { useState } from "react";
import useCheckoutStore from "~/hooks/use-checkout-store";

export function PaymentMethod({ onNext }: { onNext: () => void }) {
    const { method, setMethod } = useCheckoutStore();

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">Payment Method</CardTitle>
                        <CardDescription>Select your preferred way to pay.</CardDescription>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-medium">
                        <Lock className="w-3 h-3" />
                        Secure
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <RadioGroup
                    value={method}
                    onValueChange={setMethod}
                    className="grid gap-4"
                >
                    {/* Credit/Debit Card Option */}
                    <div>
                        <RadioGroupItem
                            value="VISA"
                            id="card"
                            className="peer sr-only"
                        />
                        <Label
                            htmlFor="card"
                            className={cn(
                                "flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-muted/50",
                                method === "VISA" ? "border-primary bg-primary/5" : "border-muted"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-background rounded-lg border shadow-sm">
                                    <CreditCard className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold">Credit or Debit Card</p>
                                    <p className="text-xs text-muted-foreground">Visa, Mastercard, AMEX, JCB</p>
                                </div>
                            </div>

                            {/* Card Icons Group */}
                            <div className="flex gap-1 mt-3 md:mt-0 opacity-70">
                                <div className="w-8 h-5 bg-slate-200 rounded animate-pulse" title="Visa" />
                                <div className="w-8 h-5 bg-slate-200 rounded animate-pulse" title="Mastercard" />
                            </div>
                        </Label>
                    </div>

                    {/* PayPal Option */}
                    <div>
                        <RadioGroupItem
                            value="PAYPAL"
                            id="paypal"
                            className="peer sr-only"
                        />
                        <Label
                            htmlFor="paypal"
                            className={cn(
                                "flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-muted/50",
                                method === "PAYPAL" ? "border-primary bg-primary/5" : "border-muted"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-background rounded-lg border shadow-sm">
                                    <Wallet className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold">PayPal</p>
                                    <p className="text-xs text-muted-foreground">You will be redirected to PayPal</p>
                                </div>
                            </div>
                        </Label>
                    </div>
                </RadioGroup>

                {/* Additional Trust Message */}
                <p className="text-[12px] text-center text-muted-foreground">
                    Your transaction is encrypted and your payment details are never stored on our servers.
                </p>

                <Button
                    onClick={onNext}
                    className="w-full py-6 text-lg font-bold"
                >
                    Review Order
                </Button>
            </CardContent>
        </Card>
    );
}