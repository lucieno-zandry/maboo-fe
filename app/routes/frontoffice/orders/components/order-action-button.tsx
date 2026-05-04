// components/orders/OrderActionButton.tsx
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";
import appPathname from "~/lib/app-pathname";
import { useTranslation } from "react-i18next";

interface OrderActionButtonProps {
    orderUuid: string;
    requiresReview: boolean;
}

export function OrderActionButton({ orderUuid, requiresReview }: OrderActionButtonProps) {
    const { t } = useTranslation("orders");

    if (requiresReview) {
        return (
            <Button size="sm" className="w-full text-xs gap-2 group" asChild>
                <Link to={appPathname(`/orders/${orderUuid}`)}>
                    {t("actions.reviewAndPay")}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
            </Button>
        );
    }

    return (
        <Button variant="outline" size="sm" className="w-full text-xs text-muted-foreground" asChild>
            <Link to={appPathname(`/orders/${orderUuid}`)}>{t("actions.viewOrder")}</Link>
        </Button>
    );
}