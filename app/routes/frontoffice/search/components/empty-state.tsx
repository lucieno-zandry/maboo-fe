import { useTranslation } from "react-i18next";
import { PackageSearch } from "lucide-react";

export function EmptyState({ hasFilters }: { hasFilters: boolean }) {
    const { t } = useTranslation("search");
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 rounded-full bg-muted p-6">
                <PackageSearch className="size-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{t("search.empty.title")}</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                {hasFilters ? t("search.empty.with_filters") : t("search.empty.no_products")}
            </p>
        </div>
    );
}