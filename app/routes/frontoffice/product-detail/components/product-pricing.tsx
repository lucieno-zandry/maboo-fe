// routes/frontoffice/product-detail/components/product-pricing.tsx
import { useEffect, useMemo, useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { getCouponFromCode } from "~/api/http-requests";
import { HttpException } from "~/api/app-fetch";
import { useFormatMoney } from "~/lib/format-money";
import { useTranslation } from "react-i18next";
import type { ShippingOption } from "../types/shipping";
import { Tag, X, Clock, Percent, Truck, ChevronDown, ChevronUp } from "lucide-react";

// ── Dumb (View) ──────────────────────────────────────────────────────────────
interface ProductPricingViewProps {
    originalPrice: number;
    effectivePrice: number;
    promotions: Promotion[];
    countdowns: Record<number, string>;
    couponCode: string;
    onCouponChange: (code: string) => void;
    onCouponApply: () => void;
    onCouponRemove: () => void;
    couponError?: string;
    appliedCoupon?: Coupon | null;
    couponIsApplicable: boolean;
    isApplyingCoupon: boolean;
    subTotal: number;
    shippingCost: number;
    discountAmount: number;
    total: number;
    formatMoney: (n?: number, fractionDigits?: number) => string;
    // Translated strings
    activePromotionsLabel: string;
    haveCouponLabel: string;
    enterCodePlaceholder: string;
    applyButton: string;
    applyingButton: string;
    couponAppliedTemplate: string;
    removeButton: string;
    percentOffTemplate: string;
    amountOffTemplate: string;
    endsInTemplate: string;
    selectVariantMessage: string;
    couponNotApplicableWarning: string;
    subtotalLabel: string;
    shippingLabel: string;
    discountLabel: string;
    totalLabel: string;
}

export function ProductPricingView({
    originalPrice,
    effectivePrice,
    promotions,
    countdowns,
    couponCode,
    onCouponChange,
    onCouponApply,
    onCouponRemove,
    couponError,
    appliedCoupon,
    couponIsApplicable,
    isApplyingCoupon,
    subTotal,
    shippingCost,
    discountAmount,
    total,
    formatMoney,
    activePromotionsLabel,
    haveCouponLabel,
    enterCodePlaceholder,
    applyButton,
    applyingButton,
    couponAppliedTemplate,
    removeButton,
    percentOffTemplate,
    amountOffTemplate,
    endsInTemplate,
    couponNotApplicableWarning,
    subtotalLabel,
    shippingLabel,
    discountLabel,
    totalLabel,
}: ProductPricingViewProps) {
    const hasDiscount = effectivePrice < originalPrice;
    const discountPercent = hasDiscount
        ? Math.round(((originalPrice - effectivePrice) / originalPrice) * 100)
        : 0;
    const [showBreakdown, setShowBreakdown] = useState(false);

    return (
        <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
            {/* Price section */}
            <div className="p-4 sm:p-5 border-b border-neutral-100">
                <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                    <span className="text-3xl font-bold text-neutral-900 sm:text-4xl tracking-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                        {formatMoney(effectivePrice)}
                    </span>
                    {hasDiscount && (
                        <>
                            <span className="text-lg text-neutral-400 line-through">
                                {formatMoney(originalPrice)}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                                <Percent className="h-3 w-3" />
                                {discountPercent}% OFF
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Active promotions */}
            {promotions.length > 0 && (
                <div className="px-4 py-3 sm:px-5 bg-amber-50 border-b border-amber-100">
                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">{activePromotionsLabel}</p>
                    <ul className="space-y-1.5">
                        {promotions.map((promo) => (
                            <li key={promo.id} className="flex flex-wrap items-center gap-2 text-sm text-amber-900">
                                <span className="font-medium">{promo.badge || promo.name}</span>
                                <span className="text-amber-700">
                                    {promo.type === "PERCENTAGE"
                                        ? percentOffTemplate.replace("{{percent}}", String(promo.discount))
                                        : amountOffTemplate.replace("{{money}}", formatMoney(promo.discount))}
                                </span>
                                {countdowns[promo.id] && (
                                    <span className="flex items-center gap-1 text-xs text-amber-600">
                                        <Clock className="h-3 w-3" />
                                        {endsInTemplate.replace("{{time}}", countdowns[promo.id])}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Coupon section */}
            <div className="p-4 sm:p-5 border-b border-neutral-100">
                <p className="text-sm font-medium text-neutral-700 mb-2.5 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-neutral-400" />
                    {haveCouponLabel}
                </p>
                <div className="flex gap-2">
                    <Input
                        placeholder={enterCodePlaceholder}
                        value={couponCode}
                        onChange={(e) => onCouponChange(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !appliedCoupon && onCouponApply()}
                        className="flex-1 font-mono text-sm uppercase tracking-widest rounded-xl border-neutral-200 focus:border-amber-400 focus:ring-amber-100"
                        disabled={!!appliedCoupon}
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onCouponApply}
                        disabled={!couponCode || isApplyingCoupon || !!appliedCoupon}
                        className="shrink-0 rounded-xl border-neutral-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                    >
                        {isApplyingCoupon ? applyingButton : applyButton}
                    </Button>
                </div>
                {couponError && (
                    <p className="text-xs text-red-500 mt-1.5">{couponError}</p>
                )}
                {appliedCoupon && (
                    <div className="mt-2.5 flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2">
                        <div className={`text-sm flex items-center gap-2 ${couponIsApplicable ? "text-emerald-700" : "text-neutral-500"}`}>
                            <Tag className="h-3.5 w-3.5" />
                            <span className="font-mono font-medium">{couponAppliedTemplate.replace("{{code}}", appliedCoupon.code)}</span>
                            {!couponIsApplicable && (
                                <span className="text-xs text-red-500 ml-1">({couponNotApplicableWarning})</span>
                            )}
                        </div>
                        <button
                            onClick={onCouponRemove}
                            className="text-neutral-400 hover:text-neutral-600 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Order summary */}
            <div className="p-4 sm:p-5">
                <button
                    className="flex w-full items-center justify-between text-sm font-medium text-neutral-700 mb-3"
                    onClick={() => setShowBreakdown((v) => !v)}
                >
                    <span className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-neutral-400" />
                        {subtotalLabel}
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="text-neutral-500">{formatMoney(subTotal)}</span>
                        {showBreakdown ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
                    </span>
                </button>

                {showBreakdown && (
                    <div className="space-y-2 text-sm mb-3 pl-1">
                        {shippingCost > 0 && (
                            <div className="flex justify-between text-neutral-500">
                                <span>{shippingLabel}</span>
                                <span>{formatMoney(shippingCost)}</span>
                            </div>
                        )}
                        {couponIsApplicable && discountAmount > 0 && (
                            <div className="flex justify-between text-emerald-600 font-medium">
                                <span>{discountLabel}</span>
                                <span>−{formatMoney(discountAmount)}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between rounded-xl bg-neutral-900 text-white px-4 py-3">
                    <span className="text-sm font-medium opacity-80">{totalLabel}</span>
                    <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                        {formatMoney(total)}
                    </span>
                </div>
            </div>
        </div>
    );
}

// ── Smart (Container) ────────────────────────────────────────────────────────
interface ProductPricingProps {
    variant: Variant | null;
    couponCode: string;
    setCouponCode: (coupon: string) => void;
    quantity: number;
    selectedOption: ShippingOption | null;
}

function formatCountdown(endDate: string): string {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    if (days > 0) return `${days}d ${hours}h`;
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

export function ProductPricing({ variant, couponCode, setCouponCode, quantity, selectedOption }: ProductPricingProps) {
    const { t } = useTranslation("product-detail");
    const [couponError, setCouponError] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [countdowns, setCountdowns] = useState<Record<number, string>>({});
    const formatMoney = useFormatMoney();

    const subTotal = useMemo(() => {
        if (!variant) return 0;
        return (variant.effective_price ?? variant.price) * quantity;
    }, [variant, quantity]);

    const couponIsApplicable = useMemo(() => {
        return !!(appliedCoupon && subTotal >= appliedCoupon.min_order_value);
    }, [appliedCoupon, subTotal]);

    const discountAmount = useMemo(() => {
        return couponIsApplicable && appliedCoupon ? appliedCoupon.discount : 0;
    }, [couponIsApplicable, appliedCoupon]);

    const shippingCost = useMemo(() => {
        return selectedOption ? selectedOption.cost : 0;
    }, [selectedOption]);

    const total = useMemo(() => {
        const finalTotal = subTotal - discountAmount + shippingCost;
        return finalTotal < 0 ? 0 : finalTotal;
    }, [subTotal, discountAmount, shippingCost]);

    useEffect(() => {
        if (couponError) setCouponError("");
    }, [variant?.id, couponCode]);

    useEffect(() => {
        if (!variant?.applied_promotions) return;
        const update = () => {
            const newCountdowns: Record<number, string> = {};
            variant.applied_promotions!.forEach((promo) => {
                const raw = formatCountdown(promo.end_date);
                newCountdowns[promo.id] = raw === "Expired" ? t("pricing.expired") : raw;
            });
            setCountdowns(newCountdowns);
        };
        update();
        const timer = setInterval(update, 1000 * 60);
        return () => clearInterval(timer);
    }, [variant, t]);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsApplyingCoupon(true);
        setCouponError("");
        try {
            const response = await getCouponFromCode(couponCode.trim());
            if (response.data?.coupon) {
                setAppliedCoupon(response.data.coupon);
                toast.success(t("pricing.couponApplied", { code: response.data.coupon.code }));
            } else {
                setCouponError(t("pricing.invalidCoupon"));
            }
        } catch (e) {
            if (e instanceof HttpException) {
                setCouponError(e.data?.message || t("pricing.failedApplyCoupon"));
            } else {
                setCouponError(t("pricing.genericError"));
            }
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
    };

    if (!variant) {
        return (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-5 text-sm text-neutral-400 text-center">
                {t("pricing.selectVariant")}
            </div>
        );
    }

    return (
        <ProductPricingView
            originalPrice={variant.price}
            effectivePrice={variant.effective_price ?? variant.price}
            promotions={variant.applied_promotions ?? []}
            countdowns={countdowns}
            couponCode={couponCode}
            onCouponChange={setCouponCode}
            onCouponApply={handleApplyCoupon}
            onCouponRemove={handleRemoveCoupon}
            couponError={couponError}
            appliedCoupon={appliedCoupon}
            couponIsApplicable={couponIsApplicable}
            isApplyingCoupon={isApplyingCoupon}
            subTotal={subTotal}
            shippingCost={shippingCost}
            discountAmount={discountAmount}
            total={total}
            formatMoney={formatMoney}
            activePromotionsLabel={t("pricing.activePromotions")}
            haveCouponLabel={t("pricing.haveCoupon")}
            enterCodePlaceholder={t("pricing.enterCode")}
            applyButton={t("pricing.apply")}
            applyingButton={t("pricing.applying")}
            couponAppliedTemplate={t("pricing.couponApplied")}
            removeButton={t("pricing.removeCoupon")}
            percentOffTemplate={t("pricing.percentOff")}
            amountOffTemplate={t("pricing.amountOff")}
            endsInTemplate={t("pricing.endsIn")}
            selectVariantMessage={t("pricing.selectVariant")}
            couponNotApplicableWarning={t("pricing.couponNotApplicable", "Not applicable for this order amount")}
            subtotalLabel={t("pricing.subtotal", "Subtotal")}
            shippingLabel={t("pricing.shippingLabel", "Shipping")}
            discountLabel={t("pricing.discountLabel", "Discount")}
            totalLabel={t("pricing.totalLabel", "Total")}
        />
    );
}