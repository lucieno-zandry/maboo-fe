// routes/checkout/components/payment-step.tsx
import { useTranslation } from "react-i18next";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import useCheckoutStore from "../stores/use-checkout-store";
import { Textarea } from "~/components/ui/textarea";

type PaymentMethodOption = {
    value: string;
    label: string;
    requiresPhone: boolean;
};

const paymentMethods: PaymentMethodOption[] = [
    { value: "card", label: "Credit / Debit Card", requiresPhone: false },
    { value: "paypal", label: "PayPal", requiresPhone: false },
    { value: "orangemoney", label: "Orange Money", requiresPhone: true },
    { value: "airtelmoney", label: "Airtel Money", requiresPhone: true },
    { value: "mvola", label: "MVola", requiresPhone: true },
];

export default function PaymentStep() {
    const { t } = useTranslation("checkout");
    const { selectedAddressId, selectedShippingMethodId, paymentMethod, setPaymentMethod } = useCheckoutStore();
    const [phone, setPhone] = useState("");
    const [notes, setNotes] = useState("");

    const selectedMethodObj = paymentMethods.find(m => m.value === paymentMethod);
    const requiresPhone = selectedMethodObj?.requiresPhone ?? false;

    return (
        <section>
            <h1 className="text-2xl font-bold tracking-tight mb-6">{t("payment.title")}</h1>

            <Form method="post" className="space-y-6">
                <input type="hidden" name="address_id" value={selectedAddressId ?? ""} />
                <input type="hidden" name="shipping_method_id" value={selectedShippingMethodId ?? ""} />
                <input type="hidden" name="payment_method" value={paymentMethod ?? ""} />

                <div>
                    <Label className="text-base font-semibold">{t("payment.method")}</Label>
                    <RadioGroup
                        value={paymentMethod ?? ""}
                        onValueChange={(val) => setPaymentMethod(val)}
                        className="mt-2 grid gap-2"
                    >
                        {paymentMethods.map((method) => (
                            <Label
                                key={method.value}
                                className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:bg-muted/20"
                            >
                                <RadioGroupItem value={method.value} />
                                <span>{method.label}</span>
                            </Label>
                        ))}
                    </RadioGroup>
                </div>

                {requiresPhone && (
                    <div>
                        <Label htmlFor="phone">{t("payment.mobile_phone")}</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+237 6 00 00 00 00"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="mt-1"
                        />
                    </div>
                )}

                <div>
                    <Label htmlFor="notes">{t("payment.order_notes")}</Label>
                    <Textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        placeholder={t("payment.notes_placeholder")}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-1"
                    />
                </div>

                <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={!paymentMethod || !selectedAddressId || !selectedShippingMethodId}
                >
                    {t("payment.pay_now")}
                </Button>
            </Form>
        </section>
    );
}