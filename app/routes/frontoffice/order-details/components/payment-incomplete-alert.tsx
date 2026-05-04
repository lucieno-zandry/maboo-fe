import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PaymentIncompleteAlert() {
    const { t } = useTranslation("order-details");

    return (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <div>
                    <p className="font-semibold text-destructive">{t("paymentIncomplete.title")}</p>
                    <p className="text-sm text-destructive/80">
                        {t("paymentIncomplete.description")}
                    </p>
                </div>
            </div>
        </div>
    );
}