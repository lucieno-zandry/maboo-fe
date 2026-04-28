// routes/frontoffice/product-detail/components/product-share.tsx

import { Button } from "~/components/ui/button";
import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useAppPathname } from "~/lib/app-pathname";
import isCsr from "~/lib/is-csr";
import { useTranslation } from "react-i18next";

// ── Dumb (View) ──────────────────────────────────────────────────────────────
interface ProductShareViewProps {
    onShare: () => void;
    onCopyLink: () => void;
    shareLabel: string;
    copyLinkLabel: string;
}

export function ProductShareView({ onShare, onCopyLink, shareLabel, copyLinkLabel }: ProductShareViewProps) {
    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button variant="outline" size="sm" onClick={onShare} className="w-full sm:w-auto">
                <Share2 className="h-4 w-4 mr-1" />
                {shareLabel}
            </Button>
            <Button variant="outline" size="sm" onClick={onCopyLink} className="w-full sm:w-auto">
                <Copy className="h-4 w-4 mr-1" />
                {copyLinkLabel}
            </Button>
        </div>
    );
}

// ── Smart (Container) ────────────────────────────────────────────────────────
interface ProductShareProps {
    product: Product;
}

export function ProductShare({ product }: ProductShareProps) {
    const { t } = useTranslation("product-detail");
    const appPath = useAppPathname();

    if (!isCsr()) return null;

    const fullUrl = location.origin + appPath(`/product/${product.slug}`);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.title,
                url: fullUrl,
            }).catch(() => { });
        } else {
            handleCopyLink();
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(fullUrl).then(() => {
            toast.success(t("share.copySuccess"));
        }).catch(() => {
            toast.error(t("share.copyFailed"));
        });
    };

    return (
        <ProductShareView
            onShare={handleShare}
            onCopyLink={handleCopyLink}
            shareLabel={t("share.share")}
            copyLinkLabel={t("share.copyLink")}
        />
    );
}