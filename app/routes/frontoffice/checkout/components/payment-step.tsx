// routes/checkout/components/payment-step.tsx
import { useTranslation } from "react-i18next";
import { Form } from "react-router";
import { CreditCard, ArrowLeft, Lock, Info } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import useCheckoutStore from "../stores/use-checkout-store";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

type PaymentMethodOption = {
    value: string;
    labelKey: string;
    requiresPhone: boolean;
    disabled?: boolean;
    disabledLabelKey?: string;
};

const paymentMethods: PaymentMethodOption[] = [
    { value: "card", labelKey: "payment.methods.card", requiresPhone: false, disabled: true, disabledLabelKey: "payment.coming_soon" },
    { value: "paypal", labelKey: "payment.methods.paypal", requiresPhone: false },
    // { value: "orangemoney", labelKey: "payment.methods.orangemoney", requiresPhone: true },
    // { value: "airtelmoney", labelKey: "payment.methods.airtelmoney", requiresPhone: true },
    // { value: "mvola", labelKey: "payment.methods.mvola", requiresPhone: true },
];

export default function PaymentStep() {
    const { t } = useTranslation("checkout");
    const { selectedAddressId, selectedShippingMethodId, paymentMethod, setPaymentMethod, setStep } = useCheckoutStore();
    const [phone, setPhone] = useState("");
    const [notes, setNotes] = useState("");

    const selectedMethodObj = paymentMethods.find(m => m.value === paymentMethod);
    const requiresPhone = selectedMethodObj?.requiresPhone ?? false;

    return (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CreditCard className="h-5 w-5" />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    {t("payment.title", "Payment Details")}
                </h1>
            </div>

            <Form method="post" className="space-y-8">
                <input type="hidden" name="address_id" value={selectedAddressId ?? ""} />
                <input type="hidden" name="shipping_method_id" value={selectedShippingMethodId ?? ""} />
                <input type="hidden" name="payment_method" value={paymentMethod ?? ""} />

                <div className="space-y-4">
                    <Label className="text-base font-semibold text-foreground flex items-center gap-2">
                        {t("payment.method", "Select Payment Method")}
                    </Label>

                    <RadioGroup
                        value={paymentMethod ?? ""}
                        onValueChange={(val) => {
                            const method = paymentMethods.find((m) => m.value === val);
                            if (!method?.disabled) {
                                setPaymentMethod(val);
                            }
                        }}
                        className="grid gap-3 sm:grid-cols-2"
                    >
                        {paymentMethods.map((method) => {
                            const isActive = paymentMethod === method.value;
                            return (
                                <Label
                                    key={method.value}
                                    className={cn(
                                        "relative flex flex-col items-start gap-2 rounded-2xl border-2 p-4 transition-all cursor-pointer",
                                        isActive
                                            ? "border-primary bg-primary/[0.03] shadow-sm"
                                            : "border-muted bg-muted/20 hover:bg-muted/40",
                                        method.disabled && "cursor-not-allowed opacity-60 grayscale-[0.5]"
                                    )}
                                >
                                    <div className="flex w-full items-center justify-between">
                                        <RadioGroupItem
                                            value={method.value}
                                            disabled={method.disabled}
                                            className={cn(isActive && "border-primary text-primary")}
                                        />
                                        {method.disabled && method.disabledLabelKey && (
                                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-tight">
                                                {t(method.disabledLabelKey)}
                                            </Badge>
                                        )}
                                    </div>
                                    <span className="mt-1 font-semibold text-foreground">{t(method.labelKey)}</span>
                                </Label>
                            );
                        })}
                    </RadioGroup>
                </div>

                {requiresPhone && (
                    <div className="space-y-2 animate-in zoom-in-95 duration-200">
                        <Label htmlFor="phone" className="text-sm font-medium">{t("payment.mobile_phone", "Mobile Money Phone Number")}</Label>
                        <div className="relative">
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="+237 6 00 00 00 00"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="h-12 rounded-xl bg-background pl-4 shadow-none"
                                required
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium">{t("payment.order_notes", "Order Notes (Optional)")}</Label>
                    <Textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        placeholder={t("payment.notes_placeholder", "Any instructions for delivery?")}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="rounded-xl bg-background p-4 shadow-none transition-all focus:ring-4 focus:ring-primary/5"
                    />
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-muted/30 p-4 text-xs text-muted-foreground">
                    <Info className="h-4 w-4 shrink-0 text-primary" />
                    <p className="leading-relaxed">
                        Your data is encrypted and secure. By proceeding, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>

                <div className="flex flex-col-reverse items-center justify-between gap-4 border-t pt-8 sm:flex-row">
                    <Button variant="ghost" type="button" className="w-full rounded-full sm:w-auto" onClick={() => setStep(2)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t("common.back_to_shipping", "Back to shipping")}
                    </Button>
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full rounded-full px-12 text-lg font-bold transition-transform hover:scale-[1.02] sm:w-auto"
                        disabled={!paymentMethod || !selectedAddressId || !selectedShippingMethodId}
                    >
                        <Lock className="mr-2 h-4 w-4" />
                        {t("payment.pay_now", "Complete Order")}
                    </Button>
                </div>
            </Form>
        </section>
    );
}