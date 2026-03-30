import { ImageOff, ShoppingCart, Tag, Zap } from "lucide-react";
import { toast } from "sonner";
import { addVariantToCart } from "~/api/http-requests";
import { useSearchStore } from "~/hooks/use-search-store";
import { cn } from "~/lib/utils";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import formatMoney from "~/lib/format-money";

interface ProductCardProps {
    product: Product;
}

export interface ProductCardViewProps {
    product: Product;
    viewMode: "grid" | "list";
    onAddToCart?: (variantId: number) => void;
}

// ─── Promotion badge pill ─────────────────────────────────────────────────────
function PromotionPill({ promotion }: { promotion: AppliedPromotion }) {
    const label =
        promotion.badge ||
        (promotion.type === "PERCENTAGE"
            ? `-${promotion.discount}%`
            : `-$${promotion.discount}`);

    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/90 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
            <Zap className="size-2.5" />
            {label}
        </span>
    );
}

// ─── Price display ────────────────────────────────────────────────────────────
function PriceDisplay({ variant }: { variant: Variant }) {
    const hasDiscount =
        variant.effective_price !== undefined &&
        variant.effective_price < variant.price;

    return (
        <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold tracking-tight text-foreground">
                {formatMoney(variant.effective_price ?? variant.price)}
            </span>
            {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                    {formatMoney(variant.price)}
                </span>
            )}
        </div>
    );
}

// ─── Image area ───────────────────────────────────────────────────────────────
function ProductImage({
    product,
    compact,
}: {
    product: Product;
    compact?: boolean;
}) {
    const firstImage = product.images?.[0];
    const promotions =
        product.variants?.flatMap((v) => v.applied_promotions ?? []) ?? [];

    return (
        <div
            className={cn(
                "relative overflow-hidden bg-muted",
                compact ? "h-44 w-full rounded-t-xl" : "h-52 w-36 shrink-0 rounded-l-xl"
            )}
        >
            {firstImage ? (
                <img
                    src={firstImage.url}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center">
                    <ImageOff className="size-8 text-muted-foreground/40" />
                </div>
            )}

            {/* Promotion badges stack */}
            {promotions.length > 0 && (
                <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                    {promotions.slice(0, 3).map((p) => (
                        <PromotionPill key={p.id} promotion={p} />
                    ))}
                </div>
            )}

            {/* Category pill */}
            {product.category && (
                <div className="absolute bottom-2 right-2">
                    <span className="rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium text-foreground/80 backdrop-blur-sm">
                        {product.category.title}
                    </span>
                </div>
            )}
        </div>
    );
}

