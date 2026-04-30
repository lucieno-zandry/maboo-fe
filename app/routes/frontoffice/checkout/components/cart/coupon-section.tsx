// routes/checkout/components/coupon-section.tsx
import { useState } from "react";
import { useRevalidator } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { getCouponFromCode, unuseCoupon } from "~/api/http-requests";
import { toast } from "sonner";
import { HttpException } from "~/api/app-fetch";

type CouponSectionSmartProps = {
    initialCoupon: Coupon | null;
};

type CouponSectionViewProps = {
    coupon: Coupon | null;
    codeInput: string;
    onCodeChange: (val: string) => void;
    onApply: () => void;
    onRemove: () => void;
    loading: boolean;
};

// Dumb
function CouponSectionView({ coupon, codeInput, onCodeChange, onApply, onRemove, loading }: CouponSectionViewProps) {
    const { t } = useTranslation("checkout");

    return (
        <div className="border rounded-xl p-4 bg-muted/30">
            <p className="text-sm font-medium mb-3">{t("coupon.label")}</p>
            {coupon ? (
                <div className="flex items-center justify-between">
                    <div>
                        <span className="font-semibold">{coupon.code}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                            ({coupon.type === "PERCENTAGE" ? `${coupon.discount}%` : `${coupon.discount} €`})
                        </span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onRemove} disabled={loading}>
                        {t("coupon.remove")}
                    </Button>
                </div>
            ) : (
                <div className="flex gap-2">
                    <Input
                        placeholder={t("coupon.code_placeholder")}
                        value={codeInput}
                        onChange={(e) => onCodeChange(e.target.value)}
                        className="h-9"
                    />
                    <Button size="sm" onClick={onApply} disabled={loading || !codeInput.trim()}>
                        {t("coupon.apply")}
                    </Button>
                </div>
            )}
        </div>
    );
}

// Smart
export default function CouponSection({ initialCoupon }: CouponSectionSmartProps) {
    const revalidator = useRevalidator();
    const [codeInput, setCodeInput] = useState("");
    const [coupon, setCoupon] = useState<Coupon | null>(initialCoupon);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation("checkout");

    const handleApply = async () => {
        if (!codeInput.trim()) return;
        setLoading(true);
        try {
            await getCouponFromCode(codeInput.trim().toUpperCase());
            revalidator.revalidate(); // reload loader, which reads new coupon cookie
            // The coupon might be returned, but we rely on revalidation
            toast.success(t("coupon.applied_success"));
        } catch (err) {
            if (err instanceof HttpException) {
                toast.error(err.data?.message || t("coupon.invalid"));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async () => {
        setLoading(true);
        try {
            await unuseCoupon();
            revalidator.revalidate();
            toast.success(t("coupon.removed_success"));
        } catch (err) {
            if (err instanceof HttpException) {
                toast.error(err.data?.message || "Failed to remove coupon");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <CouponSectionView
            coupon={coupon}
            codeInput={codeInput}
            onCodeChange={setCodeInput}
            onApply={handleApply}
            onRemove={handleRemove}
            loading={loading}
        />
    );
}