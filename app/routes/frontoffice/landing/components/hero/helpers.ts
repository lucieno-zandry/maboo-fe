// ----------------------------------------------------------------------------
// Promotion helpers
// ----------------------------------------------------------------------------
export function getPromotionBadge(variant: Variant): string | null {
    const promotions = variant.applied_promotions;
    if (!promotions?.length) return null;

    // Pick the most significant promotion (largest discount) for the badge
    const best = promotions.reduce((prev, curr) => {
        const prevValue = prev.type === "PERCENTAGE" ? prev.discount : prev.discount;
        const currValue = curr.type === "PERCENTAGE" ? curr.discount : curr.discount;
        return currValue > prevValue ? curr : prev;
    });

    if (best.type === "PERCENTAGE") {
        return `-${best.discount}%`;
    }
    // Fixed amount – show the badge from promotion if available, else a generic label
    return best.badge ?? `-${best.discount}€`;
}

export function getEffectivePrice(variant: Variant): number {
    if (variant.effective_price !== undefined) return variant.effective_price;

    let price = variant.price;
    const promotions = variant.applied_promotions;
    if (!promotions?.length) return price;

    // Sort by priority? For simplicity, apply in order (assume server already did correct)
    for (const promo of promotions) {
        if (promo.type === "PERCENTAGE") {
            price = price * (1 - promo.discount / 100);
        } else if (promo.type === "FIXED_AMOUNT") {
            price = Math.max(0, price - promo.discount);
        }
    }
    return price;
}

export function getOriginalPrice(variant: Variant): number | undefined {
    const effective = getEffectivePrice(variant);
    return effective < variant.price ? variant.price : undefined;
}

// ----------------------------------------------------------------------------
// Variant label helpers
// ----------------------------------------------------------------------------
export function getVariantLabel(variant: Variant): string {
    if (!variant.variant_options?.length) {
        return variant.sku;
    }
    return variant.variant_options
        .map((opt) => opt.value)
        .join(" / ");
}
