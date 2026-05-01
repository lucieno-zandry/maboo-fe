// routes/checkout/components/order-summary.tsx
import { useTranslation } from "react-i18next";
import useCheckoutStore from "../stores/use-checkout-store";
import { useFormatMoney } from "~/lib/format-money";
import { useMemo } from "react";

type Props = {
    cartItems: CartItem[];
    coupon: Coupon | null;
};

export default function OrderSummary({ cartItems, coupon }: Props) {
    const { t } = useTranslation("checkout");
    const { shippingCost } = useCheckoutStore();
    const formatMoney = useFormatMoney();

    const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);

    const couponIsApplicable = useMemo(() => {
        return !!(coupon && subtotal >= coupon.min_order_value);
    }, [coupon, subtotal]);

    // Coupon discount calculated from coupon object (not order-level coupon_discount_applied yet)
    let couponDiscount = 0;

    if (coupon) {
        if (coupon.type === "FIXED_AMOUNT") {
            couponDiscount = Math.min(coupon.discount, subtotal);
        } else {
            couponDiscount = (subtotal * coupon.discount) / 100;
        }
        // Round to 2 decimals
        couponDiscount = Math.round(couponDiscount * 100) / 100;
    }

    if (!couponIsApplicable) {
        couponDiscount = 0;
    }

    const shipping = shippingCost ?? 0;
    const total = subtotal - couponDiscount + shipping;

    // Total weight calculation (optional)
    const totalWeightKg = cartItems.reduce((sum, item) => {
        const weight = item.variant_snapshot.weight_kg ?? 0;
        return sum + weight * item.count;
    }, 0);

    return (
        <div className="border rounded-xl p-6 bg-card">
            <h2 className="text-lg font-semibold mb-4">{t("summary.title")}</h2>
            <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t("summary.subtotal")}</dt>
                    <dd className="font-medium">{formatMoney(subtotal)}</dd>
                </div>

                {coupon && (
                    <div className="flex justify-between text-green-600">
                        <dt>
                            {t("summary.coupon")} ({coupon.code})
                        </dt>
                        <dd>-{formatMoney(couponDiscount)}</dd>
                    </div>
                )}

                <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t("summary.shipping")}</dt>
                    <dd className="font-medium">
                        {shippingCost !== null ? (
                            shippingCost === 0 ? (
                                <span className="text-green-600">{t("summary.free")}</span>
                            ) : (
                                formatMoney(shippingCost)
                            )
                        ) : (
                            <span className="text-muted-foreground">—</span>
                        )}
                    </dd>
                </div>

                {totalWeightKg > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                        <dt>{t("summary.weight")}</dt>
                        <dd>{totalWeightKg.toFixed(1)} kg</dd>
                    </div>
                )}

                <div className="pt-3 border-t flex justify-between text-base font-semibold">
                    <dt>{t("summary.total")}</dt>
                    <dd>{formatMoney(total)}</dd>
                </div>
            </dl>
        </div>
    );
}