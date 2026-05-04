import { Badge } from "~/components/ui/badge";
import { useTranslation } from "react-i18next";

const statusColor = {
    pending: "secondary",
    approved: "default",
    rejected: "destructive",
} as const;

export function RefundRequestBadge({ request }: { request: RefundRequest }) {
    const { t } = useTranslation("order-details");

    return (
        <div className="flex items-center justify-between text-xs">
            <span>{t("transactions.refundRequestAmount", { amount: request.amount })}</span>
            <Badge variant={statusColor[request.status] || "outline"}>{request.status}</Badge>
        </div>
    );
}