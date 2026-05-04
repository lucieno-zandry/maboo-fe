// components/orders/EmptyOrdersState.tsx
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Package } from "lucide-react";
import appPathname from "~/lib/app-pathname";
import { useTranslation } from "react-i18next";

export function EmptyOrdersState() {
    const { t } = useTranslation('orders');

    return (
        <div className="container mx-auto p-10 text-center space-y-4">
            <Package className="w-16 h-16 mx-auto text-muted-foreground opacity-20" />
            <h2 className="text-2xl font-bold">{t("empty.title")}</h2>
            <p className="text-muted-foreground">{t("empty.description")}</p>
            <Button asChild>
                <Link to={appPathname("/products")}>{t("empty.cta")}</Link>
            </Button>
        </div>
    );
}