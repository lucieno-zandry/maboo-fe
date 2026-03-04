// app/components/product/trust-badges.tsx
import { Truck, ShieldCheck } from "lucide-react";

type Props = {
    t: (key: string) => string;
};

export function TrustBadges({ t }: Props) {
    return (
        <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                <Truck className="w-5 h-5 text-gray-400" />
                <div className="text-[11px] leading-tight font-bold text-gray-900">
                    {t("freeShipping")}
                    <br />
                    <span className="text-gray-400 font-medium">{t("freeShippingDesc")}</span>
                </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                <ShieldCheck className="w-5 h-5 text-gray-400" />
                <div className="text-[11px] leading-tight font-bold text-gray-900">
                    {t("warranty")}
                    <br />
                    <span className="text-gray-400 font-medium">{t("warrantyDesc")}</span>
                </div>
            </div>
        </div>
    );
}