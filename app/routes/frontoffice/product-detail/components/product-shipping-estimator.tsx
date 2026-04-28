// routes/frontoffice/product-detail/components/product-shipping-estimator.tsx

import { useEffect, useState } from "react";
import { fetchAvailableShippingMethods } from "~/api/http-requests";
import { useAddresses } from "../hooks/use-addresses";
import { useFormatMoney } from "~/lib/format-money";
import { useTranslation } from "react-i18next";

// ── Dumb (View) ──────────────────────────────────────────────────────────────
interface ShippingOption {
    method: ShippingMethod;
    cost: number;
    isFree: boolean;
}

interface ProductShippingEstimatorViewProps {
    options: ShippingOption[];
    loading: boolean;
    formatMoney: (n?: number) => string;
    location?: { country: string; city: string };
    variant?: Variant | null;
    // Translated strings
    selectVariantMessage: string;
    noShippingMessage: string;
    shippingTitle: string;
    toLocationTemplate: string;
    freeLabel: string;
    deliveryDaysTemplate: string;
}

export function ProductShippingEstimatorView({
    options,
    loading,
    formatMoney,
    location,
    variant,
    selectVariantMessage,
    noShippingMessage,
    shippingTitle,
    toLocationTemplate,
    freeLabel,
    deliveryDaysTemplate,
}: ProductShippingEstimatorViewProps) {
    if (!variant) {
        return <p className="text-sm text-muted-foreground">{selectVariantMessage}</p>;
    }

    if (loading) {
        return (
            <div className="animate-pulse space-y-2">
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-4 w-1/2 rounded bg-muted" />
            </div>
        );
    }

    if (!options.length) {
        return <p className="text-sm text-destructive">{noShippingMessage}</p>;
    }

    return (
        <div className="space-y-3 rounded-lg border bg-card p-4 sm:p-5">
            <h3 className="text-sm font-semibold">{shippingTitle}</h3>
            {location && (
                <p className="text-xs text-muted-foreground">
                    {toLocationTemplate.replace("{{city}}", location.city).replace("{{country}}", location.country)}
                </p>
            )}
            <ul className="space-y-2">
                {options.map((opt) => (
                    <li key={opt.method.id} className="flex items-start justify-between gap-3 text-sm">
                        <div className="flex flex-col">
                            <span className="font-medium">{opt.method.name}</span>
                            <span className="text-xs text-muted-foreground">
                                {deliveryDaysTemplate
                                    .replace("{{min}}", String(opt.method.min_delivery_days ?? "?"))
                                    .replace("{{max}}", String(opt.method.max_delivery_days ?? "?"))}
                            </span>
                        </div>
                        <span className={`shrink-0 ${opt.isFree ? "font-medium text-green-600" : ""}`}>
                            {opt.isFree ? freeLabel : formatMoney(opt.cost)}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// ── Smart (Container) ────────────────────────────────────────────────────────
interface ProductShippingEstimatorProps {
    variant: Variant | null;
    quantity?: number;
}

export function ProductShippingEstimator({ variant, quantity = 1 }: ProductShippingEstimatorProps) {
    const { t } = useTranslation("product-detail");
    const [options, setOptions] = useState<ShippingOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState<{ country: string; city: string } | undefined>();
    const formatMoney = useFormatMoney();
    const { addresses } = useAddresses();

    useEffect(() => {
        if (!variant) {
            setOptions([]);
            return;
        }

        const defaultAddress = addresses?.find((a) => a.is_default);

        const cartItemPayload = {
            weight: (variant.weight_kg ?? 0) * quantity,
            quantity,
            price: (variant.effective_price ?? variant.price) * quantity,
        };

        setLoading(true);
        fetchAvailableShippingMethods({
            address_id: defaultAddress?.id,
            cart_items: [cartItemPayload],
        })
            .then((res) => {
                if (res.data?.available) {
                    const opts = res.data.available.map((item) => ({
                        method: item.method,
                        cost: item.cost,
                        isFree: item.cost === 0,
                    }));
                    setOptions(opts);
                    setLocation(res.data.location);
                } else {
                    setOptions([]);
                }
            })
            .catch(() => setOptions([]))
            .finally(() => setLoading(false));
    }, [variant?.weight_kg, quantity, addresses, variant]);

    return (
        <ProductShippingEstimatorView
            options={options}
            loading={loading}
            formatMoney={formatMoney}
            location={location}
            variant={variant}
            selectVariantMessage={t("shipping.selectVariant")}
            noShippingMessage={t("shipping.noShipping")}
            shippingTitle={t("shipping.title")}
            toLocationTemplate={t("shipping.toLocation")}
            freeLabel={t("shipping.free")}
            deliveryDaysTemplate={t("shipping.deliveryDays")}
        />
    );
}