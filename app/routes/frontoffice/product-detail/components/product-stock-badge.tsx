// routes/frontoffice/product-detail/components/product-stock-badge.tsx

import { Badge } from "~/components/ui/badge";
import { useTranslation } from "react-i18next";

// ── Dumb (View) ──────────────────────────────────────────────────────────────
interface ProductStockBadgeViewProps {
    stock: number;
    isLowStock: boolean;
    isOutOfStock: boolean;
    // Translated strings
    outOfStockLabel: string;
    onlyLeftTemplate: string;
    lowStockMessage: string;
    inStockTemplate: string;
}

export function ProductStockBadgeView({
    stock,
    isLowStock,
    isOutOfStock,
    outOfStockLabel,
    onlyLeftTemplate,
    lowStockMessage,
    inStockTemplate,
}: ProductStockBadgeViewProps) {
    if (isOutOfStock) {
        return <Badge variant="destructive">{outOfStockLabel}</Badge>;
    }

    if (isLowStock) {
        return (
            <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{onlyLeftTemplate.replace("{{stock}}", String(stock))}</Badge>
                <span className="text-sm text-muted-foreground">{lowStockMessage}</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {inStockTemplate.replace("{{stock}}", String(stock))}
            </Badge>
        </div>
    );
}

// ── Smart (Container) ────────────────────────────────────────────────────────
interface ProductStockBadgeProps {
    variant: Variant | null;
    lowStockThreshold?: number;
}

export function ProductStockBadge({
    variant,
    lowStockThreshold = 5,
}: ProductStockBadgeProps) {
    const { t } = useTranslation("product-detail");

    if (!variant) return null;

    const stock = variant.stock;
    const isOutOfStock = stock <= 0;
    const isLowStock = stock > 0 && stock <= lowStockThreshold;

    return (
        <ProductStockBadgeView
            stock={stock}
            isLowStock={isLowStock}
            isOutOfStock={isOutOfStock}
            outOfStockLabel={t("stock.outOfStock")}
            onlyLeftTemplate={t("stock.onlyLeft")}
            lowStockMessage={t("stock.lowStockMessage")}
            inStockTemplate={t("stock.inStock")}
        />
    );
}