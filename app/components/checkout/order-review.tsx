import { Card } from "~/components/ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { useCallback, type PropsWithChildren } from "react";
import CartSheetItem from "../cart/cart-sheet-item";
import { useNavigate } from "react-router";
import useCheckoutStore from "~/hooks/use-checkout-store";

type OrderReviewProps = PropsWithChildren<{
    cartItems: CartItem[];
}>

export function OrderReview({ children, cartItems }: OrderReviewProps) {
    const navigate = useNavigate();
    const { setCartItemsIds, cartItemsIds } = useCheckoutStore();

    const handleCountChange = async (itemId: number, newCount: number) => {
        navigate('/checkout');
    }

    const handleRemove = (itemId: number) => {
        setCartItemsIds(cartItemsIds.filter(id => itemId !== id));
        navigate('/checkout');
    }

    return (
        <Card className="p-4 space-y-4">
            <ScrollArea className="h-[70vh] pr-2 mt-4">
                <div className="flex flex-col gap-4">
                    {cartItems.map((item, key) => <CartSheetItem
                        onCountChange={handleCountChange}
                        onRemove={handleRemove}
                        key={key}
                        item={item} />)}
                </div>
            </ScrollArea>
            {children}
        </Card>
    );
}