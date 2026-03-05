// app/components/product/product-info.tsx
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import formatMoney from "~/lib/format-money";
import { CheckCircle2, Tag } from "lucide-react";

type Props = {
    title: string;
    categoryTitle?: string;
    unitPrice: number;
    originalPrice?: number;
    stock: number;
    appliedPromotions?: AppliedPromotion[];
    t: (key: string) => string;
};

export function ProductInfo({
    title,
    categoryTitle,
    unitPrice,
    originalPrice,
    stock,
    appliedPromotions = [],
    t,
}: Props) {
    const inStock = stock > 0;
    const hasDiscount = originalPrice !== undefined && unitPrice < originalPrice;
    const discountPercent = hasDiscount && originalPrice
        ? Math.round(((originalPrice - unitPrice) / originalPrice) * 100)
        : 0;

    return (
        <header className="space-y-4">
            {categoryTitle && (
                <Badge variant="outline" className="rounded-full px-4 py-1 text-gray-500 border-gray-200">
                    {categoryTitle}
                </Badge>
            )}
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                {title}
            </h1>

            <div className="flex items-center gap-4">
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                        {formatMoney(unitPrice)}
                    </span>
                    {hasDiscount && (
                        <span className="text-xl text-gray-400 line-through">
                            {formatMoney(originalPrice)}
                        </span>
                    )}
                </div>
                <Separator orientation="vertical" className="h-6" />
                <span
                    className={cn(
                        "text-sm font-semibold flex items-center gap-1.5",
                        inStock ? "text-emerald-600" : "text-red-500"
                    )}
                >
                    {inStock ? (
                        <>
                            <CheckCircle2 className="w-4 h-4" /> {t("inStock")}
                        </>
                    ) : (
                        t("outOfStock")
                    )}
                </span>
            </div>

            {/* Promotion badges */}
            {appliedPromotions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {hasDiscount && discountPercent > 0 && (
                        <Badge className="bg-red-500 text-white border-none px-3 py-1 text-sm font-bold">
                            -{discountPercent}%
                        </Badge>
                    )}
                    {appliedPromotions.map((promo) => (
                        <Badge
                            key={promo.id}
                            variant="secondary"
                            className="flex items-center gap-1 px-3 py-1 text-xs font-medium"
                        >
                            <Tag className="w-3 h-3" />
                            {promo.badge || promo.name}
                        </Badge>
                    ))}
                </div>
            )}
        </header>
    );
}