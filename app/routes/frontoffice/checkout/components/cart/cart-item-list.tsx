// routes/checkout/components/cart/cart-item-list.ts
import CartItemRow from "./cart-item-row";
import { useRevalidator } from "react-router";
import { removeCartItem, updateCartItem } from "~/api/http-requests";
import { useState } from "react";
import { toast } from "sonner";
import { HttpException } from "~/api/app-fetch";
import { useTranslation } from "react-i18next";

type CartItemListSmartProps = {
    items: CartItem[];
};

// Dumb view
type CartItemListViewProps = {
    items: CartItem[];
    onQuantityChange: (id: number, newCount: number) => void;
    onRemove: (id: number) => void;
    disabled?: boolean;
};

function CartItemListView({ items, onQuantityChange, onRemove, disabled }: CartItemListViewProps) {
    const { t } = useTranslation("checkout");

    if (items.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                {t("cart.empty")}
            </div>
        );
    }

    return (
        <ul className="divide-y">
            {items.map((item) => (
                <li key={item.id}>
                    <CartItemRow
                        item={item}
                        onQuantityChange={(newCount) => onQuantityChange(item.id, newCount)}
                        onRemove={() => onRemove(item.id)}
                        disabled={disabled}
                    />
                </li>
            ))}
        </ul>
    );
}

// Smart wrapper
export default function CartItemList({ items }: CartItemListSmartProps) {
    const revalidator = useRevalidator();
    const [isMutating, setIsMutating] = useState(false);

    const handleQuantityChange = async (id: number, newCount: number) => {
        if (newCount < 1) return;
        setIsMutating(true);
        try {
            await updateCartItem(id, { count: newCount });
            revalidator.revalidate();
        } catch (err) {
            if (err instanceof HttpException) {
                toast.error(err.data?.message || "Failed to update quantity");
            }
        } finally {
            setIsMutating(false);
        }
    };

    const handleRemove = async (id: number) => {
        setIsMutating(true);
        try {
            await removeCartItem(id);
            revalidator.revalidate();
        } catch (err) {
            if (err instanceof HttpException) {
                toast.error(err.data?.message || "Failed to remove item");
            }
        } finally {
            setIsMutating(false);
        }
    };

    return (
        <CartItemListView
            items={items}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemove}
            disabled={isMutating}
        />
    );
}