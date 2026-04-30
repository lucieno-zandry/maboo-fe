// routes/checkout/components/cart-step.tsx
import { useTranslation } from "react-i18next";
import CartItemList from "./cart/cart-item-list";
import CouponSection from "./cart/coupon-section"; // will be created later
import { Button } from "~/components/ui/button";
import useCheckoutStore from "../stores/use-checkout-store";

type Props = {
    cartItems: CartItem[];
    coupon: Coupon | null;
};

export default function CartStep({ cartItems, coupon }: Props) {
    const { t } = useTranslation("checkout");
    const { setStep } = useCheckoutStore();

    return (
        <section>
            <h1 className="text-2xl font-bold tracking-tight mb-6">{t("cart.title")}</h1>
            <CartItemList items={cartItems} />
            <div className="mt-8">
                <CouponSection initialCoupon={coupon} />
            </div>
            <div className="mt-8 flex justify-end">
                <Button size="lg" onClick={() => setStep(1)}>
                    {t("cart.continue_to_address")}
                </Button>
            </div>
        </section>
    );
}