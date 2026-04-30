import { Badge } from "~/components/ui/badge";

export default function PromotionBadge({ promotion }: { promotion: AppliedPromotion }) {
    const discountText =
        promotion.type === "PERCENTAGE"
            ? `${promotion.discount}%`
            : `${promotion.discount} €`;

    return (
        <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
            {promotion.badge ?? promotion.name} ({discountText})
        </Badge>
    );
}