// routes/checkout/components/checkout-page-content.tsx (updated)
import { useTranslation } from "react-i18next";
import ProgressIndicator from "./progress-indicator";
import CartStep from "./cart-step";
import AddressStep from "./address-step";
import ShippingStep from "./shipping-step";
import OrderSummary from "./order-summary"; // we'll create later
import useCheckoutStore from "../stores/use-checkout-store";
import PaymentStep from "./payment-step";

type Props = {
    initialData: {
        cart_items: CartItem[];
        coupon: Coupon | null;
    };
};

export default function CheckoutPageContent({ initialData }: Props) {
    const { step } = useCheckoutStore();
    const { t } = useTranslation("checkout");

    const steps = [
        { label: t("steps.cart"), value: 0 },
        { label: t("steps.address"), value: 1 },
        { label: t("steps.shipping"), value: 2 },
        { label: t("steps.payment"), value: 3 },
    ];

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
            <ProgressIndicator steps={steps} current={step} />

            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
                <main>
                    {step === 0 && (
                        <CartStep cartItems={initialData.cart_items} coupon={initialData.coupon} />
                    )}
                    {step === 1 && <AddressStep />}
                    {step === 2 && <ShippingStep />}
                    {step === 3 && <PaymentStep />}
                </main>

                <aside className="hidden lg:block">
                    <OrderSummary cartItems={initialData.cart_items} coupon={initialData.coupon} />
                </aside>
            </div>

            <div className="mt-8 lg:hidden">
                <OrderSummary cartItems={initialData.cart_items} coupon={initialData.coupon} />
            </div>
        </div>
    );
}