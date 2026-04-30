// routes/frontoffice/product-detail/components/product-not-found.tsx

import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { PackageSearch, ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";

export function ProductNotFound() {
    const { t } = useTranslation("product-detail");
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-100">
                <PackageSearch className="h-10 w-10 text-neutral-400" />
            </div>
            <div className="space-y-2">
                <h2
                    className="text-2xl font-bold text-neutral-800"
                    style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                    {t("notFound.title")}
                </h2>
                <p className="text-neutral-400 text-sm max-w-xs mx-auto">
                    {t("notFound.description", "This product doesn't exist or may have been removed.")}
                </p>
            </div>
            <Button asChild variant="outline" className="rounded-xl gap-2">
                <Link to="/">
                    <ArrowLeft className="h-4 w-4" />
                    {t("notFound.backHome", "Back to Home")}
                </Link>
            </Button>
        </div>
    );
}