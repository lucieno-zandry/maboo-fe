import React, { useEffect } from "react";
import Button from "../custom-components/button";
import { removeCartItem, updateCartItem } from "~/api/http-requests";
import { toast } from "sonner";
import formatMoney from "~/lib/format-money";
import { useRefreshCart } from "~/hooks/use-cart";

export type CartSheetItemProps = {
    item: CartItem;
    onRemove: (itemId: number) => void;
    refreshCart: () => Promise<unknown>
}

let timeout: NodeJS.Timeout | null;

export default function ({ item, onRemove, refreshCart }: CartSheetItemProps) {
    const [count, setCount] = React.useState(item.count);

    const subtotal = React.useMemo(() => {
        return count * item.unit_price;
    }, [count, item.unit_price]);

    const onCountChange = React.useCallback((newCount: number) => {
        if (newCount < 1) return;

        setCount(newCount);
        if (timeout) clearTimeout(timeout);

        timeout = setTimeout(async () => {
            const loadingToast = toast.loading('Updating cart item...');

            await updateCartItem(item.id, { count: newCount });
            refreshCart()
                .then(() => {
                    toast.dismiss(loadingToast);
                    toast.success('Cart item updated.');
                })
                .finally(() => { timeout = null });
        }, 500);
    }, [item.id]);

    useEffect(() => {
        setCount(item.count);
    }, [item.count]);

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
                    <span className="text-xs opacity-60">No Image</span>
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

                <div className="text-sm mt-1">
                    Subtotal: {formatMoney(subtotal)}
                </div>

                <div className="flex items-center gap-2 mt-3">
                    <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={() => onCountChange(count - 1)}>
                        -
                    </Button>
                    <span className="text-sm w-6 text-center">{count}</span>
                    <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={() => onCountChange(count + 1)}>
                        +
                    </Button>
                </div>

                <Button
                    variant="ghost"
                    className="text-red-500 mt-2 px-0"
                    type="button"
                    onClick={() => onRemove(item.id)}>
                    Remove
                </Button>
            </div>
        </div>
    );
}