import React, { useEffect } from "react";
import Button from "../custom-components/button";
import { updateCartItem } from "~/api/http-requests";
import { toast } from "sonner";
import formatMoney from "~/lib/format-money";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

export type CartSheetItemProps = {
    item: CartItem;
    onRemove: (itemId: number) => void;
    refreshCart: () => Promise<unknown>
}

type CartItemProps = {
    item: CartItem;
    subtotal: number;
    count: number;
    formatMoney: (value: number) => string;
    onCountChange: (newCount: number) => void;
    onRemove: (itemId: number) => void;
    t: TFunction;
};

let timeout: NodeJS.Timeout | null;

export function CartItem({
    item,
    subtotal,
    count,
    formatMoney,
    onCountChange,
    onRemove,
    t
}: CartItemProps) {
    return (
        <div key={item.id} className="flex gap-3 rounded-xl border p-3">
            <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                {item.variant_snapshot.image ? (
                    <img
                        src={item.variant_snapshot.image}
                        alt={item.product_snapshot.title}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <span className="text-xs opacity-60">{t('common:noImage')}</span>
                )}
            </div>

            <div className="flex-1">
                <div className="font-medium text-sm">{item.product_snapshot.title}</div>

                <div className="text-xs opacity-70 mt-1">
                    {Object.entries(item.variant_options_snapshot).map(([group, value]) => (
                        <div key={group}>
                            {group}: {value}
                        </div>
                    ))}
                </div>

                <div className="text-sm font-semibold mt-2">
                    {formatMoney(item.unit_price)}
                </div>

                <div className="text-sm mt-1">{t('common:subtotal')}: {formatMoney(subtotal)}</div>

                <div className="flex items-center gap-2 mt-3">
                    <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={() => onCountChange(count - 1)}
                    >
                        -
                    </Button>
                    <span className="text-sm w-6 text-center">{count}</span>
                    <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={() => onCountChange(count + 1)}
                    >
                        +
                    </Button>
                </div>

                <Button
                    variant="ghost"
                    className="text-red-500 mt-2 px-0"
                    type="button"
                    onClick={() => onRemove(item.id)}
                >
                    {t('common:remove')}
                </Button>
            </div>
        </div>
    );
}


export default function ({ item, onRemove, refreshCart }: CartSheetItemProps) {
    const [count, setCount] = React.useState(item.count);

    const subtotal = React.useMemo(() => {
        return count * item.unit_price;
    }, [count, item.unit_price]);

    const { t } = useTranslation("common");

    const onCountChange = React.useCallback((newCount: number) => {
        if (newCount < 1) return;

        setCount(newCount);
        if (timeout) clearTimeout(timeout);

        timeout = setTimeout(async () => {
            const loadingToast = toast.loading(t('common:updatingCartItem'));

            await updateCartItem(item.id, { count: newCount });
            refreshCart()
                .then(() => {
                    toast.dismiss(loadingToast);
                    toast.success(t('common:cartItemUpdated'));
                })
                .finally(() => { timeout = null });
        }, 500);
    }, [item.id, t]);
    useEffect(() => {
        setCount(item.count);
    }, [item.count]);

    return <CartItem
        item={item}
        subtotal={subtotal}
        count={count}
        formatMoney={formatMoney}
        onCountChange={onCountChange}
        onRemove={onRemove}
        t={t} />
}