// ─── Grid card ────────────────────────────────────────────────────────────────
function GridCard({ product, onAddToCart }: ProductCardViewProps) {
    const defaultVariant = product.variants?.[0];
    const allPromotions =
        product.variants?.flatMap((v) => v.applied_promotions ?? []) ?? [];
    const uniquePromotions = allPromotions.filter(
        (p, i, arr) => arr.findIndex((x) => x.id === p.id) === i
    );
    const isLowStock =
        defaultVariant && defaultVariant.stock > 0 && defaultVariant.stock <= 5;
    const isOutOfStock = defaultVariant && defaultVariant.stock === 0;

    return (
        <Card className="group relative flex flex-col overflow-hidden border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-border">
            <ProductImage product={product} compact />
            <CardContent className="flex flex-1 flex-col gap-3 p-4">
                {/* Title */}
                <div>
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                        {product.title}
                    </h3>
                    {product.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {product.description}
                        </p>
                    )}
                </div>

                {/* Promotions */}
                {uniquePromotions.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {uniquePromotions.map((p) => (
                            <PromotionPill key={p.id} promotion={p} />
                        ))}
                    </div>
                )}

                {/* Price + stock */}
                <div className="mt-auto flex items-end justify-between gap-2">
                    <div>
                        {defaultVariant ? (
                            <PriceDisplay variant={defaultVariant} />
                        ) : (
                            <span className="text-sm text-muted-foreground">No variants</span>
                        )}
                        {isLowStock && (
                            <p className="text-[10px] font-medium text-amber-500">
                                Only {defaultVariant!.stock} left
                            </p>
                        )}
                        {isOutOfStock && (
                            <p className="text-[10px] font-medium text-rose-500">
                                Out of stock
                            </p>
                        )}
                    </div>

                    {defaultVariant && !isOutOfStock && (
                        <Button
                            size="sm"
                            variant="default"
                            className="h-8 shrink-0 gap-1.5 text-xs"
                            onClick={() => onAddToCart?.(defaultVariant.id)}
                        >
                            <ShoppingCart className="size-3" />
                            Add
                        </Button>
                    )}
                </div>

                {/* Variant count */}
                {product.variants && product.variants.length > 1 && (
                    <p className="text-[10px] text-muted-foreground">
                        +{product.variants.length - 1} more variant
                        {product.variants.length > 2 ? "s" : ""}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

// ─── List card ────────────────────────────────────────────────────────────────
function ListCard({ product, onAddToCart }: ProductCardViewProps) {
    const defaultVariant = product.variants?.[0];
    const allPromotions =
        product.variants?.flatMap((v) => v.applied_promotions ?? []) ?? [];
    const uniquePromotions = allPromotions.filter(
        (p, i, arr) => arr.findIndex((x) => x.id === p.id) === i
    );
    const isLowStock =
        defaultVariant && defaultVariant.stock > 0 && defaultVariant.stock <= 5;
    const isOutOfStock = defaultVariant && defaultVariant.stock === 0;

    return (
        <Card className="group flex overflow-hidden border-border/60 bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:border-border">
            <ProductImage product={product} compact={false} />

            <CardContent className="flex flex-1 flex-col justify-between gap-3 p-4">
                <div>
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                            {product.title}
                        </h3>
                        {product.category && (
                            <Badge variant="secondary" className="shrink-0 text-[10px]">
                                <Tag className="mr-1 size-2.5" />
                                {product.category.title}
                            </Badge>
                        )}
                    </div>
                    {product.description && (
                        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                            {product.description}
                        </p>
                    )}
                </div>

                {/* Promotions */}
                {uniquePromotions.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {uniquePromotions.map((p) => (
                            <PromotionPill key={p.id} promotion={p} />
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between gap-4">
                    <div>
                        {defaultVariant ? (
                            <PriceDisplay variant={defaultVariant} />
                        ) : (
                            <span className="text-sm text-muted-foreground">No variants</span>
                        )}
                        {isLowStock && (
                            <p className="text-[10px] font-medium text-amber-500">
                                Only {defaultVariant!.stock} left
                            </p>
                        )}
                        {isOutOfStock && (
                            <p className="text-[10px] font-medium text-rose-500">
                                Out of stock
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {product.variants && product.variants.length > 1 && (
                            <span className="text-xs text-muted-foreground">
                                {product.variants.length} variants
                            </span>
                        )}
                        {defaultVariant && !isOutOfStock && (
                            <Button
                                size="sm"
                                variant="default"
                                className="h-8 gap-1.5 text-xs"
                                onClick={() => onAddToCart?.(defaultVariant.id)}
                            >
                                <ShoppingCart className="size-3" />
                                Add to cart
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ─── Public export ────────────────────────────────────────────────────────────
export function ProductCardView(props: ProductCardViewProps) {
    return props.viewMode === "grid" ? (
        <GridCard {...props} />
    ) : (
        <ListCard {...props} />
    );
}

export function ProductCard({ product }: ProductCardProps) {
    const viewMode = useSearchStore((s) => s.viewMode);

    const handleAddToCart = async (variantId: number) => {
        const { data, error } = await addVariantToCart({ variant_id: variantId, count: 1 });
        if (error) {
            toast.error("Couldn't add to cart. Please try again.");
        } else {
            toast.success("Added to cart!");
        }
    };

    return (
        <ProductCardView
            product={product}
            viewMode={viewMode}
            onAddToCart={handleAddToCart}
        />
    );
}