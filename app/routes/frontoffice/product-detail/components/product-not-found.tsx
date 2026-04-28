// routes/frontoffice/product-detail/components/product-not-found.tsx

import { useTranslation } from "react-i18next";

export function ProductNotFound() {
    const { t } = useTranslation("product-detail");
    return <div>{t("notFound.title")}</div>;
}