import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";
import PromotionBadge from "./promotion-badge";
import { useFormatMoney } from "~/lib/format-money";

type Props = {
    item: CartItem;
    onQuantityChange: (newCount: number) => void;
    onRemove: () => void;
    disabled?: boolean;
};

export default function CartItemRow({ item, onQuantityChange, onRemove, disabled }: Props) {
    const { t } = useTranslation("checkout");
    const formatMoney = useFormatMoney();
    const { product_snapshot, variant_snapshot, variant_options_snapshot, count, unit_price, promotion_discount_applied, total, applied_promotions_snapshot } = item;

    const variantOptionsText = Object.entries(variant_options_snapshot)
        .map(([group, value]) => `${group}: ${value}`)
        .join(", ");

    return (
        <div className="flex gap-4 py-4 sm:gap-6">
            {/* Thumbnail */}
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                {product_snapshot.main_image ? (
                    <img
                        src={product_snapshot.main_image}
                        alt={product_snapshot.title}
                        className="h-full w-full object-cover object-center"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
                        {t("cart.no_image")}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <h3 className="font-medium text-sm sm:text-base">{product_snapshot.title}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{variantOptionsText}</p>
                    <p className="text-xs text-muted-foreground">SKU: {variant_snapshot.sku}</p>
                </div>

                {/* Quantity stepper and remove */}
                <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled={disabled || count <= 1}
                            onClick={() => onQuantityChange(count - 1)}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{count}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled={disabled}
                            onClick={() => onQuantityChange(count + 1)}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        disabled={disabled}
                        onClick={onRemove}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Price breakdown */}
            <div className="flex flex-col items-end justify-between">
                <div className="text-sm font-semibold">{formatMoney(total)}</div>
                <div className="text-right text-xs text-muted-foreground">
                    {promotion_discount_applied > 0 && (
                        <span className="line-through mr-1">{formatMoney(unit_price)}</span>
                    )}
                    <span>{formatMoney(unit_price - promotion_discount_applied)}</span>
                </div>
                {/* Promotions badges */}
                {applied_promotions_snapshot && applied_promotions_snapshot.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1 justify-end">
                        {applied_promotions_snapshot.map((promo) => (
                            <PromotionBadge key={promo.id} promotion={promo} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}