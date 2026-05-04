// components/orders/OrdersHeader.tsx
import { useTranslation } from "react-i18next";

export function OrdersHeader() {
    const { t } = useTranslation("orders");

    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("header.title")}</h1>
            <p className="text-muted-foreground text-sm">{t("header.subtitle")}</p>
        </div>
    );
}
