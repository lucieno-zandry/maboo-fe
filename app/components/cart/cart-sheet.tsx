import { useState, useMemo, useCallback, useEffect } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Checkbox } from "~/components/ui/checkbox";
import { CartEmpty } from "./cart-empty";
import CartSheetItem from "./cart-sheet-item";
import formatMoney from "~/lib/format-money";
import { Form, Link, useNavigate } from "react-router";
import useCheckoutStore from "~/hooks/use-checkout-store";
import { useRefreshCart } from "~/hooks/use-cart";
import { toast } from "sonner";
import { removeCartItem, updateCartItem } from "~/api/http-requests";

interface CartSheetProps {
    items: CartItem[];
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function CartSheet({ items, open, setOpen }: CartSheetProps) {
    const navigate = useNavigate();
    const { setCartItemsIds } = useCheckoutStore();

    // 1. Manage checked state locally (assuming item.id is unique)
    const [checkedIds, setCheckedIds] = useState<Set<number>>(
        new Set(items.map((item) => item.id))
    );

    const toggleItem = (id: number) => {
        const next = new Set(checkedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setCheckedIds(next);
    };

    useEffect(() => {
        setCheckedIds((prev) => {
            const validIds = new Set(items.map((item) => item.id));
            return new Set([...prev].filter((id) => validIds.has(id)));
        });
    }, [items]);

    const toggleAll = () => {
        if (checkedIds.size === items.length) setCheckedIds(new Set());
        else setCheckedIds(new Set(items.map((i) => i.id)));
    };

    // 2. Calculated values
    const checkedItemsCount = checkedIds.size;
    const isAllSelected = items.length > 0 && checkedItemsCount === items.length;

    const totals = useMemo(() => {
        return items.reduce(
            (acc, item) => {
                acc.grandTotal += item.total;
                if (checkedIds.has(item.id)) {
                    acc.checkedTotal += item.total;
                }
                return acc;
            },
            { grandTotal: 0, checkedTotal: 0 }
        );
    }, [items, checkedIds]);

    const canCheckout = useMemo(() => checkedItemsCount > 0, [checkedItemsCount]);

    const handleCheckout = useCallback(() => {
        setCartItemsIds(Array.from(checkedIds))
        setOpen(false);
        navigate('/checkout');
    }, [checkedIds, setCartItemsIds, setOpen, navigate]);

    const refreshCart = useRefreshCart();

    const handleCountChange = async (itemId: number, newCount: number) => {
        const loadingToast = toast.loading('Updating cart item...');

        await updateCartItem(itemId, { count: newCount });
        refreshCart()
            .then(() => {
                toast.dismiss(loadingToast);
                toast.success('Cart item updated.');
            });
    }

    const handleRemove = useCallback((itemId: number) => {
        const loadingToast = toast.loading('Removing cart item...');

        removeCartItem(itemId)
            .then(() => {
                refreshCart()
                    .then(() => {
                        toast.dismiss(loadingToast);
                        toast.success('Cart item removed.');
                    });
            });
    }, []);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="right" className="p-0 w-[400px] sm:w-[450px]">
                <Form className="flex flex-col overflow-y-auto">
                    <div className="p-6 pb-2">
                        <SheetHeader>
                            <SheetTitle className="text-2xl">Your Cart</SheetTitle>
                            <SheetDescription className="sr-only">Cart contents</SheetDescription>
                        </SheetHeader>

                        {items.length > 0 && (
                            <div className="flex items-center justify-between mt-4 pb-2 border-b">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="select-all"
                                        checked={isAllSelected}
                                        onCheckedChange={toggleAll}
                                    />
                                    <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                                        Select All ({items.length})
                                    </label>
                                </div>
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                    {checkedItemsCount} Selected
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-hidden px-6">
                        {items.length === 0 ? (
                            <CartEmpty onClose={() => setOpen(false)} />
                        ) : (
                            <ScrollArea className="h-full pr-4">
                                <div className="flex flex-col gap-1 py-2">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3">
                                            <Checkbox
                                                checked={checkedIds.has(item.id)}
                                                onCheckedChange={() => toggleItem(item.id)}
                                            />
                                            <div className="flex-1">
                                                <CartSheetItem
                                                    item={item}
                                                    onCountChange={handleCountChange}
                                                    onRemove={handleRemove} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </div>

                    {/* Footer Section */}
                    <div className="p-6 bg-muted/30 border-t space-y-4">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Cart Subtotal ({items.length} items)</span>
                                <span>{formatMoney(totals.grandTotal)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-foreground">
                                <span>Checkout Total</span>
                                <span className="text-primary">{formatMoney(totals.checkedTotal)}</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20"
                            disabled={!canCheckout}
                            onClick={handleCheckout}
                        >
                            Checkout ({checkedItemsCount} {checkedItemsCount <= 1 ? 'item' : 'items'})
                        </Button>
                        <p className="text-[10px] text-center text-muted-foreground uppercase tracking-tighter">
                            Shipping and taxes calculated at checkout
                        </p>
                    </div>
                </Form>
            </SheetContent>
        </Sheet>
    );
}