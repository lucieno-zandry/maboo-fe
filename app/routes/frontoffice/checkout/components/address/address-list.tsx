// routes/checkout/components/address/address-list.tsx
import { useTranslation } from "react-i18next";
import { cn } from "~/lib/utils";
import { Check } from "lucide-react";

type Props = {
    addresses: Address[];
    selectedId: number | null;
    onSelect: (id: number) => void;
};

export default function AddressList({ addresses, selectedId, onSelect }: Props) {
    const { t } = useTranslation("checkout");

    if (addresses.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground border rounded-xl">
                {t("address.no_addresses")}
            </div>
        );
    }

    return (
        <ul className="grid gap-3">
            {addresses.map((addr) => (
                <li key={addr.id}>
                    <button
                        type="button"
                        className={cn(
                            "w-full text-left border rounded-xl p-4 transition-colors hover:border-primary/50",
                            selectedId === addr.id
                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                : "border-border"
                        )}
                        onClick={() => onSelect(addr.id)}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-semibold">{addr.recipient_name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {addr.line1}, {addr.line2 && addr.line2 + ", "}{addr.city}, {addr.state} {addr.postal_code}, {addr.country}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {addr.phone}
                                    {addr.phone_alt && ` / ${addr.phone_alt}`}
                                </p>
                                {addr.label && (
                                    <span className="mt-1 inline-block text-xs bg-muted px-2 py-0.5 rounded-full">
                                        {addr.label}
                                    </span>
                                )}
                            </div>
                            {selectedId === addr.id && (
                                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            )}
                        </div>
                    </button>
                </li>
            ))}
        </ul>
    );
}