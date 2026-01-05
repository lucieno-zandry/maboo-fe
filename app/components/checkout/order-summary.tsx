import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getCouponFromCode } from "~/api/http-requests";
import formatMoney from "~/lib/format-money";
import { Card } from "../ui/card";
import Button from "../custom-components/button";
import { Input } from "../ui/input";
import { Loader2, TicketPercent, Tag, X } from "lucide-react";
import useCheckoutStore from "~/hooks/use-checkout-store";

type OrderSummaryContainerProps = {
    cartItems: CartItem[];
    itemsCount: number;
    subtotal: number;
    discountAmount: number;
    total: number;
};

export default function ({
    cartItems,
    itemsCount,
    subtotal,
    discountAmount,
    total
}: OrderSummaryContainerProps) {

    const { appliedCoupon, setAppliedCoupon } = useCheckoutStore();

    const [couponCode, setCouponCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Discount calculation


    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;

        setIsLoading(true);
        try {
            const res = await getCouponFromCode(couponCode);
            const coupon = res.data?.coupon;

            if (!coupon || !coupon.is_active) {
                toast.error("Invalid or inactive coupon code.");
            } else if (subtotal < coupon.min_order_value) {
                toast.error(
                    `Minimum order value for this coupon is ${formatMoney(
                        coupon.min_order_value
                    )}`
                );
            } else {
                setAppliedCoupon(coupon);
                toast.success(`Coupon "${coupon.code}" applied!`);
                setCouponCode("");
            }
        } catch {
            toast.error("Failed to fetch coupon. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        toast.info("Coupon removed.");
    };

    useEffect(() => {
        if (!appliedCoupon) return;

        const noLongerValid =
            appliedCoupon.min_order_value &&
            subtotal < appliedCoupon.min_order_value;

        if (noLongerValid) {
            setAppliedCoupon(null);

            toast.warning(
                `Coupon "${appliedCoupon.code}" was removed because your order no longer meets the minimum value of ${formatMoney(
                    appliedCoupon.min_order_value
                )}.`
            );
        }
    }, [subtotal, appliedCoupon, setAppliedCoupon]);


    return (
        <OrderSummary
            cartItems={cartItems}
            itemsCount={itemsCount}
            subtotal={subtotal}
            total={total}
            couponCode={couponCode}
            appliedCoupon={appliedCoupon}
            discountAmount={discountAmount}
            isLoading={isLoading}
            onCouponCodeChange={setCouponCode}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={removeCoupon}
        />
    );
}


type OrderSummaryViewProps = {
    cartItems: CartItem[];
    itemsCount: number;
    subtotal: number;
    total: number;

    couponCode: string;
    appliedCoupon: Coupon | null;
    discountAmount: number;
    isLoading: boolean;

    onCouponCodeChange: (value: string) => void;
    onApplyCoupon: () => void;
    onRemoveCoupon: () => void;
};

export function OrderSummary({
    cartItems,
    itemsCount,
    subtotal,
    total,
    couponCode,
    appliedCoupon,
    discountAmount,
    isLoading,
    onCouponCodeChange,
    onApplyCoupon,
    onRemoveCoupon,
}: OrderSummaryViewProps) {
    return (
        <Card className="sticky top-20 p-6 bg-muted/30 border-dashed space-y-6">
            <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    Order Summary
                </h3>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Items ({itemsCount} qty)
                        </span>
                        <span>{formatMoney(subtotal)}</span>
                    </div>

                    {appliedCoupon && (
                        <div className="flex justify-between text-emerald-600 animate-in fade-in slide-in-from-right-1">
                            <span className="flex items-center gap-1">
                                <TicketPercent className="w-4 h-4" />
                                Discount ({appliedCoupon.code})
                            </span>
                            <span>-{formatMoney(discountAmount)}</span>
                        </div>
                    )}

                    <div className="flex justify-between font-bold text-lg pt-4 border-t border-muted">
                        <span>Total</span>
                        <span className="text-primary">{formatMoney(total)}</span>
                    </div>
                </div>
            </div>

            {/* Coupon Section */}
            <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Have a coupon?
                </p>

                {!appliedCoupon ? (
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter code"
                            value={couponCode}
                            onChange={(e) =>
                                onCouponCodeChange(e.target.value.toUpperCase())
                            }
                            className="bg-background h-9 text-sm uppercase"
                            onKeyDown={(e) => e.key === "Enter" && onApplyCoupon()}
                        />
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={onApplyCoupon}
                            disabled={!couponCode}
                            isLoading={isLoading}
                            className="h-9 px-4"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Apply"
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between p-2 pl-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <div className="flex items-center gap-2 text-emerald-700">
                            <Tag className="w-3 h-3" />
                            <span className="text-sm font-bold uppercase">
                                {appliedCoupon.code}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onRemoveCoupon}
                            className="h-6 w-6 text-emerald-700 hover:bg-emerald-100"
                        >
                            <X className="w-3 h-3" />
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
}
